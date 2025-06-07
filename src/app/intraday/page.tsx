"use client";

import StockInput from "./stock-input";
import dynamic from "next/dynamic";
import { OHLCResponse } from "@/lib/types/ohlc";
import useFetchAggregated from "@/lib/utils/fetch -aggregated";

const OHLCVolumeChart = dynamic(() => import("./apex"), { ssr: false });

const Intraday = () => {
  const { fetchData, data: ohlcData } = useFetchAggregated<OHLCResponse>();

  return (
    <div className="flex flex-col ">
      <StockInput fetchData={fetchData} />
      <OHLCVolumeChart symbol={"IBM"} />
    </div>
  );
};

export default Intraday;
