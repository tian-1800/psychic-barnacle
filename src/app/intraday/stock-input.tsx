import Interval from "@/components/input/interval";
import SymbolSearch from "@/components/input/symbol";
import useParamState from "@/lib/utils/param-state";

export type StockSymbol = {
  "1. symbol": string;
  "2. name": string;
  "3. type": string;
  "4. region": string;
  "5. marketOpen": string;
  "6. marketClose": string;
  "7. timezone": string;
  "8. currency": string;
};

type Props = {
  fetchData: (key: string, queryParams?: Record<string, string | number>) => Promise<void>;
};

const StockInput = ({ fetchData }: Props) => {
  const [selectedSymbol, setSelectedSymbol] = useParamState<string | null>("symbol", null);
  const [interval, setInterval] = useParamState<string>("interval", "1min");

  const handleSymbolChange = (symbol: StockSymbol) => {
    setSelectedSymbol(symbol["1. symbol"]);
    if (symbol) {
      // fetchData("intraday", { symbol: symbol["1. symbol"], interval });
      console.log(`Fetching data for symbol: ${symbol["1. symbol"]} with interval: ${interval}`);
    }
  };

  const handleIntervalChange = (newInterval: string) => {
    setInterval(newInterval);
    if (selectedSymbol) {
      // fetchData("intraday", { symbol: selectedSymbol["1. symbol"], interval: newInterval });
      console.log(`Fetching data for symbol: ${selectedSymbol} with new interval: ${newInterval}`);
    }
  };

  return (
    <div className="">
      <SymbolSearch selectedSymbol={selectedSymbol} setSelectedSymbol={handleSymbolChange} />
      <Interval interval={interval} setInterval={handleIntervalChange} />
    </div>
  );
};
export default StockInput;
