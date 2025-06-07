import { createContext, ReactNode, useContext, useState } from "react";

type DataContextType<T> = [T, (data: T) => void];

const DataContext = createContext<DataContextType<unknown> | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<unknown | undefined>(undefined);

  //   const contextValue: DataContextType<T> = {
  //     data,
  //     setData,
  //   };

  return <DataContext.Provider value={[data, setData]}>{children}</DataContext.Provider>;
};

export const useDataContext = <T,>() => {
  const context = useContext(DataContext);

  if (context === undefined) {
    throw new Error("useDataContext must be used within a DataProvider");
  }

  return context as DataContextType<T>;
};
