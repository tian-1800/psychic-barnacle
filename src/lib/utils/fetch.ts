import { useState, useCallback } from "react";

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
        console.log(fullUrl);

        // const response = await fetch(fullUrl, {
        //   method: "GET",
        // });
        // const result = await response.json();

        let result: unknown;
        if (fullUrl.includes("SYMBOL_SEARCH")) {
          console.log("Using mock data for SYMBOL_SEARCH endpoint");
          result = mockSymbols; // Replace with `result` when using real API
        } else if (fullUrl.includes("GLOBAL_QUOTE")) {
          console.log("Using mock data for GLOBAL_QUOTE endpoint");
          result = mockQuote; // Replace with `result` when using real API
        } else if (fullUrl.includes("TIME_SERIES")) {
          console.log("Using mock data for TIME_SERIES endpoint");
          result = mockSeries; // Replace with `result` when using real API
        } else {
          throw new Error("Unsupported endpoint for mock data");
        }
        const transformedData = options?.transformData?.(result) || (result as T);
        console.log("Transformed Data:", transformedData);

        if (aggregate) {
          setData(
            (prevData) =>
              ({
                ...(prevData || {}),
                [options?.key || "default"]: transformedData,
              } as Aggregate extends true ? Record<string, T> : T)
          );
        } else {
          setData(transformedData as Aggregate extends true ? Record<string, T> : T);
        }
        // setData(transformedData);
        options?.onSuccess?.(transformedData);
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

