import { DataTypes } from "sequelize";
import { sequelize } from "../database/db.js";


export const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    customerName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    customerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    customerPhone: {
      type: DataTypes.STRING,
      allowNull: false
    },

    customerAddress: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "users",
    freezeTableName: true,
    timestamps: true
  }
);