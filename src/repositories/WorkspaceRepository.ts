import Workspace from '../models/Workspace';

class WorkspaceRepository {
  async findAll(): Promise<Workspace[]> {
    return await Workspace.findAll();
  }

  async findById(id: number): Promise<Workspace | null> {
    return await Workspace.findByPk(id);
  }

  async create(workspaceData: Partial<Workspace>): Promise<Workspace> {
    return await Workspace.create(workspaceData as any);
  }

  async update(id: number, workspaceData: Partial<Workspace>): Promise<[number, Workspace[]]> {
    return await Workspace.update(workspaceData, {
      where: { id },
      returning: true,
    });
  }

  async delete(id: number): Promise<number> {
    return await Workspace.destroy({ where: { id } });
  }
}

export default new WorkspaceRepository();
