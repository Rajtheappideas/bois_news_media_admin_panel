import React, { useState, useEffect } from "react";
import Search from "../../components/Search";
import ReactPaginate from "react-paginate";
import { BiChevronsLeft, BiChevronsRight, BiPencil } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import AddNewSubscriptions from "../../components/Subscriptions/AddNewSubscriptions";
import EditDetailsSubscription from "./EditDetailsSubscription";
import ShowSubscriberDetails from "../../components/Subscriber/ShowSubscriberDetails";
import {
  handleChangeDeleteID,
  handleDeleteSubscription,
  handleDeletesUBSCRIPTION,
  handleFindSubscription,
  handleGetAllSubscription,
  handleGetSubscriptionById,
  handlerFilterSubscription,
} from "../../redux/SubscriptionSlice";
import { useDispatch, useSelector } from "react-redux";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import { toast } from "react-hot-toast";
import { BsEye } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import ShowSubscriptionDetails from "../../components/Subscriptions/ShowSubscriptionDetails";
import { Helmet } from "react-helmet";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { handleLogout } from "../../redux/AuthSlice";
import { handleLogoutFromAllTabs } from "../../redux/GlobalStates";
import { useNavigate } from "react-router-dom";

const Subcriptions = () => {
  const [showAddnewSubscription, setShowAddnewSubscription] = useState(false);
  const [showSubscriptionDetails, setShowSubscriptionDetails] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);

  const {
    subscriptions,
    loading,
    addNewSubscriptionLoading,
    deleteSubscriptionLoading,
    deleteSubscriptionID,
    filterType,singleSubscriptionLoading
  } = useSelector((state) => state.root.subscriptions);

  const { token, role } = useSelector((state) => state.root.auth);
  const { fileterdData, isSidebarOpen } = useSelector(
    (state) => state.root.globalStates
  );

  const { AbortControllerRef } = useAbortApiCall();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();

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
    if (window.confirm(t("Are you sure?"))) {
      dispatch(handleChangeDeleteID(id));

      const response = dispatch(
        handleDeletesUBSCRIPTION({ id, token, signal: AbortControllerRef })
      );
      if (response) {
        response.then((res) => {
          if (res?.payload?.status === "success") {
            dispatch(handleDeleteSubscription(id));
            toast.success(`${name} ${t("subscription Deleted Successfully")}.`);
          } else if (res?.payload?.status === "error") {
            toast.error(res?.payload?.message);
          }
        });
      }
    }
  };

  const handleFetchSingleSubscription = (id,subscriptionId) => {
    if (singleSubscriptionLoading) return;
    toast.loading("Fetching...", { duration: Infinity });
    const response = dispatch(
      handleGetSubscriptionById({ id, token, signal: AbortControllerRef })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.remove();
          navigate(`/subscriptions/${subscriptionId}`, { state: { _id: id } });
        } else {
          toast.remove();
        }
      });
    }
  };

  useEffect(() => {
    if (fileterdData && fileterdData.length > 0) {
      setPageNumber(0);
    }
  }, [fileterdData]);

  // fetch subscriptions
  useEffect(() => {
    const response = dispatch(
      handleGetAllSubscription({ token, signal: AbortControllerRef })
    );
    if (response) {
      response.then((res) => {
        if (
          res?.payload?.status === "fail" &&
          (res?.payload?.message === "Please provide authentication token." ||
            res?.payload?.message === "Invalid token.")
        ) {
          dispatch(handleLogout());
          dispatch(handleLogoutFromAllTabs());
          toast.error("Please login again");
        }
      });
    }
  }, []);

  return (
    <>
      <Helmet title="Subscriptions | Bois News Media" />
      <div className="w-full flex items-start lg:gap-3 flex-row h-auto">
        <Sidebar />
        <section
          className={`h-full space-y-5 bg-[#FBFBFB] min-h-screen ${
            isSidebarOpen ? "xl:w-10/12 lg:w-4/5 w-full" : "lg:w-[90%] w-full"
          }`}
        >
          <Header />
          <div className="lg:p-5 p-3 ">
            {showAddnewSubscription && !showSubscriptionDetails && (
              <AddNewSubscriptions
                setShowAddnewSubscription={setShowAddnewSubscription}
              />
            )}

            {!showAddnewSubscription && showSubscriptionDetails && (
              <ShowSubscriptionDetails
                setShowSubscriptionDetails={setShowSubscriptionDetails}
              />
            )}
            {!showAddnewSubscription && !showSubscriptionDetails && (
              <div className="lg:space-y-5 space-y-3 w-full">
                {/* search + buttons */}
                <div className="w-full flex items-center justify-between md:flex-row flex-col gap-4">
                  <div className="lg:w-1/3 md:w-1/2 w-full">
                    <Search data={subscriptions} />
                  </div>
                  <div>
                    <select
                      name="filter"
                      value={filterType}
                      id="filter"
                      className="filter_dropdown"
                      onChange={(e) =>
                        dispatch(handlerFilterSubscription(e.target.value))
                      }
                    >
                      <option value="newest">{t("newest")}</option>
                      <option value="oldest">{t("oldest")}</option>
                    </select>
                    {role === "admin" && (
                      <button
                        className="gray_button"
                        onClick={() => setShowAddnewSubscription(true)}
                      >
                        + {t("Add new")}
                      </button>
                    )}
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
                          <span>{t("ID")}</span>
                        </th>
                        <th className="p-4 md:pl-28">
                          {t("Subscriptions name")}
                        </th>
                        <th className="p-4 md:pr-20">{t("Price")}</th>
                        <th className="p-4">{t("Status")}</th>
                        <th className="p-4 text-center">{t("Action")}</th>
                      </tr>
                    </thead>
                    <tbody className="w-full">
                      {loading ? (
                        <tr className="data_not_found_And_Loading">
                          <td colSpan="7">{t("Loading")}....</td>
                        </tr>
                      ) : subscriptions?.length !== 0 &&
                        subscriptions !== undefined ? (
                        displaySubscriptions.map((subscription) => (
                          <tr
                            key={subscription?._id}
                            className="border-b last:border-none border-gray-200 w-full text-left pl-10 select-none"
                          >
                            <td className="p-4 md:pl-28 whitespace-nowrap">
                              <label htmlFor={subscription?._id}>
                                <span className="font-bold text-center">
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
                                    handleFetchSingleSubscription(
                                      subscription?._id,
                                      subscription?.subscriptionId
                                    );
                                  }}
                                  disabled={
                                    deleteSubscriptionLoading || loading
                                  }
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
                                  disabled={
                                    deleteSubscriptionLoading || loading
                                  }
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
                          <td colSpan="7">{t("No subscriptions here")}.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* pagination */}
                <div className="flex items-center justify-between py-5">
                  <p className="font-medium md:text-base text-sm text-textBlack">
                    {t("Showing")}{" "}
                    {fileterdData.length === 0
                      ? (pageNumber + 1) * subscriptionPerPage >
                        subscriptions?.length
                        ? subscriptions?.length
                        : (pageNumber + 1) * subscriptionPerPage
                      : (pageNumber + 1) * subscriptionPerPage >
                        fileterdData?.length
                      ? fileterdData?.length
                      : (pageNumber + 1) * subscriptionPerPage}{" "}
                    {t("from")}{" "}
                    {fileterdData?.length === 0
                      ? subscriptions?.length
                      : fileterdData.length}{" "}
                    {t("Subscriptions")}
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
                    forcePage={pageNumber}
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Subcriptions;
