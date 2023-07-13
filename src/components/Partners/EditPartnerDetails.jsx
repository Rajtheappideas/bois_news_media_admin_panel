import React from "react";

const EditPartnerDetails = ({ setShowEditDetailsPartner }) => {
  return (
    <div className="w-full lg:space-y-5 space-y-3">
      {/* title + buttons */}
      <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
        <p className="font-semibold text-left lg:text-xl text-lg">
          Partner details
        </p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            className="gray_button"
            onClick={() => setShowEditDetailsPartner(false)}
          >
            Cancel
          </button>
          <button
            className="green_button"
            onClick={() => setShowEditDetailsPartner(false)}
          >
            Save
          </button>
          <button
            className="red_button"
            onClick={() => setShowEditDetailsPartner(false)}
          >
            Delete
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
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/* industry */}
          <div className="w-full space-y-2">
            <label htmlFor="industry" className="Label">
              industry
            </label>
            <select className="input_field">
              <option value="option1">option1</option>
              <option value="option2">option2</option>
              <option value="option3">option3</option>
            </select>
          </div>
          {/* website */}
          <div className="w-full space-y-2">
            <label htmlFor="website" className="Label">
              website
            </label>
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
            />
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
            <input
              type="email"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/* mobile number */}
          <div className="w-full space-y-2">
            <label htmlFor="mobile_number" className="Label">
              mobile number
            </label>
            <select className="input_field">
              <option value="option1">option1</option>
              <option value="option2">option2</option>
              <option value="option3">option3</option>
            </select>
          </div>
          {/* office number */}
          <div className="w-full space-y-2">
            <label htmlFor="office_number" className="Label">
              office number
            </label>
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
            />
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
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/* email */}
          <div className="w-full space-y-2">
            <label htmlFor="email" className="Label">
              email
            </label>
            <input
              type="email"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/* phone */}
          <div className="w-full space-y-2">
            <label htmlFor="phone" className="Label">
              phone
            </label>
            <input
              type="number"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/* company address */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="company_address" className="Label">
              company address
            </label>
            <textarea
              placeholder="Type here..."
              className="input_field min-h-[5rem] max-h-[15rem]"
            />
          </div>
          {/* city */}
          <div className="w-full space-y-2">
            <label htmlFor="city" className="Label">
              city
            </label>
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/* country */}
          <div className="w-full space-y-2">
            <label htmlFor="country" className="Label">
              country
            </label>
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/* zipcode */}
          <div className="w-full space-y-2">
            <label htmlFor="zipcode" className="Label">
              zipcode
            </label>
            <input
              type="number"
              placeholder="Type here..."
              className="input_field"
              maxLength={6}
              minLength={6}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPartnerDetails;
