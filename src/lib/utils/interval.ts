export const getFunctionName = (interval: string) => {
  switch (interval) {
    case "daily":
      return "TIME_SERIES_DAILY";
    case "weekly":
      return "TIME_SERIES_WEEKLY";
    case "monthly":
      return "TIME_SERIES_MONTHLY";
    default:
      return "INVALID_INTERVAL";
  }
};
