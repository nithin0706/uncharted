import { createContext, useContext, useState, useCallback, useMemo } from "react";

const CompareContext = createContext(null);

const MAX_COMPARE = 4; // adjust if you want a different cap

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]); // array of package _id strings

  const toggleCompare = useCallback((id) => {
    setCompareList((prev) => {
      if (prev.includes(id)) {
        return prev.filter((pkgId) => pkgId !== id);
      }
      if (prev.length >= MAX_COMPARE) {
        // optional: swap in a toast/alert here instead of silently ignoring
        return prev;
      }
      return [...prev, id];
    });
  }, []);

  const removeFromCompare = useCallback((id) => {
    setCompareList((prev) => prev.filter((pkgId) => pkgId !== id));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareList([]);
  }, []);

  const isComparing = useCallback(
    (id) => compareList.includes(id),
    [compareList]
  );

  const value = useMemo(
    () => ({
      compareList,
      toggleCompare,
      removeFromCompare,
      clearCompare,
      isComparing,
      maxCompare: MAX_COMPARE,
    }),
    [compareList, toggleCompare, removeFromCompare, clearCompare, isComparing]
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return ctx;
}
