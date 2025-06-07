"use client";

import { useCallback, useState } from "react";
import { FaSyncAlt, FaChartBar } from "react-icons/fa";
import StockCard from "./stock-card";
import SymbolInput from "./symbol-input";
// import useParamState from "@/lib/utils/param-state";

const generateMockData = (symbol: string) => {
  const basePrice = Math.random() * 500 + 50;
  const change = (Math.random() - 0.5) * 20;
  const changePercent = (change / basePrice) * 100;

  return {
    "Global Quote": {
      "01. symbol": symbol.toUpperCase(),
      "02. open": (basePrice + Math.random() * 10 - 5).toFixed(4),
      "03. high": (basePrice + Math.random() * 15).toFixed(4),
      "04. low": (basePrice - Math.random() * 15).toFixed(4),
      "05. price": basePrice.toFixed(4),
      "06. volume": Math.floor(Math.random() * 10000000 + 1000000).toString(),
      "07. latest trading day": "2025-06-06",
      "08. previous close": (basePrice - change).toFixed(4),
      "09. change": change.toFixed(4),
      "10. change percent": changePercent.toFixed(4) + "%",
    },
  };
};

export type Quote = {
  "01. symbol": string;
  "02. open": string;
  "03. high": string;
  "04. low": string;
  "05. price": string;
  "06. volume": string;
  "07. latest trading day": string;
  "08. previous close": string;
  "09. change": string;
  "10. change percent": string;
};

const StockDashboard = () => {
  const [selectedStock, setSelectedStock] = useState<{ ["Global Quote"]: Quote } | null>(null);
  //   const [selectedStock, setSelectedStock] = useParamState<{ ["Global Quote"]: Quote } | null>('symbol',null);
  const [loading, setLoading] = useState(false);

  const getStockData = useCallback(async (symbol: string) => {
    if (!symbol.trim()) return;

    setLoading(true);
    setTimeout(() => {
      const mockData = generateMockData(symbol);
      setSelectedStock(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Stock Market Dashboard</h1>
          <p className="text-gray-600">Real-time stock quotes powered by Alpha Vantage</p>
        </div>

        {/* Search Section */}
        <SymbolInput getStockData={getStockData} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {loading ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
                <div className="text-center">
                  <FaSyncAlt className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Stock Data</h3>
                  <p className="text-gray-600">Fetching latest market information...</p>
                </div>
              </div>
            ) : selectedStock ? (
              <StockCard data={selectedStock} getStockData={getStockData} />
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
                <div className="text-center">
                  <FaChartBar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Stock Dashboard</h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDashboard;
