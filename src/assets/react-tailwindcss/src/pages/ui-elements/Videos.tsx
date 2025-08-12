import VimeoRatio from "../../components/UIElements/Videos/VimeoRatio";
import VimeoRatio21x9 from "../../components/UIElements/Videos/VimeoRatio21x9";
import YouTubeRatio from "../../components/UIElements/Videos/YouTubeRatio";
import YouTubeRatio21x9 from "../../components/UIElements/Videos/YouTubeRatio21x9";
import { Link } from "react-router-dom";

const Videos = () => {
  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Videos</h5>

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
            Videos
          </li>
        </ol>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] mb-[25px]">
        <YouTubeRatio />

        <VimeoRatio />

        <YouTubeRatio21x9 />

        <VimeoRatio21x9 />
      </div>
    </>
  );
};

export default Videos;
