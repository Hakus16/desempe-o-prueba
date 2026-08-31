import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/UserRepository';

class UserService {
  async register(name: string, email: string, password: string, role?: 'ADMIN' | 'USER') {
    if (!name || typeof name !== 'string' || !name.trim()) {
      throw new Error('Name is required');
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      throw new Error('Email is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      throw new Error('Invalid email format');
    }

    if (!password || typeof password !== 'string' || !password.trim()) {
      throw new Error('Password is required');
    }

    const finalRole = role || 'USER';
    if (finalRole !== 'ADMIN' && finalRole !== 'USER') {
      throw new Error('Invalid role. Must be ADMIN or USER');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await UserRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserRepository.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: finalRole,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new Error('Invalid credentials');
    }

    const user = await UserRepository.findByEmail(email.trim().toLowerCase());
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      {
        expiresIn: '1h',
      }
    );

    return { token };
  }

  async getAllUsers() {
    return await UserRepository.findAll();
  }

  async getUserById(id: number) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateUser(id: number, data: any, requesterRole?: string) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    const updateData: any = {};

    if (data.name !== undefined) {
      if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
        throw new Error('Name cannot be empty');
      }
      updateData.name = data.name.trim();
    }

    if (data.email !== undefined) {
      if (!data.email || typeof data.email !== 'string' || !data.email.trim()) {
        throw new Error('Email cannot be empty');
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email.trim())) {
        throw new Error('Invalid email format');
      }
      const normalizedEmail = data.email.trim().toLowerCase();
      const existing = await UserRepository.findByEmail(normalizedEmail);
      if (existing && existing.id !== id) {
        throw new Error('Email already in use');
      }
      updateData.email = normalizedEmail;
    }

    if (data.password !== undefined) {
      if (!data.password || typeof data.password !== 'string' || !data.password.trim()) {
        throw new Error('Password cannot be empty');
      }
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(data.password, salt);
    }

    if (data.role !== undefined) {
      if (data.role !== 'ADMIN' && data.role !== 'USER') {
        throw new Error('Invalid role. Must be ADMIN or USER');
      }
      if (requesterRole !== 'ADMIN') {
        throw new Error('Forbidden: Only ADMIN can change user roles');
      }
      updateData.role = data.role;
    }

    await UserRepository.update(id, updateData);
    return await UserRepository.findById(id);
  }

  async deleteUser(id: number) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    await UserRepository.delete(id);
    return { message: 'User deleted successfully' };
  }
}

export default new UserService();

