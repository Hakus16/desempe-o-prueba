import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ClinicAttributes {
  id: number;
  nit: string;
  name: string;
  manager_id: number;
}

interface ClinicCreationAttributes extends Optional<ClinicAttributes, 'id'> {}

class Clinic extends Model<ClinicAttributes, ClinicCreationAttributes> implements ClinicAttributes {
  public id!: number;
  public nit!: string;
  public name!: string;
  public manager_id!: number;
}

Clinic.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nit: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    manager_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'clinics',
  }
);

export default Clinic;
