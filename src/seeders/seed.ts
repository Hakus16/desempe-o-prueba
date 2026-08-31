import { sequelize, User, Clinic, Warehouse, Medication } from '../models';
import bcrypt from 'bcrypt';

export const seedDatabase = async () => {
  try {
    console.log('Seeding initial data...');

    // 1. Usuarios
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const [adminUser] = await User.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        username: 'admin',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    const [managerUser] = await User.findOrCreate({
      where: { username: 'manager1' },
      defaults: {
        username: 'manager1',
        password: hashedPassword,
        role: 'REQUEST_MANAGER',
      },
    });

    // 2. Clínicas
    await Clinic.findOrCreate({
      where: { nit: '900123456-1' },
      defaults: {
        nit: '900123456-1',
        name: 'Clínica Principal',
        manager_id: managerUser.id,
      },
    });

    // 3. Almacenes
    await Warehouse.findOrCreate({
      where: { name: 'Almacén Central' },
      defaults: {
        name: 'Almacén Central',
        location: 'Bodega Norte',
      },
    });

    // 4. Medicamentos
    await Medication.findOrCreate({
      where: { name: 'Paracetamol' },
      defaults: {
        name: 'Paracetamol',
        description: 'Analgésico y antipirético',
      },
    });
    
    await Medication.findOrCreate({
      where: { name: 'Ibuprofeno' },
      defaults: {
        name: 'Ibuprofeno',
        description: 'Antiinflamatorio no esteroideo',
      },
    });

    console.log('Initial data seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Si se ejecuta directamente desde la terminal (npm run seed)
if (require.main === module) {
  sequelize.sync().then(() => {
    seedDatabase().then(() => process.exit(0));
  });
}
