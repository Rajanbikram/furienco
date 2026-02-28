import { DataTypes } from "sequelize";
import { sequelize } from "../../database/db.js";

export const Customer = sequelize.define(
  "Customer",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    sellerId: { type: DataTypes.INTEGER, allowNull: true }, // ← NEW
    name: { type: DataTypes.STRING, allowNull: false },
    product: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    payment: { type: DataTypes.STRING, defaultValue: "Pending" },
  },
  { tableName: "customers", freezeTableName: true, timestamps: true }
);