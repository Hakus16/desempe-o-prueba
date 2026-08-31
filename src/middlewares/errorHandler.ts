import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }

  if (err.message && err.message.startsWith('Forbidden')) {
    return res.status(403).json({ error: err.message });
  }

  if (err.message.startsWith('Unauthorized')) {
    return res.status(401).json({ error: err.message });
  }

  if (
    err.message === 'User not found' ||
    err.message === 'Workspace not found' || 
    err.message === 'Reservation not found' ||
    err.message.toLowerCase().includes('not found')
  ) {
    return res.status(404).json({ error: err.message });
  }

  if (
    err.message === 'Workspace name already exists' ||
    err.message === 'Email already in use' ||
    err.message.includes('already reserved')
  ) {
    return res.status(409).json({ error: err.message });
  }

  if (
    err.message === 'User already exists' || 
    err.message === 'Invalid credentials' || 
    err.message === 'Workspace is not available' ||
    err.message.includes('required') ||
    err.message.includes('empty') ||
    err.message.includes('format') ||
    err.message.includes('Invalid role') ||
    err.message.includes('greater than') ||
    err.message.includes('validation')
  ) {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: 'Internal Server Error' });
};

