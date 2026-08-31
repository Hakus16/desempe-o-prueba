import { Request, Response, NextFunction } from 'express';
import { Clinic, Inventory, SupplyRequest } from '../models';

/**
 * Controller function to handle validateClinicNit operations.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<any>} A promise that resolves to the response.
 */
/**
 * Middleware function to handle validateClinicNit validation.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {Promise<any>} A promise that resolves to next() or an error response.
 */
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

/**
 * Controller function to handle validateRequestCreation operations.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<any>} A promise that resolves to the response.
 */
/**
 * Middleware function to handle validateRequestCreation validation.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {Promise<any>} A promise that resolves to next() or an error response.
 */
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

/**
 * Controller function to handle validateStatusTransition operations.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<any>} A promise that resolves to the response.
 */
/**
 * Middleware function to handle validateStatusTransition validation.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {Promise<any>} A promise that resolves to next() or an error response.
 */
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
