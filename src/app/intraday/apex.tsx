"use client";

import { ApexOptions } from "apexcharts";
import React, { useMemo } from "react";
import Chart from "react-apexcharts";

export const rawData: Record<string, Record<string, Record<string, string>>> = {
  IBM: {
    "2025-06-03 19:55:00": {
      "1. open": "265.2300",
      "2. high": "265.5000",
      "3. low": "265.1100",
      "4. close": "265.2100",
      "5. volume": "26",
    },
    "2025-06-03 19:50:00": {
      "1. open": "265.5000",
      "2. high": "265.5000",
      "3. low": "265.1000",
      "4. close": "265.1000",
      "5. volume": "9",
    },
    "2025-06-03 19:45:00": {
      "1. open": "265.2100",
      "2. high": "265.3000",
      "3. low": "265.2100",
      "4. close": "265.3000",
      "5. volume": "25",
    },
    "2025-06-03 19:40:00": {
      "1. open": "264.8000",
      "2. high": "265.2100",
      "3. low": "264.8000",
      "4. close": "265.2100",
      "5. volume": "15",
    },
    "2025-06-03 19:35:00": {
      "1. open": "264.5000",
      "2. high": "264.9000",
      "3. low": "264.5000",
      "4. close": "264.8000",
      "5. volume": "32",
    },
  },
  "RELIANCE.BSE": {
    "2025-06-03 19:55:00": {
      "1. open": "1250.50",
      "2. high": "1255.75",
      "3. low": "1248.25",
      "4. close": "1252.30",
      "5. volume": "145",
    },
    "2025-06-03 19:50:00": {
      "1. open": "1248.75",
      "2. high": "1252.00",
      "3. low": "1247.50",
      "4. close": "1250.50",
      "5. volume": "89",
    },
    "2025-06-03 19:45:00": {
      "1. open": "1245.25",
      "2. high": "1249.50",
      "3. low": "1244.75",
      "4. close": "1248.75",
      "5. volume": "156",
    },
    "2025-06-03 19:40:00": {
      "1. open": "1242.80",
      "2. high": "1246.25",
      "3. low": "1241.50",
      "4. close": "1245.25",
      "5. volume": "203",
    },
    "2025-06-03 19:35:00": {
      "1. open": "1240.00",
      "2. high": "1244.25",
      "3. low": "1239.75",
      "4. close": "1242.80",
      "5. volume": "178",
    },
  },
  AAPL: {
    "2025-06-03 19:55:00": {
      "1. open": "180.25",
      "2. high": "181.50",
      "3. low": "179.80",
      "4. close": "180.95",
      "5. volume": "2500",
    },
    "2025-06-03 19:50:00": {
      "1. open": "179.50",
      "2. high": "180.75",
      "3. low": "179.25",
      "4. close": "180.25",
      "5. volume": "1850",
    },
    "2025-06-03 19:45:00": {
      "1. open": "178.75",
      "2. high": "180.00",
      "3. low": "178.50",
      "4. close": "179.50",
      "5. volume": "2100",
    },
    "2025-06-03 19:40:00": {
      "1. open": "178.25",
      "2. high": "179.25",
      "3. low": "177.90",
      "4. close": "178.75",
      "5. volume": "1950",
    },
    "2025-06-03 19:35:00": {
      "1. open": "177.80",
      "2. high": "178.50",
      "3. low": "177.40",
      "4. close": "178.25",
      "5. volume": "2250",
    },
  },
  MSFT: {
    "2025-06-03 19:55:00": {
      "1. open": "420.50",
      "2. high": "422.75",
      "3. low": "419.25",
      "4. close": "421.80",
      "5. volume": "1200",
    },
    "2025-06-03 19:50:00": {
      "1. open": "419.75",
      "2. high": "421.25",
      "3. low": "419.00",
      "4. close": "420.50",
      "5. volume": "980",
    },
    "2025-06-03 19:45:00": {
      "1. open": "418.50",
      "2. high": "420.25",
      "3. low": "418.00",
      "4. close": "419.75",
      "5. volume": "1150",
    },
    "2025-06-03 19:40:00": {
      "1. open": "417.25",
      "2. high": "419.00",
      "3. low": "416.80",
      "4. close": "418.50",
      "5. volume": "1380",
    },
    "2025-06-03 19:35:00": {
      "1. open": "416.80",
      "2. high": "418.25",
      "3. low": "416.25",
      "4. close": "417.25",
      "5. volume": "1050",
    },
  },
};

const OHLCChart = ({ symbol = "IBM" }) => {
  const series = useMemo(() => {
    const timeSeries = rawData[symbol];
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
  }, [symbol]);

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
