"use client";

import { useCallback } from "react";
import { FaSyncAlt } from "react-icons/fa";
import SymbolInput from "../../../components/input/symbol-input";
import useFetch from "@/lib/utils/fetch";
import { ICompanyOverview } from "@/lib/types";
import DashboardHeader from "@/components/dashboard/header";
import CompanyOverviewCard from "./overview-card";

const CompanyOverview = () => {
  const { fetchData, data: overviewData, loading } = useFetch<ICompanyOverview>();

  const getStockData = useCallback(
    async (symbol: string) => {
      if (!symbol.trim()) return;

      fetchData({ function: "OVERVIEW", symbol });
    },
    [fetchData]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader title="Company Overview" description="Company Overview from Alpha Vantage" />

      <SymbolInput getStockData={getStockData} loading={loading} useFavorites />

      <div className="max-w-2xl mx-auto">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
            <div className="text-center">
              <FaSyncAlt className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading</h3>
              <p className="text-gray-600">Loading company data...</p>
            </div>
          </div>
        ) : (
          overviewData && <CompanyOverviewCard data={overviewData} />
        )}
      </div>
    </div>
  );
};

export default CompanyOverview;
