import { Model, DataTypes } from 'sequelize';
import sequelize from '../config';

export class Concept extends Model {
  public id!: number;
  public name!: string;
  public details!: string;
}

Concept.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Concept',
  }
);