import { Request, Response, NextFunction } from 'express';
import WorkspaceService from '../services/WorkspaceService';

class WorkspaceController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaces = await WorkspaceService.getAllWorkspaces();
      res.status(200).json(workspaces);
    } catch (error: any) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const workspace = await WorkspaceService.getWorkspaceById(Number(id));
      res.status(200).json(workspace);
    } catch (error: any) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, location, capacity, isAvailable } = req.body;
      const workspace = await WorkspaceService.createWorkspace(name, location, capacity, isAvailable);
      res.status(201).json({ message: 'Workspace created successfully', workspace });
    } catch (error: any) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const workspace = await WorkspaceService.updateWorkspace(Number(id), req.body);
      res.status(200).json({ message: 'Workspace updated successfully', workspace });
    } catch (error: any) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await WorkspaceService.deleteWorkspace(Number(id));
      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  }
}

export default new WorkspaceController();
