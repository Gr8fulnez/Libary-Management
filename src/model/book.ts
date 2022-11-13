import { DataTypes, Model } from "sequelize";
import db from "../config/database.config";

interface bookAttributes {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  userId: string;
}

export class bookInstance extends Model<bookAttributes> {}

bookInstance.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },

    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: "bookTable",
  }
);
