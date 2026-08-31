import { Request, Response } from 'express';
import { Warehouse, Inventory, Medication } from '../models';

export const createWarehouse = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, location } = req.body;
    const warehouse = await Warehouse.create({ name, location });
    res.status(201).json(warehouse);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getWarehouses = async (req: Request, res: Response): Promise<any> => {
  try {
    const warehouses = await Warehouse.findAll();
    res.json(warehouses);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

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
