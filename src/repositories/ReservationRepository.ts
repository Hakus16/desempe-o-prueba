import { Op } from 'sequelize';
import Reservation from '../models/Reservation';
import User from '../models/User';
import Workspace from '../models/Workspace';

class ReservationRepository {
  async findAll(): Promise<Reservation[]> {
    return await Reservation.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Workspace, as: 'workspace', attributes: ['id', 'name', 'location'] }
      ]
    });
  }

  async findById(id: number): Promise<Reservation | null> {
    return await Reservation.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Workspace, as: 'workspace', attributes: ['id', 'name', 'location'] }
      ]
    });
  }

  async findByUserId(userId: number): Promise<Reservation[]> {
    return await Reservation.findAll({
      where: { userId },
      include: [
        { model: Workspace, as: 'workspace', attributes: ['id', 'name', 'location'] }
      ]
    });
  }

  async findByWorkspaceAndDate(workspaceId: number, date: Date, excludeReservationId?: number): Promise<Reservation | null> {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const whereClause: any = {
      workspaceId,
      [Op.or]: [
        { reservationDate: date },
        { reservationDate: { [Op.between]: [startOfDay, endOfDay] } }
      ]
    };

    if (excludeReservationId) {
      whereClause.id = { [Op.ne]: excludeReservationId };
    }

    return await Reservation.findOne({ where: whereClause });
  }

  async create(reservationData: Partial<Reservation>): Promise<Reservation> {
    return await Reservation.create(reservationData as any);
  }

  async update(id: number, reservationData: Partial<Reservation>): Promise<[number, Reservation[]]> {
    return await Reservation.update(reservationData, {
      where: { id },
      returning: true,
    });
  }

  async delete(id: number): Promise<number> {
    return await Reservation.destroy({ where: { id } });
  }
}

export default new ReservationRepository();

