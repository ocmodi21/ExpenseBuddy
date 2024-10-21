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

## API Endpoints

### User Endpoints

1. **Register User**

   - **URL**: `/user/register`
   - **Method**: `POST`
   - **Request Body**:
     ```json
     {
       "name": "Test",
       "email": "test@example.com",
       "mobile": "1234567890",
       "password": "*****"
     }
     ```
   - **Response**:
     ```json
     {
       "message": "User registered successfully.",
       "data": {
         "id": 1,
         "name": "Test",
         "email": "test@example.com",
         "phone_number": "1234567890",
         "password": "$2b$10$B3bGYrpY.woesxbaGODGCOsmnAD5JWTIWRVYIinOrBl4Fd4DaQBKu",
         "rec_status": true,
         "created_at": "2024-10-20T18:45:58.037Z",
         "updated_at": "2024-10-20T18:45:58.037Z"
       },
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im9jbW9kaTIxMTdAZ21haWwuY29tIiwibmFtZSI6Ik9tIE1vZGkiLCJpYXQiOjE3Mjk1MDYxMTN9.Q6noIXbf0l9RCoVx1XE1fC-TGUE_LHAiU0J9bbavYec"
     }
     ```

2. **Login User**

   - **URL**: `/user/login`
   - **Method**: `POST`
   - **Request Body**:
     ```json
     {
       "email": "test@example.com",
       "password": "*****"
     }
     ```
   - **Response**:
     ```json
     {
       "message": "Login successful.",
       "data": {
         "id": 1,
         "name": "Test",
         "email": "test@example.com",
         "phone_number": "1234567890",
         "password": "$2b$10$B3bGYrpY.woesxbaGODGCOsmnAD5JWTIWRVYIinOrBl4Fd4DaQBKu",
         "rec_status": true,
         "created_at": "2024-10-20T18:45:58.037Z",
         "updated_at": "2024-10-20T18:45:58.037Z"
       },
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im9jbW9kaTIxMTdAZ21haWwuY29tIiwibmFtZSI6Ik9tIE1vZGkiLCJpYXQiOjE3Mjk1MDYxMTN9.Q6noIXbf0l9RCoVx1XE1fC-TGUE_LHAiU0J9bbavYec"
     }
     ```

3. **Retrieve User Details**
   - **URL**: `/user/profile`
   - **Method**: `GET`
   - **Example Header**:
     ```json
     {
       "Authorization": "Bearer <your-token-here>"
     }
     ```
   - **Response**:
     ```json
     {
       "message": "User details retrieved successfully.",
       "data": {
         "id": 1,
         "name": "Test",
         "email": "test@gmail.com",
         "phone_number": "1234567890",
         "password": "$2b$10$B3bGYrpY.woesxbaGODGCOsmnAD5JWTIWRVYIinOrBl4Fd4DaQBKu",
         "rec_status": true,
         "created_at": "2024-10-20T18:45:58.037Z",
         "updated_at": "2024-10-20T18:45:58.037Z",
         "Expense": [
           {
             "id": 5,
             "total_amount": 900,
             "description": null,
             "split_method": "EQUAL",
             "user_id": 1,
             "created_at": "2024-10-21T03:03:07.553Z",
             "updated_at": "2024-10-21T03:03:07.553Z"
           }
         ],
         "UserExpense": [
           {
             "amount": 300,
             "exact_amount": 300,
             "percentage": 33.33333333333334,
             "is_settled": false,
             "user_id": 1,
             "expense_id": 5,
             "created_at": "2024-10-21T03:03:07.573Z",
             "updated_at": "2024-10-21T03:03:07.573Z"
           }
         ]
       }
     }
     ```

### Expense Endpoints

1. **Add Expense**

   - **URL**: `/expense/addExpense`
   - **Method**: `POST`
   - **Example Header**:
     ```json
     {
       "Authorization": "Bearer <your-token-here>"
     }
     ```
   - **Request Body (Equal Split)**:
     ```json
     {
       "description": "Dinner",
       "amount": 3000,
       "splitMethod": "EQUAL",
       "participants": [
         "user1@example.com",
         "user2@example.com",
         "user3@example.com"
       ]
     }
     ```
   - **Request Body (Exact Amount Split)**:
     ```json
     {
       "description": "Shopping",
       "amount": 4299,
       "splitMethod": "EXACT",
       "participants": [
         { "email": "user1@example.com", "exact_amount": 799 },
         { "email": "user2@example.com", "exact_amount": 2000 },
         { "email": "user3@example.com", "exact_amount": 1500 }
       ]
     }
     ```
   - **Request Body (Percentage Split)**:
     ```json
     {
       "description": "Party",
       "amount": 1000,
       "splitMethod": "PERCENTAGE",
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
       "message": "Expense and user shares added successfully!",
       "data": {
         "expense": {
           "id": 11,
           "total_amount": 1500,
           "description": "Shopping",
           "split_method": "EXACT",
           "user_id": 1,
           "created_at": "2024-10-21T10:35:14.958Z",
           "updated_at": "2024-10-21T10:35:14.958Z"
         },
         "userExpenses": [
           {
             "expense_id": 11,
             "user_id": 2,
             "exact_amount": 799,
             "amount": 799,
             "percentage": 18.58571760874622
           },
           {
             "expense_id": 11,
             "user_id": 3,
             "exact_amount": 2000,
             "amount": 2000,
             "percentage": 46.52244708071645
           },
           {
             "expense_id": 11,
             "user_id": 4,
             "exact_amount": 1500,
             "amount": 1500,
             "percentage": 34.89183531053733
           }
         ]
       }
     }
     ```

2. **Retrieve Individual User Expenses**

   - **URL**: `/expense/individualExpense`
   - **Method**: `GET`
   - **Example Header**:
     ```json
     {
       "Authorization": "Bearer <your-token-here>"
     }
     ```
   - **Response**:
     ```json
     {
       "message": "User expense records retrieved successfully!",
       "data": {
         "userExpenses": [
           {
             "amount": 300,
             "exact_amount": 300,
             "percentage": 33.33333333333334,
             "is_settled": false,
             "user_id": 1,
             "expense_id": 5,
             "created_at": "2024-10-21T03:03:07.573Z",
             "updated_at": "2024-10-21T03:03:07.573Z"
           },
           {
             "amount": 270,
             "exact_amount": 270,
             "percentage": 30,
             "is_settled": false,
             "user_id": 1,
             "expense_id": 8,
             "created_at": "2024-10-21T04:11:51.584Z",
             "updated_at": "2024-10-21T04:11:51.584Z"
           }
         ]
       }
     }
     ```

3. **Retrieve Overall Expenses**

   - **URL**: `/expense/overallExpense`
   - **Method**: `GET`
   - **Example Header**:
     ```json
     {
       "Authorization": "Bearer <your-token-here>"
     }
     ```
   - **Response**:
     ```json
     {
       "message": "User expense records retrieved successfully.",
       "data": {
         "totalExpenses": 12000,
         "expenses": [
           { "description": "Dinner", "amount": 3000 },
           { "description": "Shopping", "amount": 4299 }
         ]
       }
     }
     ```

4. **Download Balance Sheet**
   - **URL**: `/expense/downloadBalanceSheet`
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

- **Backend**: Node.js with Express
- **Database**: PostgreSQL/MongoDB
- **ORM**: Prisma (for PostgreSQL)
- **Excel Sheet Generation**: ExcelJS

## Author

- [Om Modi](https://ocmodi21.vercel.app)
