import { Request, Response } from 'express';
import { User, Clinic, Warehouse, Medication, Inventory, sequelize } from '../models';
import bcrypt from 'bcrypt';

/**
 * Controller function to handle seedDatabase operations.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<any>} A promise that resolves to the response.
 */
export const seedDatabase = async (req: Request, res: Response): Promise<any> => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No JSON file uploaded' });
    }
    
    const fileContent = req.file.buffer.toString('utf-8');
    const data = JSON.parse(fileContent);
    
    const transaction = await sequelize.transaction();
    
    try {
      if (data.users) {
        for (const u of data.users) {
          const hashed = await bcrypt.hash(u.password, 10);
          await User.findOrCreate({ where: { username: u.username }, defaults: { ...u, password: hashed }, transaction });
        }
      }
      
      if (data.clinics) {
        for (const c of data.clinics) {
          const whereClause = c.nit ? { nit: c.nit } : { name: c.name };
          await Clinic.findOrCreate({ where: whereClause, defaults: c, transaction });
        }
      }
      
      if (data.warehouses) {
        for (const w of data.warehouses) {
          await Warehouse.findOrCreate({ where: { name: w.name }, defaults: w, transaction });
        }
      }
      
      if (data.medications) {
        for (const m of data.medications) {
          await Medication.findOrCreate({ where: { name: m.name }, defaults: m, transaction });
        }
      }
      
      if (data.inventories) {
        for (const inv of data.inventories) {
          await Inventory.findOrCreate({ 
            where: { warehouse_id: inv.warehouse_id, medication_id: inv.medication_id },
            defaults: inv,
            transaction 
          });
        }
      }
      
      await transaction.commit();
      res.json({ message: 'Database seeded successfully' });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server error during seeding', error: error.message });
  }
};
