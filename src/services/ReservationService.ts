import ReservationRepository from '../repositories/ReservationRepository';
import WorkspaceRepository from '../repositories/WorkspaceRepository';

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

  async createReservation(userId: number, workspaceId: number, reservationDate: Date) {
    // Validate workspace exists and is available
    const workspace = await WorkspaceRepository.findById(workspaceId);
    if (!workspace) {
      throw new Error('Workspace not found');
    }
    if (!workspace.isAvailable) {
      throw new Error('Workspace is not available');
    }

    // Creating the reservation
    return await ReservationRepository.create({ userId, workspaceId, reservationDate });
  }

  async updateReservation(id: number, data: any) {
    const reservation = await ReservationRepository.findById(id);
    if (!reservation) {
      throw new Error('Reservation not found');
    }
    const [affectedCount, updatedReservations] = await ReservationRepository.update(id, data);
    return updatedReservations[0];
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
