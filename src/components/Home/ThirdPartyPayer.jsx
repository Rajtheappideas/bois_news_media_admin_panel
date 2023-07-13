import React, { useState } from "react";
import Search from "../Search";
import ReactPaginate from "react-paginate";
import { BiChevronsLeft, BiChevronsRight, BiPencil } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import AddNewThirdPartyPayer from "../ThirdPartyPayer/AddNewThirdPartyPayer";
import EditDetailsThirdPartyPayer from "../ThirdPartyPayer/EditDetailsThirdPartyPayer";

const ThirdPartyPayer = () => {
  const [showAddnewPayer, setShowAddnewPayer] = useState(false);
  const [showEditDetailsPayer, setShowEditDetailsPayer] = useState(false);

  return (
    <>
      {showAddnewPayer && !showEditDetailsPayer && (
        <AddNewThirdPartyPayer setShowAddnewPayer={setShowAddnewPayer} />
      )}
      {!showAddnewPayer && showEditDetailsPayer && (
        <EditDetailsThirdPartyPayer
          setShowEditDetailsPayer={setShowEditDetailsPayer}
        />
      )}
      {!showAddnewPayer && !showEditDetailsPayer && (
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
              <button
                className="gray_button"
                onClick={() => setShowAddnewPayer(true)}
              >
                + Add new
              </button>
            </div>
          </div>
          {/* table */}
          <div className="shadow-sm outline-none rounded-2xl md:mt-5 mt-3 py-3 px-4 bg-white overflow-x-scroll scrollbar">
            <table className="border-none outline-none w-full overflow-scroll">
              <thead className="w-full border-b border-gray-100 text-left">
                <tr>
                  <th className="p-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded-lg inline-block mr-2 h-4 w-4"
                    />
                    <span>Account name</span>
                  </th>
                  <th className="p-4">Account number</th>
                  <th className="p-4">Postal code</th>
                  <th className="p-4">Billing country</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="w-full">
                <tr className="border-b border-gray-200 w-full text-left">
                  <td className="p-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded-lg inline-block mr-2 w-4 h-4"
                    />
                    Marilyn Workman
                  </td>

                  <td className="text-left p-4 whitespace-nowrap">
                    1248554124
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">523424</td>

                  <td className="text-left p-4">London</td>
                  <td className="text-left p-4">
                    <select
                      name="status"
                      className="border border-gray-200 rounded-md p-1 font-medium"
                    >
                      <option value="Active">Active</option>
                      <option value="DeActive">DeActive</option>
                    </select>
                  </td>
                  <td className="flex items-center justify-start p-4">
                    <button
                      onClick={() => setShowEditDetailsPayer(true)}
                      type="button"
                      className="hover:bg-gray-200 p-1 rounded-full h-10 w-10"
                    >
                      <BiPencil
                        color="gray"
                        size={30}
                        className="inline-block mr-1"
                      />
                    </button>
                    <button
                      type="button"
                      className="hover:bg-red-200 p-1 rounded-full h-10 w-10"
                    >
                      <RiDeleteBin6Line
                        color="red"
                        size={30}
                        className="inline-block"
                      />
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 w-full text-left">
                  <td className="p-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded-lg inline-block mr-2 w-4 h-4"
                    />
                    Marilyn Workman
                  </td>

                  <td className="text-left p-4 whitespace-nowrap">
                    1248554124
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">523424</td>

                  <td className="text-left p-4">London</td>
                  <td className="text-left p-4">
                    <select
                      name="status"
                      className="border border-gray-200 rounded-md p-1 font-medium"
                    >
                      <option value="Active">Active</option>
                      <option value="DeActive">DeActive</option>
                    </select>
                  </td>
                  <td className="flex items-center justify-start p-4">
                    <button
                      onClick={() => setShowEditDetailsPayer(true)}
                      type="button"
                      className="hover:bg-gray-200 p-1 rounded-full h-10 w-10"
                    >
                      <BiPencil
                        color="gray"
                        size={30}
                        className="inline-block mr-1"
                      />
                    </button>
                    <button
                      type="button"
                      className="hover:bg-red-200 p-1 rounded-full h-10 w-10"
                    >
                      <RiDeleteBin6Line
                        color="red"
                        size={30}
                        className="inline-block"
                      />
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 w-full text-left">
                  <td className="p-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded-lg inline-block mr-2 w-4 h-4"
                    />
                    Marilyn Workman
                  </td>

                  <td className="text-left p-4 whitespace-nowrap">
                    1248554124
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">523424</td>

                  <td className="text-left p-4">London</td>
                  <td className="text-left p-4">
                    <select
                      name="status"
                      className="border border-gray-200 rounded-md p-1 font-medium"
                    >
                      <option value="Active">Active</option>
                      <option value="DeActive">DeActive</option>
                    </select>
                  </td>
                  <td className="flex items-center justify-start p-4">
                    <button
                      onClick={() => setShowEditDetailsPayer(true)}
                      type="button"
                      className="hover:bg-gray-200 p-1 rounded-full h-10 w-10"
                    >
                      <BiPencil
                        color="gray"
                        size={30}
                        className="inline-block mr-1"
                      />
                    </button>
                    <button
                      type="button"
                      className="hover:bg-red-200 p-1 rounded-full h-10 w-10"
                    >
                      <RiDeleteBin6Line
                        color="red"
                        size={30}
                        className="inline-block"
                      />
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 w-full text-left">
                  <td className="p-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded-lg inline-block mr-2 w-4 h-4"
                    />
                    Marilyn Workman
                  </td>

                  <td className="text-left p-4 whitespace-nowrap">
                    1248554124
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">523424</td>

                  <td className="text-left p-4">London</td>
                  <td className="text-left p-4">
                    <select
                      name="status"
                      className="border border-gray-200 rounded-md p-1 font-medium"
                    >
                      <option value="Active">Active</option>
                      <option value="DeActive">DeActive</option>
                    </select>
                  </td>
                  <td className="flex items-center justify-start p-4">
                    <button
                      onClick={() => setShowEditDetailsPayer(true)}
                      type="button"
                      className="hover:bg-gray-200 p-1 rounded-full h-10 w-10"
                    >
                      <BiPencil
                        color="gray"
                        size={30}
                        className="inline-block mr-1"
                      />
                    </button>
                    <button
                      type="button"
                      className="hover:bg-red-200 p-1 rounded-full h-10 w-10"
                    >
                      <RiDeleteBin6Line
                        color="red"
                        size={30}
                        className="inline-block"
                      />
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 w-full text-left">
                  <td className="p-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded-lg inline-block mr-2 w-4 h-4"
                    />
                    Marilyn Workman
                  </td>

                  <td className="text-left p-4 whitespace-nowrap">
                    1248554124
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">523424</td>

                  <td className="text-left p-4">London</td>
                  <td className="text-left p-4">
                    <select
                      name="status"
                      className="border border-gray-200 rounded-md p-1 font-medium"
                    >
                      <option value="Active">Active</option>
                      <option value="DeActive">DeActive</option>
                    </select>
                  </td>
                  <td className="flex items-center justify-start p-4">
                    <button
                      onClick={() => setShowEditDetailsPayer(true)}
                      type="button"
                      className="hover:bg-gray-200 p-1 rounded-full h-10 w-10"
                    >
                      <BiPencil
                        color="gray"
                        size={30}
                        className="inline-block mr-1"
                      />
                    </button>
                    <button
                      type="button"
                      className="hover:bg-red-200 p-1 rounded-full h-10 w-10"
                    >
                      <RiDeleteBin6Line
                        color="red"
                        size={30}
                        className="inline-block"
                      />
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

export default ThirdPartyPayer;
