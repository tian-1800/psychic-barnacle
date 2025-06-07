export type OHLC = {
  "1. open": string;
  "2. high": string;
  "3. low": string;
  "4. close": string;
  "5. volume": string;
};

export type Interval = "1min" | "5min" | "15min" | "30min" | "60min";

type OHLCResponse = {
  "Meta Data": {
    "1. Information": string;
    "2. Symbol": string;
    "3. Last Refreshed": string;
    "4. Interval": Interval;
  };
};

export type OHLCOneMin = OHLCResponse & {
  "Time Series (1min)": Record<string, OHLC>;
};
export type OHLCFiveMin = OHLCResponse & {
  "Time Series (5min)": Record<string, OHLC>;
};
export type OHLCFifteenMin = OHLCResponse & {
  "Time Series (15min)": Record<string, OHLC>;
};
export type OHLCThirtyMin = OHLCResponse & {
  "Time Series (30min)": Record<string, OHLC>;
};
export type OHLCSixtyMin = OHLCResponse & {
  "Time Series (60min)": Record<string, OHLC>;
};
