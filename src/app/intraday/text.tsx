import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const symbolOptions = ["IBM", "RELIANCE.BSE", "AAPL", "MSFT", "GOOGL", "TSLA"];
const mockData: Record<string, Record<string, Record<string, string>>> = {
  IBM: {
    "2025-06-03 19:55:00": {
      "1. open": "265.2300",
      "2. high": "265.5000",
      "3. low": "265.2100",
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

type StockData = {
  timestamp: string;
  fullTimestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1", "#d084d0"];

const StockDashboard = () => {
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [activeStocks, setActiveStocks] = useState<{ symbol: string; data: StockData[]; color: string }[]>([]);

  // Transform raw data to chart format
  const transformData = (rawData: Record<string, Record<string, string>>) => {
    return Object.entries(rawData)
      .map(([timestamp, data]) => ({
        timestamp: timestamp.split(" ")[1], // Get only time part
        fullTimestamp: timestamp,
        open: parseFloat(data["1. open"]),
        high: parseFloat(data["2. high"]),
        low: parseFloat(data["3. low"]),
        close: parseFloat(data["4. close"]),
        volume: parseInt(data["5. volume"]),
      }))
      .reverse(); // Reverse to show chronological order
  };

  const handleAddStock = () => {
    if (selectedSymbol && !activeStocks.find((stock) => stock.symbol === selectedSymbol)) {
      const stockData = mockData[selectedSymbol] || mockData["IBM"]; // Fallback to IBM data
      const transformedData = transformData(stockData);

      const newStock = {
        symbol: selectedSymbol,
        data: transformedData,
        color: colors[activeStocks.length % colors.length],
      };

      setActiveStocks([...activeStocks, newStock]);
      setSelectedSymbol("");
    }
  };

  const removeStock = (symbolToRemove: string) => {
    setActiveStocks(activeStocks.filter((stock) => stock.symbol !== symbolToRemove));
  };

  // Combine all stock data for the chart
  const combinedData =
    activeStocks.length > 0
      ? activeStocks[0].data.map((item, index) => {
          const combined: Record<string, number | string> = {
            timestamp: item.timestamp,
            fullTimestamp: item.fullTimestamp,
          };
          activeStocks.forEach((stock) => {
            if (stock.data[index]) {
              combined[`${stock.symbol}_close`] = stock.data[index].close;
              combined[`${stock.symbol}_volume`] = stock.data[index].volume;
            }
          });
          return combined;
        })
      : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Stock Data Dashboard</h1>

        {/* Part 2: User Input Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Stock Symbol</h2>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="symbol-select" className="block text-sm font-medium text-gray-700 mb-2">
                Select Symbol
              </label>
              <select
                id="symbol-select"
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a symbol...</option>
                {symbolOptions.map((symbol) => (
                  <option key={symbol} value={symbol}>
                    {symbol}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAddStock}
              disabled={!selectedSymbol}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Add Stock
            </button>
          </div>

          {/* Active Stocks Display */}
          {activeStocks.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Active Stocks:</h3>
              <div className="flex flex-wrap gap-2">
                {activeStocks.map((stock) => (
                  <span
                    key={stock.symbol}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: stock.color }}
                  >
                    {stock.symbol}
                    <button onClick={() => removeStock(stock.symbol)} className="ml-2 text-white hover:text-gray-200">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Part 1: Data Visualization */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Stock Price Chart</h2>

          {activeStocks.length > 0 ? (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={combinedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={["dataMin - 5", "dataMax + 5"]} />
                  <Tooltip
                    labelFormatter={(label) => {
                      const item = combinedData.find((d) => d.timestamp === label);
                      return item ? `Time: ${item.fullTimestamp}` : `Time: ${label}`;
                    }}
                    formatter={(value, name) => [
                      `$${parseFloat(value.toString()).toFixed(2)}`,
                      name.toString().replace("_close", " Close Price"),
                    ]}
                  />
                  <Legend />
                  {activeStocks.map((stock) => (
                    <Line
                      key={stock.symbol}
                      type="monotone"
                      dataKey={`${stock.symbol}_close`}
                      stroke={stock.color}
                      strokeWidth={2}
                      dot={{ fill: stock.color, strokeWidth: 2, r: 4 }}
                      name={stock.symbol}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-lg mb-2">No stocks selected</p>
                <p className="text-sm">Add a stock symbol to view the chart</p>
              </div>
            </div>
          )}
        </div>

        {/* Volume Chart */}
        {activeStocks.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Volume Chart</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={combinedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    labelFormatter={(label) => {
                      const item = combinedData.find((d) => d.timestamp === label);
                      return item ? `Time: ${item.fullTimestamp}` : `Time: ${label}`;
                    }}
                    formatter={(value, name) => [value.toLocaleString(), name.toString().replace("_volume", " Volume")]}
                  />
                  <Legend />
                  {activeStocks.map((stock) => (
                    <Line
                      key={`${stock.symbol}_volume`}
                      type="monotone"
                      dataKey={`${stock.symbol}_volume`}
                      stroke={stock.color}
                      strokeWidth={2}
                      dot={{ fill: stock.color, strokeWidth: 2, r: 3 }}
                      name={`${stock.symbol} Volume`}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockDashboard;
