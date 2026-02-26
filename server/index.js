import express from 'express';
import cors from 'cors';
import { connection } from './database/db.js';

// Routes
import userRoute from "./Routes/authRoute.js";


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Start database connection
connection();

// Test route
app.get('/', (req, res) => {
  res.send('RentEasy Nepal API is running...');
});

// API Routes
app.use('/api/users', userRoute);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// PORT
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
