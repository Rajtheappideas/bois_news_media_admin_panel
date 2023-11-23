import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleFindProspect } from "../../redux/ProspectSlice";
import { useTranslation } from "react-i18next";

const ShowProspectDetails = ({ setShowProspectDetails }) => {
  const { singleProspect } = useSelector((state) => state.root.prospects);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const {
    name,
    industry,
    website,
    email,
    mobile,
    officeNumber,
    billingAddress,
  } = singleProspect;

  return (
    <div className="w-full lg:space-y-5 space-y-3">
      {/* title + buttons */}
      <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
        <p className="font-semibold text-left lg:text-xl text-lg">
          {t("Prospect details")}
        </p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            className={`gray_button`}
            onClick={() => {
              setShowProspectDetails(false);
              dispatch(handleFindProspect(""));
            }}
          >
            {t("Cancel")}
          </button>
        </div>
      </div>
      {/* main div */}
      <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
        <p className="font-bold text-black md:text-xl">{t("Prospect Info")}</p>
        {/* personal details */}
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/* name */}
          <div className="w-full space-y-2">
            <label htmlFor="name" className="Label">
              {t("Name")}
            </label>
            <p className="font-semibold">{name ?? "-"}</p>
          </div>
          {/* industry */}
          <div className="w-full space-y-2">
            <label htmlFor="industry" className="Label">
              {t("industry")}
            </label>
            <p className="font-semibold">{industry ?? "-"}</p>
          </div>
          {/* website */}
          <div className="w-full space-y-2">
            <label htmlFor="website" className="Label">
              {t("website")}
            </label>
            <p className="font-semibold">{website ?? "-"}</p>
          </div>
        </div>
        <hr className="my-1" />
        {/* contact info */}
        <p className="font-bold text-black md:text-xl">{t("Contact Info")}</p>
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/* email */}
          <div className="w-full space-y-2">
            <label htmlFor="email" className="Label">
              {t("email")}
            </label>
            <p className="font-semibold">{email ?? "-"}</p>
          </div>
          {/* mobile number */}
          <div className="w-full space-y-2">
            <label htmlFor="mobile_number" className="Label">
              {t("mobile number")}
            </label>
            <p className="font-semibold">{mobile ?? "-"}</p>
          </div>
          {/* office number */}
          <div className="w-full space-y-2">
            <label htmlFor="office_number" className="Label">
              {t("office number")}
            </label>
            <p className="font-semibold">{officeNumber ?? "-"}</p>
          </div>
        </div>
        <hr className="my-1" />
        {/*billing address */}
        <p className="font-bold text-black md:text-xl">
          {t("Billing Address")}
        </p>{" "}
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/*contact name */}
          <div className="w-full space-y-2">
            <label htmlFor="contact_name" className="Label">
              {t("Contact Name")}
            </label>
            <p className="font-semibold">
              {billingAddress?.contactName !== ""
                ? billingAddress?.contactName
                : "-"}
            </p>
          </div>
          {/* email */}
          <div className="w-full space-y-2">
            <label htmlFor="email" className="Label">
              {t("email")}
            </label>
            <p className="font-semibold">
              {billingAddress?.email !== "" ? billingAddress?.email : "-"}
            </p>
          </div>
          {/* phone */}
          <div className="w-full space-y-2">
            <label htmlFor="phone" className="Label">
              {t("phone")}
            </label>
            <p className="font-semibold">
              {billingAddress?.phone !== "" ? billingAddress?.phone : "-"}
            </p>
          </div>
          {/* company address */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="company_address" className="Label">
              {t("company address")}
            </label>
            <p className="font-semibold">
              {billingAddress?.address !== "" ? billingAddress?.address : "-"}
            </p>
          </div>
          {/* city */}
          <div className="w-full space-y-2">
            <label htmlFor="city" className="Label">
              {t("city")}
            </label>
            <p className="font-semibold">
              {billingAddress?.city !== "" ? billingAddress?.city : "-"}
            </p>
          </div>
          {/* country */}
          <div className="w-full space-y-2">
            <label htmlFor="country" className="Label">
              {t("country")}
            </label>
            <p className="font-semibold">
              {billingAddress?.country !== "" ? billingAddress?.country : "-"}
            </p>
          </div>
          {/* zipcode */}
          <div className="w-full space-y-2">
            <label htmlFor="zipcode" className="Label">
              {t("zipcode")}
            </label>
            <p className="font-semibold">
              {billingAddress?.zipCode !== "" ? billingAddress?.zipCode : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowProspectDetails;
