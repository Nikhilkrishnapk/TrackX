import {
  collection,
  doc,
  FirestoreError,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch,
} from '@react-native-firebase/firestore';
import { db } from './client';
import { userDocRef } from './user';
import { isCategoryId } from '../../constants/categories';
import { NewTransactionInput, Transaction, TransactionType } from '../../types';

const transactionsCollection = (uid: string) =>
  collection(db, 'users', uid, 'transactions');

const totalsField = (type: TransactionType) =>
  type === 'income' ? 'incomeMinor' : 'expenseMinor';

// Converts a Firestore document into our Transaction model.
// Malformed documents are skipped instead of crashing the UI.
function toTransaction(snapshot: QueryDocumentSnapshot): Transaction | null {
  const data = snapshot.data();
  if (
    (data.type !== 'income' && data.type !== 'expense') ||
    typeof data.amountMinor !== 'number' ||
    !isCategoryId(data.category) ||
    !(data.transactionDate instanceof Timestamp)
  ) {
    return null;
  }
  return {
    id: snapshot.id,
    type: data.type,
    amountMinor: data.amountMinor,
    category: data.category,
    note: typeof data.note === 'string' ? data.note : '',
    transactionDate: data.transactionDate.toDate(),
  };
}

/**
 * Saves a transaction and updates the running totals on users/{uid}
 * in ONE atomic batch, so the balance can never drift from the records.
 *
 * Returns immediately with `committed`: Firestore applies the write to the
 * local cache straight away (the UI updates instantly, even offline) and
 * `committed` resolves once the server confirms it.
 */
export function addTransaction(uid: string, input: NewTransactionInput) {
  const ref = doc(transactionsCollection(uid));
  const batch = writeBatch(db);

  batch.set(ref, {
    type: input.type,
    amountMinor: input.amountMinor,
    category: input.category,
    note: input.note.trim(),
    transactionDate: Timestamp.fromDate(input.transactionDate),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  batch.set(
    userDocRef(uid),
    { totals: { [totalsField(input.type)]: increment(input.amountMinor) } },
    { merge: true },
  );

  return { id: ref.id, committed: batch.commit() };
}

export function deleteTransaction(uid: string, transaction: Transaction) {
  const batch = writeBatch(db);
  batch.delete(doc(transactionsCollection(uid), transaction.id));
  batch.set(
    userDocRef(uid),
    { totals: { [totalsField(transaction.type)]: increment(-transaction.amountMinor) } },
    { merge: true },
  );
  return batch.commit();
}

// Undo for deleteTransaction: re-creates the same document (same id) and
// adds the amount back to the totals, again in one atomic batch.
export function restoreTransaction(uid: string, transaction: Transaction) {
  const batch = writeBatch(db);
  batch.set(doc(transactionsCollection(uid), transaction.id), {
    type: transaction.type,
    amountMinor: transaction.amountMinor,
    category: transaction.category,
    note: transaction.note,
    transactionDate: Timestamp.fromDate(transaction.transactionDate),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  batch.set(
    userDocRef(uid),
    { totals: { [totalsField(transaction.type)]: increment(transaction.amountMinor) } },
    { merge: true },
  );
  return batch.commit();
}

export interface TransactionQueryOptions {
  type?: TransactionType;
  since?: Date;
  max?: number;
}

// Real-time listener, newest first. Remember to call the returned
// unsubscribe function when the screen/provider unmounts.
export function subscribeToTransactions(
  uid: string,
  options: TransactionQueryOptions,
  onData: (transactions: Transaction[]) => void,
  onError: (error: FirestoreError) => void,
) {
  const constraints: QueryConstraint[] = [];
  if (options.type) {
    constraints.push(where('type', '==', options.type));
  }
  if (options.since) {
    constraints.push(where('transactionDate', '>=', Timestamp.fromDate(options.since)));
  }
  constraints.push(orderBy('transactionDate', 'desc'));
  if (options.max) {
    constraints.push(limit(options.max));
  }

  return onSnapshot(
    query(transactionsCollection(uid), ...constraints),
    snapshot => {
      const transactions: Transaction[] = [];
      snapshot.docs.forEach(d => {
        const transaction = toTransaction(d);
        if (transaction) {
          transactions.push(transaction);
        }
      });
      onData(transactions);
    },
    onError,
  );
}
