import useParamState from "@/lib/utils/param-state";
import React, { ChangeEvent, useState } from "react";
import { FaSearch, FaSyncAlt } from "react-icons/fa";
import { StockSymbol } from "../intraday/stock-input";

type Props = {
  getStockData: (symbol: string) => void;
  loading: boolean;
};

const mockFetchSymbol = (query: string) => {
  console.log(`Mock API call for query: ${query}`);

  const mockResponse = {
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

  const filteredMatches = mockResponse.bestMatches.filter(
    (match) =>
      match["1. symbol"].toLowerCase().includes(query.toLowerCase()) ||
      match["2. name"].toLowerCase().includes(query.toLowerCase())
  );
  return { bestMatches: filteredMatches };
};

const favStocks = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN", "META"];

export type SymbolFormatted = {
  symbol: string;
  name: string;
  type: string;
  region: string;
  currency: string;
};

const formatSymbols = (symbols: StockSymbol[]): SymbolFormatted[] => {
  return symbols.map((symbol) => ({
    symbol: symbol["1. symbol"],
    name: symbol["2. name"],
    type: symbol["3. type"],
    region: symbol["4. region"],
    currency: symbol["8. currency"],
  }));
};

const SymbolInput = ({ getStockData, loading }: Props) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useParamState<string>("symbol");
  const [searchSymbol, setSearchSymbol] = useState(selectedSymbol || "");

  const [searchResults, setSearchResults] = useState<SymbolFormatted[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchSymbols = async (query: string) => {
    if (!query.trim() || query.length < 1) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setSearchLoading(true);
    setTimeout(() => {
      // Fetch data here
      const results = formatSymbols(mockFetchSymbol(query).bestMatches);
      setSearchResults(results);
      setShowDropdown(results.length > 0);
      setSearchLoading(false);
    }, 300);
  };

  const handleInputChange = (value: string) => {
    setSearchSymbol(value.toUpperCase());
    searchSymbols(value);
  };

  const selectSymbol = (symbol: string) => {
    setSearchSymbol(symbol);
    setShowDropdown(false);
    setSearchResults([]);
  };

  const handleSearch = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchSymbol.trim()) {
      getStockData(searchSymbol);
      setSelectedSymbol(searchSymbol);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchSymbol}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => searchSymbol && setShowDropdown(searchResults.length > 0)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder="Search stocks by symbol(e.g., AAPL, Apple)"
            className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={loading || !searchSymbol.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <FaSyncAlt className="w-5 h-5 animate-spin" /> : "Get Data"}
          </button>

          {/* Search Results Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
              {searchLoading ? (
                <div className="p-4 text-center">
                  <FaSyncAlt className="w-5 h-5 animate-spin mx-auto text-blue-600" />
                  <p className="text-sm text-gray-600 mt-2">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((result, index) => (
                  <div
                    key={index}
                    onClick={() => selectSymbol(result.symbol)}
                    className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-blue-600">{result.symbol}</span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {result.type}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm mt-1">{result.name}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          {result.region} • {result.currency}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <p className="text-sm">No symbols found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </form>
      <div className="flex flex-wrap gap-2 justify-center">
        {favStocks.map((symbol) => (
          <button
            key={symbol}
            onClick={() => {
              setSearchSymbol(symbol);
              getStockData(symbol);
              setShowDropdown(false);
              setSelectedSymbol(symbol);
            }}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            {symbol}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SymbolInput;
