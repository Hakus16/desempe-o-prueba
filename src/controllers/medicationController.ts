import { Request, Response } from 'express';
import { Medication } from '../models';

export const createMedication = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, description } = req.body;
    const medication = await Medication.create({ name, description });
    res.status(201).json(medication);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMedications = async (req: Request, res: Response): Promise<any> => {
  try {
    const medications = await Medication.findAll();
    res.json(medications);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
