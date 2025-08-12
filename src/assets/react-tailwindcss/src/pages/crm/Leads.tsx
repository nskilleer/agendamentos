import RevenueGrowth from "../../components/CRM/Leads/RevenueGrowth";
import LeadConversion from "../../components/CRM/Leads/LeadConversion";
import TotalOrders from "../../components/CRM/Leads/TotalOrders";
import AnnualProfit from "../../components/CRM/Leads/AnnualProfit";
import LeadsTable from "../../components/CRM/Leads/LeadsTable";
import { Link } from "react-router-dom";

const Leads = () => {
  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Leads</h5>

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
            CRM
          </li>
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Leads
          </li>
        </ol>
      </div>

      <div className="sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-x-[25px] lg:gap-[25px]">
        <div>
          <RevenueGrowth />
        </div>

        <div>
          <LeadConversion />
        </div>

        <div>
          <TotalOrders />
        </div>

        <div>
          <AnnualProfit />
        </div>
      </div>

      <LeadsTable />
    </>
  );
};

export default Leads;
