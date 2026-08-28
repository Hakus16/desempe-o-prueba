import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  if (
    err.message === 'User already exists' || 
    err.message === 'Invalid credentials' || 
    err.message === 'Workspace not found' || 
    err.message === 'Reservation not found' || 
    err.message === 'Workspace is not available'
  ) {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Internal Server Error' });
};
