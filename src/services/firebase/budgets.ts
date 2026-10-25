import {
  collection,
  deleteDoc,
  doc,
  FirestoreError,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from '@react-native-firebase/firestore';
import { db } from './client';
import { isExpenseCategoryId } from '../../constants/categories';
import { Budget, ExpenseCategoryId } from '../../types';

// Budgets are monthly and repeat every month. The document id is the
// category id, so each category can have at most one budget.
const budgetsCollection = (uid: string) => collection(db, 'users', uid, 'budgets');

export function saveBudget(
  uid: string,
  category: ExpenseCategoryId,
  limitMinor: number,
  isNew: boolean,
) {
  const ref = doc(budgetsCollection(uid), category);
  if (isNew) {
    return setDoc(ref, {
      category,
      limitMinor,
      period: 'monthly',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  return updateDoc(ref, { limitMinor, updatedAt: serverTimestamp() });
}

export function deleteBudget(uid: string, category: ExpenseCategoryId) {
  return deleteDoc(doc(budgetsCollection(uid), category));
}

export function subscribeToBudgets(
  uid: string,
  onData: (budgets: Budget[]) => void,
  onError: (error: FirestoreError) => void,
) {
  return onSnapshot(
    budgetsCollection(uid),
    snapshot => {
      const budgets: Budget[] = [];
      snapshot.docs.forEach(d => {
        const data = d.data();
        if (isExpenseCategoryId(data.category) && typeof data.limitMinor === 'number') {
          budgets.push({ id: d.id, category: data.category, limitMinor: data.limitMinor });
        }
      });
      onData(budgets);
    },
    onError,
  );
}
