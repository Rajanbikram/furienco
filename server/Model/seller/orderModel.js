import { DataTypes } from "sequelize";
import { sequelize } from "../../database/db.js";

export const Order = sequelize.define(
  "Order",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    product: { type: DataTypes.STRING, allowNull: false },
    customer: { type: DataTypes.STRING, allowNull: false },
    period: { type: DataTypes.STRING, allowNull: true },
    amount: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: "Pending" },
    date: { type: DataTypes.DATEONLY, allowNull: false },
  },
  { tableName: "orders", freezeTableName: true, timestamps: true }
);