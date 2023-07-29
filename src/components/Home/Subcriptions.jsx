import React, { useState } from "react";
import Search from "../Search";
import ReactPaginate from "react-paginate";
import { BiChevronsLeft, BiChevronsRight, BiPencil } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import AddNewSubscriptions from "../Subscriptions/AddNewSubscriptions";
import EditDetailsSubscription from "../Subscriptions/EditDetailsSubscription";
import ShowSubscriberDetails from "../Subscriber/ShowSubscriberDetails";
import {
  handleChangeDeleteID,
  handleDeleteSubscription,
  handleDeletesUBSCRIPTION,
  handleFindSubscription,
} from "../../redux/SubscriptionSlice";
import { useDispatch, useSelector } from "react-redux";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import { toast } from "react-hot-toast";
import { BsEye } from "react-icons/bs";

const Subcriptions = () => {
  const [showAddnewSubscription, setShowAddnewSubscription] = useState(false);
  const [showEditSubscription, setShowEditSubscription] = useState(false);
  const [showSubscriptionDetails, setShowSubscriptionDetails] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);

  const {
    subscriptions,
    loading,
    addNewSubscriptionLoading,
    deleteSubscriptionLoading,
    deleteSubscriptionID,
  } = useSelector((state) => state.root.subscriptions);

  const { token, role } = useSelector((state) => state.root.auth);
  const { fileterdData } = useSelector((state) => state.root.globalStates);

  const { AbortControllerRef } = useAbortApiCall();

  const dispatch = useDispatch();

  // pagination logic
  const subscriptionPerPage = 8;
  const pageVisited = pageNumber * subscriptionPerPage;
  let displaySubscriptions = [];
  if (!loading) {
    displaySubscriptions =
      subscriptions?.length > 0 && fileterdData.length === 0
        ? subscriptions.slice(pageVisited, subscriptionPerPage + pageVisited)
        : fileterdData.slice(pageVisited, subscriptionPerPage + pageVisited);
  }
  const pageCount =
    fileterdData.length === 0
      ? Math.ceil(subscriptions?.length / subscriptionPerPage)
      : Math.ceil(fileterdData?.length / subscriptionPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleDeletesubscription = (id, name) => {
    if (window.confirm("Are you sure?")) {
      dispatch(handleChangeDeleteID(id));

      const response = dispatch(
        handleDeletesUBSCRIPTION({ id, token, signal: AbortControllerRef })
      );
      if (response) {
        response.then((res) => {
          if (res?.payload?.status === "success") {
            dispatch(handleDeleteSubscription(id));
            toast.success(`${name} subscription Deleted Successfully.`);
          } else if (res?.payload?.status === "error") {
            toast.error(res?.payload?.message);
          }
        });
      }
    }
  };

  return (
    <>
      {showAddnewSubscription &&
        !showEditSubscription &&
        !showSubscriptionDetails && (
          <AddNewSubscriptions
            setShowAddnewSubscription={setShowAddnewSubscription}
          />
        )}
      {!showAddnewSubscription &&
        showEditSubscription &&
        !showSubscriptionDetails && (
          <EditDetailsSubscription
            setShowEditSubscription={setShowEditSubscription}
          />
        )}
      {!showAddnewSubscription &&
        !showEditSubscription &&
        showSubscriptionDetails && (
          <ShowSubscriberDetails
            setShowEditSubscription={setShowEditSubscription}
          />
        )}
      {!showAddnewSubscription &&
        !showEditSubscription &&
        !showSubscriptionDetails && (
          <div className="lg:space-y-5 space-y-3 w-full">
            {/* search + buttons */}
            <div className="w-full flex items-center justify-between md:flex-row flex-col gap-4">
              <div className="lg:w-1/3 md:w-1/2 w-full">
                <Search data={subscriptions} />
              </div>
              <div>
                <select name="filter" id="filter" className="filter_dropdown">
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
                <button
                  className="gray_button"
                  onClick={() => setShowAddnewSubscription(true)}
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
                    <th className="p-4 md:pl-28 whitespace-nowrap">
                      {/* <input
                        type="checkbox"
                        className="rounded-lg inline-block mr-2 h-4 w-4"
                      /> */}
                      <span>ID</span>
                    </th>
                    <th className="p-4 md:pl-28">Subscriptions name</th>
                    <th className="p-4 md:pr-20">Price</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="w-full">
                  {loading ? (
                    <tr className="data_not_found_And_Loading">
                      <td colSpan="7">Loading....</td>
                    </tr>
                  ) : subscriptions?.length !== 0 &&
                    subscriptions !== undefined ? (
                    displaySubscriptions.map((subscription) => (
                      <tr
                        key={subscription?._id}
                        className="border-b border-gray-200 w-full text-left pl-10 select-none"
                      >
                        <td className="p-4 md:pl-28 whitespace-nowrap">
                          {/* <input
                            type="checkbox"
                            id={subscription?._id}
                            className="rounded-lg inline-block mr-2 w-4 h-4"
                          /> */}
                          <label htmlFor={subscription?._id}>
                            <span className="font-bold text-center cursor-pointer">
                              {subscription?.subscriptionId}
                            </span>
                          </label>
                        </td>
                        <td className="text-left p-4 md:pl-28 whitespace-nowrap">
                          {subscription?.title}
                        </td>
                        <td className="text-left p-4 md:pr-20 whitespace-nowrap">
                          $ {subscription?.price}
                        </td>

                        <td className="text-left p-4 whitespace-nowrap">
                          {subscription?.status ?? "-"}
                        </td>
                        <td className="flex items-center justify-center p-4">
                          {role === "admin" || role === "editor" ? (
                            <button
                              onClick={() => {
                                setShowEditSubscription(true);
                                dispatch(
                                  handleFindSubscription(subscription?._id)
                                );
                              }}
                              disabled={deleteSubscriptionLoading || loading}
                              type="button"
                              className="hover:bg-gray-200 p-1 rounded-full h-10 w-10"
                            >
                              <BiPencil
                                color="gray"
                                size={30}
                                className="inline-block mr-1"
                              />
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setShowSubscriptionDetails(true);
                                dispatch(
                                  handleFindSubscription(subscription?._id)
                                );
                              }}
                              disabled={deleteSubscriptionLoading || loading}
                              type="button"
                              className="hover:bg-gray-200 p-1 rounded-full h-10 w-10"
                            >
                              <BsEye
                                color="gray"
                                size={30}
                                className="inline-block mr-1"
                              />
                            </button>
                          )}

                          {role === "admin" && (
                            <button
                              type="button"
                              className="hover:bg-red-200 p-1 rounded-full h-10 w-10"
                              onClick={() =>
                                handleDeletesubscription(
                                  subscription?._id,
                                  subscription?.title
                                )
                              }
                              disabled={
                                addNewSubscriptionLoading ||
                                deleteSubscriptionLoading ||
                                loading
                              }
                            >
                              {deleteSubscriptionLoading &&
                              subscription?._id === deleteSubscriptionID ? (
                                "..."
                              ) : (
                                <RiDeleteBin6Line
                                  color="red"
                                  size={30}
                                  className="inline-block"
                                />
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="data_not_found_And_Loading">
                      <td colSpan="7">No subscriptions here.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* pagination */}
            <div className="flex items-center justify-between py-5">
              <p className="font-medium md:text-base text-sm text-textBlack">
                Showing{" "}
                {fileterdData.length === 0
                  ? (pageNumber + 1) * subscriptionPerPage >
                    subscriptions?.length
                    ? subscriptions?.length
                    : (pageNumber + 1) * subscriptionPerPage
                  : (pageNumber + 1) * subscriptionPerPage >
                    fileterdData?.length
                  ? fileterdData?.length
                  : (pageNumber + 1) * subscriptionPerPage}{" "}
                from{" "}
                {fileterdData?.length === 0
                  ? subscriptions?.length
                  : fileterdData.length}{" "}
                Subscriptions
              </p>
              <ReactPaginate
                onPageChange={changePage}
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
                pageCount={pageCount}
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

export default Subcriptions;
