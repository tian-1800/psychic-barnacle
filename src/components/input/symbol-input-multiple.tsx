import useParamState from "@/lib/utils/param-state";
import SymbolInput from "./symbol-input";
// import { useState } from "react";

type Props = {
  getStockData: (symbol: string) => void;
  loading: boolean;
};

const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1", "#d084d0"];

const SymbolInputMultiple = ({ getStockData: getStockDataProp, loading }: Props) => {
  const [activeStocks = [], setActiveStocks] = useParamState<string[]>("activeStocks");

  const handleAddStock = (selectedSymbol: string) => {
    if (selectedSymbol && !activeStocks?.find((stock) => stock === selectedSymbol)) {
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
          <h3 className="text-sm font-medium text-gray-700 mb-2">Active Stocks:</h3>
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
