import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { User } from '@react-native-firebase/auth';
import { createUserProfile, subscribeToUserProfile } from '../services/firebase/user';
import { subscribeToTransactions } from '../services/firebase/transactions';
import { subscribeToBudgets } from '../services/firebase/budgets';
import { Budget, Transaction, UserProfile } from '../types';
import { startOfMonth } from '../utils/date';

// Data shared by the signed-in screens. Listeners live here (one per data
// set) instead of in each screen, so switching tabs does not refetch and
// every screen sees the same, always up-to-date data.

interface AppDataContextValue {
  user: User;
  profile: UserProfile | null;
  // Transactions from the start of LAST month until now: enough for the
  // dashboard (this month / last month) and the budget screen.
  recentTransactions: Transaction[];
  budgets: Budget[];
  loading: boolean;
  error: string | null;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

const LOAD_ERROR = 'Could not load your data. Check your connection.';

export function AppDataProvider({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loaded, setLoaded] = useState({ profile: false, transactions: false, budgets: false });
  const [error, setError] = useState<string | null>(null);
  const profileRepairAttempted = useRef(false);

  const uid = user.uid;

  useEffect(() => {
    const markLoaded = (key: keyof typeof loaded) =>
      setLoaded(prev => (prev[key] ? prev : { ...prev, [key]: true }));
    const handleError = (key: keyof typeof loaded) => (e: Error) => {
      console.warn(`Failed to load ${key}`, e);
      setError(LOAD_ERROR);
      markLoaded(key);
    };

    const unsubscribeProfile = subscribeToUserProfile(
      uid,
      (nextProfile, fromCache) => {
        setProfile(nextProfile);
        markLoaded('profile');

        // Repair accounts whose profile document is missing or incomplete
        // (e.g. the write after sign up failed). Only trust the server's
        // answer, and only try once per session.
        const needsRepair = !nextProfile || !nextProfile.username;
        if (needsRepair && !fromCache && !profileRepairAttempted.current) {
          profileRepairAttempted.current = true;
          const fallbackName = user.displayName || user.email?.split('@')[0] || 'User';
          createUserProfile(uid, fallbackName, user.email ?? '', !nextProfile).catch(e =>
            console.warn('Profile repair failed', e),
          );
        }
      },
      handleError('profile'),
    );

    const unsubscribeTransactions = subscribeToTransactions(
      uid,
      { since: startOfMonth(new Date(), -1) },
      transactions => {
        setRecentTransactions(transactions);
        markLoaded('transactions');
      },
      handleError('transactions'),
    );

    const unsubscribeBudgets = subscribeToBudgets(
      uid,
      nextBudgets => {
        setBudgets(nextBudgets);
        markLoaded('budgets');
      },
      handleError('budgets'),
    );

    return () => {
      unsubscribeProfile();
      unsubscribeTransactions();
      unsubscribeBudgets();
    };
    // `user` details are only read for the one-off repair above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  const value = useMemo<AppDataContextValue>(
    () => ({
      user,
      profile,
      recentTransactions,
      budgets,
      loading: !loaded.profile || !loaded.transactions || !loaded.budgets,
      error,
    }),
    [user, profile, recentTransactions, budgets, loaded, error],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const value = useContext(AppDataContext);
  if (!value) {
    throw new Error('useAppData must be used inside <AppDataProvider>');
  }
  return value;
}
