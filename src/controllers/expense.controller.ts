import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ExpenseController {
  // Method to handle adding an expense
  async addExpense(req: Request, res: Response): Promise<any> {
    // Extract user email from the authenticated request
    const { email } = (<any>req).user;

    try {
      // Find the user by their email in the database
      const user = await prisma.user.findUnique({ where: { email } });

      // If user not found, send an error response
      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found. Please register first." });
      }

      // Destructure relevant fields from the request body
      const {
        splitMethod,
        totalAmount,
        noOfUser,
        users,
        exact_amount,
        percentage,
      } = req.body;

      // Validate if the number of users matches the provided list of users
      if (noOfUser !== users.length + 1) {
        return res.status(400).json({
          message: "Number of users does not match the provided users list.",
        });
      }

      // Create the expense in the database
      const expense = await prisma.expense.create({
        data: {
          total_amount: totalAmount,
          split_method: splitMethod,
          user_id: user.id,
        },
      });

      // If the expense creation fails, send an error response
      if (!expense) {
        return res.status(500).json({
          message: "Failed to create the expense. Please try again later.",
        });
      }

      let userExpenses: any = [];

      // Find all users in the list of provided users' emails
      const existingUsers = await prisma.user.findMany({
        where: { email: { in: users.map((u: any) => u.email || u) } },
      });

      // If any user is not found, send an error response
      if (existingUsers.length !== users.length) {
        return res.status(404).json({
          message: "One or more users not found. Please check their emails.",
        });
      }

      // Handle the expense splitting based on the chosen split method
      if (splitMethod === "EQUAL") {
        // Equal split: Each user gets an equal share of the total amount
        const splitAmount = totalAmount / noOfUser;
        userExpenses = existingUsers.map((u) => ({
          expense_id: expense.id,
          user_id: u.id,
          amount: splitAmount,
          percentage: 100 / noOfUser,
          exact_amount: splitAmount,
        }));

        // Add the current user (who created the expense) to the split as well
        userExpenses.push({
          expense_id: expense.id,
          user_id: user.id,
          amount: splitAmount,
          percentage: 100 / noOfUser,
          exact_amount: splitAmount,
        });
      } else if (splitMethod === "EXACT") {
        // Exact split: Each user contributes an exact amount
        const totalExactAmount = users.reduce(
          (sum: number, u: any) => sum + u.exact_amount,
          0
        );

        // Validate if the sum of exact amounts equals the total amount
        if (totalExactAmount + exact_amount !== totalAmount) {
          return res.status(400).json({
            message:
              "Total of exact amounts does not match the total expense amount.",
          });
        }

        // Map each user's contribution to the expense
        userExpenses = existingUsers.map((existingUser) => {
          const userExpense = users.find(
            (u: any) => u.email === existingUser.email
          );
          return {
            expense_id: expense.id,
            user_id: existingUser.id,
            exact_amount: userExpense.exact_amount,
            amount: userExpense.exact_amount,
            percentage: (userExpense.exact_amount / totalAmount) * 100,
          };
        });

        // Add the remaining amount to the current user
        userExpenses.push({
          expense_id: expense.id,
          user_id: user.id,
          exact_amount: totalAmount - totalExactAmount,
          amount: totalAmount - totalExactAmount,
          percentage: ((totalAmount - totalExactAmount) / totalAmount) * 100,
        });
      } else if (splitMethod === "PERCENTAGE") {
        // Percentage split: Each user contributes based on a percentage
        const totalPercentage = users.reduce(
          (sum: number, u: any) => sum + u.percentage,
          0
        );

        // Validate if the total percentage equals 100%
        if (totalPercentage + percentage !== 100) {
          return res
            .status(400)
            .json({ message: "Total of percentages does not equal 100%." });
        }

        // Map each user's contribution based on their percentage
        userExpenses = existingUsers.map((existingUser) => {
          const userExpense = users.find(
            (u: any) => u.email === existingUser.email
          );
          return {
            expense_id: expense.id,
            user_id: existingUser.id,
            exact_amount: (totalAmount * userExpense.percentage) / 100,
            amount: (totalAmount * userExpense.percentage) / 100,
            percentage: userExpense.percentage,
          };
        });

        // Add the remaining percentage contribution to the current user
        userExpenses.push({
          expense_id: expense.id,
          user_id: user.id,
          exact_amount: (totalAmount * (100 - totalPercentage)) / 100,
          amount: (totalAmount * (100 - totalPercentage)) / 100,
          percentage: 100 - totalPercentage,
        });
      }

      // Insert all user expense records into the database
      await prisma.userExpense.createMany({ data: userExpenses });

      // Return a success response with the created expense and user shares
      return res.status(201).json({
        message: "Expense and user shares added successfully!",
        data: { expense, userExpenses },
      });
    } catch (error) {
      // Log any errors and return a generic server error response
      console.error("Error adding expense:", error);
      return res
        .status(500)
        .json({ message: "Server error: Unable to add expense." });
    }
  }
}

export default new ExpenseController();
