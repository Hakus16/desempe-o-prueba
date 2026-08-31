import { Request, Response } from 'express';
import { Warehouse, Inventory, Medication } from '../models';

/**
 * Controller function to handle createWarehouse operations.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<any>} A promise that resolves to the response.
 */
export const createWarehouse = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, location } = req.body;
    const warehouse = await Warehouse.create({ name, location });
    res.status(201).json(warehouse);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Controller function to handle getWarehouses operations.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<any>} A promise that resolves to the response.
 */
export const getWarehouses = async (req: Request, res: Response): Promise<any> => {
  try {
    const warehouses = await Warehouse.findAll();
    res.json(warehouses);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Controller function to handle updateInventory operations.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<any>} A promise that resolves to the response.
 */
export const updateInventory = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params; // warehouse_id
    const { medication_id, stock } = req.body;
    
    const warehouse = await Warehouse.findByPk(id as string);
    if (!warehouse) return res.status(404).json({ message: 'Warehouse not found' });
    
    const medication = await Medication.findByPk(medication_id);
    if (!medication) return res.status(404).json({ message: 'Medication not found' });
    
    const [inventory, created] = await Inventory.findOrCreate({
      where: { warehouse_id: id, medication_id },
      defaults: { warehouse_id: Number(id), medication_id, stock }
    });
    
    if (!created) {
      inventory.stock = stock;
      await inventory.save();
    }
    
    res.json(inventory);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Controller function to handle getInventory operations.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<any>} A promise that resolves to the response.
 */
export const getInventory = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const inventory = await Inventory.findAll({ 
      where: { warehouse_id: id },
      include: [{ model: Medication, as: 'medication' }]
    });
    res.json(inventory);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Controller function to handle updateWarehouse operations.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<any>} A promise that resolves to the response.
 */
export const updateWarehouse = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;
    
    const warehouse = await Warehouse.findByPk(id as string);
    if (!warehouse) return res.status(404).json({ message: 'Warehouse not found' });
    
    await warehouse.update({ name, location });
    res.json(warehouse);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Controller function to handle deleteWarehouse operations.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<any>} A promise that resolves to the response.
 */
export const deleteWarehouse = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const warehouse = await Warehouse.findByPk(id as string);
    if (!warehouse) return res.status(404).json({ message: 'Warehouse not found' });
    
    await warehouse.destroy();
    res.json({ message: 'Warehouse deleted logically' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
