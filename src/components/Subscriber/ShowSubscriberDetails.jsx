import React from "react";

const ShowSubscriberDetails = ({ setShowSubscriberDetails }) => {
  return (
    <div className="w-full lg:space-y-5 space-y-3">
      {/* title + buttons */}
      <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
        <p className="font-semibold text-left lg:text-xl text-lg">
          Subscriber Detail
        </p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            className="gray_button"
            onClick={() => setShowSubscriberDetails(false)}
          >
            Cancel
          </button>
        </div>
      </div>
      {/* main div */}
      <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
        <p className="font-bold text-black md:text-xl">Personal Details</p>
        {/* personal details */}
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/* first name */}
          <div className="w-full space-y-2">
            <label htmlFor="firstname" className="Label">
              first name
            </label>
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/* last  name */}
          <div className="w-full space-y-2">
            <label htmlFor="lastname" className="Label">
              last name
            </label>
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/* title */}
          <div className="w-full space-y-2">
            <label htmlFor="title" className="Label">
              title
            </label>
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/* company */}
          <div className="w-full space-y-2">
            <label htmlFor="company" className="Label">
              company
            </label>
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/* civility */}
          <div className="w-full space-y-2">
            <label htmlFor="civility" className="Label">
              civility
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
          {/*mobile phone */}
          <div className="w-full space-y-2">
            <label htmlFor="mobilephone" className="Label">
              mobile phone
            </label>
            <input
              type="number"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
        </div>
        <hr className="my-1" />
        {/*shipping  address */}
        <p className="font-bold text-black md:text-xl">Shipping Address</p>
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/*address 1 */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="address1" className="Label">
              address 1
            </label>
            <textarea
              type="text"
              placeholder="Type here..."
              className="input_field min-h-[5rem] max-h-[15rem]"
            />
          </div>
          {/*address 2 */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="address2" className="Label">
              address 2
            </label>
            <textarea
              type="text"
              placeholder="Type here..."
              className="input_field min-h-[5rem] max-h-[15rem]"
            />
          </div>
          {/*address 3 */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="address3" className="Label">
              address 3
            </label>
            <textarea
              type="text"
              placeholder="Type here..."
              className="input_field min-h-[5rem] max-h-[15rem]"
            />
          </div>
          {/* postal code */}
          <div className="w-full space-y-2">
            <label htmlFor="postalcode" className="Label">
              Postal code
            </label>
            <input
              type="number"
              placeholder="Type here..."
              className="input_field"
              maxLength={6}
              minLength={6}
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
          {/* province */}
          <div className="w-full space-y-2">
            <label htmlFor="province" className="Label">
              province
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
        </div>
        <hr className="my-1" />
        {/*billing address */}
        <p className="font-bold text-black md:text-xl">Billing Address</p>
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/*address 1 */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="address1" className="Label">
              address 1
            </label>
            <textarea
              type="text"
              placeholder="Type here..."
              className="input_field min-h-[5rem] max-h-[15rem]"
            />
          </div>
          {/*address 2 */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="address2" className="Label">
              address 2
            </label>
            <textarea
              type="text"
              placeholder="Type here..."
              className="input_field min-h-[5rem] max-h-[15rem]"
            />
          </div>
          {/*address 3 */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="address3" className="Label">
              address 3
            </label>
            <textarea
              type="text"
              placeholder="Type here..."
              className="input_field min-h-[5rem] max-h-[15rem]"
            />
          </div>
          {/* postal code */}
          <div className="w-full space-y-2">
            <label htmlFor="postalcode" className="Label">
              Postal code
            </label>
            <input
              type="number"
              placeholder="Type here..."
              className="input_field"
              maxLength={6}
              minLength={6}
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
          {/* province */}
          <div className="w-full space-y-2">
            <label htmlFor="province" className="Label">
              province
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
        </div>
        <hr className="my-1" />
        {/* third payyer */}
        <p className="font-bold text-black md:text-xl">Third-Party Payer</p>
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          <div className="w-full space-y-2">
            <label htmlFor="third_payer" className="Label">
              Select Third-Party Payer
            </label>
            <select name="third_payer" className="input_field">
              <option value="payer1">Payer 1</option>
              <option value="payer2">Payer 2</option>
              <option value="payer3">Payer 3</option>
              <option value="payer4">Payer 4</option>
            </select>
          </div>
        </div>
        <hr className="my-1" />
        {/* billing supplement */}
        <p className="font-bold text-black md:text-xl">Billing supplement</p>
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/* Accounting contact (name) */}
          <div className="w-full space-y-2">
            <label htmlFor="account_contact_name" className="Label">
              Accounting contact (name)
            </label>
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/* Accounting email*/}
          <div className="w-full space-y-2">
            <label htmlFor="accounting_email" className="Label">
              Accounting email
            </label>
            <input
              type="email"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/* Accounting phone */}
          <div className="w-full space-y-2">
            <label htmlFor="accounting_phone" className="Label">
              Accounting phone{" "}
            </label>
            <input
              type="number"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/* VAT Number */}
          <div className="w-full space-y-2">
            <label htmlFor="VAT_number" className="Label">
              VAT Number{" "}
            </label>
            <input
              type="number"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/* VAT Code */}
          <div className="w-full space-y-2">
            <label htmlFor="VAT_code" className="Label">
              VAT Code
            </label>
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/* Client code */}
          <div className="w-full space-y-2">
            <label htmlFor="client_code" className="Label">
              Client code
            </label>
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/* Company registration number */}
          <div className="w-full space-y-2">
            <label htmlFor="company_registration_number" className="Label">
              Company registration number
            </label>
            <input
              type="number"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/*Company website */}
          <div className="w-full space-y-2">
            <label htmlFor="company_website" className="Label">
              Company website
            </label>
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/* Activity domain */}
          <div className="w-full space-y-2">
            <label htmlFor="activity_domain" className="Label">
              Activity domain{" "}
            </label>
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/* Contact origin */}
          <div className="w-full space-y-2">
            <label htmlFor="contact_origin" className="Label">
              Contact origin{" "}
            </label>
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
        </div>
        <hr className="my-1" />
        {/* Magazine distribution */}
        <div className="font-bold text-black md:text-xl flex flex-wrap w-full flex-row items-center justify-between gap-2">
          <p>Magazine distribution</p>
        </div>
        <div className="shadow-sm outline-none rounded-2xl md:mt-5 mt-3 py-3 px-4 bg-white overflow-x-scroll scrollbar">
          <table className="border-none outline-none w-full overflow-scroll">
            <thead className="w-full border-b border-gray-100 text-center">
              <tr>
                <th className="p-4 whitespace-nowrap">
                  <span>Magazine</span>
                </th>
                <th className="p-4">Sub state</th>
                <th className="p-4">Prospect state</th>
                <th className="p-4">Start date</th>
                <th className="p-4">Renewal date</th>
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
