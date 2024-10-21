import { Router } from "express";
import authUser from "../middlewares/auth.middleware";
import expenseController from "../controllers/expense.controller";
import expenseSchema from "../schemas/expense.schema";

const router = Router();

router.post(
  "/addExpense",
  expenseSchema.addExpenseValidator,
  authUser,
  expenseController.addExpense
);
router.get(
  "/individualExpense",
  authUser,
  expenseController.getIndividualExpense
);
router.get("/overallExpense", authUser, expenseController.getOverallExpenses);
router.get(
  "/downloadBalanceSheet",
  authUser,
  expenseController.getBalanceSheet
);

export default router;
