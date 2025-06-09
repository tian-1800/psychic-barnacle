"use client";

import { FormattedOhlcv } from "@/lib/types";
import { ApexOptions } from "apexcharts";
import { useSearchParams } from "next/navigation";
import React, { Fragment, useMemo } from "react";
import Chart from "react-apexcharts";

const OHLCChart = ({ data, interval }: { data?: FormattedOhlcv; interval?: string }) => {
  const searchParams = useSearchParams();
  // const interval = intervalProps || searchParams.get("interval") || "";
  const symbol = searchParams.get("symbol");

  const series = useMemo(() => {
    // const intervalKey = `Time Series (${interval.charAt(0).toUpperCase() + interval.slice(1)})` as const;
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

  const volumeOptions: ApexOptions = useMemo(() => {
    return {
      chart: {
        type: "line",
        height: 400,
        zoom: {
          enabled: true,
          type: "x",
          autoScaleYaxis: true,
        },
        toolbar: { autoSelected: "zoom", show: true },
      },
      title: { text: "Volume", align: "left" },
      xaxis: {
        type: "datetime",
        labels: { datetimeUTC: false, format: "dd MMM HH:mm" },
        title: { text: "Time" },
        tooltip: { enabled: true },
      },
      yaxis: {
        title: { text: "Volume" },
        labels: {
          formatter: (value: number) => {
            return value ? `${value.toFixed(2)}` : "";
          },
        },
      },
      stroke: { curve: "linestep", width: 2.5 },

      tooltip: {
        shared: true,
        intersect: false,
        x: { format: "dd MMM yyyy, HH:mm" },
        y: {
          formatter: (value: number) => {
            return value ? `${value.toFixed(2)}` : "N/A";
          },
        },
        marker: { show: true },
      },
      grid: {
        borderColor: "#e7e7e7",
        row: { colors: ["#f3f3f3", "transparent"], opacity: 0.5 },
      },
    };
  }, []);

  if (!symbol) {
    return <Fragment />;
  }

  if (!series.length) {
    return <div>Loading chart data...</div>;
  }

  return (
    <div className="chart-container">
      <Chart options={options} series={series} type="candlestick" height={350} />
      <Chart options={volumeOptions} series={series} type="bar" height={400} />
    </div>
  );
};

export default OHLCChart;
