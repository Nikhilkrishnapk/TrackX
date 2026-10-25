import { useEffect, useState } from 'react';
import { subscribeToTransactions } from '../services/firebase/transactions';
import { getErrorCode } from '../services/firebase/client';
import { Transaction, TransactionType } from '../types';

const PAGE_SIZE = 25;

// Paginated, real-time transaction history for the Activity screen.
// "Load more" grows the listener's limit by one page; Firestore serves the
// already-loaded documents from its cache so only new ones are read.
export function useTransactionHistory(uid: string, type?: TransactionType) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  // The page count belongs to a filter: switching filter starts at page 1.
  const [page, setPage] = useState({ type, count: 1 });
  const pageCount = page.type === type ? page.count : 1;

  useEffect(() => {
    const max = pageCount * PAGE_SIZE;
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToTransactions(
      uid,
      { type, max },
      next => {
        setTransactions(next);
        setHasMore(next.length >= max);
        setLoading(false);
      },
      e => {
        console.warn('Failed to load transaction history', e);
        // failed-precondition = the query needs a composite index that does
        // not exist yet. The warning above contains a link to create it.
        setError(
          getErrorCode(e) === 'firestore/failed-precondition'
            ? 'This filter needs a Firestore index. Create it in the Firebase Console (Firestore → Indexes).'
            : 'Could not load transactions. Check your connection.',
        );
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [uid, type, pageCount]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage({ type, count: pageCount + 1 });
    }
  };

  return { transactions, loading, error, hasMore, loadMore };
}
