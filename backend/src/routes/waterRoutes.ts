import { Router } from "express";
import {
  addWaterLog,
  deleteWaterLog,
  getWaterLogs,
  patchWaterLog,
} from "../controllers/waterController.js";

const router = Router();

router.post("/", addWaterLog);
router.get("/", getWaterLogs);
router.delete("/:id", deleteWaterLog);
router.patch("/:id", patchWaterLog);

export default router;
