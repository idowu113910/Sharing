// src/hooks/useLocalLinks.js
import { useEffect, useState } from 'react';

export function useLocalLinks(key = 'links') {
  const [links, setLinks] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(links));
    } catch {}
  }, [links, key]);

  return [links, setLinks];
}
