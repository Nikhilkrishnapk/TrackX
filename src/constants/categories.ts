import React from 'react';
import { SvgProps } from 'react-native-svg';
import FoodIcon from '../assets/images/food-icon.svg';
import BillIcon from '../assets/images/bill-icon.svg';
import ShoppingIcon from '../assets/images/shopping-icon.svg';
import { colorStyles } from './colors';
import {
  CategoryId,
  ExpenseCategoryId,
  IncomeCategoryId,
  TransactionType,
} from '../types';

// Single source of truth for categories. Every screen/component that shows
// a category reads from here, so adding a category is a one-file change.

export interface CategoryDefinition<Id extends CategoryId = CategoryId> {
  id: Id;
  name: string;
  type: TransactionType;
  color: string;
  emoji: string;
  Icon?: React.FC<SvgProps>;
}

export const EXPENSE_CATEGORIES: CategoryDefinition<ExpenseCategoryId>[] = [
  { id: 'food', name: 'Food & Dining', type: 'expense', color: colorStyles.foodAndDinning, emoji: '🍽️', Icon: FoodIcon },
  { id: 'bills', name: 'Bills & Utilities', type: 'expense', color: colorStyles.billAndUtilities, emoji: '⚡', Icon: BillIcon },
  { id: 'shopping', name: 'Shopping', type: 'expense', color: colorStyles.shopping, emoji: '🛍️', Icon: ShoppingIcon },
];

export const INCOME_CATEGORIES: CategoryDefinition<IncomeCategoryId>[] = [
  { id: 'salary', name: 'Salary', type: 'income', color: '#2E6B4F', emoji: '🏦' },
  { id: 'freelance', name: 'Freelance', type: 'income', color: '#3C8D6A', emoji: '💻' },
  { id: 'otherIncome', name: 'Other Income', type: 'income', color: '#61A887', emoji: '💰' },
];

const ALL_CATEGORIES: CategoryDefinition[] = [
  ...EXPENSE_CATEGORIES,
  ...INCOME_CATEGORIES,
];

export function getCategoriesForType(type: TransactionType): CategoryDefinition[] {
  return type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
}

export function getCategory(id: string): CategoryDefinition | undefined {
  return ALL_CATEGORIES.find(category => category.id === id);
}

export function isCategoryId(value: unknown): value is CategoryId {
  return typeof value === 'string' && getCategory(value) !== undefined;
}

export function isExpenseCategoryId(value: unknown): value is ExpenseCategoryId {
  return EXPENSE_CATEGORIES.some(category => category.id === value);
}
