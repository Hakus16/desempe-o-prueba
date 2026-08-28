import { Request, Response, NextFunction } from 'express';
import UserService from '../services/UserService';

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

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const { token } = await UserService.login(email, password);
      res.status(200).json({ token });
    } catch (error: any) {
      next(error);
    }
  }
}

export default new UserController();
