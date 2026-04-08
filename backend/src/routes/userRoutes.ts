import { Router } from "express";
import {
  handleLogin,
  registerUser,
  getMe,
  logoutUser,
} from "../controllers/UserController.js";

const router = Router();

router.post("/register", registerUser);
router.post("/auth/login", handleLogin);
router.get("/me", getMe);
router.post("/auth/logout", logoutUser);

export default router;
