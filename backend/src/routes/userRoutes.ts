import { Router } from "express";
import { handleLogin, registerUser } from "../controllers/UserController.js";

const router = Router();

router.post("/register", registerUser);
router.post("/auth/login", handleLogin);

export default router;
