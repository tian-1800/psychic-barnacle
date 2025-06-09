"use client";

import DashboardHeader from "@/components/dashboard/header";
import { useCallback, useState } from "react";
import { FaExchangeAlt as ArrowRightLeft, FaChartLine } from "react-icons/fa";
import ExchangeRateCard from "./exchange-rate-card";
import useFetch from "@/lib/utils/fetch";
import { ExchangeRate } from "@/lib/types";

const ForexExchange = () => {
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [amount, setAmount] = useState("1");

  const { fetchData, data: exchangeData, loading } = useFetch<ExchangeRate>();

  const fetchExchangeRate = useCallback(async () => {
    fetchData(
      { function: "CURRENCY_EXCHANGE_RATE", from_currency: fromCurrency, to_currency: toCurrency },
      { transformData: (data) => (data as { [key: string]: ExchangeRate })["Realtime Currency Exchange Rate"] }
    );
  }, [fetchData, fromCurrency, toCurrency]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <DashboardHeader title="Exchange Rates" description="Get real-time currency exchange rates" />

      <div className="bg-white rounded-2xl shadow-l p-8 mb-8">
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Currency</label>
              <input
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Currency</label>
              <input
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full p-2  border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={swapCurrencies}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              title="Swap currencies"
            >
              <ArrowRightLeft className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter amount"
            />
          </div>

          <button
            type="button"
            onClick={fetchExchangeRate}
            disabled={loading || !fromCurrency || !toCurrency}
            className="text-center mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <>
                <FaChartLine className="w-5 h-5" />
                Convert Currency
              </>
            )}
          </button>
        </div>
      </div>

      {exchangeData && <ExchangeRateCard data={exchangeData} amount={amount} />}
    </div>
  );
};

export default ForexExchange;
