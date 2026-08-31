import { Request, Response, NextFunction } from 'express';
import { Clinic, Inventory, SupplyRequest } from '../models';

export const validateClinicNit = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { nit } = req.body;
    const { id } = req.params;

    if (nit) {
      const existingClinic = await Clinic.findOne({ where: { nit } });
      if (existingClinic) {
        // If it's an update, ensure it's not the same clinic
        if (id && existingClinic.id.toString() === id) {
          return next();
        }
        return res.status(400).json({ message: 'A clinic with this NIT already exists' });
      }
    }
    next();
  } catch (error: any) {
    res.status(500).json({ message: 'Server error during validation', error: error.message });
  }
};

export const validateRequestCreation = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { items, warehouse_id } = req.body;

    if (!warehouse_id) {
      return res.status(400).json({ message: 'A warehouse_id must be provided to register a request' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Items are required' });
    }

    for (const item of items) {
      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({ message: `Quantity must be greater than zero for medication ID ${item.medication_id}` });
      }

      const inventory = await Inventory.findOne({
        where: { warehouse_id, medication_id: item.medication_id }
      });

      if (!inventory || inventory.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock in warehouse for medication ID ${item.medication_id}. Needed: ${item.quantity}, Available: ${inventory ? inventory.stock : 0}` 
        });
      }
    }

    next();
  } catch (error: any) {
    res.status(500).json({ message: 'Server error during validation', error: error.message });
  }
};

export const validateStatusTransition = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await SupplyRequest.findByPk(id as string);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const validTransitions: Record<string, string[]> = {
      'PENDING': ['ASSIGNED', 'REJECTED'],
      'ASSIGNED': ['SHIPPED', 'REJECTED'],
      'SHIPPED': ['DELIVERED', 'REJECTED'],
      'DELIVERED': [],
      'REJECTED': []
    };

    if (!validTransitions[request.status].includes(status)) {
      return res.status(400).json({ message: `Invalid status transition from ${request.status} to ${status}` });
    }

    // Attach request object to avoid querying it again in controller
    (req as any).supplyRequest = request;
    next();
  } catch (error: any) {
    res.status(500).json({ message: 'Server error during validation', error: error.message });
  }
};
