// Shared data models used by services, hooks and screens.
//
// Money is always stored as an integer number of paise ("minor units"),
// e.g. ₹123.45 is stored as 12345. See utils/money.ts.

export type TransactionType = 'income' | 'expense';

export type ExpenseCategoryId = 'food' | 'bills' | 'shopping';
export type IncomeCategoryId = 'salary' | 'freelance' | 'otherIncome';
export type CategoryId = ExpenseCategoryId | IncomeCategoryId;

export interface UserTotals {
  incomeMinor: number;
  expenseMinor: number;
}

export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  totals: UserTotals;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amountMinor: number;
  category: CategoryId;
  note: string;
  transactionDate: Date;
}

export interface NewTransactionInput {
  type: TransactionType;
  amountMinor: number;
  category: CategoryId;
  note: string;
  transactionDate: Date;
}

// Budgets repeat every month: one document per expense category.
export interface Budget {
  id: string;
  category: ExpenseCategoryId;
  limitMinor: number;
}
