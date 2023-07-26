import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleFindPartner } from "../../redux/PartnerSlice";

const ShowPartnerDetails = ({ setShowPartnerDetails }) => {
  const { editPartnerLoading, deletePartnerLoading, singlePartner } =
    useSelector((state) => state.root.partners);

  const {
    name,
    industry,
    website,
    email,
    mobile,
    officeNumber,
    address: {
      contactName,
      email: aemail,
      phone,
      companyAddress,
      city,
      country,
      zipCode,
    },
  } = singlePartner;

  const dispatch = useDispatch();

  return (
    <div className="w-full lg:space-y-5 space-y-3">
      {/* title + buttons */}
      <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
        <p className="font-semibold text-left lg:text-xl text-lg">
          Partner details
        </p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            className={`gray_button  `}
            onClick={() => {
              setShowPartnerDetails(false);
              dispatch(handleFindPartner(""));
            }}
          >
            Cancel
          </button>
        </div>
      </div>
      {/* main div */}
      <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
        <p className="font-bold text-black md:text-xl">Basic Info</p>
        {/* personal details */}
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/* name */}
          <div className="w-full space-y-2">
            <label htmlFor="name" className="Label">
              Name
            </label>
            <p className="font-semibold">{name}</p>
          </div>
          {/* industry */}
          <div className="w-full space-y-2">
            <label htmlFor="industry" className="Label">
              industry
            </label>
            <p className="font-semibold">{industry}</p>
          </div>
          {/* website */}
          <div className="w-full space-y-2">
            <label htmlFor="website" className="Label">
              website
            </label>
            <p className="font-semibold">{website}</p>
          </div>
        </div>
        <hr className="my-1" />
        {/* contact info */}
        <p className="font-bold text-black md:text-xl">Contact Info</p>
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/* email */}
          <div className="w-full space-y-2">
            <label htmlFor="email" className="Label">
              email
            </label>
            <p className="font-semibold">{email}</p>
          </div>
          {/* mobile number */}
          <div className="w-full space-y-2">
            <label htmlFor="mobile_number" className="Label">
              mobile number
            </label>
            <p className="font-semibold">{mobile}</p>
          </div>
          {/* office number */}
          <div className="w-full space-y-2">
            <label htmlFor="office_number" className="Label">
              office number
            </label>
            <p className="font-semibold">{officeNumber}</p>
          </div>
        </div>
        <hr className="my-1" />
        {/*address */}
        <p className="font-bold text-black md:text-xl">Address</p>
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/*contact name */}
          <div className="w-full space-y-2">
            <label htmlFor="contact_name" className="Label">
              Contact Name
            </label>
            <p className="font-semibold">{contactName}</p>
          </div>
          {/* email */}
          <div className="w-full space-y-2">
            <label htmlFor="email" className="Label">
              email
            </label>
            <p className="font-semibold">{aemail}</p>
          </div>
          {/* phone */}
          <div className="w-full space-y-2">
            <label htmlFor="phone" className="Label">
              phone
            </label>
            <p className="font-semibold">{phone}</p>
          </div>
          {/* company address */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="company_address" className="Label">
              company address
            </label>
            <p className="font-semibold">{companyAddress}</p>
          </div>
          {/* city */}
          <div className="w-full space-y-2">
            <label htmlFor="city" className="Label">
              city
            </label>
            <p className="font-semibold">{city}</p>
          </div>
          {/* country */}
          <div className="w-full space-y-2">
            <label htmlFor="country" className="Label">
              country
            </label>
            <p className="font-semibold">{country}</p>
          </div>
          {/* zipcode */}
          <div className="w-full space-y-2">
            <label htmlFor="zipcode" className="Label">
              zipcode
            </label>
            <p className="font-semibold">{zipCode}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowPartnerDetails;
