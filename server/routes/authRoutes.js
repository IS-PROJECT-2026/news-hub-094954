import { Router } from "express";
import { register, login } from "../controllers/authController.js";

const router = Router();

router.post("/registerpages", register);
router.post("/loginpage", login);

export default router;
