import { useState, useCallback } from "react";

const baseUrl = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_BASE_URL || "https://www.alphavantage.co/query";
const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
const cacheStorage = process.env.NEXT_PUBLIC_CACHE_STORAGE;

export const getFullUrl = (queryParams: Record<string, string | number> = {}) => {
  const params = new URLSearchParams();
  for (const key in queryParams) {
    const value = queryParams[key];
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  }

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}${apiKey ? `&apikey=${apiKey}` : ""}` : baseUrl;
};

export type FetchOptions<T> = {
  transformData?: (data: unknown) => T;
  onSuccess?: (data: T) => void;
  key?: string;
};

function useFetch<T, Aggregate extends boolean = false>(aggregate: Aggregate = false as Aggregate) {
  const [data, setData] = useState<Aggregate extends true ? Record<string, T> : T>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(
    async (queryParams: Record<string, string | number>, options?: FetchOptions<T>) => {
      setLoading(true);
      setError(null);

      const fullUrl = getFullUrl(queryParams);

      try {
        let result: unknown;

        // client side cache for development purpose
        const storageDriver =
          cacheStorage === "sessionStorage" ? sessionStorage : cacheStorage === "localStorage" ? localStorage : null;

        const cachedData = storageDriver?.getItem(fullUrl);

        if (cachedData) {
          result = JSON.parse(cachedData) as T;
        } else {
          const response = await fetch(fullUrl, {
            method: "GET",
          });
          result = await response.json();

          result = options?.transformData?.(result) || (result as T);
          storageDriver?.setItem(fullUrl, JSON.stringify(result));
        }

        if (aggregate) {
          setData(
            (prevData) =>
              ({
                ...(prevData || {}),
                [options?.key || "default"]: result,
              } as Aggregate extends true ? Record<string, T> : T)
          );
        } else {
          setData(result as Aggregate extends true ? Record<string, T> : T);
        }
        options?.onSuccess?.(result as T);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err);
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    },
    [aggregate]
  );

  const clearData = useCallback(() => {
    setData(undefined);
  }, []);

  return { fetchData, data, loading, error, clearData };
}

export type FetchData<T> = ReturnType<typeof useFetch<T>>["fetchData"];

export default useFetch;
