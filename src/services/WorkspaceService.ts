import WorkspaceRepository from '../repositories/WorkspaceRepository';

class WorkspaceService {
  async getAllWorkspaces() {
    return await WorkspaceRepository.findAll();
  }

  async getWorkspaceById(id: number) {
    const workspace = await WorkspaceRepository.findById(id);
    if (!workspace) {
      throw new Error('Workspace not found');
    }
    return workspace;
  }

  async createWorkspace(name: string, location: string, capacity: number, isAvailable: boolean = true) {
    const existing = await WorkspaceRepository.findByName(name);
    if (existing) {
      throw new Error('Workspace name already exists');
    }
    return await WorkspaceRepository.create({ name, location, capacity, isAvailable });
  }

  async updateWorkspace(id: number, data: any) {
    const workspace = await WorkspaceRepository.findById(id);
    if (!workspace) {
      throw new Error('Workspace not found');
    }
    const [affectedCount, updatedWorkspaces] = await WorkspaceRepository.update(id, data);
    return updatedWorkspaces[0];
  }

  async deleteWorkspace(id: number) {
    const workspace = await WorkspaceRepository.findById(id);
    if (!workspace) {
      throw new Error('Workspace not found');
    }
    await WorkspaceRepository.delete(id);
    return { message: 'Workspace deleted successfully' };
  }
}

export default new WorkspaceService();
