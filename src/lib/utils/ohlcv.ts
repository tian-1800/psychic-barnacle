import { OHLCResponse } from "../types";
import capitalize from "./capitalize";

export const formatOHLCVResponse = (intervalInput: string) => (resp: unknown) => {
  const data = resp as OHLCResponse;
  const interval = capitalize(intervalInput);

  const intervalKey = (
    ["Weekly", "Weekly Adjusted", "Monthly", "Monthly Adjusted"].includes(interval)
      ? `${interval} Time Series`
      : `Time Series (${interval})`
  ) as `Time Series (${string})`;

  return data[intervalKey];
};
