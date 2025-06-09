"use client";

import DashboardHeader from "@/components/dashboard/header";
import SymbolInput from "@/components/input/symbol-input";
import { ICompanyEarning } from "@/lib/types";
import { getQuartal } from "@/lib/utils/date";
import useFetch from "@/lib/utils/fetch";
import dynamic from "next/dynamic";
import { useCallback } from "react";
const EarningChart = dynamic(() => import("./earning-chart"), { ssr: false });

const EarningsDashboard = () => {
  const { fetchData, data: earningData, loading } = useFetch<ICompanyEarning>();

  const getStockData = useCallback(
    async (symbol: string) => {
      if (!symbol.trim()) return;

      fetchData(
        { function: "EARNINGS", symbol },
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          transformData: (data: any) => ({
            ...data,
            annualEarnings: data.annualEarnings.reverse(),
            quarterlyEarnings: data.quarterlyEarnings.reverse(),
          }),
        }
      );
    },
    [fetchData]
  );

  return (
    <div className="p-5 font-sans bg-gray-100 min-h-screen">
      <DashboardHeader title="Earnings" description="Company Annual and Quarterly Earnings" />
      <SymbolInput getStockData={getStockData} loading={loading} useFavorites />
      {earningData && (
        <div className="max-w-6xl mx-auto space-y-4">
          <EarningChart data={earningData} />
          <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
            <h2 className="flex items-center font-semibold text-gray-700 mb-4">Quarterly Surprise Percentage</h2>
            <div className="max-h-64 overflow-y-auto">
              <ul>
                {earningData.quarterlyEarnings.map((entry, index) => (
                  <li
                    key={index}
                    className="py-3 px-2 border-b border-gray-200 last:border-b-0 items-center bg-white hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="text-gray-800">
                      <b>{getQuartal(entry.fiscalDateEnding)}:</b> {parseFloat(entry.surprisePercentage).toFixed(2)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarningsDashboard;
