import express from "express";
import { register, login, getAll } from '../Controller/authController.js';
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", getAll);

export default router;