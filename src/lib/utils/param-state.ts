import { useRouter, useSearchParams } from "next/navigation";

const useParamState = <T>(key: string, defaultValue?: T) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const state = searchParams.get(key) || defaultValue || "";

  const setState = (value: T) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === undefined || value === null) {
      newParams.delete(key);
    } else {
      newParams.set(key, String(value));
    }
    router.push(`?${newParams.toString()}`);
  };

  return [state, setState] as const;
};
export default useParamState;
