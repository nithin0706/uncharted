import { createContext, useContext, useState, useCallback, useMemo } from "react";

const CompareContext = createContext(null);

const MAX_COMPARE = 4; // adjust if you want a different cap

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState(() => {
  return JSON.parse(localStorage.getItem("compare_packages")) || [];
});
  const toggleCompare = useCallback((id) => {
  setCompareList((prev) => {
    let updated;

    if (prev.includes(id)) {
      updated = prev.filter((pkgId) => pkgId !== id);
    } else {
      if (prev.length >= MAX_COMPARE) return prev;
      updated = [...prev, id];
    }

    localStorage.setItem(
      "compare_packages",
      JSON.stringify(updated)
    );

    return updated;
  });
}, []);
  const removeFromCompare = useCallback((id) => {
  setCompareList((prev) => {
    const updated = prev.filter((pkgId) => pkgId !== id);

    localStorage.setItem(
      "compare_packages",
      JSON.stringify(updated)
    );

    return updated;
  });
}, []);

 const clearCompare = useCallback(() => {
  localStorage.removeItem("compare_packages");
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
