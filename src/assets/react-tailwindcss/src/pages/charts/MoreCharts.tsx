import BasicBoxplotChart from "../../components/Charts/More/BasicBoxplotChart";
import BasicBubbleChart from "../../components/Charts/More/BasicBubbleChart";
import BasicCandlestickChart from "../../components/Charts/More/BasicCandlestickChart";
import BasicHeatmapChart from "../../components/Charts/More/BasicHeatmapChart";
import BasicRangeAreaChart from "../../components/Charts/More/BasicRangeAreaChart";
import BasicScatterChart from "../../components/Charts/More/BasicScatterChart";
import BasicTimelineChart from "../../components/Charts/More/BasicTimelineChart";
import BasicTreemapChart from "../../components/Charts/More/BasicTreemapChart";
import { Link } from "react-router-dom";

const MoreCharts = () => {
  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">More Charts</h5>

        <ol className="breadcrumb mt-[12px] md:mt-0">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            <Link
              to="/dashboard/ecommerce"
              className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500"
            >
              <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">
                home
              </i>
              Dashboard
            </Link>
          </li>
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Charts
          </li>
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            More Charts
          </li>
        </ol>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] mb-[25px]">
        <BasicRangeAreaChart />

        <BasicTimelineChart />

        <BasicCandlestickChart />

        <BasicBoxplotChart />

        <BasicBubbleChart />

        <BasicScatterChart />

        <BasicHeatmapChart />

        <BasicTreemapChart />
      </div>
    </>
  );
};

export default MoreCharts;
