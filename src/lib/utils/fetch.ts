import { useState, useCallback } from "react";

/**
 * @template T The expected type of the data to be fetched.
 * @param {string} url The URL to fetch data from.
 * @param {RequestInit} [options] Optional standard `fetch` API options (e.g., headers).
 * @returns {UseFetchResult<T>} An object containing data, loading state, error, and a refetch function.
 */

const baseUrl = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_BASE_URL || "https://www.alphavantage.co/query";
const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;

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

function useFetch<T>() {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (queryParams?: Record<string, string | number>) => {
    setLoading(true);
    setError(null);

    const fullUrl = getFullUrl(queryParams);

    try {
      console.log(fullUrl);
      throw new Error("Mock error for testing purposes"); // Remove this line in production

      const response = await fetch(fullUrl, {
        method: "GET",
      });

      const result: T = await response.json();

      setData(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchData, data, loading, error };
}

export default useFetch;
