import PaginationStyle1 from "../../components/UIElements/Pagination/PaginationStyle1";
import PaginationStyle2 from "../../components/UIElements/Pagination/PaginationStyle2";
import { Link } from "react-router-dom";

const Pagination = () => {
  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Pagination</h5>

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
            UI Elements
          </li>
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Pagination
          </li>
        </ol>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] mb-[25px]">
        <PaginationStyle1 />

        <PaginationStyle2 />
      </div>
    </>
  );
};

export default Pagination;
