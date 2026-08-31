import { Request, Response } from 'express';
import { Clinic, SupplyRequest, User } from '../models';

export const createClinic = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, nit, manager_id } = req.body;
    
    if (!name || !nit || !manager_id) {
      return res.status(400).json({ message: 'Missing required fields (name, nit, manager_id)' });
    }

    const existingClinic = await Clinic.findOne({ where: { nit } });
    if (existingClinic) {
      return res.status(400).json({ message: 'A clinic with this NIT already exists' });
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

export const getClinics = async (req: Request, res: Response): Promise<any> => {
  try {
    const clinics = await Clinic.findAll({ include: [{ model: User, as: 'manager', attributes: ['id', 'username'] }] });
    res.json(clinics);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

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
