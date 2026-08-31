import { Request, Response } from 'express';
import { Clinic, SupplyRequest, User } from '../models';

/**
 * Controller function to handle createClinic operations.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<any>} A promise that resolves to the response.
 */
export const createClinic = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, nit, manager_id } = req.body;
    
    if (!name || !nit || !manager_id) {
      return res.status(400).json({ message: 'Missing required fields (name, nit, manager_id)' });
    }
    
    const manager = await User.findByPk(manager_id);
    if (!manager) {
      return res.status(404).json({ message: 'Manager (User) not found' });
    }
    
    const clinic = await Clinic.create({ name, nit, manager_id });
    res.status(201).json(clinic);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Controller function to handle getClinics operations.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<any>} A promise that resolves to the response.
 */
export const getClinics = async (req: Request, res: Response): Promise<any> => {
  try {
    const clinics = await Clinic.findAll({ include: [{ model: User, as: 'manager', attributes: ['id', 'username'] }] });
    res.json(clinics);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Controller function to handle getClinicRequests operations.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<any>} A promise that resolves to the response.
 */
export const getClinicRequests = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const clinic = await Clinic.findByPk(id as string);
    if (!clinic) return res.status(404).json({ message: 'Clinic not found' });
    
    const requests = await SupplyRequest.findAll({ where: { clinic_id: id } });
    res.json(requests);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Controller function to handle updateClinic operations.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<any>} A promise that resolves to the response.
 */
export const updateClinic = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { name, nit, manager_id } = req.body;
    
    const clinic = await Clinic.findByPk(id as string);
    if (!clinic) return res.status(404).json({ message: 'Clinic not found' });

    if (manager_id) {
      const manager = await User.findByPk(manager_id);
      if (!manager) {
        return res.status(404).json({ message: 'Manager (User) not found' });
      }
    }
    
    await clinic.update({ name, nit, manager_id });
    res.json(clinic);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Controller function to handle deleteClinic operations.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<any>} A promise that resolves to the response.
 */
export const deleteClinic = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const clinic = await Clinic.findByPk(id as string);
    if (!clinic) return res.status(404).json({ message: 'Clinic not found' });
    
    await clinic.destroy(); // Soft delete because of paranoid: true
    res.json({ message: 'Clinic deleted logically' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
