import { Request, Response } from 'express';
import { Medication } from '../models';

/**
 * Controller function to handle createMedication operations.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<any>} A promise that resolves to the response.
 */
export const createMedication = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, description } = req.body;
    const medication = await Medication.create({ name, description });
    res.status(201).json(medication);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Controller function to handle getMedications operations.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<any>} A promise that resolves to the response.
 */
export const getMedications = async (req: Request, res: Response): Promise<any> => {
  try {
    const medications = await Medication.findAll();
    res.json(medications);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Controller function to handle updateMedication operations.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<any>} A promise that resolves to the response.
 */
export const updateMedication = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    const medication = await Medication.findByPk(id as string);
    if (!medication) return res.status(404).json({ message: 'Medication not found' });
    
    await medication.update({ name, description });
    res.json(medication);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Controller function to handle deleteMedication operations.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<any>} A promise that resolves to the response.
 */
export const deleteMedication = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const medication = await Medication.findByPk(id as string);
    if (!medication) return res.status(404).json({ message: 'Medication not found' });
    
    await medication.destroy();
    res.json({ message: 'Medication deleted logically' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
