import Interval from "@/components/input/interval";
import SymbolInput from "@/components/input/symbol-input";
import { OHLCResponse } from "@/lib/types";
import { FetchData } from "@/lib/utils/fetch";
import useParamState from "@/lib/utils/param-state";

type Props = {
  fetchData: FetchData<OHLCResponse>;
};

const StockInput = ({ fetchData }: Props) => {
  const [interval, setInterval] = useParamState<string>("interval", "1min");

  const getStockData = (symbol: string) => {
    if (!interval || !allowedIntervals.includes(interval)) return;

    fetchData({ function: "TIME_SERIES_INTRADAY", symbol, interval });
  };

  return (
    <SymbolInput getStockData={getStockData} loading={false}>
      <Interval interval={interval} setInterval={setInterval} />
    </SymbolInput>
  );
};

const allowedIntervals = ["1min", "5min", "15min", "30min", "60min"];

export default StockInput;
