import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export const useParamState = <T>(key: string, defaultValue?: T) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const state = useMemo(() => {
    const params = searchParams ? new URLSearchParams(searchParams.toString()) : null; // Unwrap searchParams
    const param = params?.get(key);
    if (!param) {
      return defaultValue;
    }
    try {
      return JSON.parse(param) as T;
    } catch {
      return param as unknown as T;
    }
  }, [defaultValue, key, searchParams]);

  const setState = useCallback(
    (value: T) => {
      const params = searchParams ? new URLSearchParams(searchParams.toString()) : new URLSearchParams();
      if (value === undefined || value === null) {
        params.delete(key);
      } else {
        const stringifiedValue = typeof value === "object" && value !== null ? JSON.stringify(value) : String(value);
        params.set(key, stringifiedValue);
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [key, router, searchParams]
  );

  return [state, setState] as const;
};

export default useParamState;
