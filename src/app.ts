import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import logger from "./middlewares/logger/logger";
import userRoutes from "./routes/user.route";
import expenseRoutes from "./routes/expense.route";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

// api
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/expense", expenseRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
