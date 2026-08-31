import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface SupplyRequestAttributes {
  id: number;
  clinic_id: number;
  warehouse_id?: number | null;
  status: 'PENDING' | 'ASSIGNED' | 'SHIPPED' | 'DELIVERED' | 'REJECTED';
}

interface SupplyRequestCreationAttributes extends Optional<SupplyRequestAttributes, 'id' | 'status' | 'warehouse_id'> {}

class SupplyRequest extends Model<SupplyRequestAttributes, SupplyRequestCreationAttributes> implements SupplyRequestAttributes {
  public id!: number;
  public clinic_id!: number;
  public warehouse_id!: number | null;
  public status!: 'PENDING' | 'ASSIGNED' | 'SHIPPED' | 'DELIVERED' | 'REJECTED';
}

SupplyRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    clinic_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    warehouse_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'ASSIGNED', 'SHIPPED', 'DELIVERED', 'REJECTED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
  },
  {
    sequelize,
    tableName: 'supply_requests',
  }
);

export default SupplyRequest;
