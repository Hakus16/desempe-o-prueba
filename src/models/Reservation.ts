import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Workspace from './Workspace';

interface ReservationAttributes {
  id: number;
  userId: number;
  workspaceId: number;
  reservationDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ReservationCreationAttributes extends Optional<ReservationAttributes, 'id'> {}

class Reservation extends Model<ReservationAttributes, ReservationCreationAttributes> implements ReservationAttributes {
  public id!: number;
  public userId!: number;
  public workspaceId!: number;
  public reservationDate!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Reservation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    workspaceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Workspace,
        key: 'id',
      },
    },
    reservationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'reservations',
  }
);

// Define associations
User.hasMany(Reservation, { foreignKey: 'userId' });
Reservation.belongsTo(User, { foreignKey: 'userId' });

Workspace.hasMany(Reservation, { foreignKey: 'workspaceId' });
Reservation.belongsTo(Workspace, { foreignKey: 'workspaceId' });

export default Reservation;
