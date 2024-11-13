import express from "express";
import { auth } from "../middlewares/auth.middleware";
import { validateResponse } from "../middlewares/validate.middleware";
import { AuthController } from "../controller/auth.controller";

const router = express.Router();
const authController = new AuthController();

router.use(validateResponse);

router.post("/login", authController.login);
router.get("/me", auth, authController.me);

export default router;