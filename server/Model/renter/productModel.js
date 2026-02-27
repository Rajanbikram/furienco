import { DataTypes } from "sequelize";
import { sequelize } from "../../database/db.js";

export const Product = sequelize.define(
  "Product",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    price3: { type: DataTypes.INTEGER, allowNull: false },
    price6: { type: DataTypes.INTEGER, allowNull: false },
    price12: { type: DataTypes.INTEGER, allowNull: false },
  },
  { tableName: "products", freezeTableName: true, timestamps: true }
);