import useParamState from "@/lib/utils/param-state";
import Interval from "./interval";
import SymbolInput from "./symbol-input";
import { FetchData } from "@/lib/utils/fetch";

type Props<T> = {
  fetchData: FetchData<T>;
  apiFunction: string;
  allowedIntervals: string[];
  transformData?: (interval: string) => (data: unknown) => T;
};

const SymbolInputInterval = <T,>({ fetchData, apiFunction, allowedIntervals, transformData }: Props<T>) => {
  const [interval, setInterval] = useParamState<string>("interval", "1min");
  const [selectedSymbol, setSelectedSymbol] = useParamState<string>("symbol");

  const getStockData = (symbol: string) => {
    setSelectedSymbol(symbol);
    if (!interval || !allowedIntervals.includes(interval)) return;

    fetchData({ function: apiFunction, symbol, interval }, { transformData: transformData?.(interval) });
  };

  return (
    <SymbolInput getStockData={getStockData} loading={false} selectedSymbol={selectedSymbol} inlineSubmitButton={false}>
      <Interval interval={interval} setInterval={setInterval} />
    </SymbolInput>
  );
};

export default SymbolInputInterval;
