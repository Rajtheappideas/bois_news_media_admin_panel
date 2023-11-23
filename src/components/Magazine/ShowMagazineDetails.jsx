import React from "react";
import { useSelector } from "react-redux";
import BaseUrl from "../../BaseUrl";
import { useTranslation } from "react-i18next";

const ShowMagazineDetails = ({ setShowMagazineDetails }) => {
  const { singleMagazine } = useSelector((state) => state.root.magazines);

  const { t } = useTranslation();

  const {
    title,
    description,
    magazineTitle,
    stock,
    price,
    status,
    image,
    pdf,
  } = singleMagazine;

  return (
    <div className="w-full lg:space-y-5 space-y-3 ">
      {/* title + buttons */}
      <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
        <p className="font-semibold text-left lg:text-xl text-lg">
          {t("Magazine details")}
        </p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            className={`gray_button  `}
            onClick={() => setShowMagazineDetails(false)}
            type="button"
          >
            {t("Cancel")}
          </button>
        </div>
      </div>
      {/* main div */}
      <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
        <div className=" w-full flex items-start md:gap-x-10 gap-x-4">
          <div className="text-center">
            <label htmlFor="image" className="Label">
              {t("Image")}
            </label>
            <div className="relative md:w-24 w-20 h-24 block">
              <img
                src={BaseUrl.concat(image)}
                alt="image"
                className="rounded-full object-contain object-center md:h-24 md:w-24 w-20 h-20 border"
              />
            </div>
          </div>
          {/* pdf */}
          {/* <div className="text-center">
            <label htmlFor="pdf" className="Label">
              Pdf
            </label>

            <div className="relative md:w-24 w-20 h-24">
              <p className="text-sm text-center absolute z-0 bottom-0 right-0 rounded-full bg-gray-300 text-black md:h-24 md:w-24 w-20 h-20 p-5">
                <span className="block">{BaseUrl.concat(pdf)}</span>
              </p>
            </div>
          </div> */}
        </div>
        <p className="font-bold text-black md:text-xl">
          {t("Magazine details")}
        </p>{" "}
        {/* personal details */}
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/* title */}
          <div className="w-full space-y-2">
            <label htmlFor="title" className="Label">
            {t("title")}
            </label>
            <p className="font-semibold">{title}</p>
          </div>
          {/* price */}
          <div className="w-full space-y-2">
            <label htmlFor="price" className="Label">
            {t("price")}
            </label>
            <p className="font-semibold">{price}</p>
          </div>
          {/* stock */}
          <div className="w-full space-y-2">
            <label htmlFor="stock" className="Label">
            {t("stock")}
            </label>
            <p className="font-semibold">{stock}</p>
          </div>
          {/* status */}
          <div className="w-full space-y-2">
            <label htmlFor="status" className="Label">
            {t("status")}
            </label>
            <p className="font-semibold">{status}</p>
          </div>
          {/* magazines */}
          <div className="w-full space-y-2">
            <label htmlFor="magazineTitle" className="Label">
            {t("Magazine")}
            </label>
            <p className="font-semibold">{magazineTitle}</p>
          </div>
          {/* summary */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="summary" className="Label">
            {t("summary")}
            </label>
            <p className="font-semibold">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowMagazineDetails;
