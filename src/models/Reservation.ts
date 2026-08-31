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
    indexes: [
      {
        unique: true,
        fields: ['workspaceId', 'reservationDate'],
        name: 'unique_workspace_reservation_date',
      },
    ],
  }
);

// Define associations
User.hasMany(Reservation, { foreignKey: 'userId', as: 'reservations', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Reservation.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Workspace.hasMany(Reservation, { foreignKey: 'workspaceId', as: 'reservations', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Reservation.belongsTo(Workspace, { foreignKey: 'workspaceId', as: 'workspace', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

export default Reservation;
