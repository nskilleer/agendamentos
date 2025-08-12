
import React, { useState, useEffect } from "react";
import type { ApexOptions } from "apexcharts";

const AssetAllocation: React.FC = () => {
  // Chart
  // State for dynamically loaded Chart component
  const [ChartComponent, setChartComponent] =
    useState<React.ComponentType<any> | null>(null);

  // Dynamically import react-apexcharts
  useEffect(() => {
    import("react-apexcharts").then((module) => {
      setChartComponent(() => module.default);
    });
  }, []);

  const series = [30, 25, 20, 15, 10];

  const options: ApexOptions = {
    labels: ["BTC 30%", "ETH 25%", "USDC 20%", "ADA 15%", "SHIB 10%"],
    colors: ["#605DFF", "#757DFF", "#9CAAFF", "#C2CDFF", "#DDE4FF"],
    legend: {
      show: true,
      fontSize: "12px",
      position: "bottom",
      horizontalAlign: "center",
      itemMargin: {
        horizontal: 8,
        vertical: 8,
      },
      labels: {
        colors: "#64748B",
      },
      markers: {
        size: 6,
        offsetX: -2,
        offsetY: -0.5,
        shape: "square",
      },
    },
    dataLabels: {
      enabled: false,
    },
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Asset Allocation</h5>
          </div>
          <div className="trezo-card-subtitle">Last 30 Days</div>
        </div>

        <div className="trezo-card-content">
          <span className="block">Total Value</span>
          <h5 className="!mb-0 mt-[5px] !text-[20px]">$17,485</h5>

          <div className="-mt-[15px]">
            {ChartComponent ? (
              <ChartComponent
                options={options}
                series={series}
                type="pie"
                height={235}
                width={"100%"}
              />
            ) : (
              <div>Loading chart...</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AssetAllocation;
