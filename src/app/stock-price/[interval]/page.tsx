"use client";

import dynamic from "next/dynamic";
import { FormattedOhlcv } from "@/lib/types";
import useFetch from "@/lib/utils/fetch";
import { use, useMemo } from "react";
import { getFunctionName } from "@/lib/utils/interval";
import SymbolInputMultiple from "@/components/input/symbol-input-multiple";
import capitalize from "@/lib/utils/capitalize";
import useParamState from "@/lib/utils/param-state";
import DashboardHeader from "@/components/dashboard/header";
import { formatOHLCVResponse } from "@/lib/utils/ohlcv";
const StockPriceMovementChart = dynamic(() => import("@/components/dashboard/stock-price-movement-chart"), {
  ssr: false,
});

const StockPrice = ({ params }: { params: Promise<{ interval: string }> }) => {
  const { interval: intervalParam } = use(params);
  const interval = capitalize(intervalParam);

  const { fetchData, data: ohlcData, loading } = useFetch<FormattedOhlcv, true>(true);
  const [activeStocks = [], setActiveStocks] = useParamState<string[]>("activeStocks");

  const filteredOhlcData = useMemo(() => {
    if (!ohlcData) return undefined;
    return Object.entries(ohlcData)
      .filter(([key]) => activeStocks.includes(key))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, FormattedOhlcv>);
  }, [ohlcData, activeStocks]);

  const getStockData = (symbol: string) => {
    fetchData(
      { function: getFunctionName(intervalParam), symbol },
      { transformData: formatOHLCVResponse(intervalParam), key: symbol }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader
          title={`${capitalize(interval)} Stock Price Movement`}
          description={`${capitalize(interval)} stock price movement from Alpha Vantage`}
        />
        <SymbolInputMultiple
          getStockData={getStockData}
          loading={loading}
          activeStocks={activeStocks}
          setActiveStocks={setActiveStocks}
        />
        {filteredOhlcData && (
          <StockPriceMovementChart data={filteredOhlcData} chartTitle={`${interval} Stock Price Movement`} />
        )}
      </div>
    </div>
  );
};

export default StockPrice;
