import User from './User';
import Clinic from './Clinic';
import Warehouse from './Warehouse';
import Medication from './Medication';
import Inventory from './Inventory';
import SupplyRequest from './SupplyRequest';
import SupplyRequestItem from './SupplyRequestItem';
import sequelize from '../config/database';

// User - Clinic (One-to-Many)
User.hasMany(Clinic, { foreignKey: 'manager_id', as: 'clinics' });
Clinic.belongsTo(User, { foreignKey: 'manager_id', as: 'manager' });

// Warehouse - Medication (Many-to-Many via Inventory)
Warehouse.belongsToMany(Medication, { through: Inventory, foreignKey: 'warehouse_id', as: 'medications' });
Medication.belongsToMany(Warehouse, { through: Inventory, foreignKey: 'medication_id', as: 'warehouses' });

// HasMany / BelongsTo helpers for Inventory
Warehouse.hasMany(Inventory, { foreignKey: 'warehouse_id', as: 'inventoryRecords' });
Inventory.belongsTo(Warehouse, { foreignKey: 'warehouse_id', as: 'warehouse' });
Medication.hasMany(Inventory, { foreignKey: 'medication_id', as: 'inventoryRecords' });
Inventory.belongsTo(Medication, { foreignKey: 'medication_id', as: 'medication' });

// Clinic - SupplyRequest (One-to-Many)
Clinic.hasMany(SupplyRequest, { foreignKey: 'clinic_id', as: 'requests' });
SupplyRequest.belongsTo(Clinic, { foreignKey: 'clinic_id', as: 'clinic' });

// Warehouse - SupplyRequest (One-to-Many)
Warehouse.hasMany(SupplyRequest, { foreignKey: 'warehouse_id', as: 'requests' });
SupplyRequest.belongsTo(Warehouse, { foreignKey: 'warehouse_id', as: 'warehouse' });

// SupplyRequest - Medication (Many-to-Many via SupplyRequestItem)
SupplyRequest.belongsToMany(Medication, { through: SupplyRequestItem, foreignKey: 'request_id', as: 'items' });
Medication.belongsToMany(SupplyRequest, { through: SupplyRequestItem, foreignKey: 'medication_id', as: 'requests' });

SupplyRequest.hasMany(SupplyRequestItem, { foreignKey: 'request_id', as: 'requestItems' });
SupplyRequestItem.belongsTo(SupplyRequest, { foreignKey: 'request_id', as: 'request' });
Medication.hasMany(SupplyRequestItem, { foreignKey: 'medication_id', as: 'requestItems' });
SupplyRequestItem.belongsTo(Medication, { foreignKey: 'medication_id', as: 'medication' });

export {
  User,
  Clinic,
  Warehouse,
  Medication,
  Inventory,
  SupplyRequest,
  SupplyRequestItem,
  sequelize
};
