import React from "react";
import { handleFindUser } from "../../redux/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import BaseUrl from "../../BaseUrl";
import { useTranslation } from "react-i18next";

const ShowUsersDetailsOnly = ({ setShowUserDetailsOnly }) => {
  const { singleUser } = useSelector((state) => state.root.users);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const {
    name,
    email,
    phone,
    company,
    address,
    city,
    country,
    zipCode,
    profile,
    role,
  } = singleUser;

  return (
    <div className="w-full lg:space-y-5 space-y-3">
      {/* title + buttons */}
      <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
        <p className="font-semibold text-left lg:text-xl text-lg">Edit User</p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            className={`gray_button `}
            type="button"
            onClick={() => {
              setShowUserDetailsOnly(false);
              dispatch(handleFindUser(""));
            }}
          >
            {t("Cancel")}
          </button>
        </div>
      </div>
      {/* main div */}
      <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
        <div className="relative md:w-24 w-20 block">
          <img
            src={BaseUrl.concat(profile)}
            alt={name}
            className="rounded-full border object-contain object-center md:h-24 md:w-24 w-20 h-20"
          />
        </div>

        <p className="font-bold text-black md:text-xl capitalize">{t("personal details")}</p>
        {/* personal details */}
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/* name */}
          <div className="w-full space-y-2">
            <label htmlFor="name" className="Label">
              {t("User name")}
            </label>
            <p className="font-semibold">{name ?? "-"}</p>
          </div>
          {/* role */}
          <div className="w-full space-y-2">
            <label htmlFor="role" className="Label">
              {t("Role")}
            </label>
            <p className="font-semibold">{role ?? "-"}</p>
          </div>
          {/* company */}
          <div className="w-full space-y-2">
            <label htmlFor="company" className="Label">
              {t("company")}
            </label>
            <p className="font-semibold">{company ?? "-"}</p>
          </div>
          {/* email */}
          <div className="w-full space-y-2">
            <label htmlFor="email" className="Label">
              {t("email")}
            </label>
            <p className="font-semibold">{email ?? "-"}</p>
          </div>
          {/* phone */}
          <div className="w-full space-y-2">
            <label htmlFor="phone" className="Label">
              {t("phone")}
            </label>
            <p className="font-semibold">{phone ?? "-"}</p>
          </div>
        </div>
        <hr className="my-1" />
        {/* address */}
        <p className="font-bold text-black md:text-xl">{t("Address")}</p>
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/*company address */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="company_address" className="Label">
              {t("Company address")}
            </label>
            <p className="font-semibold">{address ?? "-"}</p>
          </div>
          {/* city */}
          <div className="w-full space-y-2">
            <label htmlFor="city" className="Label">
              {t("city")}
            </label>
            <p className="font-semibold">{city ?? "-"}</p>
          </div>
          {/* country */}
          <div className="w-full space-y-2">
            <label htmlFor="country" className="Label">
              {t("country")}
            </label>
            <p className="font-semibold">{country ?? "-"}</p>
          </div>
          {/* zipcode */}
          <div className="w-full space-y-2">
            <label htmlFor="zipCode" className="Label">
              {t("zipcode")}
            </label>
            <p className="font-semibold">{zipCode ?? "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowUsersDetailsOnly;
