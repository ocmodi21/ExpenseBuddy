# ExpenseBuddy

## Objective
This backend service is designed to manage users and expenses for a daily-expenses sharing application. The application allows users to add expenses and split them using three different methods: exact amounts, percentages, and equal splits. It also manages user details, validates inputs, and generates downloadable balance sheets.

## Features
- **User Management**
  - Create user accounts with email, name, and mobile number.
  - Retrieve user details.
  
- **Expense Management**
  - Add expenses with three splitting options: 
    1. Equal split
    2. Exact amounts
    3. Percentage split
  - Retrieve individual and overall expenses.
  - Validate input for expenses.
  - Generate and download balance sheets showing individual and group expenses.

## API Endpoints

### User Endpoints
1. **Create User**
    - **URL**: `/user/create`
    - **Method**: `POST`
    - **Request Body**:
      ```json
      {
        "name": "John Doe",
        "email": "john@example.com",
        "mobile": "1234567890"
      }
      ```
    - **Response**:
      ```json
      {
        "message": "User created successfully",
        "userId": "user123"
      }
      ```

2. **Retrieve User Details**
    - **URL**: `/user/{userId}`
    - **Method**: `GET`
    - **Response**:
      ```json
      {
        "userId": "user123",
        "name": "John Doe",
        "email": "john@example.com",
        "mobile": "1234567890"
      }
      ```

### Expense Endpoints
1. **Add Expense**
    - **URL**: `/expense/add`
    - **Method**: `POST`
    - **Request Body (Equal Split)**:
      ```json
      {
        "description": "Dinner",
        "amount": 3000,
        "splitMethod": "equal",
        "participants": ["user1@example.com", "user2@example.com", "user3@example.com"]
      }
      ```
    - **Request Body (Exact Amount Split)**:
      ```json
      {
        "description": "Shopping",
        "amount": 4299,
        "splitMethod": "exact",
        "participants": [
          { "email": "user1@example.com", "amount": 799 },
          { "email": "user2@example.com", "amount": 2000 },
          { "email": "user3@example.com", "amount": 1500 }
        ]
      }
      ```
    - **Request Body (Percentage Split)**:
      ```json
      {
        "description": "Party",
        "amount": 1000,
        "splitMethod": "percentage",
        "participants": [
          { "email": "user1@example.com", "percentage": 50 },
          { "email": "user2@example.com", "percentage": 25 },
          { "email": "user3@example.com", "percentage": 25 }
        ]
      }
      ```
    - **Response**:
      ```json
      {
        "message": "Expense added successfully",
        "expenseId": "expense123"
      }
      ```

2. **Retrieve Individual User Expenses**
    - **URL**: `/expense/user/{userId}`
    - **Method**: `GET`
    - **Response**:
      ```json
      {
        "totalExpenses": 4000,
        "expenses": [
          { "description": "Dinner", "amount": 1000 },
          { "description": "Shopping", "amount": 1500 }
        ]
      }
      ```

3. **Retrieve Overall Expenses**
    - **URL**: `/expense/all`
    - **Method**: `GET`
    - **Response**:
      ```json
      {
        "totalExpenses": 12000,
        "expenses": [
          { "description": "Dinner", "amount": 3000 },
          { "description": "Shopping", "amount": 4299 }
        ]
      }
      ```

4. **Download Balance Sheet**
    - **URL**: `/expense/download`
    - **Method**: `GET`
    - **Response**:
      - Generates and downloads a balance sheet in `.xlsx` format for all users' expenses.

## Data Validation
- Ensure the following validations are applied:
  - **User inputs**:
    - Validate email, name, and mobile number format.
  - **Expense splits**:
    - For **percentage splits**, ensure that the sum of percentages equals 100%.
    - For **exact splits**, the total specified amounts must equal the expense amount.

## Technologies Used
- **Backend**: Node.js with Express or Golang
- **Database**: PostgreSQL/MongoDB
- **ORM**: Prisma (for PostgreSQL)
- **Excel Sheet Generation**: ExcelJS

## Setup Instructions
1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/daily-expenses-sharing.git
    ```
   
2. Install dependencies:
    ```bash
    npm install
    ```

3. Setup environment variables in `.env` file:
    ```env
    DATABASE_URL=your_database_url
    PORT=3000
    ```

4. Run the application:
    ```bash
    npm start
    ```

5. Access the API at `http://localhost:3000/api/v1`.
