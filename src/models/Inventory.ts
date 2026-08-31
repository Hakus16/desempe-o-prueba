import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface InventoryAttributes {
  warehouse_id: number;
  medication_id: number;
  stock: number;
}

class Inventory extends Model<InventoryAttributes> implements InventoryAttributes {
  public warehouse_id!: number;
  public medication_id!: number;
  public stock!: number;
}

Inventory.init(
  {
    warehouse_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    medication_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'inventories',
  }
);

export default Inventory;
