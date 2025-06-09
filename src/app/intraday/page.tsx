"use client";

import dynamic from "next/dynamic";
import { FormattedOhlcv } from "@/lib/types";
import useFetch from "@/lib/utils/fetch";
import SymbolInputInterval from "@/components/input/symbol-input-interval";
import DashboardHeader from "@/components/dashboard/header";
import { formatOHLCVResponse } from "@/lib/utils/ohlcv";

const OHLCVolumeChart = dynamic(() => import("../../components/dashboard/ohlc-chart"), { ssr: false });

const Intraday = () => {
  const { fetchData, data: ohlcData } = useFetch<FormattedOhlcv>();

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader title="Intraday Stock OHLCV" description="Intraday stock data from Alpha Vantage" />
      <SymbolInputInterval
        fetchData={fetchData}
        apiFunction="TIME_SERIES_INTRADAY"
        allowedIntervals={allowedIntervals}
        transformData={(interval: string) => formatOHLCVResponse(interval)}
      />
      <OHLCVolumeChart data={ohlcData} />
    </div>
  );
};

const allowedIntervals = ["1min", "5min", "15min", "30min", "60min"];

export default Intraday;
