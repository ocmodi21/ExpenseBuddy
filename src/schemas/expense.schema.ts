import { NextFunction, Request, Response } from "express";
import Joi from "joi";

// Schema for 'EXACT' split method participants
const userExactSchema = Joi.object({
  email: Joi.string().email().required(),
  exact_amount: Joi.number().positive().required(),
});

// Schema for 'PERCENTAGE' split method participants
const userPercentageSchema = Joi.object({
  email: Joi.string().email().required(),
  percentage: Joi.number().min(1).max(100).required(),
});

// Schema for 'EQUAL' split method participants
const userEqualSchema = Joi.string().email().required();

// Main schema for the add expense request
const addExpenseSchema = Joi.object({
  amount: Joi.number().positive().required(),
  users_count: Joi.number().integer().min(1).required(),

  // Conditional users schema based on the split method
  users: Joi.alternatives().conditional("splitMethod", {
    switch: [
      {
        is: "EXACT",
        then: Joi.array()
          .items(userExactSchema)
          .min(1)
          .max(Joi.ref("users_count"))
          .required(),
      },
      {
        is: "PERCENTAGE",
        then: Joi.array()
          .items(userPercentageSchema)
          .min(1)
          .max(Joi.ref("users_count"))
          .required(),
      },
      {
        is: "EQUAL",
        then: Joi.array()
          .items(userEqualSchema)
          .min(1)
          .max(Joi.ref("users_count"))
          .required(),
      },
    ],
  }),

  // Conditional exact amount field for 'EXACT' split method
  exact_amount: Joi.alternatives().conditional("splitMethod", {
    is: "EXACT",
    then: Joi.number().positive().required(),
    otherwise: Joi.forbidden(),
  }),

  // Conditional percentage field for 'PERCENTAGE' split method
  percentage: Joi.alternatives().conditional("splitMethod", {
    is: "PERCENTAGE",
    then: Joi.number().min(1).max(100).required(),
    otherwise: Joi.forbidden(),
  }),

  splitMethod: Joi.string().valid("EXACT", "PERCENTAGE", "EQUAL").required(),
});

// Class to handle the validation of incoming request payloads for adding an expense.
class ExpenseSchemaValidator {
  // This method validates the addExpense request body against the defined Joi schema.
  addExpenseValidator(req: Request, res: Response, next: NextFunction): any {
    try {
      // Validate the request body using the Joi schema.
      const { error } = addExpenseSchema.validate(req.body);

      // If validation fails, return a 400 Bad Request response with a detailed error message.
      if (error) {
        return res
          .status(400)
          .send({ message: `Validation error: ${error.details[0].message}` });
      }

      // If validation passes, proceed to the next middleware or route handler.
      next();
    } catch (error) {
      // Catch any server-side errors and pass them to the error handler middleware.
      return next(
        new Error("Server error: Invalid request body for addExpense.")
      );
    }
  }
}

// Export an instance of the ExpenseSchemaValidator for use in routes.
export default new ExpenseSchemaValidator();
