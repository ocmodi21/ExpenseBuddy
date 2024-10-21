import { Router } from "express";
import authUser from "../middlewares/auth.middleware";
import expenseController from "../controllers/expense.controller";

const router = Router();

router.post("/addExpense", authUser, expenseController.addExpense);

export default router;
