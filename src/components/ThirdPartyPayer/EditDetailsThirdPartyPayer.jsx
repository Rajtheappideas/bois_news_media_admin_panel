import React from "react";

const EditDetailsThirdPartyPayer = ({ setShowEditDetailsPayer }) => {
  return (
    <div className="w-full lg:space-y-5 space-y-3">
      {/* title + buttons */}
      <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
        <p className="font-semibold text-left lg:text-xl text-lg">
          Third-party payer details
        </p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            className="gray_button"
            onClick={() => setShowEditDetailsPayer(false)}
          >
            Cancel
          </button>
          <button
            className="green_button"
            onClick={() => setShowEditDetailsPayer(false)}
          >
            Save
          </button>
          <button
            className="red_button"
            onClick={() => setShowEditDetailsPayer(false)}
          >
            Delete
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
              status
            </label>
            <select className="input_field">
              <option value="active">active</option>
              <option value="deactive">deactive</option>
            </select>
          </div>
          {/*account name */}
          <div className="w-full space-y-2">
            <label htmlFor="account_name" className="Label">
              Account name
            </label>
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/* account number */}
          <div className="w-full space-y-2">
            <label htmlFor="account_number" className="Label">
              account number
            </label>
            <input
              type="number"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/*email */}
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
            <input
              type="number"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
        </div>
        <hr className="my-1" />

        <hr className="my-1" />
        {/* billing address */}
        <p className="font-bold text-black md:text-xl">Billing Address</p>
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/* company  address  */}
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

export default EditDetailsThirdPartyPayer;
