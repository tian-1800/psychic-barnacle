"use client";

import { FormattedOhlcv } from "@/lib/types";
import { ApexOptions } from "apexcharts";
import { useSearchParams } from "next/navigation";
import React, { Fragment, useMemo } from "react";
import Chart from "react-apexcharts";

const OHLCChart = ({ data }: { data?: FormattedOhlcv }) => {
  const searchParams = useSearchParams();
  const symbol = searchParams.get("symbol");

  const series = useMemo(() => {
    const timeSeries = data;
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
  }, [data]);

  const seriesVolume = useMemo(() => {
    const timeSeries = data;
    if (!timeSeries) return [];

    const ohlcPoints = Object.entries(timeSeries).map(([timestamp, entry]) => ({
      x: new Date(timestamp),
      y: parseFloat(entry["5. volume"]),
    }));

    return [{ name: "Volume", data: ohlcPoints }];
  }, [data]);

  const options: ApexOptions = useMemo(() => {
    return {
      chart: { height: 350 },
      title: { text: `${symbol} OHLC Chart` },
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
          wick: { useFillColor: true },
        },
      },
    };
  }, [symbol]);

  const volumeOptions: ApexOptions = useMemo(() => {
    return {
      chart: {
        height: 400,
        toolbar: { show: false },
      },
      title: { text: `${symbol} Volume Chart` },
      xaxis: {
        type: "datetime",
        labels: {
          datetimeUTC: false,
          trim: true,
          showDuplicates: true,
        },
      },
      yaxis: {
        title: { text: "Volume" },
        labels: {
          formatter: (value: number) => {
            return value ? `${value.toFixed(2)}` : "";
          },
        },
      },

      grid: {
        borderColor: "#e7e7e7",
        row: { colors: ["#f3f3f3", "transparent"], opacity: 0.5 },
      },
    };
  }, [symbol]);

  if (!symbol) {
    return <Fragment />;
  }

  if (!series.length) {
    return <div>Loading chart data...</div>;
  }

  return (
    <div className="space-y-4">
      <Chart options={options} series={series} type="candlestick" height={400} />
      <Chart options={volumeOptions} series={seriesVolume} type="bar" height={400} />
    </div>
  );
};

export default OHLCChart;
