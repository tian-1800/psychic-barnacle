export const getFunctionName = (interval: string) => {
  switch (interval) {
    case "daily":
      return "TIME_SERIES_DAILY";
    case "weekly":
      return "TIME_SERIES_WEEKLY";
    case "weekly-adjusted":
      return "TIME_SERIES_WEEKLY_ADJUSTED";
    case "monthly":
      return "TIME_SERIES_MONTHLY";
    case "monthly-adjusted":
      return "TIME_SERIES_MONTHLY_ADJUSTED";

    default:
      return "INVALID_INTERVAL";
  }
};
