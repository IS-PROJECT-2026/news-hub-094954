import { Router } from "express";
import { register, login } from "../controllers/authController.js";

const router = Router();

router.post("/registerpage", register);
router.post("/login", login);

export default router;
