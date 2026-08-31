import { Request, Response } from 'express';
import { SupplyRequest, SupplyRequestItem, Clinic, Warehouse, Medication, Inventory, sequelize } from '../models';
import { Op } from 'sequelize';

/**
 * Controller function to handle createRequest operations.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<any>} A promise that resolves to the response.
 */
export const createRequest = async (req: Request, res: Response): Promise<any> => {
  const transaction = await sequelize.transaction();
  try {
    // Middleware validateRequestCreation ensures items and warehouse_id exist and stock is sufficient
    const { clinic_id, items, warehouse_id, status } = req.body; 
    
    const clinic = await Clinic.findByPk(clinic_id);
    if (!clinic) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Clinic not found' });
    }
    
    const newRequest = await SupplyRequest.create(
      { clinic_id, status: status || 'PENDING', warehouse_id },
      { transaction }
    );
    
    const requestItems = [];
    for (const item of items) {
      requestItems.push({
        request_id: newRequest.id,
        medication_id: item.medication_id,
        quantity: item.quantity
      });
      
      // Deduct inventory (middleware already verified sufficient stock)
      const inventory = await Inventory.findOne({
        where: { warehouse_id, medication_id: item.medication_id },
        transaction
      });
      
      if (inventory) {
        inventory.stock -= item.quantity;
        await inventory.save({ transaction });
      }
    }
    
    await SupplyRequestItem.bulkCreate(requestItems, { transaction });
    await transaction.commit();
    
    res.status(201).json(newRequest);
  } catch (error: any) {
    await transaction.rollback();
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Controller function to handle getRequests operations.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<any>} A promise that resolves to the response.
 */
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

/**
 * Controller function to handle assignWarehouse operations.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<any>} A promise that resolves to the response.
 */
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

/**
 * Controller function to handle updateStatus operations.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<any>} A promise that resolves to the response.
 */
export const updateStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { status } = req.body;
    
    // request object is injected by validateStatusTransition middleware
    const request = (req as any).supplyRequest as SupplyRequest;
    
    request.status = status;
    await request.save();
    
    res.json(request);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Controller function to handle getActiveRequests operations.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<any>} A promise that resolves to the response.
 */
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

/**
 * Controller function to handle updateRequest operations.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<any>} A promise that resolves to the response.
 */
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

/**
 * Controller function to handle deleteRequest operations.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<any>} A promise that resolves to the response.
 */
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
