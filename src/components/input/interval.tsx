import { ChangeEvent } from "react";

type Props = {
  interval: string;
  setInterval: (value: string) => void;
};

const Interval = ({ interval, setInterval }: Props) => {
  const handleIntervalChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setInterval(value);
  };
  return (
    <div className="mb-6">
      <label htmlFor="interval" className="block text-gray-700 font-medium mb-2">
        Interval
      </label>
      <select
        id="interval"
        value={interval}
        onChange={handleIntervalChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="1min">1 minute</option>
        <option value="5min">5 minutes</option>
        <option value="15min">15 minutes</option>
        <option value="30min">30 minutes</option>
        <option value="60min">60 minutes</option>
      </select>
    </div>
  );
};

export default Interval;
