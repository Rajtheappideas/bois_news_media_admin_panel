import React from "react";
import { BiPrinter } from "react-icons/bi";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

const OrderDetails = ({ setshowOrderDetails }) => {
  return (
    <div className="w-full lg:space-y-5 space-y-3">
      {/* title + buttons */}
      <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
        <p
          onClick={() => setshowOrderDetails(false)}
          className="font-semibold text-left lg:text-xl text-lg cursor-pointer"
        >
          <MdOutlineKeyboardBackspace
            size={25}
            className="inline-block pb-1 mr-1"
          />
          Order Detail
        </p>
        <div className="flex flex-wrap gray_button items-center text-black justify-start md:gap-3 gap-1">
          <BiPrinter size={25} color="white" />
          <button className="">Print</button>
        </div>
      </div>
      {/* main div */}
      <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-2">
        <div>
          <p className="font-bold text-black md:text-4xl text-xl">Invoice</p>
          <p className="font-bold text-black md:text-lg">
            Status:<span className="text-green-500 ml-1">Delivered</span>
          </p>
        </div>
        {/*invoice details */}
        <div className="w-full grid xl:grid-cols-4 md:grid-cols-2 place-items-start items-start md:gap-5 gap-2">
          {/* date */}
          <div className="w-full md:space-y-2">
            <label htmlFor="date" className="Label">
              Date
            </label>
            <p className="text-textBlack font-medium md:text-lg">
              June 1, 2023 10:30 PM
            </p>
          </div>
          {/* Payment method */}
          <div className="w-full md:space-y-2">
            <label htmlFor="payment_method" className="Label">
              Payment method
            </label>
            <p className="text-textBlack font-medium md:text-lg">Cash</p>
          </div>
          {/* Contact */}
          <div className="w-full md:space-y-2">
            <label htmlFor="Contact" className="Label">
              Contact
            </label>
            <p className="text-textBlack font-medium md:text-lg">
              Marilyn Workman
            </p>
            <p className="text-textBlack font-medium md:text-lg">
              marilynworkman@email.com
            </p>
            <p className="text-textBlack font-medium md:text-lg">
              +123 456 7890
            </p>
          </div>
          {/* Address */}
          <div className="w-full md:space-y-2">
            <label htmlFor="Address" className="Label">
              Address
            </label>
            <p className="text-textBlack font-medium md:text-lg">
              gf 22vvvvggg, ghh, 3222
            </p>
          </div>
        </div>
        {/* table */}
        <div className="outline-none rounded-2xl md:mt-5 mt-3 py-3 px-4 bg-white overflow-x-scroll scrollbar">
          <table className="border-none outline-none w-full overflow-scroll">
            <thead className="w-full border-b border-gray-100 text-center">
              <tr className="bg-textColor/20">
                <th className="p-4 whitespace-nowrap">
                  <span>Sr no.</span>
                </th>
                <th className="p-4 whitespace-nowrap">Product title</th>
                <th className="p-4 whitespace-nowrap">Quantity</th>
                <th className="p-4 whitespace-nowrap">Item price</th>
                <th className="p-4 whitespace-nowrap">Amount</th>
              </tr>
            </thead>
            <tbody className="w-full">
              <tr className="border-b border-gray-200 w-full text-center">
                <td className="p-4 whitespace-nowrap">1</td>
                <td className="p-4 whitespace-nowrap">magazine</td>
                <td className="p-4 whitespace-nowrap">2</td>
                <td className="p-4 whitespace-nowrap">€ 95.00</td>
                <td className="p-4 whitespace-nowrap">€ 190.00</td>
              </tr>
              <tr className="border-b border-gray-200 w-full text-center">
                <td className="p-4 whitespace-nowrap">1</td>
                <td className="p-4 whitespace-nowrap">magazine</td>
                <td className="p-4 whitespace-nowrap">2</td>
                <td className="p-4 whitespace-nowrap">€ 95.00</td>
                <td className="p-4 whitespace-nowrap">€ 190.00</td>
              </tr>
              <tr className="border-b border-gray-200 w-full text-center">
                <td className="p-4 whitespace-nowrap">1</td>
                <td className="p-4 whitespace-nowrap">magazine</td>
                <td className="p-4 whitespace-nowrap">2</td>
                <td className="p-4 whitespace-nowrap">€ 95.00</td>
                <td className="p-4 whitespace-nowrap">€ 190.00</td>
              </tr>
              <tr className="border-b border-gray-200 w-full text-center">
                <td className="p-4 whitespace-nowrap">1</td>
                <td className="p-4 whitespace-nowrap">magazine</td>
                <td className="p-4 whitespace-nowrap">2</td>
                <td className="p-4 whitespace-nowrap">€ 95.00</td>
                <td className="p-4 whitespace-nowrap">€ 190.00</td>
              </tr>

              {/* <tr className="text-center text-2xl font-semibold py-2">
              <td colSpan="6">No Invoices here.</td>
            </tr> */}
            </tbody>
          </table>
        </div>
        <div className="border border-gray-200 w-full flex justify-between items-start rounded-md p-3">
          <div className="md:w-3/5 w-0" />
          <div className="md:w-2/5 w-full md:space-y-3 space-y-2">
            <div className="w-full flex items-center justify-between">
              <p className="w-1/2 font-semibold">SHIPPING COST</p>
              <p className="w-1/2 text-right">€ 20.00</p>
            </div>
            <div className="w-full flex items-center justify-between">
              <p className="w-1/2 font-semibold">DISCOUNT</p>
              <p className="w-1/2 text-right">€ 00.00</p>
            </div>
            <div className="w-full flex items-center justify-between">
              <p className="w-1/2 font-bold">Total Amount</p>
              <p className="w-1/2 text-right">€ 400.00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
