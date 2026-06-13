import { useEffect, useState } from "react";

/** Returns `true` while a short skeleton-loading window is active (default 800ms). */
export function useInitialLoad(ms = 800): boolean {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(id);
  }, [ms]);
  return loading;
}
