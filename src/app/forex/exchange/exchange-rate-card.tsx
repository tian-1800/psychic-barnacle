import { ExchangeRate } from "@/lib/types";
import { FaClock } from "react-icons/fa";

type Props = { data: ExchangeRate; amount: string };

const ExchangeRateCard = ({ data, amount }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-l p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Exchange Rate Details</h2>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-stone-50 to-stone-200 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">From Currency</h3>
            <p className="text-lg">
              <span className="font-bold text-green-600">{data["1. From_Currency Code"]}</span> -{" "}
              {data["2. From_Currency Name"]}
            </p>
          </div>

          <div className="bg-gradient-to-r from-stone-50 to-stone-200 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">To Currency</h3>
            <p className="text-lg">
              <span className="font-bold text-blue-600">{data["3. To_Currency Code"]}</span> -{" "}
              {data["4. To_Currency Name"]}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-stone-50 to-stone-200 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Exchange Rate</h3>
            <p className="text-2xl font-bold ">{data["5. Exchange Rate"]}</p>
          </div>

          <div className="bg-gradient-to-r from-stone-50 to-stone-200 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Converted Amount</h3>
            <p className="text-2xl font-bold">
              {calculateConvertedAmount(amount, data["5. Exchange Rate"])} {data["3. To_Currency Code"]}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <h4 className="font-semibold text-gray-700 mb-1">Bid Price</h4>
          <p className="text-lg text-gray-600">{data["8. Bid Price"]}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <h4 className="font-semibold text-gray-700 mb-1">Ask Price</h4>
          <p className="text-lg text-gray-600">{data["9. Ask Price"]}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <h4 className="font-semibold text-gray-700 mb-1 flex items-center justify-center gap-1">
            <FaClock className="w-4 h-4" />
            Last Updated
          </h4>
          <p className="text-sm text-gray-600">
            {data["6. Last Refreshed"]}
            <br />
            <span className="text-xs">({data["7. Time Zone"]})</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const calculateConvertedAmount = (amount: string, rate: string) => {
  return (parseFloat(amount) * parseFloat(rate)).toFixed(2);
};

export default ExchangeRateCard;
