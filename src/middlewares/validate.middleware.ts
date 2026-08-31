import { Request, Response, NextFunction } from 'express';

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, role } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!password || typeof password !== 'string' || !password.trim()) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (role && role !== 'ADMIN' && role !== 'USER') {
    return res.status(400).json({ error: 'Invalid role. Must be ADMIN or USER' });
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!password || typeof password !== 'string' || !password.trim()) {
    return res.status(400).json({ error: 'Password is required' });
  }

  next();
};

export const validateWorkspace = (req: Request, res: Response, next: NextFunction) => {
  const { name, location, capacity } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (!location || typeof location !== 'string' || !location.trim()) {
    return res.status(400).json({ error: 'Location is required' });
  }

  if (capacity === undefined || capacity === null || typeof capacity !== 'number' || isNaN(capacity) || capacity <= 0) {
    return res.status(400).json({ error: 'Capacity must be greater than 0' });
  }

  next();
};

export const validateWorkspaceUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { name, location, capacity } = req.body;

  if (name !== undefined && (!name || typeof name !== 'string' || !name.trim())) {
    return res.status(400).json({ error: 'Name cannot be empty' });
  }

  if (location !== undefined && (!location || typeof location !== 'string' || !location.trim())) {
    return res.status(400).json({ error: 'Location cannot be empty' });
  }

  if (capacity !== undefined && (typeof capacity !== 'number' || isNaN(capacity) || capacity <= 0)) {
    return res.status(400).json({ error: 'Capacity must be greater than 0' });
  }

  next();
};

export const validateReservation = (req: Request, res: Response, next: NextFunction) => {
  const { workspaceId, reservationDate } = req.body;

  if (workspaceId === undefined || workspaceId === null || typeof workspaceId !== 'number' || isNaN(workspaceId) || workspaceId <= 0) {
    return res.status(400).json({ error: 'Workspace ID is required' });
  }

  if (!reservationDate) {
    return res.status(400).json({ error: 'Reservation date is required' });
  }

  const date = new Date(reservationDate);
  if (isNaN(date.getTime())) {
    return res.status(400).json({ error: 'Invalid reservation date format' });
  }

  next();
};

export const validateReservationUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { workspaceId, reservationDate } = req.body;

  if (workspaceId !== undefined && (typeof workspaceId !== 'number' || isNaN(workspaceId) || workspaceId <= 0)) {
    return res.status(400).json({ error: 'Invalid workspace ID' });
  }

  if (reservationDate !== undefined) {
    const date = new Date(reservationDate);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: 'Invalid reservation date format' });
    }
  }

  next();
};
