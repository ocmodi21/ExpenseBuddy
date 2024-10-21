import { Router } from "express";
import authUser from "../middlewares/auth.middleware";
import expenseController from "../controllers/expense.controller";

const router = Router();

router.post("/addExpense", authUser, expenseController.addExpense);
router.get(
  "/individualExpense",
  authUser,
  expenseController.getIndividualExpense
);
router.get("/overallExpense", authUser, expenseController.getOverallExpenses);

export default router;
