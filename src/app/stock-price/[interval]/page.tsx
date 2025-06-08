"use client";

import dynamic from "next/dynamic";
import { FormattedOhlcv, OHLCResponse } from "@/lib/types";
import useFetch from "@/lib/utils/fetch";
import { use } from "react";
import { getFunctionName } from "@/lib/utils/interval";
import SymbolInputMultiple from "@/components/input/symbol-input-multiple";
import capitalize from "@/lib/utils/capitalize";
const StockPriceMovementChart = dynamic(() => import("@/components/dashboard/stock-price-movement-chart"), {
  ssr: false,
});

const StockPrice = ({ params }: { params: Promise<{ interval: string }> }) => {
  const { interval: intervalParam } = use(params);
  const interval = capitalize(intervalParam);

  const { fetchData, data: ohlcData, loading } = useFetch<FormattedOhlcv, true>(true);

  const getStockData = (symbol: string) => {
    fetchData(
      { function: getFunctionName(interval), symbol },
      {
        transformData: (resp) => {
          const data = resp as OHLCResponse;
          return data[`Time Series (${interval})`];
        },
        key: symbol,
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SymbolInputMultiple getStockData={getStockData} loading={loading} />
      {ohlcData && <StockPriceMovementChart data={ohlcData} chartTitle={`${interval} Stock Price Movement`} />}
    </div>
  );
};

export default StockPrice;
