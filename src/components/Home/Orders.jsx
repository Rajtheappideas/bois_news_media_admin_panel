import React, { useState } from "react";
import Search from "../Search";
import ReactPaginate from "react-paginate";
import { BiChevronsLeft, BiChevronsRight, BiPencil } from "react-icons/bi";
import { BiPrinter } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import OrderDetails from "../Orders/OrderDetails";

const Orders = () => {
  const [showOrderDetails, setshowOrderDetails] = useState(false);

  return (
    <>
      {showOrderDetails ? (
        <OrderDetails setshowOrderDetails={setshowOrderDetails} />
      ) : (
        <div className="lg:space-y-5 space-y-3 w-full">
          {/* search + buttons */}
          <div className="w-full flex items-center justify-between md:flex-row flex-col gap-4">
            <div className="lg:w-1/3 md:w-1/2 w-full">
              <Search />
            </div>
            <div>
              <select name="filter" id="filter" className="filter_dropdown">
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
          {/* table */}
          <div className="shadow-sm outline-none rounded-2xl md:mt-5 mt-3 py-3 px-4 bg-white overflow-x-scroll scrollbar">
            <table className="border-none outline-none w-full overflow-scroll">
              <thead className="w-full border-b border-gray-100 text-left">
                <tr>
                  <th className="p-4 whitespace-nowrap">
                    <span>Invoice no</span>
                  </th>
                  <th className="p-4">Order date & time</th>
                  <th className="p-4">Customer name</th>
                  <th className="p-4">Pay method</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="w-full">
                <tr className="border-b border-gray-200 w-full text-left">
                  <td className="p-4 whitespace-nowrap">423455</td>

                  <td className="text-left p-4 whitespace-nowrap">
                    June 1, 2023 10:30 PM
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">
                    Marilyn Workman
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">Cash</td>
                  <td className="text-left p-4 whitespace-nowrap">€ 95.00</td>
                  <td className="text-left p-4">
                    <select
                      name="status"
                      className="border border-gray-200 rounded-md p-1 font-medium"
                    >
                      <option value="Delivered">Delivered</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </td>
                  <td className="flex items-center justify-start p-4">
                    <button
                      type="button"
                      className="hover:bg-gray-200 p-1 rounded-full h-10 w-10"
                    >
                      <BiPrinter
                        color="gray"
                        size={30}
                        className="inline-block mr-1"
                      />
                    </button>
                    <button
                      onClick={() => setshowOrderDetails(true)}
                      type="button"
                      className="hover:bg-green-200 p-1 rounded-full h-10 w-10"
                    >
                      <BsEye color="gray" size={30} className="inline-block" />
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 w-full text-left">
                  <td className="p-4 whitespace-nowrap">423455</td>

                  <td className="text-left p-4 whitespace-nowrap">
                    June 1, 2023 10:30 PM
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">
                    Marilyn Workman
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">Cash</td>
                  <td className="text-left p-4 whitespace-nowrap">€ 95.00</td>
                  <td className="text-left p-4">
                    <select
                      name="status"
                      className="border border-gray-200 rounded-md p-1 font-medium"
                    >
                      <option value="Delivered">Delivered</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </td>
                  <td className="flex items-center justify-start p-4">
                    <button
                      type="button"
                      className="hover:bg-gray-200 p-1 rounded-full h-10 w-10"
                    >
                      <BiPrinter
                        color="gray"
                        size={30}
                        className="inline-block mr-1"
                      />
                    </button>
                    <button
                      onClick={() => setshowOrderDetails(true)}
                      type="button"
                      className="hover:bg-green-200 p-1 rounded-full h-10 w-10"
                    >
                      <BsEye color="gray" size={30} className="inline-block" />
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 w-full text-left">
                  <td className="p-4 whitespace-nowrap">423455</td>

                  <td className="text-left p-4 whitespace-nowrap">
                    June 1, 2023 10:30 PM
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">
                    Marilyn Workman
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">Cash</td>
                  <td className="text-left p-4 whitespace-nowrap">€ 95.00</td>
                  <td className="text-left p-4">
                    <select
                      name="status"
                      className="border border-gray-200 rounded-md p-1 font-medium"
                    >
                      <option value="Delivered">Delivered</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </td>
                  <td className="flex items-center justify-start p-4">
                    <button
                      type="button"
                      className="hover:bg-gray-200 p-1 rounded-full h-10 w-10"
                    >
                      <BiPrinter
                        color="gray"
                        size={30}
                        className="inline-block mr-1"
                      />
                    </button>
                    <button
                      onClick={() => setshowOrderDetails(true)}
                      type="button"
                      className="hover:bg-green-200 p-1 rounded-full h-10 w-10"
                    >
                      <BsEye color="gray" size={30} className="inline-block" />
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 w-full text-left">
                  <td className="p-4 whitespace-nowrap">423455</td>

                  <td className="text-left p-4 whitespace-nowrap">
                    June 1, 2023 10:30 PM
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">
                    Marilyn Workman
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">Cash</td>
                  <td className="text-left p-4 whitespace-nowrap">€ 95.00</td>
                  <td className="text-left p-4">
                    <select
                      name="status"
                      className="border border-gray-200 rounded-md p-1 font-medium"
                    >
                      <option value="Delivered">Delivered</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </td>
                  <td className="flex items-center justify-start p-4">
                    <button
                      type="button"
                      className="hover:bg-gray-200 p-1 rounded-full h-10 w-10"
                    >
                      <BiPrinter
                        color="gray"
                        size={30}
                        className="inline-block mr-1"
                      />
                    </button>
                    <button
                      onClick={() => setshowOrderDetails(true)}
                      type="button"
                      className="hover:bg-green-200 p-1 rounded-full h-10 w-10"
                    >
                      <BsEye color="gray" size={30} className="inline-block" />
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 w-full text-left">
                  <td className="p-4 whitespace-nowrap">423455</td>

                  <td className="text-left p-4 whitespace-nowrap">
                    June 1, 2023 10:30 PM
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">
                    Marilyn Workman
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">Cash</td>
                  <td className="text-left p-4 whitespace-nowrap">€ 95.00</td>
                  <td className="text-left p-4">
                    <select
                      name="status"
                      className="border border-gray-200 rounded-md p-1 font-medium"
                    >
                      <option value="Delivered">Delivered</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </td>
                  <td className="flex items-center justify-start p-4">
                    <button
                      type="button"
                      className="hover:bg-gray-200 p-1 rounded-full h-10 w-10"
                    >
                      <BiPrinter
                        color="gray"
                        size={30}
                        className="inline-block mr-1"
                      />
                    </button>
                    <button
                      onClick={() => setshowOrderDetails(true)}
                      type="button"
                      className="hover:bg-green-200 p-1 rounded-full h-10 w-10"
                    >
                      <BsEye color="gray" size={30} className="inline-block" />
                    </button>
                  </td>
                </tr>

                {/* <tr className="text-center text-2xl font-semibold py-2">
    <td colSpan="6">No Invoices here.</td>
  </tr> */}
              </tbody>
            </table>
          </div>
          {/* pagination */}
          <div className="flex items-center justify-between py-5">
            <p className="font-medium md:text-base text-sm text-textBlack">
              {/* Showing{" "}
{(pageNumber + 1) * invoicePerPage > userInvoices.length
  ? userInvoices.length
  : (pageNumber + 1) * invoicePerPage}{" "}
from {userInvoices.length} data */}
              Showing 8 from 8
            </p>
            <ReactPaginate
              // onPageChange={changePage}
              previousLabel={
                <BiChevronsLeft
                  className="text-blue-500 text-2xl"
                  role="button"
                />
              }
              nextLabel={
                <BiChevronsRight
                  className="text-blue-500 text-2xl"
                  role="button"
                />
              }
              pageClassName="px-2"
              breakLabel="..."
              breakClassName="page-item"
              breakLinkClassName="page-link"
              pageRangeDisplayed={1}
              marginPagesDisplayed={1}
              pageCount={2}
              containerClassName="pagination"
              activeClassName="py-2 px-4 bg-primaryBlue cursor-pointer text-white rounded-lg text-center"
              className="shadow-sm p-2 font-semibold text-textColor rounded-lg flex items-center md:gap-x-2 gap-x-1"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Orders;
