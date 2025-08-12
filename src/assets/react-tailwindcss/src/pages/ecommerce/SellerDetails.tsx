import ProductsListTable from "../../components/eCommerce/ProductsListTable";
import Profile from "../../components/eCommerce/SellerDetails/Profile";
import Revenue from "../../components/eCommerce/SellerDetails/Revenue";
import SellerOverview from "../../components/eCommerce/SellerDetails/SellerOverview";
import { Link } from "react-router-dom";

const SellerDetails = () => {
  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Seller Details</h5>

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
            eCommerce
          </li>
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Seller Details
          </li>
        </ol>
      </div>

      <SellerOverview />

      <div className="lg:grid lg:grid-cols-4 gap-[25px]">
        <div className="lg:col-span-1">
          <Profile />
        </div>

        <div className="lg:col-span-3">
          <Revenue />
        </div>
      </div>

      <ProductsListTable />
    </>
  );
};

export default SellerDetails;
