import { Router } from "express";
import userController from "../controllers/user.controller";
import authManager from "../utils/auth-manager";
import authUser from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", userController.login);
router.post("/register", userController.register);
router.get("/profile", authUser, userController.userDetails);

export default router;
