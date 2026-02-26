import express from "express";
// ✅ Correct - named import
import { getAll, save } from '../Controller/authController.js'


const router = express.Router();

router.get("/", getAll);
router.post("/", save);

export default router;
