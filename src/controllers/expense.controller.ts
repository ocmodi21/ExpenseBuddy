import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { generateBalanceSheet } from "../utils/sheet-manager";

const prisma = new PrismaClient();

class ExpenseController {
  // Method to handle adding an expense
  async addExpense(req: Request, res: Response): Promise<any> {
    // Extract user email from the authenticated request
    const { email } = (<any>req).user;

    try {
      // Use a single transaction with callback
      await prisma.$transaction(async (prisma) => {
        // Find the user by their email in the database
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          throw new Error("User not found. Please register first.");
        }

        // Destructure relevant fields from the request body
        const {
          splitMethod,
          amount,
          users_count,
          users,
          exact_amount,
          percentage,
        } = req.body;

        // Validate if the number of users matches the provided list of users
        if (users_count !== users.length + 1) {
          throw new Error(
            "Number of users does not match the provided users list."
          );
        }

        // Create the expense in the database
        const expense = await prisma.expense.create({
          data: {
            total_amount: amount,
            split_method: splitMethod,
            user_id: user.id,
          },
        });

        // Find all users in the list of provided users' emails
        const existingUsers = await prisma.user.findMany({
          where: { email: { in: users.map((u: any) => u.email || u) } },
        });

        if (existingUsers.length !== users.length) {
          throw new Error(
            "One or more users not found. Please check their emails."
          );
        }

        let userExpenses: {
          expense_id: number;
          user_id: number;
          amount: number;
          percentage: number;
          exact_amount: number;
        }[] = [];

        // Handle the expense splitting based on the chosen split method
        if (splitMethod === "EQUAL") {
          const splitAmount = amount / users_count;
          userExpenses = existingUsers.map((u) => ({
            expense_id: expense.id,
            user_id: u.id,
            amount: splitAmount,
            percentage: 100 / users_count,
            exact_amount: splitAmount,
          }));

          // Add the current user (who created the expense) to the split
          userExpenses.push({
            expense_id: expense.id,
            user_id: user.id,
            amount: splitAmount,
            percentage: 100 / users_count,
            exact_amount: splitAmount,
          });
        } else if (splitMethod === "EXACT") {
          const totalExactAmount = users.reduce(
            (sum: number, u: any) => sum + u.exact_amount,
            0
          );

          if (totalExactAmount + exact_amount !== amount) {
            throw new Error(
              "Total of exact amounts does not match the total expense amount."
            );
          }

          userExpenses = existingUsers.map((existingUser) => {
            const userExpense = users.find(
              (u: any) => u.email === existingUser.email
            );
            return {
              expense_id: expense.id,
              user_id: existingUser.id,
              exact_amount: userExpense.exact_amount,
              amount: userExpense.exact_amount,
              percentage: (userExpense.exact_amount / amount) * 100,
            };
          });

          userExpenses.push({
            expense_id: expense.id,
            user_id: user.id,
            exact_amount: amount - totalExactAmount,
            amount: amount - totalExactAmount,
            percentage: ((amount - totalExactAmount) / amount) * 100,
          });
        } else if (splitMethod === "PERCENTAGE") {
          const totalPercentage = users.reduce(
            (sum: number, u: any) => sum + u.percentage,
            0
          );

          if (totalPercentage + percentage !== 100) {
            throw new Error("Total of percentages does not equal 100%.");
          }

          userExpenses = existingUsers.map((existingUser) => {
            const userExpense = users.find(
              (u: any) => u.email === existingUser.email
            );
            return {
              expense_id: expense.id,
              user_id: existingUser.id,
              exact_amount: (amount * userExpense.percentage) / 100,
              amount: (amount * userExpense.percentage) / 100,
              percentage: userExpense.percentage,
            };
          });

          userExpenses.push({
            expense_id: expense.id,
            user_id: user.id,
            exact_amount: (amount * (100 - totalPercentage)) / 100,
            amount: (amount * (100 - totalPercentage)) / 100,
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
      });
    } catch (error) {
      // Return an error response with the original error message
      return res.status(500).json({
        message: "Server error: Unable to add expense.",
      });
    }
  }

  async getIndividualExpense(req: Request, res: Response): Promise<any> {
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

      // Find all user expense records in the database
      const userExpenses = await prisma.userExpense.findMany({
        where: { user_id: user.id },
      });

      // If no user expenses are found, send an error response
      if (!userExpenses || userExpenses.length === 0) {
        return res
          .status(404)
          .json({ message: "No expenses found for the user." });
      }

      // Return a success response with the user's expense records
      return res.status(200).json({
        message: "User expense records retrieved successfully!",
        data: { userExpenses },
      });
    } catch (error) {
      // return a generic server error response
      return res
        .status(500)
        .json({ message: "Server error: Unable to get individual expense." });
    }
  }

  async getOverallExpenses(req: Request, res: Response): Promise<any> {
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

      // Find all expense records associated with the authenticated user
      const overallExpenses = await prisma.user.findUnique({
        where: { email },
        include: {
          UserExpense: {
            include: {
              expense: true,
            },
          },
        },
      });

      // If no user expenses are found, send an error response
      if (!overallExpenses || overallExpenses.UserExpense.length === 0) {
        return res
          .status(404)
          .json({ message: "No expenses found for the user." });
      }

      // Calculate total paid and total owed for the user
      let totalPaid = 0;
      let totalOwed = 0;

      overallExpenses.UserExpense.forEach((userExpense) => {
        if (userExpense.expense.user_id === user.id) {
          totalPaid += userExpense.exact_amount;
        } else {
          totalOwed += userExpense.exact_amount;
        }
      });

      // Prepare the balance details for the user
      const balance = {
        user: user.email,
        totalPaid,
        totalOwed,
        balance: totalPaid - totalOwed,
      };

      // Return a success response with the user's expense records
      return res.status(200).json({
        message: "User expense records retrieved successfully.",
        data: { balance },
      });
    } catch (error) {
      // Return a generic server error response
      return res
        .status(500)
        .json({ message: "Server error: Unable to retrieve user expenses." });
    }
  }

  async getBalanceSheet(req: Request, res: Response): Promise<any> {
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

      // Fetch all expenses linked to the user, including related user and expense details
      const userExpenses = await prisma.userExpense.findMany({
        where: { user_id: user.id },
        include: { user: true, expense: true },
      });

      // Fetch all expenses in the system, including details of the user who paid and user-expense relations
      const allExpenses = await prisma.expense.findMany({
        include: { paid_by: true, UserExpense: true },
      });

      // Generate the balance sheet by processing user expenses and all expenses,
      // and store the resulting file path
      const filePath = await generateBalanceSheet(userExpenses, allExpenses);

      // Send the generated balance sheet as a downloadable file to the client
      res.download(filePath);
    } catch (error) {
      // Return a 500 status with a generic server error message if an exception occurs
      return res
        .status(500)
        .json({ message: "Server error: Unable to retrieve balance sheet." });
    }
  }
}

export default new ExpenseController();
