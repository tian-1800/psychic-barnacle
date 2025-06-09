"use client";

import SymbolInput from "./symbol-input";
import useInitialEffect from "@/lib/utils/initial-effect";

type Props = {
  getStockData: (symbol: string) => void;
  loading: boolean;
  activeStocks: string[];
  setActiveStocks: (stocks: string[]) => void;
};

const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1", "#d084d0"];

const MAX_ACTIVE_STOCK = 5;

const SymbolInputMultiple = ({ getStockData: getStockDataProp, loading, activeStocks, setActiveStocks }: Props) => {
  const handleAddStock = (selectedSymbol: string) => {
    if (
      activeStocks.length < MAX_ACTIVE_STOCK &&
      selectedSymbol &&
      !activeStocks?.find((stock) => stock === selectedSymbol)
    ) {
      setActiveStocks([...activeStocks, selectedSymbol]);
    }
  };

  const getStockData = (symbol: string) => {
    getStockDataProp(symbol);
    handleAddStock(symbol);
  };

  const removeStock = (symbolToRemove: string) => {
    if (!activeStocks.length) return;
    setActiveStocks(activeStocks.filter((stock) => stock !== symbolToRemove));
  };

  useInitialEffect(() => {
    if (activeStocks.length > 0) {
      activeStocks.forEach((stock) => getStockData(stock));
    }
  });

  return (
    <SymbolInput
      getStockData={getStockData}
      loading={loading}
      selectedSymbol={""}
      inlineSubmitButton={true}
      useMultipleInput
    >
      {activeStocks.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Active Stocks (Max 5):</h3>
          <div className="flex flex-wrap gap-2">
            {activeStocks.map((stock, i) => (
              <span
                key={stock}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: colors[i] }}
              >
                {stock}
                <button
                  type="button"
                  onClick={() => removeStock(stock)}
                  className="ml-2 text-white hover:text-gray-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </SymbolInput>
  );
};

export default SymbolInputMultiple;
