import Reservation from '../models/Reservation';
import User from '../models/User';
import Workspace from '../models/Workspace';

class ReservationRepository {
  async findAll(): Promise<Reservation[]> {
    return await Reservation.findAll({
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Workspace, attributes: ['id', 'name', 'location'] }
      ]
    });
  }

  async findById(id: number): Promise<Reservation | null> {
    return await Reservation.findByPk(id, {
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Workspace, attributes: ['id', 'name', 'location'] }
      ]
    });
  }

  async findByUserId(userId: number): Promise<Reservation[]> {
    return await Reservation.findAll({
      where: { userId },
      include: [
        { model: Workspace, attributes: ['id', 'name', 'location'] }
      ]
    });
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
