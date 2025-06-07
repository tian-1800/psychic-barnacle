import { useState, useCallback } from "react";
import { getFullUrl } from "./fetch";

function useFetchAggregated<T>() {
  const [data, setData] = useState<Record<string, T>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (key: string, queryParams?: Record<string, string | number>) => {
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

      setData((data) => ({ ...data, [key]: result }));
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

export default useFetchAggregated;
