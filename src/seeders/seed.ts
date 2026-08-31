import bcrypt from 'bcrypt';
import { sequelize, User, Workspace } from '../models';

export const seedDatabase = async () => {
  try {
    console.log('--- Iniciando Seeder de Base de Datos ---');

    // 1. Crear / Verificar Usuario ADMIN
    const adminEmail = 'admin@example.com';
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const hashedAdminPassword = await bcrypt.hash('Admin123!', 10);
      await User.create({
        name: 'Administrador Principal',
        email: adminEmail,
        password: hashedAdminPassword,
        role: 'ADMIN',
      });
      console.log('✔ Usuario ADMIN creado: admin@example.com (Password: Admin123!)');
    } else {
      console.log('ℹ Usuario ADMIN ya existe: admin@example.com');
    }

    // 2. Crear / Verificar Usuario USER
    const userEmail = 'user@example.com';
    const existingUser = await User.findOne({ where: { email: userEmail } });
    if (!existingUser) {
      const hashedUserPassword = await bcrypt.hash('User123!', 10);
      await User.create({
        name: 'Usuario Regular',
        email: userEmail,
        password: hashedUserPassword,
        role: 'USER',
      });
      console.log('✔ Usuario USER creado: user@example.com (Password: User123!)');
    } else {
      console.log('ℹ Usuario USER ya existe: user@example.com');
    }

    // 3. Crear / Verificar 3 Espacios de Trabajo
    const workspacesData = [
      {
        name: 'Sala de Juntas Ejecutiva',
        location: 'Piso 2 - Edificio Principal',
        capacity: 12,
        isAvailable: true,
      },
      {
        name: 'Oficina Privada 204',
        location: 'Piso 2 - Ala Norte',
        capacity: 4,
        isAvailable: true,
      },
      {
        name: 'Auditorio de Conferencias',
        location: 'Piso 1 - Zona Central',
        capacity: 50,
        isAvailable: true,
      },
    ];

    for (const ws of workspacesData) {
      const existingWs = await Workspace.findOne({ where: { name: ws.name } });
      if (!existingWs) {
        await Workspace.create(ws);
        console.log(`✔ Espacio creado: "${ws.name}" (Capacidad: ${ws.capacity}, Ubicación: ${ws.location})`);
      } else {
        console.log(`ℹ Espacio ya existe: "${ws.name}"`);
      }
    }

    console.log('--- Seeder completado exitosamente ---\n');
  } catch (error) {
    console.error('Error al ejecutar el seeder:', error);
    throw error;
  }
};

// Si se ejecuta directamente desde la línea de comandos
if (require.main === module || process.argv[1]?.includes('seed')) {
  (async () => {
    try {
      await sequelize.authenticate();
      await sequelize.sync({ alter: true });
      await seedDatabase();
      await sequelize.close();
      process.exit(0);
    } catch (err) {
      console.error('Fallo en la ejecución directa del seeder:', err);
      process.exit(1);
    }
  })();
}
