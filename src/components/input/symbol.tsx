import { StockSymbol } from "@/lib/types";
import useFetch from "@/lib/utils/fetch";
import React, { useState, useEffect, useCallback, ChangeEvent, useRef } from "react";

type SymbolResponse = {
  bestMatches: Array<StockSymbol>;
};

type Props = {
  selectedSymbol: string;
  setSelectedSymbol: (symbol: StockSymbol) => void;
};

function SymbolSearch({ selectedSymbol, setSelectedSymbol }: Props) {
  const [inputValue, setInputValue] = useState(selectedSymbol || "");
  const [loading, setLoading] = useState(false);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const DEBOUNCE_DELAY = 1000;

  const { fetchData, data } = useFetch<SymbolResponse>();
  const searchResults = data?.bestMatches || [];
  const executeSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        // setSearchResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      // setSelectedSymbol(null);
      try {
        // fetch data here
        fetchData({
          function: "SYMBOL_SEARCH",
          keywords: query,
        });
        // setSearchResults(data.bestMatches);
      } catch (error) {
        console.error("Error fetching symbol:", error);
        // setSearchResults([]);
      } finally {
        setLoading(false);
      }
    },
    [fetchData]
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newInputValue = event.target.value;
    setInputValue(newInputValue);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    const newTimeout = setTimeout(() => {
      executeSearch(newInputValue);
    }, DEBOUNCE_DELAY);
    debounceTimeout.current = newTimeout;
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const handleSelectSymbol = (symbol: StockSymbol) => {
    setSelectedSymbol(symbol);
    // setSearchResults([]);
    setInputValue(symbol["1. symbol"]);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
      debounceTimeout.current = null;
    }
  };

  return (
    <div>
      <h1>Symbol Search</h1>
      <div className="mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter symbol or company name"
          className="px-4 py-2 mr-2 w-72 border border-gray-300 rounded"
        />
      </div>

      {loading && <p className="text-gray-600">Loading results...</p>}

      {searchResults.length > 0 && (
        <div className="max-h-72 overflow-y-auto border border-gray-300 rounded">
          <ul className="list-none p-0 m-0">
            {searchResults.map((match, index) => (
              <li
                key={index}
                onClick={() => handleSelectSymbol(match)}
                className="px-4 py-2 cursor-pointer border-b border-gray-200 hover:bg-gray-100"
              >
                <strong>{match["1. symbol"]}</strong> - {match["2. name"]} ({match["4. region"]})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* {searchResults.length === 0 && inputValue.trim() && !loading && <p>No matching symbols found.</p>} */}
    </div>
  );
}

export default SymbolSearch;
