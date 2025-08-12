import BasicColumnChart from "../../components/Charts/Column/BasicColumnChart";
import DataLabelsColumnChart from "../../components/Charts/Column/DataLabelsColumnChart";
import DistributedColumnChart from "../../components/Charts/Column/DistributedColumnChart";
import RangeColumnChart from "../../components/Charts/Column/RangeColumnChart";
import RotatedLabelsColumnChart from "../../components/Charts/Column/RotatedLabelsColumnChart";
import StackedColumnChart from "../../components/Charts/Column/StackedColumnChart";
import { Link } from "react-router-dom";

const ColumnCharts = () => {
  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Column Charts</h5>

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
            Column Charts
          </li>
        </ol>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] mb-[25px]">
        <BasicColumnChart />

        <DataLabelsColumnChart />

        <StackedColumnChart />

        <RangeColumnChart />

        <RotatedLabelsColumnChart />

        <DistributedColumnChart />
      </div>
    </>
  );
};

export default ColumnCharts;
