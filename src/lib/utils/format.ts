export const formatCurrency = (value?: string) => {
  if (value === null || value === undefined) return "N/A";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value));
};

export const formatLargeNumber = (inputValue?: string) => {
  if (inputValue === null || inputValue === undefined) return "N/A";
  const value = parseFloat(inputValue);
  if (isNaN(value)) return "N/A";

  if (value >= 1_000_000_000_000) {
    return (value / 1_000_000_000_000).toFixed(2) + "T";
  }
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(2) + "B";
  }
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(2) + "M";
  }
  return value.toLocaleString();
};
