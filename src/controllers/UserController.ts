import { Request, Response, NextFunction } from 'express';
import UserService from '../services/UserService';
import { AuthRequest } from '../middlewares/auth.middleware';

class UserController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, role } = req.body;
      const user = await UserService.register(name, email, password, role);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error: any) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, role } = req.body;
      const user = await UserService.register(name, email, password, role);
      res.status(201).json({ message: 'User created successfully', user });
    } catch (error: any) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const { token } = await UserService.login(email, password);
      res.status(200).json({ token });
    } catch (error: any) {
      next(error);
    }
  }

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error: any) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(Number(id));
      if (req.user?.role !== 'ADMIN' && req.user?.id !== Number(id)) {
        return res.status(403).json({ error: 'Forbidden: You do not have permission to view this user' });
      }
      res.status(200).json(user);
    } catch (error: any) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (req.user?.role !== 'ADMIN' && req.user?.id !== Number(id)) {
        return res.status(403).json({ error: 'Forbidden: You do not have permission to update this user' });
      }
      const user = await UserService.updateUser(Number(id), req.body, req.user?.role);
      res.status(200).json({ message: 'User updated successfully', user });
    } catch (error: any) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await UserService.deleteUser(Number(id));
      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  }
}

export default new UserController();

