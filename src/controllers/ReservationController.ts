import { Request, Response, NextFunction } from 'express';
import ReservationService from '../services/ReservationService';

class ReservationController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const reservations = await ReservationService.getAllReservations();
      res.status(200).json(reservations);
    } catch (error: any) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const reservation = await ReservationService.getReservationById(Number(id));
      res.status(200).json(reservation);
    } catch (error: any) {
      next(error);
    }
  }

  async getByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const reservations = await ReservationService.getReservationsByUser(Number(userId));
      res.status(200).json(reservations);
    } catch (error: any) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // In a real app, userId could come from req.user (JWT), but here we take it from body
      const { userId, workspaceId, reservationDate } = req.body;
      const reservation = await ReservationService.createReservation(userId, workspaceId, new Date(reservationDate));
      res.status(201).json({ message: 'Reservation created successfully', reservation });
    } catch (error: any) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const reservation = await ReservationService.updateReservation(Number(id), req.body);
      res.status(200).json({ message: 'Reservation updated successfully', reservation });
    } catch (error: any) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await ReservationService.deleteReservation(Number(id));
      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  }
}

export default new ReservationController();
