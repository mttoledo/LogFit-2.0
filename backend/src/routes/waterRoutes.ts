import { Router } from "express";
import { addWaterLog, getWaterLogs } from "../controllers/waterController.js";

const router = Router();

router.post("/", addWaterLog);
router.get("/", getWaterLogs);

export default router;
