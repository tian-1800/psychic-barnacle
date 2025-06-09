import { ICompanyOverview } from "@/lib/types";
import { formatCurrency, formatLargeNumber } from "@/lib/utils/format";
import { FaDollarSign, FaChartLine, FaPercent, FaBuilding, FaGlobe, FaCalendarAlt } from "react-icons/fa";

const CompanyOverviewCard = ({ data }: { data: ICompanyOverview }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{data.Symbol}</h1>
            <p className="text-blue-100 text-sm">{data.Name}</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Market Capitalization */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FaDollarSign className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Market Cap</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatLargeNumber(data.MarketCapitalization)}</p>
        </div>

        {/* PE Ratio */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FaChartLine className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">P/E Ratio</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{data.PERatio || "N/A"}</p>
        </div>

        {/* Dividend Yield */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FaPercent className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-600">Dividend Yield</span>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {data.DividendYield ? `${(parseFloat(data.DividendYield) * 100).toFixed(2)}%` : "N/A"}
          </p>
        </div>

        {/* Diluted TTM */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FaDollarSign className="w-5 h-5 text-red-600" />
            <span className="text-sm text-gray-600">EPS (TTM)</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(data.DilutedEPSTTM)}</p>
        </div>

        {/* Profit Margin */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FaPercent className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-600">Profit Margin</span>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {data.ProfitMargin ? `${(parseFloat(data.ProfitMargin) * 100).toFixed(2)}%` : "N/A"}
          </p>
        </div>

        {/* Analyst Target Price */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FaChartLine className="w-5 h-5 text-indigo-600" />
            <span className="text-sm text-gray-600">Analyst Target Price</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(data.AnalystTargetPrice)}</p>
        </div>

        {/* Latest Quarter */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FaCalendarAlt className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">Latest Quarter</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{data.LatestQuarter || "N/A"}</p>
        </div>

        {/* Sector */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FaBuilding className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">Sector</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{data.Sector || "N/A"}</p>
        </div>

        {/* Country */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FaGlobe className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">Country</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{data.Country || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default CompanyOverviewCard;
