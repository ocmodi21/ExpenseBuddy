import { Router } from "express";
import userController from "../controllers/user.controller";
import authUser from "../middlewares/auth.middleware";
import authSchema from "../schemas/auth.schema";

const router = Router();

router.post("/login", authSchema.loginValidator, userController.login);
router.post("/register", authSchema.registerValidator, userController.register);
router.get("/profile", authUser, userController.userDetails);

export default router;
