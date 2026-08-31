import ReservationRepository from '../repositories/ReservationRepository';
import WorkspaceRepository from '../repositories/WorkspaceRepository';
import UserRepository from '../repositories/UserRepository';

class ReservationService {
  async getAllReservations() {
    return await ReservationRepository.findAll();
  }

  async getReservationById(id: number) {
    const reservation = await ReservationRepository.findById(id);
    if (!reservation) {
      throw new Error('Reservation not found');
    }
    return reservation;
  }

  async getReservationsByUser(userId: number) {
    return await ReservationRepository.findByUserId(userId);
  }

  async createReservation(userId: number, workspaceId: number, reservationDate: string | Date) {
    if (!workspaceId || typeof workspaceId !== 'number' || isNaN(workspaceId)) {
      throw new Error('Workspace ID is required');
    }

    if (!reservationDate) {
      throw new Error('Reservation date is required');
    }

    const date = new Date(reservationDate);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid reservation date format');
    }

    // Regla 1: Que el usuario exista
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Regla 2: Que el espacio de trabajo exista
    const workspace = await WorkspaceRepository.findById(workspaceId);
    if (!workspace) {
      throw new Error('Workspace not found');
    }

    // Regla 3: Que el espacio esté disponible
    if (!workspace.isAvailable) {
      throw new Error('Workspace is not available');
    }

    // Regla 4: Que no exista otra reserva para el mismo espacio en la misma fecha
    const existingReservation = await ReservationRepository.findByWorkspaceAndDate(workspaceId, date);
    if (existingReservation) {
      throw new Error('Workspace is already reserved for this date');
    }

    const created = await ReservationRepository.create({ userId, workspaceId, reservationDate: date });
    return await ReservationRepository.findById(created.id);
  }

  async updateReservation(id: number, data: { workspaceId?: number; reservationDate?: string | Date }) {
    const reservation = await ReservationRepository.findById(id);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    const targetWorkspaceId = data.workspaceId !== undefined ? Number(data.workspaceId) : reservation.workspaceId;
    if (isNaN(targetWorkspaceId) || targetWorkspaceId <= 0) {
      throw new Error('Invalid workspace ID');
    }

    let targetDate = reservation.reservationDate;
    if (data.reservationDate !== undefined) {
      const parsedDate = new Date(data.reservationDate);
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid reservation date format');
      }
      targetDate = parsedDate;
    }

    // Validar que el espacio exista
    const workspace = await WorkspaceRepository.findById(targetWorkspaceId);
    if (!workspace) {
      throw new Error('Workspace not found');
    }

    // Validar que el espacio esté disponible
    if (!workspace.isAvailable) {
      throw new Error('Workspace is not available');
    }

    // Validar que no exista conflicto con otra reserva en la misma fecha
    const conflict = await ReservationRepository.findByWorkspaceAndDate(targetWorkspaceId, targetDate, id);
    if (conflict) {
      throw new Error('Workspace is already reserved for this date');
    }

    await ReservationRepository.update(id, {
      workspaceId: targetWorkspaceId,
      reservationDate: targetDate,
    });

    return await ReservationRepository.findById(id);
  }

  async deleteReservation(id: number) {
    const reservation = await ReservationRepository.findById(id);
    if (!reservation) {
      throw new Error('Reservation not found');
    }
    await ReservationRepository.delete(id);
    return { message: 'Reservation deleted successfully' };
  }
}

export default new ReservationService();

