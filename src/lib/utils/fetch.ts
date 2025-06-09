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

        const storageDriver = cacheStorage === "sessionStorage" ? sessionStorage : localStorage;
        const cachedData = cacheStorage ? storageDriver.getItem(fullUrl) : null;
        if (cachedData) {
          result = JSON.parse(cachedData) as T;
        } else {
          // const response = await fetch(fullUrl, {
          //   method: "GET",
          // });
          // const result = await response.json();

          // Mock result start
          if (fullUrl.includes("SYMBOL_SEARCH")) {
            console.log("Using mock data for SYMBOL_SEARCH endpoint");
            result = mockSymbols;
          } else if (fullUrl.includes("GLOBAL_QUOTE")) {
            console.log("Using mock data for GLOBAL_QUOTE endpoint");
            result = mockQuote;
          } else if (fullUrl.includes("TIME_SERIES")) {
            console.log("Using mock data for TIME_SERIES endpoint");
            result = mockSeries(String(queryParams.symbol));
          } else {
            throw new Error("Unsupported endpoint for mock data");
          }
          // Mock result end

          result = options?.transformData?.(result) || (result as T);
          localStorage.setItem(fullUrl, JSON.stringify(result));
        }
        console.log("Transformed Data:", result);

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

const mockSymbols = {
  bestMatches: [
    {
      "1. symbol": "IBM",
      "2. name": "IBM",
      "3. type": "Equity",
      "4. region": "United Kingdom",
      "5. marketOpen": "08:00",
      "6. marketClose": "16:30",
      "7. timezone": "UTC+01",
      "8. currency": "GBX",
      "9. matchScore": "0.7273",
    },
    {
      "1. symbol": "TSCDF",
      "2. name": "Tesco plc",
      "3. type": "Equity",
      "4. region": "United States",
      "5. marketOpen": "09:30",
      "6. marketClose": "16:00",
      "7. timezone": "UTC-04",
      "8. currency": "USD",
      "9. matchScore": "0.7143",
    },
    {
      "1. symbol": "TSCDY",
      "2. name": "Tesco plc",
      "3. type": "Equity",
      "4. region": "United States",
      "5. marketOpen": "09:30",
      "6. marketClose": "16:00",
      "7. timezone": "UTC-04",
      "8. currency": "USD",
      "9. matchScore": "0.7143",
    },
    {
      "1. symbol": "TCO2.FRK",
      "2. name": "TESCO PLC ADR/1 LS-05",
      "3. type": "Equity",
      "4. region": "Frankfurt",
      "5. marketOpen": "08:00",
      "6. marketClose": "20:00",
      "7. timezone": "UTC+02",
      "8. currency": "EUR",
      "9. matchScore": "0.5455",
    },
    {
      "1. symbol": "TCO0.FRK",
      "2. name": "TESCO PLC LS-0633333",
      "3. type": "Equity",
      "4. region": "Frankfurt",
      "5. marketOpen": "08:00",
      "6. marketClose": "20:00",
      "7. timezone": "UTC+02",
      "8. currency": "EUR",
      "9. matchScore": "0.5455",
    },
  ],
};

const mockQuote = ((symbol: string) => {
  const basePrice = Math.random() * 500 + 50;
  const change = (Math.random() - 0.5) * 20;
  const changePercent = (change / basePrice) * 100;

  return {
    "Global Quote": {
      "01. symbol": symbol.toUpperCase(),
      "02. open": (basePrice + Math.random() * 10 - 5).toFixed(4),
      "03. high": (basePrice + Math.random() * 15).toFixed(4),
      "04. low": (basePrice - Math.random() * 15).toFixed(4),
      "05. price": basePrice.toFixed(4),
      "06. volume": Math.floor(Math.random() * 10000000 + 1000000).toString(),
      "07. latest trading day": "2025-06-06",
      "08. previous close": (basePrice - change).toFixed(4),
      "09. change": change.toFixed(4),
      "10. change percent": changePercent.toFixed(4) + "%",
    },
  };
})("GOOGL");

const mockSeriesInterval = () => {
  const series: Record<string, { [key: string]: string }> = {};

  for (let i = 0; i < 30; i++) {
    const date = new Date(Date.now() - i * 1000 * 60 * 5);
    const dateString = date.toISOString().split(".")[0].replace("T", " ");
    let openValue = Math.random() * 2;
    let highValue = openValue + Math.random() * 2;
    let lowValue = openValue - Math.random() * 2;
    let closeValue = openValue + (Math.random() - 0.5) * 2;

    if (lowValue > highValue) [highValue, lowValue] = [lowValue, highValue];
    if (closeValue > openValue) [openValue, closeValue] = [closeValue, openValue];
    if (closeValue < lowValue) [lowValue, closeValue] = [closeValue, lowValue];

    const volume = Math.floor(Math.random() * 10000000 + 1000000).toString();

    series[dateString] = {
      "1. open": openValue.toFixed(2),
      "2. high": highValue.toFixed(2),
      "3. low": lowValue.toFixed(2),
      "4. close": closeValue.toFixed(2),
      "5. volume": volume,
    };
  }

  return series;
};

const mockSeries = (symbol: string) => ({
  "Meta Data": {
    "1. Information": "Intraday (5min) open, high, low, close prices and volume",
    "2. Symbol": symbol,
    "3. Last Refreshed": "2025-06-05 19:55:00",
    "4. Interval": "5min",
    "5. Output Size": "Compact",
    "6. Time Zone": "US/Eastern",
  },
  "Time Series (Daily)": mockSeriesInterval(),
  "Weekly Time Series": mockSeriesInterval(),
  "Monthly Time Series": mockSeriesInterval(),
});

export default useFetch;