const mockSeries = {
  "Meta Data": {
    "1. Information": "Intraday (5min) open, high, low, close prices and volume",
    "2. Symbol": "IBM",
    "3. Last Refreshed": "2025-06-05 19:55:00",
    "4. Interval": "5min",
    "5. Output Size": "Compact",
    "6. Time Zone": "US/Eastern",
  },
  "Time Series (Daily)": {
    "2025-06-05 19:55:00": {
      "1. open": "265.4000",
      "2. high": "267.4000",
      "3. low": "265.4000",
      "4. close": "266.5100",
      "5. volume": "13",
    },
    "2025-06-05 19:50:00": {
      "1. open": "266.9900",
      "2. high": "267.4000",
      "3. low": "265.2912",
      "4. close": "265.2912",
      "5. volume": "43",
    },
    "2025-06-05 19:40:00": {
      "1. open": "265.2900",
      "2. high": "266.8600",
      "3. low": "265.2900",
      "4. close": "266.8600",
      "5. volume": "45",
    },
    "2025-06-05 19:35:00": {
      "1. open": "266.8600",
      "2. high": "266.8600",
      "3. low": "265.5000",
      "4. close": "265.5000",
      "5. volume": "51",
    },
    "2025-06-05 19:30:00": {
      "1. open": "266.8600",
      "2. high": "266.8600",
      "3. low": "266.8600",
      "4. close": "266.8600",
      "5. volume": "120",
    },
    "2025-06-05 19:25:00": {
      "1. open": "265.6200",
      "2. high": "265.6200",
      "3. low": "265.6200",
      "4. close": "265.6200",
      "5. volume": "10",
    },
    "2025-06-05 19:10:00": {
      "1. open": "267.0000",
      "2. high": "267.0100",
      "3. low": "265.2900",
      "4. close": "265.5200",
      "5. volume": "121",
    },
    "2025-06-05 19:05:00": {
      "1. open": "265.2900",
      "2. high": "265.2900",
      "3. low": "265.2900",
      "4. close": "265.2900",
      "5. volume": "10",
    },
    "2025-06-05 19:00:00": {
      "1. open": "266.8600",
      "2. high": "267.4000",
      "3. low": "266.8600",
      "4. close": "267.4000",
      "5. volume": "549957",
    },
    "2025-06-05 18:55:00": {
      "1. open": "267.4000",
      "2. high": "267.4000",
      "3. low": "266.3500",
      "4. close": "266.8800",
      "5. volume": "51",
    },
    "2025-06-05 18:50:00": {
      "1. open": "267.3900",
      "2. high": "267.3900",
      "3. low": "267.3900",
      "4. close": "267.3900",
      "5. volume": "1",
    },
    "2025-06-05 18:45:00": {
      "1. open": "267.4000",
      "2. high": "267.4000",
      "3. low": "267.0000",
      "4. close": "267.3900",
      "5. volume": "21",
    },
    "2025-06-05 18:35:00": {
      "1. open": "267.3000",
      "2. high": "267.3000",
      "3. low": "267.0000",
      "4. close": "267.0000",
      "5. volume": "9",
    },
    "2025-06-05 18:30:00": {
      "1. open": "266.8600",
      "2. high": "267.3993",
      "3. low": "265.5100",
      "4. close": "267.3993",
      "5. volume": "550132",
    },
    "2025-06-05 18:25:00": {
      "1. open": "267.0000",
      "2. high": "267.3700",
      "3. low": "267.0000",
      "4. close": "267.3700",
      "5. volume": "26",
    },
    "2025-06-05 18:20:00": {
      "1. open": "267.0000",
      "2. high": "267.0000",
      "3. low": "267.0000",
      "4. close": "267.0000",
      "5. volume": "5",
    },
    "2025-06-05 18:15:00": {
      "1. open": "267.3800",
      "2. high": "267.3999",
      "3. low": "267.3800",
      "4. close": "267.3999",
      "5. volume": "45",
    },
    "2025-06-05 18:10:00": {
      "1. open": "266.8600",
      "2. high": "267.3900",
      "3. low": "265.5000",
      "4. close": "267.3900",
      "5. volume": "2537",
    },
    "2025-06-05 18:05:00": {
      "1. open": "266.8100",
      "2. high": "266.8100",
      "3. low": "266.8100",
      "4. close": "266.8100",
      "5. volume": "58",
    },
    "2025-06-05 18:00:00": {
      "1. open": "267.3200",
      "2. high": "267.4000",
      "3. low": "265.4110",
      "4. close": "267.4000",
      "5. volume": "145",
    },
    "2025-06-05 17:55:00": {
      "1. open": "267.3300",
      "2. high": "267.3300",
      "3. low": "267.3200",
      "4. close": "267.3200",
      "5. volume": "24",
    },
    "2025-06-05 17:50:00": {
      "1. open": "267.0000",
      "2. high": "267.4000",
      "3. low": "265.5000",
      "4. close": "267.3400",
      "5. volume": "63",
    },
    "2025-06-05 17:45:00": {
      "1. open": "266.1000",
      "2. high": "267.3680",
      "3. low": "265.2900",
      "4. close": "266.9900",
      "5. volume": "384",
    },
    "2025-06-05 17:40:00": {
      "1. open": "267.0000",
      "2. high": "267.0000",
      "3. low": "266.3000",
      "4. close": "266.3000",
      "5. volume": "343",
    },
    "2025-06-05 17:35:00": {
      "1. open": "266.8700",
      "2. high": "266.8700",
      "3. low": "266.8700",
      "4. close": "266.8700",
      "5. volume": "5",
    },
    "2025-06-05 17:30:00": {
      "1. open": "267.0000",
      "2. high": "267.4000",
      "3. low": "265.5000",
      "4. close": "265.5000",
      "5. volume": "237",
    },
    "2025-06-05 17:25:00": {
      "1. open": "267.3500",
      "2. high": "267.3999",
      "3. low": "265.5000",
      "4. close": "266.8600",
      "5. volume": "146",
    },
    "2025-06-05 17:20:00": {
      "1. open": "267.3300",
      "2. high": "267.3300",
      "3. low": "266.8600",
      "4. close": "267.3300",
      "5. volume": "42",
    },
    "2025-06-05 17:15:00": {
      "1. open": "266.8600",
      "2. high": "267.3300",
      "3. low": "266.8600",
      "4. close": "267.3000",
      "5. volume": "17",
    },
    "2025-06-05 17:10:00": {
      "1. open": "267.0000",
      "2. high": "267.3300",
      "3. low": "266.8600",
      "4. close": "267.3300",
      "5. volume": "326",
    },
    "2025-06-05 17:05:00": {
      "1. open": "267.0000",
      "2. high": "267.3300",
      "3. low": "266.9500",
      "4. close": "266.9500",
      "5. volume": "26",
    },
    "2025-06-05 17:00:00": {
      "1. open": "267.4000",
      "2. high": "267.4000",
      "3. low": "266.4100",
      "4. close": "267.3300",
      "5. volume": "53",
    },
    "2025-06-05 16:55:00": {
      "1. open": "266.8600",
      "2. high": "267.4000",
      "3. low": "266.8600",
      "4. close": "267.3200",
      "5. volume": "54",
    },
    "2025-06-05 16:45:00": {
      "1. open": "266.9000",
      "2. high": "267.4300",
      "3. low": "266.8700",
      "4. close": "267.4000",
      "5. volume": "114",
    },
    "2025-06-05 16:40:00": {
      "1. open": "266.8600",
      "2. high": "267.2400",
      "3. low": "266.8600",
      "4. close": "267.2000",
      "5. volume": "240",
    },
    "2025-06-05 16:35:00": {
      "1. open": "265.2500",
      "2. high": "267.0000",
      "3. low": "265.2500",
      "4. close": "266.9900",
      "5. volume": "175",
    },
    "2025-06-05 16:30:00": {
      "1. open": "265.2500",
      "2. high": "266.8600",
      "3. low": "265.2500",
      "4. close": "266.8600",
      "5. volume": "90445",
    },
    "2025-06-05 16:25:00": {
      "1. open": "266.3750",
      "2. high": "267.4800",
      "3. low": "266.3750",
      "4. close": "266.8700",
      "5. volume": "12",
    },
    "2025-06-05 16:20:00": {
      "1. open": "266.8600",
      "2. high": "267.5000",
      "3. low": "266.5152",
      "4. close": "267.4800",
      "5. volume": "55",
    },
    "2025-06-05 16:15:00": {
      "1. open": "266.8600",
      "2. high": "267.4800",
      "3. low": "266.4900",
      "4. close": "267.4800",
      "5. volume": "4718",
    },
    "2025-06-05 16:10:00": {
      "1. open": "266.8600",
      "2. high": "267.4800",
      "3. low": "266.8600",
      "4. close": "267.4800",
      "5. volume": "549852",
    },
    "2025-06-05 16:05:00": {
      "1. open": "266.8600",
      "2. high": "266.8700",
      "3. low": "266.8600",
      "4. close": "266.8600",
      "5. volume": "5110",
    },
    "2025-06-05 16:00:00": {
      "1. open": "266.8700",
      "2. high": "266.8700",
      "3. low": "266.4900",
      "4. close": "266.8600",
      "5. volume": "1225593",
    },
    "2025-06-05 15:55:00": {
      "1. open": "266.4900",
      "2. high": "266.9900",
      "3. low": "266.4200",
      "4. close": "266.8700",
      "5. volume": "191994",
    },
    "2025-06-05 15:50:00": {
      "1. open": "267.1900",
      "2. high": "267.3351",
      "3. low": "266.5300",
      "4. close": "266.5400",
      "5. volume": "70256",
    },
    "2025-06-05 15:45:00": {
      "1. open": "266.9600",
      "2. high": "267.3100",
      "3. low": "266.8201",
      "4. close": "267.2100",
      "5. volume": "45548",
    },
    "2025-06-05 15:40:00": {
      "1. open": "266.9250",
      "2. high": "267.0550",
      "3. low": "266.7700",
      "4. close": "266.9000",
      "5. volume": "37277",
    },
    "2025-06-05 15:35:00": {
      "1. open": "266.3200",
      "2. high": "267.1200",
      "3. low": "266.3150",
      "4. close": "266.9200",
      "5. volume": "52154",
    },
    "2025-06-05 15:30:00": {
      "1. open": "266.0700",
      "2. high": "266.3600",
      "3. low": "266.0550",
      "4. close": "266.3100",
      "5. volume": "23906",
    },
    "2025-06-05 15:25:00": {
      "1. open": "265.8100",
      "2. high": "266.2700",
      "3. low": "265.7950",
      "4. close": "265.8500",
      "5. volume": "17361",
    },
    "2025-06-05 15:20:00": {
      "1. open": "265.8900",
      "2. high": "265.9600",
      "3. low": "265.6600",
      "4. close": "265.7500",
      "5. volume": "24087",
    },
    "2025-06-05 15:15:00": {
      "1. open": "266.4900",
      "2. high": "266.5700",
      "3. low": "265.5600",
      "4. close": "265.8800",
      "5. volume": "34730",
    },
    "2025-06-05 15:10:00": {
      "1. open": "266.7800",
      "2. high": "266.8700",
      "3. low": "266.3300",
      "4. close": "266.4300",
      "5. volume": "24267",
    },
    "2025-06-05 15:05:00": {
      "1. open": "266.5900",
      "2. high": "266.7700",
      "3. low": "266.5600",
      "4. close": "266.7700",
      "5. volume": "12585",
    },
    "2025-06-05 15:00:00": {
      "1. open": "266.6900",
      "2. high": "266.7900",
      "3. low": "266.4600",
      "4. close": "266.5250",
      "5. volume": "19578",
    },
    "2025-06-05 14:55:00": {
      "1. open": "266.6975",
      "2. high": "266.7600",
      "3. low": "266.5678",
      "4. close": "266.6900",
      "5. volume": "11673",
    },
    "2025-06-05 14:50:00": {
      "1. open": "266.7600",
      "2. high": "266.9700",
      "3. low": "266.6700",
      "4. close": "266.6700",
      "5. volume": "19968",
    },
    "2025-06-05 14:45:00": {
      "1. open": "266.6700",
      "2. high": "266.8500",
      "3. low": "266.6700",
      "4. close": "266.7550",
      "5. volume": "14091",
    },
    "2025-06-05 14:40:00": {
      "1. open": "266.7000",
      "2. high": "266.7300",
      "3. low": "266.5000",
      "4. close": "266.7300",
      "5. volume": "22918",
    },
    "2025-06-05 14:35:00": {
      "1. open": "266.5450",
      "2. high": "266.6550",
      "3. low": "266.3200",
      "4. close": "266.6100",
      "5. volume": "26882",
    },
    "2025-06-05 14:30:00": {
      "1. open": "266.5275",
      "2. high": "266.5602",
      "3. low": "266.4000",
      "4. close": "266.5350",
      "5. volume": "12802",
    },
    "2025-06-05 14:25:00": {
      "1. open": "266.4000",
      "2. high": "266.6554",
      "3. low": "266.4000",
      "4. close": "266.4800",
      "5. volume": "20122",
    },
    "2025-06-05 14:20:00": {
      "1. open": "266.1000",
      "2. high": "266.4200",
      "3. low": "266.0628",
      "4. close": "266.4098",
      "5. volume": "16021",
    },
    "2025-06-05 14:15:00": {
      "1. open": "266.0500",
      "2. high": "266.1299",
      "3. low": "265.5800",
      "4. close": "266.1299",
      "5. volume": "15257",
    },
    "2025-06-05 14:10:00": {
      "1. open": "266.0795",
      "2. high": "266.1600",
      "3. low": "265.9420",
      "4. close": "266.0800",
      "5. volume": "8273",
    },
    "2025-06-05 14:05:00": {
      "1. open": "266.0900",
      "2. high": "266.1100",
      "3. low": "265.9415",
      "4. close": "266.0700",
      "5. volume": "14279",
    },
    "2025-06-05 14:00:00": {
      "1. open": "266.4526",
      "2. high": "266.5600",
      "3. low": "266.1500",
      "4. close": "266.1500",
      "5. volume": "14736",
    },
    "2025-06-05 13:55:00": {
      "1. open": "266.6300",
      "2. high": "266.6400",
      "3. low": "266.4400",
      "4. close": "266.4400",
      "5. volume": "10136",
    },
    "2025-06-05 13:50:00": {
      "1. open": "266.8000",
      "2. high": "266.8300",
      "3. low": "266.6400",
      "4. close": "266.6750",
      "5. volume": "19883",
    },
    "2025-06-05 13:45:00": {
      "1. open": "266.9100",
      "2. high": "266.9699",
      "3. low": "266.7301",
      "4. close": "266.8450",
      "5. volume": "12623",
    },
    "2025-06-05 13:40:00": {
      "1. open": "266.9400",
      "2. high": "267.0000",
      "3. low": "266.8550",
      "4. close": "266.9000",
      "5. volume": "11652",
    },
    "2025-06-05 13:35:00": {
      "1. open": "266.8600",
      "2. high": "267.0000",
      "3. low": "266.8250",
      "4. close": "266.8650",
      "5. volume": "19191",
    },
    "2025-06-05 13:30:00": {
      "1. open": "266.8200",
      "2. high": "266.9400",
      "3. low": "266.8000",
      "4. close": "266.8500",
      "5. volume": "8401",
    },
    "2025-06-05 13:25:00": {
      "1. open": "266.7250",
      "2. high": "266.9175",
      "3. low": "266.6700",
      "4. close": "266.8250",
      "5. volume": "23216",
    },
    "2025-06-05 13:20:00": {
      "1. open": "266.5500",
      "2. high": "266.7700",
      "3. low": "266.5500",
      "4. close": "266.7400",
      "5. volume": "5887",
    },
    "2025-06-05 13:15:00": {
      "1. open": "266.6200",
      "2. high": "266.6900",
      "3. low": "266.5400",
      "4. close": "266.5400",
      "5. volume": "12727",
    },
    "2025-06-05 13:10:00": {
      "1. open": "266.2000",
      "2. high": "266.5000",
      "3. low": "266.2000",
      "4. close": "266.5000",
      "5. volume": "8201",
    },
    "2025-06-05 13:05:00": {
      "1. open": "265.8700",
      "2. high": "266.3599",
      "3. low": "265.8400",
      "4. close": "266.1500",
      "5. volume": "9850",
    },
    "2025-06-05 13:00:00": {
      "1. open": "265.7800",
      "2. high": "266.0900",
      "3. low": "265.5830",
      "4. close": "265.9800",
      "5. volume": "16374",
    },
    "2025-06-05 12:55:00": {
      "1. open": "266.1000",
      "2. high": "266.1450",
      "3. low": "265.6907",
      "4. close": "265.6907",
      "5. volume": "14508",
    },
    "2025-06-05 12:50:00": {
      "1. open": "265.8700",
      "2. high": "266.0400",
      "3. low": "265.6900",
      "4. close": "266.0150",
      "5. volume": "11644",
    },
    "2025-06-05 12:45:00": {
      "1. open": "266.6000",
      "2. high": "266.6000",
      "3. low": "265.7819",
      "4. close": "265.8712",
      "5. volume": "26331",
    },
    "2025-06-05 12:40:00": {
      "1. open": "266.8200",
      "2. high": "266.9039",
      "3. low": "266.6000",
      "4. close": "266.6936",
      "5. volume": "10461",
    },
    "2025-06-05 12:35:00": {
      "1. open": "266.9500",
      "2. high": "266.9500",
      "3. low": "266.7800",
      "4. close": "266.8300",
      "5. volume": "9757",
    },
    "2025-06-05 12:30:00": {
      "1. open": "267.1900",
      "2. high": "267.3300",
      "3. low": "266.9100",
      "4. close": "266.9894",
      "5. volume": "33835",
    },
    "2025-06-05 12:25:00": {
      "1. open": "267.1500",
      "2. high": "267.2100",
      "3. low": "267.0200",
      "4. close": "267.1900",
      "5. volume": "13820",
    },
    "2025-06-05 12:20:00": {
      "1. open": "266.9050",
      "2. high": "267.2700",
      "3. low": "266.9050",
      "4. close": "267.1200",
      "5. volume": "23551",
    },
    "2025-06-05 12:15:00": {
      "1. open": "267.1000",
      "2. high": "267.1200",
      "3. low": "266.6600",
      "4. close": "266.9050",
      "5. volume": "24145",
    },
    "2025-06-05 12:10:00": {
      "1. open": "267.1900",
      "2. high": "267.2700",
      "3. low": "267.0400",
      "4. close": "267.0600",
      "5. volume": "14205",
    },
    "2025-06-05 12:05:00": {
      "1. open": "267.1400",
      "2. high": "267.2600",
      "3. low": "267.0700",
      "4. close": "267.1300",
      "5. volume": "12695",
    },
    "2025-06-05 12:00:00": {
      "1. open": "267.0900",
      "2. high": "267.1400",
      "3. low": "267.0100",
      "4. close": "267.0800",
      "5. volume": "18394",
    },
    "2025-06-05 11:55:00": {
      "1. open": "267.1399",
      "2. high": "267.1821",
      "3. low": "266.9800",
      "4. close": "267.0704",
      "5. volume": "12308",
    },
    "2025-06-05 11:50:00": {
      "1. open": "266.9300",
      "2. high": "267.0600",
      "3. low": "266.8800",
      "4. close": "266.9800",
      "5. volume": "15152",
    },
    "2025-06-05 11:45:00": {
      "1. open": "267.2399",
      "2. high": "267.2399",
      "3. low": "266.8500",
      "4. close": "266.9400",
      "5. volume": "17045",
    },
    "2025-06-05 11:40:00": {
      "1. open": "267.2580",
      "2. high": "267.3900",
      "3. low": "267.1200",
      "4. close": "267.2500",
      "5. volume": "33159",
    },
    "2025-06-05 11:35:00": {
      "1. open": "267.2350",
      "2. high": "267.4500",
      "3. low": "267.1311",
      "4. close": "267.2200",
      "5. volume": "14431",
    },
    "2025-06-05 11:30:00": {
      "1. open": "267.1000",
      "2. high": "267.2785",
      "3. low": "267.1000",
      "4. close": "267.1800",
      "5. volume": "13485",
    },
    "2025-06-05 11:25:00": {
      "1. open": "267.2150",
      "2. high": "267.3000",
      "3. low": "267.0000",
      "4. close": "267.0950",
      "5. volume": "18223",
    },
    "2025-06-05 11:20:00": {
      "1. open": "267.3200",
      "2. high": "267.3800",
      "3. low": "267.1301",
      "4. close": "267.1800",
      "5. volume": "17641",
    },
    "2025-06-05 11:15:00": {
      "1. open": "267.2800",
      "2. high": "267.5100",
      "3. low": "267.1400",
      "4. close": "267.3600",
      "5. volume": "20187",
    },
  },
};

export default useFetch;
