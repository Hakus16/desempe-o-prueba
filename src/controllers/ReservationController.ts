import { Response, NextFunction } from 'express';
import ReservationService from '../services/ReservationService';
import { AuthRequest } from '../middlewares/auth.middleware';

class ReservationController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const reservations = await ReservationService.getAllReservations();
      res.status(200).json(reservations);
    } catch (error: any) {
      next(error);
    }
  }

  async getMyReservations(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const reservations = await ReservationService.getReservationsByUser(req.user!.id);
      res.status(200).json(reservations);
    } catch (error: any) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const reservation = await ReservationService.getReservationById(Number(id));
      if (req.user?.role !== 'ADMIN' && reservation.userId !== req.user?.id) {
        return res.status(403).json({ error: 'Forbidden: You do not have permission to view this reservation' });
      }
      res.status(200).json(reservation);
    } catch (error: any) {
      next(error);
    }
  }

  async getByUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      if (req.user?.role !== 'ADMIN' && req.user?.id !== Number(userId)) {
        return res.status(403).json({ error: 'Forbidden: You do not have permission to view other users reservations' });
      }
      const reservations = await ReservationService.getReservationsByUser(Number(userId));
      res.status(200).json(reservations);
    } catch (error: any) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // El usuario propietario de la reserva se obtiene SIEMPRE del usuario autenticado
      const userId = req.user!.id;
      const { workspaceId, reservationDate } = req.body;

      const reservation = await ReservationService.createReservation(userId, Number(workspaceId), reservationDate);
      res.status(201).json({ message: 'Reservation created successfully', reservation });
    } catch (error: any) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const reservation = await ReservationService.getReservationById(Number(id));
      if (req.user?.role !== 'ADMIN' && reservation.userId !== req.user?.id) {
        return res.status(403).json({ error: 'Forbidden: You do not have permission to update this reservation' });
      }

      const updated = await ReservationService.updateReservation(Number(id), req.body);
      res.status(200).json({ message: 'Reservation updated successfully', reservation: updated });
    } catch (error: any) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const reservation = await ReservationService.getReservationById(Number(id));
      if (req.user?.role !== 'ADMIN' && reservation.userId !== req.user?.id) {
        return res.status(403).json({ error: 'Forbidden: You do not have permission to delete this reservation' });
      }
      const result = await ReservationService.deleteReservation(Number(id));
      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  }
}

export default new ReservationController();


