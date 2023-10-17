import React from "react";
import { useTranslation } from "react-i18next";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

const MessgeDetails = ({ setShowMessageDetails, singleMessage }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full lg:space-y-5 space-y-3">
      {/* title + buttons */}
      <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
        <p
          className="font-semibold text-left lg:text-xl text-lg cursor-pointer"
          onClick={() => setShowMessageDetails(false)}
        >
          <MdOutlineKeyboardBackspace
            size={25}
            className="inline-block pb-1 mr-1"
          />{" "}
          <span>{t("Message Details")}</span>
        </p>
      </div>
      {/* main div */}
      <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/* name */}
          <div className="w-full space-y-2">
            <label htmlFor="name" className="Label">
              {t("Name")}
            </label>

            <p className="font-semibold">{singleMessage?.name}</p>
          </div>
          {/* email */}
          <div className="w-full space-y-2">
            <label htmlFor="email" className="Label">
              {t("Email")}
            </label>

            <p className="font-semibold">{singleMessage?.email}</p>
          </div>
          {/* phone */}
          <div className="w-full space-y-2">
            <label htmlFor="phone" className="Label">
              {t("Phone")}
            </label>
            <p className="font-semibold">{singleMessage?.phone}</p>
          </div>
          {/* comments */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="comments" className="Label">
              {t("Comments")}
            </label>
            <p className="font-semibold">{singleMessage?.comments}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessgeDetails;
