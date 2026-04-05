import { useState } from 'react';

const STORAGE_KEY = 'weather:recentSearches';

export function useRecentSearches() {
  const [recents, setRecents] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  function addRecent(entry) {
    setRecents(prev => {
      const deduped = prev.filter(r => r.name !== entry.name);
      const updated = [entry, ...deduped].slice(0, 5);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  function clearRecents() {
    localStorage.removeItem(STORAGE_KEY);
    setRecents([]);
  }

  return { recents, addRecent, clearRecents };
}
