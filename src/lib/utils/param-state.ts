import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

// const useParamState = <T>(key: string, defaultValue?: T) => {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const state = searchParams.get(key) || defaultValue || "";

//   const setState = useCallback(
//     (value: T) => {
//       const newParams = new URLSearchParams(searchParams);
//       if (value === undefined || value === null) {
//         newParams.delete(key);
//       } else {
//         newParams.set(key, String(value));
//       }
//       router.push(`?${newParams.toString()}`);
//     },
//     [key, router, searchParams]
//   );

//   return [state, setState] as const;
// };

export const useParamState = <T>(key: string, defaultValue?: T) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const state = useMemo(() => {
    const param = searchParams.get(key);
    if (param === null) {
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
      const newParams = new URLSearchParams(searchParams);
      if (value === undefined || value === null) {
        newParams.delete(key);
      } else {
        const stringifiedValue = typeof value === "object" && value !== null ? JSON.stringify(value) : String(value);
        newParams.set(key, stringifiedValue);
      }
      router.push(`?${newParams.toString()}`, { scroll: false });
    },
    [key, router, searchParams]
  );

  return [state, setState] as const;
};

export default useParamState;
