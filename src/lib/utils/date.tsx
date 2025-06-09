export const getQuartal = (entry: string) => {
  const date = new Date(entry);
  const year = date.getFullYear();
  const month = date.getMonth();
  const quarter = Math.floor(month / 3) + 1;
  return `${year} Q${quarter}`;
};
