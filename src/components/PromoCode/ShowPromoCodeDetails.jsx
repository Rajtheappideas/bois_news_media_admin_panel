import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { handleFindSinglePromoCode } from "../../redux/PromoCodeSlice";
import moment from "moment";

const ShowPromoCodeDetails = ({ setShowPromoCodeDetails }) => {
  const { singlePromoCode } = useSelector((state) => state.root.promoCode);

  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <div className="w-full lg:space-y-5 space-y-3">
      {/* title + buttons */}
      <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
        <p className="font-semibold text-left lg:text-xl text-lg">
          {t("promo code details")}
        </p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            className={`gray_button`}
            onClick={() => {
              setShowPromoCodeDetails(false);
              dispatch(handleFindSinglePromoCode(null));
            }}
          >
            {t("Cancel")}
          </button>
        </div>
      </div>
      {/* main div */}
      <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
        {/* personal details */}
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/* code */}
          <div className="w-full space-y-2">
            <label htmlFor="code" className="Label">
              {t("Code")}
            </label>
            <p className="font-semibold">{singlePromoCode?.code}</p>
          </div>
          {/* expire date */}
          <div className="w-full space-y-2">
            <label htmlFor="expireDate" className="Label">
              {t("expire date")}
            </label>
            <p className="font-semibold">
              {moment(singlePromoCode?.expireDate).format("l")}
            </p>
          </div>
          {/* discount */}
          <div className="w-full space-y-2">
            <label htmlFor="company" className="Label">
              {t("Discount percentage")}
            </label>
            <p className="font-semibold">
              {singlePromoCode?.discountPercentage}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowPromoCodeDetails;
