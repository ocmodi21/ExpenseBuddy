import { Router } from "express";
import userController from "../controllers/user.controller";
import authUser from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", userController.login);
router.post("/register", userController.register);
router.get("/profile", authUser, userController.userDetails);

export default router;
