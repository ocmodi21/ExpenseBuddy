import { NextFunction, Request, Response } from "express";
import Joi from "joi";

// Define validation schema for login requests
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Define validation schema for register requests
const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone_number: Joi.string()
    .regex(/^[0-9]{10}$/)
    .required(),
  password: Joi.string().required(),
});

class AuthSchemaValidator {
  // Validate login request body
  loginValidator(req: Request, res: Response, next: NextFunction): any {
    try {
      // Validate request body against the login schema
      const { error } = loginSchema.validate(req.body);

      // If validation fails, respond with the error message
      if (error) {
        return res
          .status(400)
          .send({ message: `Validation error: ${error.details[0].message}` });
      }

      // If validation passes, proceed to the next middleware or route handler
      next();
    } catch (error) {
      return next(new Error("Server error: Invalid request body for login.")); // Handle server-side validation errors
    }
  }

  // Validate register request body
  registerValidator(req: Request, res: Response, next: NextFunction): any {
    try {
      // Validate request body against the register schema
      const { error } = registerSchema.validate(req.body);

      // If validation fails, respond with the error message
      if (error) {
        return res
          .status(400)
          .send({ message: `Validation error: ${error.details[0].message}` });
      }

      // If validation passes, proceed to the next middleware or route handler
      next();
    } catch (error) {
      return next(
        new Error("Server error: Invalid request body for registration.")
      ); // Handle server-side validation errors
    }
  }
}

export default new AuthSchemaValidator();
