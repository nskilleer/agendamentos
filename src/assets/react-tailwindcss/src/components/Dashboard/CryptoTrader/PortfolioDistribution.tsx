
import React, { useState, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import type { ApexOptions } from "apexcharts";

const PortfolioDistribution: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Monthly");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`);
  };

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

  const series = [30, 20, 12, 10, 8, 6];

  const options: ApexOptions = {
    labels: ["Bitcoin", "Ethereum", "BNB", "Tether", "Ripple", "Others"],
    colors: ["#9135E8", "#AD63F6", "#BF85FB", "#D7B5FD", "#E9D5FF", "#F3E8FF"],
    stroke: {
      width: 2,
      show: true,
      colors: ["#ffffff"],
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          labels: {
            show: false,
            name: {
              color: "#64748B",
            },
            value: {
              show: true,
              color: "#3A4252",
              fontSize: "28px",
              fontWeight: "600",
              formatter: (val: string) => {
                const numericVal = parseFloat(val);
                const total = series.reduce((a, b) => a + b, 0);
                const percentage = ((numericVal / total) * 100).toFixed(1); // Calculate percentage
                return `${numericVal}k (${percentage}%)`; // Show value in currency + percentage
              },
            },
            total: {
              show: true,
              color: "#64748B",
              formatter: (w) => {
                return `${w.globals.seriesTotals.reduce(
                  (a: number, b: number) => a + b,
                  0
                )}k`; // Show total in currency
              },
            },
          },
        },
      },
    },
    legend: {
      show: true,
      offsetY: 0,
      fontSize: "12px",
      position: "left",
      horizontalAlign: "center",
      itemMargin: {
        horizontal: 0,
        vertical: 5,
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
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "%";
        },
      },
    },
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Portfolio Distribution</h5>
          </div>

          <div className="trezo-card-subtitle">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[26px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500">
                <i className="ri-more-fill"></i>
              </MenuButton>

              <MenuItems className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
                {["This Day", "This Week", "This Month", "This Year"].map(
                  (option) => (
                    <MenuItem
                      key={option}
                      as="div"
                      className={`block w-full transition-all text-black cursor-pointer ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black ${
                        selectedOption === option ? "font-semibold" : ""
                      }`}
                      onClick={() => handleSelect(option)}
                    >
                      {option}
                    </MenuItem>
                  )
                )}
              </MenuItems>
            </Menu>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="-mt-[5px] -mb-[5px]">
            {ChartComponent ? (
              <ChartComponent
                options={options}
                series={series}
                type="donut"
                height={195}
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

export default PortfolioDistribution;
