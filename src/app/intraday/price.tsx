import { useMemo } from "react";
import Chart from "react-apexcharts";
import { rawData } from "./apex";
import { ApexOptions } from "apexcharts";

const symbolsToDisplay = ["IBM", "RELIANCE.BSE"];

const StockPriceMovementChart = ({ chartTitle = "Stock Price Movement" }) => {
  const series: ApexAxisChartSeries = useMemo(() => {
    return symbolsToDisplay.map((symbol) => {
      const timeSeries = rawData[symbol];

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
  }, []);

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
        toolbar: {
          autoSelected: "zoom",
          show: true,
        },
      },
      title: {
        text: chartTitle,
        align: "left",
      },
      xaxis: {
        type: "datetime",
        labels: {
          datetimeUTC: false,
          format: "dd MMM HH:mm",
        },
        title: {
          text: "Time",
        },
        tooltip: {
          enabled: true,
        },
      },
      yaxis: {
        title: {
          text: "Price",
        },
        labels: {
          formatter: (value: number) => {
            return value ? `$${value.toFixed(2)}` : "";
          },
        },
      },
      stroke: {
        curve: "smooth", // 'smooth', 'straight', 'stepline'
        width: 2.5, // Slightly thicker lines
      },
      tooltip: {
        shared: true, // Shows tooltip with data from all series at that x-value
        intersect: false, // Tooltip activates when hovering near a point, not necessarily directly on it
        x: {
          format: "dd MMM yyyy, HH:mm", // Date format in the tooltip header
        },
        y: {
          formatter: (value: number, { seriesName }: { seriesName: string }) => {
            return value ? `${seriesName}: $${value.toFixed(2)}` : "N/A";
          },
        },
        marker: {
          show: true,
        },
      },
      legend: {
        position: "top", // 'top', 'bottom', 'left', 'right'
        horizontalAlign: "center", // 'left', 'center', 'right'
        fontSize: "14px",
        markers: {
          width: 12,
          height: 12,
          strokeWidth: 0,
          radius: 12,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5,
        },
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"], // zebra stripes
          opacity: 0.5,
        },
      },
      markers: {
        // Markers on data points
        size: 0, // Size of markers, 0 means no markers unless hovered
        hover: {
          size: 5, // Enlarge marker on hover
        },
      },
    };
  }, [chartTitle]);

  //   useEffect(() => {
  //     const currentRawData = rawData;

  //     if (!symbolsToDisplay || symbolsToDisplay.length === 0 || !currentRawData) {
  //       setSeries([]);
  //       return;
  //     }

  //     const newSeries = symbolsToDisplay
  //       .map((symbol) => {
  //         const timeSeries = currentRawData[symbol];
  //         if (!timeSeries) {
  //           console.warn(`Data for symbol ${symbol} not found.`);
  //           return null;
  //         }

  //         const closePoints = [];
  //         // Ensure timestamps are sorted for correct line plotting
  //         const sortedTimestamps = Object.keys(timeSeries);

  //         for (const timestamp of sortedTimestamps) {
  //           const entry = timeSeries[timestamp];
  //           if (entry && entry["4. close"] !== undefined) {
  //             closePoints.push({
  //               x: new Date(timestamp), // Timestamp for the x-axis
  //               y: parseFloat(entry["4. close"]), // Closing price for the y-axis
  //             });
  //           }
  //         }
  //         return {
  //           name: `${symbol}`, // Legend entry for the symbol
  //           type: "line",
  //           data: closePoints,
  //         };
  //       })
  //       .filter((s) => s !== null && s.data.length > 0); // Filter out symbols with no data

  //     setSeries(newSeries);

  //     setOptions({
  //       chart: {
  //         type: "line",
  //         height: 400, // Adjusted height
  //         zoom: {
  //           enabled: true,
  //           type: "x",
  //           autoScaleYaxis: true,
  //         },
  //         toolbar: {
  //           autoSelected: "zoom", // 'zoom', 'pan', 'selection'
  //           show: true,
  //         },
  //       },
  //       title: {
  //         text: chartTitle,
  //         align: "left",
  //       },
  //       xaxis: {
  //         type: "datetime",
  //         labels: {
  //           datetimeUTC: false, // Display in local timezone
  //           format: "dd MMM HH:mm", // Format for x-axis labels
  //         },
  //         title: {
  //           text: "Time",
  //         },
  //         tooltip: {
  //           enabled: true, // Shows x-axis value in the main tooltip
  //         },
  //       },
  //       yaxis: {
  //         title: {
  //           text: "Price",
  //         },
  //         labels: {
  //           formatter: (value) => {
  //             return value ? `$${value.toFixed(2)}` : "";
  //           }, // Format price with $
  //         },
  //         // If price scales differ vastly, consider multiple y-axes or normalization
  //       },
  //       stroke: {
  //         curve: "smooth", // 'smooth', 'straight', 'stepline'
  //         width: 2.5, // Slightly thicker lines
  //       },
  //       tooltip: {
  //         shared: true, // Shows tooltip with data from all series at that x-value
  //         intersect: false, // Tooltip activates when hovering near a point, not necessarily directly on it
  //         x: {
  //           format: "dd MMM yyyy, HH:mm", // Date format in the tooltip header
  //         },
  //         y: {
  //           formatter: (value, { seriesName }) => {
  //             return value ? `${seriesName}: $${value.toFixed(2)}` : "N/A";
  //           },
  //         },
  //         marker: {
  //           show: true,
  //         },
  //       },
  //       legend: {
  //         position: "top", // 'top', 'bottom', 'left', 'right'
  //         horizontalAlign: "center", // 'left', 'center', 'right'
  //         fontSize: "14px",
  //         markers: {
  //           width: 12,
  //           height: 12,
  //           strokeWidth: 0,
  //           radius: 12,
  //         },
  //         itemMargin: {
  //           horizontal: 10,
  //           vertical: 5,
  //         },
  //       },
  //       // Example: Pre-defined colors for a consistent look
  //       // colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'],
  //       grid: {
  //         borderColor: "#e7e7e7",
  //         row: {
  //           colors: ["#f3f3f3", "transparent"], // zebra stripes
  //           opacity: 0.5,
  //         },
  //       },
  //       markers: {
  //         // Markers on data points
  //         size: 0, // Size of markers, 0 means no markers unless hovered
  //         hover: {
  //           size: 5, // Enlarge marker on hover
  //         },
  //       },
  //     });
  //   }, [chartTitle]);

  if (!series.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chart-container" style={{ padding: "20px" }}>
      <Chart options={options} series={series} type="line" height={400} />
    </div>
  );
};

export default StockPriceMovementChart;
