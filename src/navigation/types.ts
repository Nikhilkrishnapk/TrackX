import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { TransactionType } from '../types';

export type TabParamList = {
  Home: undefined;
  Activity: undefined;
  AddBudget: { mode?: TransactionType } | undefined;
  Budget: undefined;
  Profile: undefined;
};

export type TabScreenProps<Screen extends keyof TabParamList> = BottomTabScreenProps<
  TabParamList,
  Screen
>;
