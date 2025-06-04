import Dexie from 'dexie';

export const db = new Dexie('ClickerDB');
db.version(1).stores({
  progress: '&id'
});