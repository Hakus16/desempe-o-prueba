import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface WarehouseAttributes {
  id: number;
  name: string;
  location: string;
}

interface WarehouseCreationAttributes extends Optional<WarehouseAttributes, 'id'> {}

class Warehouse extends Model<WarehouseAttributes, WarehouseCreationAttributes> implements WarehouseAttributes {
  public id!: number;
  public name!: string;
  public location!: string;
}

Warehouse.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'warehouses',
  }
);

export default Warehouse;
