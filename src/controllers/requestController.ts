import { Request, Response } from 'express';
import { SupplyRequest, SupplyRequestItem, Clinic, Warehouse, Medication, Inventory, sequelize } from '../models';
import { Op } from 'sequelize';

export const createRequest = async (req: Request, res: Response): Promise<any> => {
  try {
    const { clinic_id, items } = req.body; // items: [{ medication_id, quantity }]
    
    const clinic = await Clinic.findByPk(clinic_id);
    if (!clinic) return res.status(404).json({ message: 'Clinic not found' });
    
    // Validate medications existence
    if (items && items.length > 0) {
      for (const item of items) {
        const med = await Medication.findByPk(item.medication_id);
        if (!med) {
          return res.status(404).json({ message: `Medication with ID ${item.medication_id} not found` });
        }
      }
    }
    
    const newRequest = await SupplyRequest.create({ clinic_id, status: 'PENDING', warehouse_id: null });
    
    if (items && items.length > 0) {
      const requestItems = items.map((item: any) => ({
        request_id: newRequest.id,
        medication_id: item.medication_id,
        quantity: item.quantity
      }));
      await SupplyRequestItem.bulkCreate(requestItems);
    }
    
    res.status(201).json(newRequest);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getRequests = async (req: Request, res: Response): Promise<any> => {
  try {
    const requests = await SupplyRequest.findAll({
      include: [
        { model: Clinic, as: 'clinic' },
        { model: Warehouse, as: 'warehouse' },
        { model: Medication, as: 'items', through: { attributes: ['quantity'] } }
      ]
    });
    res.json(requests);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const assignWarehouse = async (req: Request, res: Response): Promise<any> => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { warehouse_id } = req.body;
    
    const request = await SupplyRequest.findByPk(id as string, {
      include: [{ model: SupplyRequestItem, as: 'requestItems' }],
      transaction
    });
    if (!request) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Request not found' });
    }
    if (request.status !== 'PENDING') {
      await transaction.rollback();
      return res.status(400).json({ message: 'Can only assign warehouse to PENDING requests' });
    }
    
    const warehouse = await Warehouse.findByPk(warehouse_id, { transaction });
    if (!warehouse) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    
    // Check inventory availability and deduct
    const items = (request as any).requestItems as SupplyRequestItem[];
    for (const item of items) {
      const inventory = await Inventory.findOne({
        where: { warehouse_id, medication_id: item.medication_id },
        transaction
      });
      
      if (!inventory || inventory.stock < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({ 
          message: `Insufficient stock in warehouse for medication ID ${item.medication_id}. Needed: ${item.quantity}, Available: ${inventory ? inventory.stock : 0}` 
        });
      }
      
      inventory.stock -= item.quantity;
      await inventory.save({ transaction });
    }
    
    request.warehouse_id = warehouse_id;
    request.status = 'ASSIGNED';
    await request.save({ transaction });
    
    await transaction.commit();
    res.json(request);
  } catch (error: any) {
    await transaction.rollback();
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const request = await SupplyRequest.findByPk(id as string);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    
    // State machine validation
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
    
    request.status = status;
    await request.save();
    
    res.json(request);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getActiveRequests = async (req: Request, res: Response): Promise<any> => {
  try {
    const requests = await SupplyRequest.findAll({
      where: {
        status: {
          [Op.in]: ['PENDING', 'ASSIGNED', 'SHIPPED']
        }
      },
      include: [
        { model: Clinic, as: 'clinic' },
        { model: Warehouse, as: 'warehouse' },
        { model: Medication, as: 'items', through: { attributes: ['quantity'] } }
      ]
    });
    res.json(requests);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateRequest = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { clinic_id } = req.body;
    
    const request = await SupplyRequest.findByPk(id as string);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    
    if (request.status !== 'PENDING') {
      return res.status(400).json({ message: 'Only PENDING requests can be updated' });
    }
    
    if (clinic_id) {
      const clinic = await Clinic.findByPk(clinic_id);
      if (!clinic) return res.status(404).json({ message: 'Clinic not found' });
      request.clinic_id = clinic_id;
    }
    
    await request.save();
    res.json(request);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteRequest = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const request = await SupplyRequest.findByPk(id as string);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    
    await request.destroy();
    res.json({ message: 'Request deleted logically' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
