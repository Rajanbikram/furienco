import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "furniture",          // database name
  "postgres",           // username
  "Rajanbikram@123",    // password
  {
    host: "localhost",
    dialect: "postgres",
    logging: false
  }
);

export const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connection established successfully.");

    await sequelize.sync({ alter: true }); // drops and recreates all tables
    console.log("✅ All tables created successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
};