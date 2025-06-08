import { ChangeEvent, ReactNode, useState } from "react";
import { FaSearch, FaSyncAlt } from "react-icons/fa";
import useFetch from "@/lib/utils/fetch";
import { StockSymbol, SymbolFormatted } from "@/lib/types";
import useInitialEffect from "@/lib/utils/initial-effect";
import { formatSymbols } from "@/lib/utils/symbol";

type Props = {
  getStockData: (symbol: string) => void;
  loading: boolean;
  children?: ReactNode;
  selectedSymbol?: string;
  // setSelectedSymbol: (symbol: string) => void;
  inlineSubmitButton?: boolean;
  submitButtonText?: string;
};

const favStocks = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN", "META"];

const SymbolInput = ({
  getStockData,
  loading,
  children,
  selectedSymbol,
  // setSelectedSymbol,
  inlineSubmitButton = true,
  submitButtonText = "Get Data",
}: Props) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchSymbol, setSearchSymbol] = useState(selectedSymbol || "");

  const { fetchData, data: searchResults = [], loading: searchLoading, clearData } = useFetch<SymbolFormatted[]>();

  const searchSymbols = async (query: string) => {
    if (!query.trim() || query.length < 1) {
      clearData();
      setShowDropdown(false);
      return;
    }

    fetchData(
      { function: "SYMBOL_SEARCH", keywords: query },
      {
        transformData: (data) => formatSymbols((data as { bestMatches: StockSymbol[] }).bestMatches),
        onSuccess: (results) => setShowDropdown(results.length > 0),
      }
    );
  };

  const handleInputChange = (value: string) => {
    // Need to add debounce here
    setSearchSymbol(value.toUpperCase());
    searchSymbols(value);
  };

  const selectSymbol = (symbol: string) => {
    setSearchSymbol(symbol);
    setShowDropdown(false);
    clearData();
  };

  const handleGetData = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchSymbol.trim()) {
      getStockData(searchSymbol);
      // setSelectedSymbol(searchSymbol);
    }
  };

  useInitialEffect(() => {
    if (selectedSymbol) {
      setSearchSymbol(selectedSymbol);
      getStockData(selectedSymbol);
    }
  });

  return (
    <div className="max-w-2xl mx-auto mb-8 space-y-4">
      <form onSubmit={handleGetData} className="relative space-y-4">
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
          {inlineSubmitButton && (
            <button
              type="submit"
              disabled={loading || !searchSymbol.trim()}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <FaSyncAlt className="w-5 h-5 animate-spin" /> : submitButtonText}
            </button>
          )}

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
              {searchLoading ? (
                <div className="p-4 text-center">
                  <FaSyncAlt className="w-5 h-5 animate-spin mx-auto text-blue-600" />
                  <p className="text-sm text-gray-600 mt-2">Searching...</p>
                </div>
              ) : (
                searchResults?.map((result, index) => (
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
                )) ?? (
                  <div className="p-4 text-center text-gray-500">
                    <p className="text-sm">No symbols found</p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
        {children ?? (
          <ul className="flex flex-wrap gap-2 justify-center">
            {favStocks.map((symbol) => (
              <li
                key={symbol}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <button
                  onClick={() => {
                    setSearchSymbol(symbol);
                    getStockData(symbol);
                    setShowDropdown(false);
                    // setSelectedSymbol(symbol);
                  }}
                >
                  {symbol}
                </button>
              </li>
            ))}
          </ul>
        )}
        {!inlineSubmitButton && (
          <button
            type="submit"
            disabled={loading || !searchSymbol.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <FaSyncAlt className="w-5 h-5 animate-spin" /> : "Get Data"}
          </button>
        )}
      </form>
    </div>
  );
};

export default SymbolInput;
