import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface SupplyRequestItemAttributes {
  request_id: number;
  medication_id: number;
  quantity: number;
}

class SupplyRequestItem extends Model<SupplyRequestItemAttributes> implements SupplyRequestItemAttributes {
  public request_id!: number;
  public medication_id!: number;
  public quantity!: number;
}

SupplyRequestItem.init(
  {
    request_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    medication_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'supply_request_items',
    paranoid: true,
  }
);

export default SupplyRequestItem;
