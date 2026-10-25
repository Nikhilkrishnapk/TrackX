import { formatCurrency, parseAmountToMinor } from '../src/utils/money';
import { calculateBudgetProgress, sumByType } from '../src/utils/finance';
import { Transaction } from '../src/types';

describe('parseAmountToMinor', () => {
  it('parses whole and decimal amounts without float errors', () => {
    expect(parseAmountToMinor('120')).toEqual({ ok: true, amountMinor: 12000 });
    expect(parseAmountToMinor('120.5')).toEqual({ ok: true, amountMinor: 12050 });
    expect(parseAmountToMinor('0.29')).toEqual({ ok: true, amountMinor: 29 });
    expect(parseAmountToMinor('1,200.75')).toEqual({ ok: true, amountMinor: 120075 });
  });

  it('rejects invalid input', () => {
    expect(parseAmountToMinor('').ok).toBe(false);
    expect(parseAmountToMinor('0').ok).toBe(false);
    expect(parseAmountToMinor('-5').ok).toBe(false);
    expect(parseAmountToMinor('1.234').ok).toBe(false);
    expect(parseAmountToMinor('abc').ok).toBe(false);
    expect(parseAmountToMinor('10000001').ok).toBe(false);
  });
});

describe('formatCurrency', () => {
  it('uses Indian digit grouping', () => {
    expect(formatCurrency(845020)).toBe('₹ 8,450.20');
    expect(formatCurrency(12345678900)).toBe('₹ 12,34,56,789.00');
    expect(formatCurrency(5)).toBe('₹ 0.05');
    expect(formatCurrency(-50000)).toBe('-₹ 500.00');
  });
});

describe('finance helpers', () => {
  const tx = (type: 'income' | 'expense', amountMinor: number): Transaction => ({
    id: `${type}-${amountMinor}`,
    type,
    amountMinor,
    category: type === 'income' ? 'salary' : 'food',
    note: '',
    transactionDate: new Date(),
  });

  it('sums by type exactly', () => {
    const totals = sumByType([tx('expense', 10), tx('expense', 20), tx('income', 5000)]);
    expect(totals).toEqual({ incomeMinor: 5000, expenseMinor: 30 });
  });

  it('flags exceeded budgets', () => {
    const [progress] = calculateBudgetProgress(
      [{ id: 'food', category: 'food', limitMinor: 1000 }],
      { food: 1500 },
    );
    expect(progress.isExceeded).toBe(true);
    expect(progress.remainingMinor).toBe(-500);
    expect(progress.percentUsed).toBe(150);
  });
});
