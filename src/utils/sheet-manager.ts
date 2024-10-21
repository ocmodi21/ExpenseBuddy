import Exceljs from "exceljs";

export async function generateBalanceSheet(
  userExpenses: any[],
  allExpenses: any[]
) {
  const workbook = new Exceljs.Workbook();
  const worksheet = workbook.addWorksheet("Balance Sheet");

  // Add headers
  worksheet.columns = [
    { header: "User Name", key: "name", width: 20 },
    { header: "Expense Description", key: "description", width: 30 },
    { header: "Total Amount", key: "total_amount", width: 15 },
    { header: "Exact Amount", key: "exact_amount", width: 15 },
    { header: "Percentage", key: "percentage", width: 15 },
    { header: "Is Settled", key: "is_settled", width: 10 },
    { header: "Date Created", key: "created_at", width: 20 },
  ];

  // Add individual expenses
  userExpenses.forEach((expense) => {
    worksheet.addRow({
      name: expense.user.name,
      description: expense.expense.description || "N/A",
      total_amount: expense.expense.total_amount,
      exact_amount: expense.exact_amount,
      percentage: expense.percentage,
      is_settled: expense.is_settled ? "Yes" : "No",
      created_at: expense.created_at,
    });
  });

  // Add a new worksheet for overall expenses
  const overallWorksheet = workbook.addWorksheet("Overall Expenses");
  overallWorksheet.columns = [
    { header: "Paid By", key: "paid_by", width: 20 },
    { header: "Expense Description", key: "description", width: 30 },
    { header: "Total Amount", key: "total_amount", width: 15 },
    { header: "Date Created", key: "created_at", width: 20 },
  ];

  allExpenses.forEach((expense) => {
    overallWorksheet.addRow({
      paid_by: expense.paid_by.name,
      description: expense.description || "N/A",
      total_amount: expense.total_amount,
      created_at: expense.created_at,
    });
  });

  // Write to file or send as response
  const filePath = "./balance-sheet.xlsx";
  await workbook.xlsx.writeFile(filePath);
  return filePath; // Return the file path to be downloaded
}
