import AlignmentSpinner from "../../components/UIElements/Spinner/AlignmentSpinner";
import ButtonsSpinner from "../../components/UIElements/Spinner/ButtonsSpinner";
import ColorSpinner from "../../components/UIElements/Spinner/ColorSpinner";
import DefaultSpinner from "../../components/UIElements/Spinner/DefaultSpinner";
import ProgressSpinner from "../../components/UIElements/Spinner/ProgressSpinner";
import SizeSpinner from "../../components/UIElements/Spinner/SizeSpinner";
import SpinnerWithCard from "../../components/UIElements/Spinner/SpinnerWithCard";
import { Link } from "react-router-dom";

const Spinner = () => {
  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Spinner</h5>

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
            Spinner
          </li>
        </ol>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] mb-[25px]">
        <DefaultSpinner />

        <ColorSpinner />

        <SizeSpinner />

        <AlignmentSpinner />

        <SpinnerWithCard />

        <ProgressSpinner />

        <ButtonsSpinner />
      </div>
    </>
  );
};

export default Spinner;
