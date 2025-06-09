import { useMemo } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { FormattedOhlcv } from "@/lib/types";

type StockPriceMovementChartProps = {
  chartTitle?: string;
  data: Record<string, FormattedOhlcv>;
};

const StockPriceMovementChart = ({ chartTitle = "Stock Price Movement", data }: StockPriceMovementChartProps) => {
  const series: ApexAxisChartSeries = useMemo(() => {
    return Object.keys(data).map((symbol) => {
      const timeSeries = data[symbol];

      const closePoints = Object.entries(timeSeries).map(([timestamp, entry]) => {
        return {
          x: new Date(timestamp),
          y: parseFloat(entry["4. close"]),
        };
      });
      return {
        name: `${symbol}`,
        type: "line",
        data: closePoints,
      };
    });
  }, [data]);

  const options: ApexOptions = useMemo(() => {
    return {
      chart: {
        type: "line",
        height: 400,
        zoom: {
          enabled: true,
          type: "x",
          autoScaleYaxis: true,
        },
        toolbar: { show: false },
      },
      title: { text: chartTitle, align: "left" },
      xaxis: {
        type: "datetime",
        labels: { datetimeUTC: false, format: "dd MMM HH:mm" },
        title: { text: "Time" },
        tooltip: { enabled: true },
      },
      yaxis: {
        title: { text: "Price (Closing)" },
        labels: {
          formatter: (value: number) => {
            return value ? `${value.toFixed(2)}` : "";
          },
        },
      },
      stroke: { curve: "smooth", width: 2.5 },
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
  }, [chartTitle]);

  if (!series.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <Chart options={options} series={series} type="line" height={400} />
    </div>
  );
};

export default StockPriceMovementChart;
