import { useEffect } from 'react';
import { db } from '../db/db';

export const useSaveProgress = (gameState) => {
  useEffect(() => {
    if (!gameState) return;

    const timeout = setTimeout(() => {
      db.progress.put({ id: 'state', value: gameState });
    }, 500); 

    return () => clearTimeout(timeout);
  }, [gameState]);
};
