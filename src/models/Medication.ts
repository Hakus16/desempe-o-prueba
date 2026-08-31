import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MedicationAttributes {
  id: number;
  name: string;
  description: string;
}

interface MedicationCreationAttributes extends Optional<MedicationAttributes, 'id'> {}

class Medication extends Model<MedicationAttributes, MedicationCreationAttributes> implements MedicationAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
}

Medication.init(
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
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'medications',
    paranoid: true,
  }
);

export default Medication;
