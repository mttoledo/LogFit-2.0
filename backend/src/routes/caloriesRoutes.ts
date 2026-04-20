import { Router } from "express";
import {
  addCaloriesLog,
  handleSearch,
  getCaloriesLogs,
} from "../controllers/CaloriesController.js";

const router = Router();

router.get("/search", handleSearch);
router.get("/", getCaloriesLogs);
router.post("/", addCaloriesLog);

export default router;
