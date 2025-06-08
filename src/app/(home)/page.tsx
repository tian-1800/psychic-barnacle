"use client";

import { useCallback } from "react";
import { FaSyncAlt, FaChartBar } from "react-icons/fa";
import StockCard from "./stock-card";
import SymbolInput from "../../components/input/symbol-input";
import useFetch from "@/lib/utils/fetch";
import { Quote } from "@/lib/types";
import DashboardHeader from "@/components/dashboard/header";

const StockDashboard = () => {
  const { fetchData, data: selectedStock, loading } = useFetch<{ ["Global Quote"]: Quote }, false>();

  const getStockData = useCallback(
    async (symbol: string) => {
      if (!symbol.trim()) return;

      fetchData({ function: "GLOBAL_QUOTE", symbol });
    },
    [fetchData]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader title="Alpha Vantage Quotes" description="Real-time stock quotes from Alpha Vantage" />

        <SymbolInput getStockData={getStockData} loading={loading} />

        <div className="max-w-2xl mx-auto">
          {loading ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
              <div className="text-center">
                <FaSyncAlt className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Stock Data</h3>
                <p className="text-gray-600">Fetching latest market information...</p>
              </div>
            </div>
          ) : selectedStock ? (
            <StockCard data={selectedStock["Global Quote"]} getStockData={getStockData} />
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
  );
};

export default StockDashboard;
