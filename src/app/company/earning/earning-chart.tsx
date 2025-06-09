import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { ICompanyEarning } from "@/lib/types";
import { getQuartal } from "@/lib/utils/date";

type Props = { data: ICompanyEarning };

const EarningChart = ({ data }: Props) => {
  const annualEPS = data.annualEarnings.map((entry) => ({
    x: new Date(entry.fiscalDateEnding).getFullYear(),
    y: parseFloat(entry.reportedEPS),
  }));

  const annualChartOptions = {
    chart: {
      id: "annual-eps-chart",
      toolbar: { show: false },
    },
    xaxis: {
      title: { text: "Fiscal Year" },
      labels: { datetimeUTC: false, format: "dd MMM", trim: true },
    },
    yaxis: {
      title: { text: "Reported EPS" },
    },
    dataLabels: { enabled: false },
    title: { text: `Annual Reported EPS for ${data.symbol}` },
  };

  const annualChartSeries = [
    {
      name: "Reported EPS",
      data: annualEPS,
    },
  ];

  const quarterlyDates = data.quarterlyEarnings.map(({ fiscalDateEnding }) => {
    return getQuartal(fiscalDateEnding);
  });
  const reportedQuarterlyEPS = data.quarterlyEarnings.map((entry) => parseFloat(entry.reportedEPS));
  const estimatedQuarterlyEPS = data.quarterlyEarnings.map((entry) => parseFloat(entry.estimatedEPS));

  const quarterlyChartOptions: ApexOptions = {
    chart: {
      id: "quarterly-eps-chart",
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: { horizontal: false },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: quarterlyDates,
      title: { text: "Fiscal Quartal" },
      labels: {
        trim: true,
      },
    },

    yaxis: { title: { text: "EPS" } },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val + " EPS";
        },
      },
    },
    title: { text: `Quarterly EPS (Reported vs. Estimated) for ${data.symbol}` },
  };
  const quarterlyChartSeries = [
    {
      name: "Reported EPS",
      data: reportedQuarterlyEPS,
    },
    {
      name: "Estimated EPS",
      data: estimatedQuarterlyEPS,
    },
  ];

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Chart options={annualChartOptions} series={annualChartSeries} type="line" height={400} />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Chart options={quarterlyChartOptions} series={quarterlyChartSeries} type="bar" height={400} />
      </div>
    </>
  );
};

export default EarningChart;
