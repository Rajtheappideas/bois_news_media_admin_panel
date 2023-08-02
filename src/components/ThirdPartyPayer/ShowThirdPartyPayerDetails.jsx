import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleFindPayer } from "../../redux/ThirdPartyPayerSlice";
import { useTranslation } from "react-i18next";

const ShowThirdPartyPayerDetails = ({ setShowPayerDetails }) => {
  const { deletePayerLoading, editPayerLoading, singlePayer } = useSelector(
    (state) => state.root.thirdPartyPayers
  );
  const {
    _id,
    status,
    accountName,
    email,
    mobile,
    accountNumber,
    billingAddress: { companyAddress, city, country, zipCode },
  } = singlePayer;

  const dispatch = useDispatch();

  const { t } = useTranslation();

  return (
    <div className="w-full lg:space-y-5 space-y-3">
      {/* title + buttons */}
      <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
        <p className="font-semibold text-left lg:text-xl text-lg">
          {t("Third-party payer details")}
        </p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            className={`gray_button  `}
            onClick={() => {
              setShowPayerDetails(false);
              dispatch(handleFindPayer(""));
            }}
            type="button"
          >
            {t("Cancel")}
          </button>
        </div>
      </div>
      {/* main div */}
      <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
        <p className="font-bold text-black md:text-xl">Personal details</p>
        {/* personal details */}
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/* status */}
          <div className="w-full space-y-2">
            <label htmlFor="status" className="Label">
              {t("status")}
            </label>
            <p className="font-semibold">{status}</p>
          </div>
          {/*account name */}
          <div className="w-full space-y-2">
            <label htmlFor="account_name" className="Label">
              {t("Account name")}
            </label>
            <p className="font-semibold">{accountName}</p>
          </div>
          {/* account number */}
          <div className="w-full space-y-2">
            <label htmlFor="accountNumber" className="Label">
              {t("account number")}
            </label>
            <p className="font-semibold">{accountNumber}</p>
          </div>
          {/*email */}
          <div className="w-full space-y-2">
            <label htmlFor="email" className="Label">
              {t("email")}
            </label>
            <p className="font-semibold">{email}</p>
          </div>
          {/* mobile number */}
          <div className="w-full space-y-2">
            <label htmlFor="mobile_number" className="Label">
              {t("mobile number")}
            </label>
            <p className="font-semibold">{mobile}</p>
          </div>
        </div>

        <hr className="my-1" />
        {/* billing address */}
        <p className="font-bold text-black md:text-xl">
          {t("Billing Address")}
        </p>
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/* company  address  */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="company_address" className="Label">
            {t("company address")}
            </label>
            <p className="font-semibold">{companyAddress}</p>
          </div>
          {/* city */}
          <div className="w-full space-y-2">
            <label htmlFor="city" className="Label">
            {t("city")}
            </label>
            <p className="font-semibold">{city}</p>
          </div>
          {/* country */}
          <div className="w-full space-y-2">
            <label htmlFor="country" className="Label">
            {t("country")}
            </label>
            <p className="font-semibold">{country}</p>
          </div>
          {/* zipcode */}
          <div className="w-full space-y-2">
            <label htmlFor="zipcode" className="Label">
            {t("zipcode")}
            </label>
            <p className="font-semibold">{zipCode}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowThirdPartyPayerDetails;
