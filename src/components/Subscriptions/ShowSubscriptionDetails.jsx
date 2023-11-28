import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { PublicS3Url } from "../../BaseUrl";

const ShowSubscriptionDetails = ({ setShowSubscriptionDetails }) => {
  const { singleSubscription } = useSelector(
    (state) => state.root.subscriptions
  );

  const { title, price, status, description, image, _id } = singleSubscription;

  const { t } = useTranslation();

  return (
    <div className="w-full lg:space-y-5 space-y-3 ">
      {/* title + buttons */}
      <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
        <p className="font-semibold text-left lg:text-xl text-lg">
          {t("Subscriptions details")}{" "}
        </p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            className={`gray_button  `}
            type="button"
            onClick={() => setShowSubscriptionDetails(false)}
          >
            {t("Cancel")}
          </button>
        </div>
      </div>
      {/* main div */}
      <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
        <div className="relative md:w-24 w-20 block">
          <img
            src={PublicS3Url.concat(image)}
            alt=""
            className="rounded-full md:h-24 md:w-24 w-20 h-20 border"
          />
        </div>

        <p className="font-bold text-black md:text-xl">Subscription details</p>
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
          {/* status */}
          <div className="w-full space-y-2">
            <label htmlFor="status" className="Label">
              {t("status")}
            </label>
            <p className="font-semibold">{status}</p>
          </div>
          {/* descriptions */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="descriptions" className="Label">
              {t("descriptions")}
            </label>

            <p className="font-semibold">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowSubscriptionDetails;
