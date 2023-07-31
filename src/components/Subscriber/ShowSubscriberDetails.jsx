import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleFindSubscriber } from "../../redux/SubscriberSlice";
import { useTranslation } from "react-i18next";

const ShowSubscriberDetails = ({ setShowSubscriberDetails }) => {
  const { singleSucriber } = useSelector((state) => state.root.subscribers);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const {
    fname,
    lname,
    company,
    phone,
    mobile,
    thirdPartyPayer,
    title,
    email,
    civility,
    shippingAddress: {
      address1,
      address2,
      address3,
      city,
      country,
      province,
      zipCode,
    },
    billingAddress,
    billingSupplement: {
      VATcode,
      VATnumber,
      accountingContact,
      accountingEmail,
      accountingPhone,
      activityDomain,
      clientCode,
      companyRegNum,
      companyWebsite,
      contactOrigin,
    },
  } = singleSucriber;

  return (
    <div className="w-full lg:space-y-5 space-y-3">
      {/* title + buttons */}
      <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
        <p className="font-semibold text-left lg:text-xl text-lg">
          {t("Subscriber Detail")}
        </p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            className="gray_button"
            onClick={() => {
              setShowSubscriberDetails(false);
              dispatch(handleFindSubscriber(""));
            }}
          >
            {t("Cancel")}
          </button>
        </div>
      </div>
      {/* main div */}
      <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
        <p className="font-bold text-black md:text-xl">
          {t("personal details")}
        </p>
        {/* personal details */}
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/* first name */}
          <div className="w-full space-y-2">
            <label htmlFor="fname" className="Label">
              {t("first name")}
            </label>

            <p className="font-semibold">{fname}</p>
          </div>
          {/* last  name */}
          <div className="w-full space-y-2">
            <label htmlFor="lastname" className="Label">
              {t("last name")}
            </label>

            <p className="font-semibold">{lname}</p>
          </div>
          {/* title */}
          <div className="w-full space-y-2">
            <label htmlFor="title" className="Label">
              {t("title")}
            </label>

            <p className="font-semibold">{title}</p>
          </div>
          {/* company */}
          <div className="w-full space-y-2">
            <label htmlFor="company" className="Label">
              {t("company")}
            </label>
            <p className="font-semibold">{company}</p>
          </div>
          {/* civility */}
          <div className="w-full space-y-2">
            <label htmlFor="civility" className="Label">
              {t("civility")}
            </label>
            <p className="font-semibold">{civility}</p>
          </div>
          {/* email */}
          <div className="w-full space-y-2">
            <label htmlFor="email" className="Label">
              {t("email")}
            </label>
            <p className="font-semibold">{email}</p>
          </div>
          {/* phone */}
          <div className="w-full space-y-2">
            <label htmlFor="phone" className="Label">
              {t("phone")}
            </label>

            <p className="font-semibold">{phone}</p>
          </div>
          {/*mobile phone */}
          <div className="w-full space-y-2">
            <label htmlFor="mobile" className="Label">
              {t("mobile phone")}
            </label>

            <p className="font-semibold">{mobile}</p>
          </div>
        </div>
        <hr className="my-1" />
        {/*shipping  address */}
        <p className="font-bold text-black md:text-xl">
          {t("Shipping Address")}
        </p>
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/*address 1 */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="address1" className="Label">
              {t("address")} 1
            </label>
            <p className="font-semibold">{address1}</p>
          </div>
          {/*address 2 */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="address2" className="Label">
              {t("address")} 2
            </label>
            <p className="font-semibold">{address2}</p>
          </div>
          {/*address 3 */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="address3" className="Label">
              {t("address")} 3
            </label>
            <p className="font-semibold">{address3}</p>
          </div>
          {/* postal code */}
          <div className="w-full space-y-2">
            <label htmlFor="postalcode" className="Label">
              {t("Postal code")}
            </label>
            <p className="font-semibold">{zipCode}</p>
          </div>
          {/* city */}
          <div className="w-full space-y-2">
            <label htmlFor="city" className="Label">
              {t("city")}
            </label>
            <p className="font-semibold">{city}</p>
          </div>
          {/* province */}
          <div className="w-full space-y-2">
            <label htmlFor="province" className="Label">
              {t("province")}
            </label>
            <p className="font-semibold">{province}</p>
          </div>
          {/* country */}
          <div className="w-full space-y-2">
            <label htmlFor="country" className="Label">
              {t("country")}
            </label>
            <p className="font-semibold">{country}</p>
          </div>
        </div>
        <hr className="my-1" />
        {/*billing address */}
        <p className="font-bold text-black md:text-xl">
          {t("Billing Address")}
        </p>
        <p className="font-bold text-black md:text-xl">
          {t("Billing Address")}
        </p>
        {/* billing addrss */}
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/*address 1 */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="address1" className="Label">
              {t("address")} 1
            </label>
            <p className="font-semibold">{billingAddress?.address1}</p>
          </div>
          {/*address 2 */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="address2" className="Label">
              {t("address")} 2
            </label>
            <p className="font-semibold">{billingAddress?.address2}</p>
          </div>
          {/*address 3 */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="address3" className="Label">
              {t("address")} 3
            </label>
            <p className="font-semibold">{billingAddress?.address3}</p>
          </div>
          {/* postal code */}
          <div className="w-full space-y-2">
            <label htmlFor="postalcode" className="Label">
              {t("Postal code")}
            </label>
            <p className="font-semibold">{billingAddress?.postalCode}</p>
          </div>
          {/* city */}
          <div className="w-full space-y-2">
            <label htmlFor="city" className="Label">
              {t("city")}
            </label>
            <p className="font-semibold">{billingAddress?.city}</p>
          </div>
          {/* province */}
          <div className="w-full space-y-2">
            <label htmlFor="province" className="Label">
              {t("province")}
            </label>
            <p className="font-semibold">{billingAddress?.province}</p>
          </div>
          {/* country */}
          <div className="w-full space-y-2">
            <label htmlFor="country" className="Label">
              {t("country")}
            </label>
            <p className="font-semibold">{billingAddress?.country}</p>
          </div>
        </div>
        <hr className="my-1" />
        {/* third payyer */}
        <p className="font-bold text-black md:text-xl">
          {t("Third-Party Payer")}
        </p>
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          <div className="w-full space-y-2">
            <label htmlFor="third_payer" className="Label">
              {t("select third-Party Payer")}
            </label>
            <p className="font-semibold">{thirdPartyPayer ?? "-"}</p>
          </div>
        </div>
        <hr className="my-1" />
        {/* billing supplement */}
        <p className="font-bold text-black md:text-xl">
          {t("Billing supplement")}
        </p>
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/* Accounting contact (name) */}
          <div className="w-full space-y-2">
            <label htmlFor="account_contact_name" className="Label">
              {t("Accounting contactname")}
            </label>
            <p className="font-semibold">{accountingContact ?? "-"}</p>
          </div>
          {/* Accounting email*/}
          <div className="w-full space-y-2">
            <label htmlFor="accounting_email" className="Label">
              {t("Accounting email")}
            </label>
            <p className="font-semibold">{accountingEmail ?? "-"}</p>
          </div>
          {/* Accounting phone */}
          <div className="w-full space-y-2">
            <label htmlFor="accounting_phone" className="Label">
              {t("Accounting phone")}{" "}
            </label>
            <p className="font-semibold">{accountingPhone ?? "-"}</p>
          </div>
          {/* VAT Number */}
          <div className="w-full space-y-2">
            <label htmlFor="VAT_number" className="Label">
              {t("VAT Number")}{" "}
            </label>
            <p className="font-semibold">{VATnumber ?? "-"}</p>
          </div>
          {/* VAT Code */}
          <div className="w-full space-y-2">
            <label htmlFor="VAT_code" className="Label">
              {t("VAT Code")}
            </label>
            <p className="font-semibold">{VATcode ?? "-"}</p>
          </div>
          {/* Client code */}
          <div className="w-full space-y-2">
            <label htmlFor="client_code" className="Label">
              {t("Client code")}
            </label>
            <p className="font-semibold">{clientCode ?? "-"}</p>
          </div>
          {/* Company registration number */}
          <div className="w-full space-y-2">
            <label htmlFor="company_registration_number" className="Label">
              {t("Company registration number")}
            </label>
            <p className="font-semibold">{companyRegNum ?? "-"}</p>
          </div>
          {/*Company website */}
          <div className="w-full space-y-2">
            <label htmlFor="company_website" className="Label">
              {t("Company website")}
            </label>
            <p className="font-semibold">{companyWebsite ?? "-"}</p>
          </div>
          {/* Activity domain */}
          <div className="w-full space-y-2">
            <label htmlFor="activity_domain" className="Label">
              {t("Activity domain")}{" "}
            </label>
            <p className="font-semibold">{activityDomain ?? "-"}</p>
          </div>
          {/* Contact origin */}
          <div className="w-full space-y-2">
            <label htmlFor="contact_origin" className="Label">
              {t("Contact origin")}{" "}
            </label>
            <p className="font-semibold">{contactOrigin ?? "-"}</p>
          </div>
        </div>
        <hr className="my-1" />
        {/* Magazine distribution */}
        <div className="font-bold text-black md:text-xl flex flex-wrap w-full flex-row items-center justify-between gap-2">
          <p>{t("Magazine distribution")}</p>
        </div>
        <div className="shadow-sm outline-none rounded-2xl md:mt-5 mt-3 py-3 px-4 bg-white overflow-x-scroll scrollbar">
          <table className="border-none outline-none w-full overflow-scroll">
            <thead className="w-full border-b border-gray-100 text-center">
              <tr>
                <th className="p-4 whitespace-nowrap">
                  <span>{t("Magazine")}</span>
                </th>
                <th className="p-4">{t("Sub state")}</th>
                <th className="p-4">{t("Prospect state")}</th>
                <th className="p-4">{t("Start date")}</th>
                <th className="p-4">{t("Renewal date")}</th>
              </tr>
            </thead>
            <tbody className="w-full">
              <tr className="border-b border-gray-200 w-full text-center">
                <td className="p-4 whitespace-nowrap">Agenceur</td>
                <td className="p-4 whitespace-nowrap">Paper</td>
                <td className="p-4 whitespace-nowrap">Digital </td>
                <td className="p-4 whitespace-nowrap">11 July, 2022 </td>
                <td className="p-4 whitespace-nowrap">10 July, 2023 </td>
              </tr>
              <tr className="border-b border-gray-200 w-full text-center">
                <td className="p-4 whitespace-nowrap">BOISmag</td>
                <td className="p-4 whitespace-nowrap">Paper</td>
                <td className="p-4 whitespace-nowrap">Digital </td>
                <td className="p-4 whitespace-nowrap">11 July, 2022 </td>
                <td className=" p-4 whitespace-nowrap">10 July, 2023 </td>
              </tr>
              <tr className="border-b border-gray-200 w-full text-center">
                <td className="p-4 whitespace-nowrap">Artisans et Bois</td>
                <td className=" p-4 whitespace-nowrap">Paper</td>
                <td className=" p-4 whitespace-nowrap">Digital </td>
                <td className=" p-4 whitespace-nowrap">11 July, 2022 </td>
                <td className=" p-4 whitespace-nowrap">10 July, 2023 </td>
              </tr>
              <tr className="border-b border-gray-200 w-full text-center">
                <td className="p-4 whitespace-nowrap">Toiture</td>
                <td className="p-4 whitespace-nowrap">Paper</td>
                <td className="p-4 whitespace-nowrap">Digital </td>
                <td className="p-4 whitespace-nowrap">11 July, 2022 </td>
                <td className="p-4 whitespace-nowrap">10 July, 2023 </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShowSubscriberDetails;
