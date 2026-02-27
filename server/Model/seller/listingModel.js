import { DataTypes } from "sequelize";
import { sequelize } from "../../database/db.js";

export const Listing = sequelize.define(
  "Listing",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    category: { type: DataTypes.STRING, allowNull: true },
    price: { type: DataTypes.STRING, allowNull: false },
    tenure: { type: DataTypes.STRING, allowNull: true },
    location: { type: DataTypes.STRING, allowNull: true },
    tags: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.STRING, defaultValue: "Active" },
    views: { type: DataTypes.INTEGER, defaultValue: 0 },
    rents: { type: DataTypes.INTEGER, defaultValue: 0 },
    imageUrl: { type: DataTypes.STRING, allowNull: true },
  },
  { tableName: "listings", freezeTableName: true, timestamps: true }
);