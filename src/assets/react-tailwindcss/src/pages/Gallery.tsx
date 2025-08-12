import GalleryStyle1 from "../components/Gallery/GalleryStyle1";
import GalleryStyle2 from "../components/Gallery/GalleryStyle2";
import PopupGallery from "../components/Gallery/PopupGallery";
import { Link } from "react-router-dom";

export default function Gallery() {
  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Gallery</h5>

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
            Gallery
          </li>
        </ol>
      </div>
      
      <PopupGallery />

      <GalleryStyle1 />

      <GalleryStyle2 />
    </>
  );
}
