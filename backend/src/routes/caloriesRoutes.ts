import { Router } from "express";
import {
  saveCaloriesLog,
  searchFood,
  getCaloriesLogs,
} from "../controllers/CaloriesController.js";

const router = Router();

router.get("/search", searchFood);
router.get("/", getCaloriesLogs);
router.post("/", saveCaloriesLog);

export default router;
