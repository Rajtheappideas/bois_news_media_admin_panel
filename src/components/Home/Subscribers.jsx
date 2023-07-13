import React, { useEffect, useState } from "react";
import EditSubscriberDetails from "../Subscriber/EditSubscriberDetails";
import AddNewSubscirber from "../Subscriber/AddNewSubscirber";
import Search from "../Search";
import ReactPaginate from "react-paginate";
import { BiChevronsLeft, BiChevronsRight, BiPencil } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import AddMagazineDistribution from "../Subscriber/AddMagazineDistribution";

const Subscribers = () => {
  const [showEditSubscriberDetails, setShowEditSubscriberDetails] =
    useState(false);
  const [showAddNewSubscriber, setShowAddNewSubscriber] = useState(false);
  const [showMagazineDistrutionPopup, setShowMagazineDistrutionPopup] =
    useState(false);
  const [pageNumber, setPageNumber] = useState(0);

  const handleClosePopup = () => {
    setShowMagazineDistrutionPopup(false);
  };

  // pagination logic
  const usersPerPage = 8;
  // const pageVisited = pageNumber * usersPerPage;
  // let displayInvoices = [];
  // if (!loading) {
  //   displayInvoices =
  //     userInvoices.length > 0 &&
  //     userInvoices.slice(pageVisited, usersPerPage + pageVisited);
  // }
  // const pageCount = Math.ceil(userInvoices.length / usersPerPage);
  // const changePage = ({ selected }) => {
  //   setPageNumber(selected);
  // };

  useEffect(() => {
    if (showMagazineDistrutionPopup) {
      window.document.body.style.overflow = "hidden";
    } else {
      window.document.body.style.overflow = "unset";
    }
  }, [showMagazineDistrutionPopup]);

  return (
    <>
      {showMagazineDistrutionPopup && (
        <AddMagazineDistribution
          showMagazineDistrutionPopup={showMagazineDistrutionPopup}
          handleClosePopup={handleClosePopup}
        />
      )}
      {showEditSubscriberDetails && !showAddNewSubscriber && (
        <EditSubscriberDetails
          setShowEditSubscriberDetails={setShowEditSubscriberDetails}
        />
      )}
      {!showEditSubscriberDetails && showAddNewSubscriber && (
        <AddNewSubscirber
          setShowMagazineDistrutionPopup={setShowMagazineDistrutionPopup}
          setShowAddNewSubscriber={setShowAddNewSubscriber}
        />
      )}
      {!showEditSubscriberDetails && !showAddNewSubscriber && (
        <div className="lg:space-y-5 space-y-3 w-full">
          {/* search + buttons */}
          <div className="w-full flex items-center justify-between md:flex-row flex-col gap-4">
            <div className="lg:w-1/3 md:w-1/2 w-full">
              <Search />
            </div>
            <div className="flex items-center gap-3">
              <button
                className="blue_button"
                // onClick={() => showAddNewSubscriber(true)}
              >
                Import
              </button>
              <button
                className="gray_button"
                onClick={() => setShowAddNewSubscriber(true)}
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
                      className="rounded-lg inline-block mr-2 w-4 h-4"
                    />
                    <span>ID</span>
                  </th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Company</th>
                  <th className="p-4">Email</th>
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
                    <span className="font-bold text-left">4145</span>
                  </td>

                  <td className="text-left p-4 whitespace-nowrap">
                    Marilyn Workman
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">
                    Marilyn Workman
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">
                    Acme Corporation
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">
                    marilynworkman6@mai.com
                  </td>
                  <td className="flex items-center justify-start p-4">
                    <button
                      onClick={() => setShowEditSubscriberDetails(true)}
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
                    <span className="font-bold text-left">4145</span>
                  </td>

                  <td className="text-left p-4 whitespace-nowrap">
                    Marilyn Workman
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">
                    Marilyn Workman
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">
                    Acme Corporation
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">
                    marilynworkman6@mai.com
                  </td>
                  <td className="flex items-center justify-start p-4">
                    <button
                      onClick={() => setShowEditSubscriberDetails(true)}
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
                    <span className="font-bold text-left">4145</span>
                  </td>

                  <td className="text-left p-4 whitespace-nowrap">
                    Marilyn Workman
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">
                    Marilyn Workman
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">
                    Acme Corporation
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">
                    marilynworkman6@mai.com
                  </td>
                  <td className="flex items-center justify-start p-4">
                    <button
                      onClick={() => setShowEditSubscriberDetails(true)}
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
                    <span className="font-bold text-left">4145</span>
                  </td>

                  <td className="text-left p-4 whitespace-nowrap">
                    Marilyn Workman
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">
                    Marilyn Workman
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">
                    Acme Corporation
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">
                    marilynworkman6@mai.com
                  </td>
                  <td className="flex items-center justify-start p-4">
                    <button
                      onClick={() => setShowEditSubscriberDetails(true)}
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
                    <span className="font-bold text-left">4145</span>
                  </td>

                  <td className="text-left p-4 whitespace-nowrap">
                    Marilyn Workman
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">
                    Marilyn Workman
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">
                    Acme Corporation
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">
                    marilynworkman6@mai.com
                  </td>
                  <td className="flex items-center justify-start p-4">
                    <button
                      onClick={() => setShowEditSubscriberDetails(true)}
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
                    <span className="font-bold text-left">4145</span>
                  </td>

                  <td className="text-left p-4 whitespace-nowrap">
                    Marilyn Workman
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">
                    Marilyn Workman
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">
                    Acme Corporation
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">
                    marilynworkman6@mai.com
                  </td>
                  <td className="flex items-center justify-start p-4">
                    <button
                      onClick={() => setShowEditSubscriberDetails(true)}
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

export default Subscribers;
