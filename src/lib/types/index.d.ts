export type OHLC = {
  "1. open": string;
  "2. high": string;
  "3. low": string;
  "4. close": string;
  "5. volume": string;
};

export type Interval = "1min" | "5min" | "15min" | "30min" | "60min";

export type OHLCResponse = {
  "Meta Data": {
    "1. Information": string;
    "2. Symbol": string;
    "3. Last Refreshed": string;
    "4. Interval": Interval;
  };
  [key: `Time Series (${string})`]: Record<string, OHLC>;
};

export type StockSymbol = {
  "1. symbol": string;
  "2. name": string;
  "3. export type ": string;
  "4. region": string;
  "5. marketOpen": string;
  "6. marketClose": string;
  "7. timezone": string;
  "8. currency": string;
};

export type SymbolFormatted = {
  symbol: string;
  name: string;
  type: string;
  region: string;
  currency: string;
};

export type Quote = {
  "01. symbol": string;
  "02. open": string;
  "03. high": string;
  "04. low": string;
  "05. price": string;
  "06. volume": string;
  "07. latest trading day": string;
  "08. previous close": string;
  "09. change": string;
  "10. change percent": string;
};
