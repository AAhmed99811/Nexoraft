import { useCallback, useEffect, useRef } from "react";

export function useCustomCallback<T extends (...args: unknown[]) => unknown>(fn: T): T {
  const ref = useRef<T>(fn);

  useEffect(() => {
    ref.current = fn;
  }, [fn]);

  const stableCallback = useCallback((...args: unknown[]) => {
    return ref.current(...args);
  }, []);

  return stableCallback as unknown as T;
}

export default useCustomCallback;

