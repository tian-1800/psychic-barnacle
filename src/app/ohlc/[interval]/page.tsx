"use client";

import dynamic from "next/dynamic";
import { FormattedOhlcv } from "@/lib/types";
import useFetch from "@/lib/utils/fetch";
import SymbolInputFavorite from "@/components/input/symbol-input-favorite";
import { use } from "react";
import { getFunctionName } from "@/lib/utils/interval";
import DashboardHeader from "@/components/dashboard/header";
import capitalize from "@/lib/utils/capitalize";
import { formatOHLCVResponse } from "@/lib/utils/ohlcv";

const OHLCVolumeChart = dynamic(() => import("@/components/dashboard/ohlc-chart"), { ssr: false });

const OHLC = ({ params }: { params: Promise<{ interval: string }> }) => {
  const { interval } = use(params);

  const { fetchData, data: ohlcData, loading } = useFetch<FormattedOhlcv>();

  const getStockData = (symbol: string) => {
    fetchData({ function: getFunctionName(interval), symbol }, { transformData: formatOHLCVResponse(interval) });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader
          title={`${capitalize(interval)} Stock OHLCV`}
          description={`${capitalize(interval)} stock data from Alpha Vantage`}
        />
        <SymbolInputFavorite getStockData={getStockData} loading={loading} />
        <OHLCVolumeChart data={ohlcData} interval={interval} />
      </div>
    </div>
  );
};

export default OHLC;
