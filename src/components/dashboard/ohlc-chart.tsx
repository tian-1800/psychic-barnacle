"use client";

import { OHLCResponse } from "@/lib/types";
import { ApexOptions } from "apexcharts";
import { useSearchParams } from "next/navigation";
import React, { useMemo } from "react";
import Chart from "react-apexcharts";

const OHLCChart = ({ data }: { data?: OHLCResponse }) => {
  const searchParams = useSearchParams();
  const interval = searchParams.get("interval");
  const symbol = searchParams.get("symbol");

  const series = useMemo(() => {
    const intervalKey = `Time Series (${interval})` as const;
    const timeSeries = data?.[intervalKey];
    if (!timeSeries) return [];

    const ohlcPoints = Object.entries(timeSeries).map(([timestamp, entry]) => ({
      x: new Date(timestamp),
      y: [
        parseFloat(entry["1. open"]),
        parseFloat(entry["2. high"]),
        parseFloat(entry["3. low"]),
        parseFloat(entry["4. close"]),
      ],
    }));

    return [{ data: ohlcPoints }];
  }, [data, interval]);

  const options: ApexOptions = useMemo(() => {
    return {
      chart: {
        type: "candlestick",
        height: 350,
      },
      title: {
        text: `${symbol} OHLC Chart`,
      },
      xaxis: {
        type: "datetime",
        labels: {
          datetimeUTC: false,
          trim: true,
          showDuplicates: true,
        },
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: "#00B746",
            downward: "#EF403C",
          },
          wick: {
            useFillColor: true,
          },
        },
      },
    };
  }, [symbol]);

  if (!symbol) {
    return <div>Please select a symbol to view the chart.</div>;
  }

  if (!series.length) {
    return <div>Loading chart data...</div>;
  }

  return (
    <div className="chart-container">
      <Chart options={options} series={series} type="candlestick" height={350} />
    </div>
  );
};

export default OHLCChart;
