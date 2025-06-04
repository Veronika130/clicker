import { useEffect } from 'react';
import { db } from '../db/db';

export const useLoadProgress = (setState, setLoading) => {
  useEffect(() => {
    const load = async () => {
      const saved = await db.progress.get('state');
      if (saved?.value) {
        setState(saved.value);
      }
      setLoading(false);
    };
    load();
  }, [setState, setLoading]);
};