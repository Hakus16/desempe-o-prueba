import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface WorkspaceAttributes {
  id: number;
  name: string;
  location: string;
  capacity: number;
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface WorkspaceCreationAttributes extends Optional<WorkspaceAttributes, 'id' | 'isAvailable'> {}

class Workspace extends Model<WorkspaceAttributes, WorkspaceCreationAttributes> implements WorkspaceAttributes {
  public id!: number;
  public name!: string;
  public location!: string;
  public capacity!: number;
  public isAvailable!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Workspace.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'workspaces',
  }
);

export default Workspace;
