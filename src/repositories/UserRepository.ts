import User from '../models/User';

class UserRepository {
  async findAll(): Promise<User[]> {
    return await User.findAll({
      attributes: { exclude: ['password'] },
    });
  }

  async findById(id: number, includePassword = false): Promise<User | null> {
    return await User.findByPk(id, {
      attributes: includePassword ? undefined : { exclude: ['password'] },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    return await User.create(userData as any);
  }

  async update(id: number, userData: Partial<User>): Promise<[number, User[]]> {
    return await User.update(userData, {
      where: { id },
      returning: true,
    });
  }

  async delete(id: number): Promise<number> {
    return await User.destroy({ where: { id } });
  }
}

export default new UserRepository();

