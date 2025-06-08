import useParamState from "@/lib/utils/param-state";
import SymbolInput from "./symbol-input";

type Props = {
  getStockData: (symbol: string) => void;
  loading: boolean;
};
const SymbolInputFavorite = ({ getStockData: getStockDataProp, loading }: Props) => {
  const [selectedSymbol, setSelectedSymbol] = useParamState<string>("symbol");

  const getStockData = (symbol: string) => {
    getStockDataProp(symbol);
    setSelectedSymbol(symbol);
  };

  return <SymbolInput getStockData={getStockData} loading={loading} useFavorites selectedSymbol={selectedSymbol} />;
};

export default SymbolInputFavorite;
