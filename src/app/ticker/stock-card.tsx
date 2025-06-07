import { FaArrowUp, FaArrowDown, FaSyncAlt, FaVolumeUp, FaClock } from "react-icons/fa";
import { Quote } from "./page";

const formatNumber = (num: string) => {
  return parseFloat(num).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
};

const formatVolume = (volume: string) => {
  const num = parseInt(volume);
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toLocaleString();
};

type StockCardProps = {
  data: { "Global Quote": Quote };
  getStockData: (key: string, queryParams?: Record<string, string | number>) => Promise<void>;
};
const StockCard = ({ data, getStockData }: StockCardProps) => {
  const quote = data["Global Quote"];
  const isPositive = parseFloat(quote["09. change"]) >= 0;
  const changePercent = quote["10. change percent"].replace("%", "");

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{quote["01. symbol"]}</h1>
            <p className="text-blue-100 text-sm">Latest Trading Day: {quote["07. latest trading day"]}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => getStockData(quote["01. symbol"])}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <FaSyncAlt className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className="p-6">
        <div className="flex items-baseline space-x-4 mb-6">
          <span className="text-4xl font-bold text-gray-900">${formatNumber(quote["05. price"])}</span>
          <div
            className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
              isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {isPositive ? <FaArrowUp className="w-4 h-4" /> : <FaArrowDown className="w-4 h-4" />}
            <span className="font-semibold">
              {isPositive ? "+" : ""}
              {formatNumber(quote["09. change"])}
            </span>
            <span className="font-semibold">
              ({isPositive ? "+" : ""}
              {parseFloat(changePercent).toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <FaArrowUp className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">Open</span>
            </div>
            <p className="text-xl font-bold text-gray-900">${formatNumber(quote["02. open"])}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <FaArrowUp className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">High</span>
            </div>
            <p className="text-xl font-bold text-gray-900">${formatNumber(quote["03. high"])}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <FaArrowDown className="w-5 h-5 text-red-600" />
              <span className="text-sm text-gray-600">Low</span>
            </div>
            <p className="text-xl font-bold text-gray-900">${formatNumber(quote["04. low"])}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <FaVolumeUp className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">Volume</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{formatVolume(quote["06. volume"])}</p>
          </div>
        </div>

        {/* Previous Close */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FaClock className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600">Previous Close</span>
            </div>
            <span className="text-xl font-bold text-gray-900">${formatNumber(quote["08. previous close"])}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
