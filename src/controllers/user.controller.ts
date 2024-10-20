import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import passwordManager from "../utils/password-manager";
import authManager from "../utils/auth-manager";

const prisma = new PrismaClient();

class UserController {
  // Login user
  async login(req: Request, res: Response): Promise<any> {
    const { email, password } = req.body;

    try {
      // Check if a user with the given email exists
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found. Please register first." });
      }

      // Verify the provided password against the stored hashed password
      const verified = passwordManager.comparePassword(password, user.password);
      if (!verified) {
        return res
          .status(401)
          .json({ message: "Incorrect password. Please try again." });
      }

      // Generate authentication token for the user
      const token = await authManager.generateToken(email, user.name);

      // Respond with user data and authentication token
      return res
        .status(200)
        .json({ message: "Login successful.", data: user, token });
    } catch (error) {
      // Handle any errors during login
      return res
        .status(500)
        .json({ message: "Server error: Unable to process login request." });
    }
  }

  // Register a new user
  async register(req: Request, res: Response): Promise<any> {
    const { name, email, phone_number, password } = req.body;

    try {
      // Check if a user with the given email and name already exists
      const userExists = await prisma.user.findUnique({ where: { email } });
      if (userExists) {
        return res
          .status(409)
          .json({ message: "User already registered with this email." });
      }

      // Hash the password before storing it in the database
      const hash = passwordManager.hashPassword(password);

      // Generate authentication token for the new user
      const token = await authManager.generateToken(email, name);

      // Create a new user record in the database
      const user = await prisma.user.create({
        data: {
          name,
          email,
          phone_number,
          password: hash,
        },
      });

      // Check if user creation was successful
      if (!user) {
        return res.status(500).json({
          message: "Error while creating user. Please try again later.",
        });
      }

      // Respond with the newly created user data and authentication token
      return res
        .status(201)
        .json({ message: "User registered successfully.", data: user, token });
    } catch (error) {
      // Handle any errors during user registration
      return res
        .status(500)
        .json({ message: "Server error: Unable to register user." });
    }
  }

  // User details
  async userDetails(req: Request, res: Response): Promise<any> {
    // Extract email from the request's user object (attached after authentication middleware)
    const { email } = (<any>req).user;

    try {
      // Check if a user with the given email and name already exists
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          Expense: true,
          UserExpense: true,
        },
      });

      // If no user is found, return a 404 response with an error message
      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found. Please register first." });
      }

      // Respond with the user details
      return res
        .status(200)
        .json({ message: "User details retrieved successfully.", data: user });
    } catch (error) {
      // Handle any errors while fetching user details
      return res
        .status(500)
        .json({ message: "Server error: Unable to retrieve user details." });
    }
  }
}

export default new UserController();
