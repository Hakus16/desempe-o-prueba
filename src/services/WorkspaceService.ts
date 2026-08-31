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
    if (!name || typeof name !== 'string' || !name.trim()) {
      throw new Error('Name is required');
    }

    if (!location || typeof location !== 'string' || !location.trim()) {
      throw new Error('Location is required');
    }

    if (capacity === undefined || capacity === null || typeof capacity !== 'number' || isNaN(capacity) || capacity <= 0) {
      throw new Error('Capacity must be greater than 0');
    }

    const trimmedName = name.trim();
    const existing = await WorkspaceRepository.findByName(trimmedName);
    if (existing) {
      throw new Error('Workspace name already exists');
    }

    return await WorkspaceRepository.create({
      name: trimmedName,
      location: location.trim(),
      capacity,
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
    });
  }

  async updateWorkspace(id: number, data: any) {
    const workspace = await WorkspaceRepository.findById(id);
    if (!workspace) {
      throw new Error('Workspace not found');
    }

    const updateData: any = {};

    if (data.name !== undefined) {
      if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
        throw new Error('Name cannot be empty');
      }
      const trimmedName = data.name.trim();
      const existing = await WorkspaceRepository.findByName(trimmedName);
      if (existing && existing.id !== id) {
        throw new Error('Workspace name already exists');
      }
      updateData.name = trimmedName;
    }

    if (data.location !== undefined) {
      if (!data.location || typeof data.location !== 'string' || !data.location.trim()) {
        throw new Error('Location cannot be empty');
      }
      updateData.location = data.location.trim();
    }

    if (data.capacity !== undefined) {
      if (typeof data.capacity !== 'number' || isNaN(data.capacity) || data.capacity <= 0) {
        throw new Error('Capacity must be greater than 0');
      }
      updateData.capacity = data.capacity;
    }

    if (data.isAvailable !== undefined) {
      updateData.isAvailable = Boolean(data.isAvailable);
    }

    await WorkspaceRepository.update(id, updateData);
    return await WorkspaceRepository.findById(id);
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

