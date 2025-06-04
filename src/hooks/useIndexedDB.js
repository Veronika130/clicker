import { useEffect } from 'react';
import { db } from '../db/db';

export function useSaveProgress(state) {
  useEffect(() => {
    db.progress.put({ key: 'state', value: state });
  }, [state]);
}