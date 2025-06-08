import { StockSymbol, SymbolFormatted } from "../types";

export const formatSymbols = (symbols: StockSymbol[]): SymbolFormatted[] => {
  return symbols.map((symbol) => ({
    symbol: symbol["1. symbol"],
    name: symbol["2. name"],
    type: symbol["3. type"],
    region: symbol["4. region"],
    currency: symbol["8. currency"],
  }));
};
