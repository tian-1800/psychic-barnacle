"use client";

import dynamic from "next/dynamic";
import { OHLCResponse } from "@/lib/types";
import useFetch from "@/lib/utils/fetch";
import SymbolInputFavorite from "@/components/input/symbol-input-favorite";
import { use } from "react";
import { getFunctionName } from "@/lib/utils/interval";

const OHLCVolumeChart = dynamic(() => import("@/components/dashboard/ohlc-chart"), { ssr: false });

const OHLC = ({ params }: { params: Promise<{ interval: string }> }) => {
  const { interval } = use(params);

  const { fetchData, data: ohlcData, loading } = useFetch<OHLCResponse>();

  const getStockData = (symbol: string) => {
    fetchData(
      { function: getFunctionName(interval), symbol },
      {
        transformData: (data) => data as OHLCResponse,
        onSuccess: (data) => console.log("Fetched stock data:", data),
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SymbolInputFavorite getStockData={getStockData} loading={loading} />
      <OHLCVolumeChart data={ohlcData} interval={interval} />
    </div>
  );
};

export default OHLC;
