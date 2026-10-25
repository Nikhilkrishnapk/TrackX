import { Budget, ExpenseCategoryId, Transaction } from '../types';
import { isSameMonth } from './date';

// Pure calculation helpers. They take plain data and return plain data,
// so they are easy to reason about and to unit test.

export function transactionsInMonth(transactions: Transaction[], month: Date): Transaction[] {
  return transactions.filter(t => isSameMonth(t.transactionDate, month));
}

export function sumByType(transactions: Transaction[]) {
  let incomeMinor = 0;
  let expenseMinor = 0;
  for (const t of transactions) {
    if (t.type === 'income') {
      incomeMinor += t.amountMinor;
    } else {
      expenseMinor += t.amountMinor;
    }
  }
  return { incomeMinor, expenseMinor };
}

// Total expense amount per category, e.g. { food: 12000, bills: 4500 }
export function expensesByCategory(transactions: Transaction[]): Partial<Record<ExpenseCategoryId, number>> {
  const totals: Partial<Record<ExpenseCategoryId, number>> = {};
  for (const t of transactions) {
    if (t.type === 'expense') {
      const category = t.category as ExpenseCategoryId;
      totals[category] = (totals[category] ?? 0) + t.amountMinor;
    }
  }
  return totals;
}

export interface BudgetProgress {
  budget: Budget;
  spentMinor: number;
  remainingMinor: number;
  percentUsed: number;
  isExceeded: boolean;
}

export function calculateBudgetProgress(
  budgets: Budget[],
  monthExpenses: Partial<Record<ExpenseCategoryId, number>>,
): BudgetProgress[] {
  return budgets.map(budget => {
    const spentMinor = monthExpenses[budget.category] ?? 0;
    return {
      budget,
      spentMinor,
      remainingMinor: budget.limitMinor - spentMinor,
      percentUsed: budget.limitMinor > 0 ? (spentMinor / budget.limitMinor) * 100 : 0,
      isExceeded: spentMinor > budget.limitMinor,
    };
  });
}
