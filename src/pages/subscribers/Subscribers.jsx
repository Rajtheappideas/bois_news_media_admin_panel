import React, { useEffect, useState } from "react";
import AddNewSubscirber from "../../components/Subscriber/AddNewSubscirber";
import Search from "../../components/Search";
import ReactPaginate from "react-paginate";
import { BiChevronsLeft, BiChevronsRight, BiPencil } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import AddMagazineSubscription from "../../components/Subscriber/AddMagazineSubscription";
import { useDispatch, useSelector } from "react-redux";
import { BsEye } from "react-icons/bs";
import ShowSubscriberDetails from "../../components/Subscriber/ShowSubscriberDetails";
import {
  handleDeleteSUBSCRIBER,
  handleDeleteSubscriber,
  handleFindSubscriber,
  handleChangeDeleteID,
  handleGetAllSubscribers,
  handleGetSubscriberById,
} from "../../redux/SubscriberSlice";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { handleLogout } from "../../redux/AuthSlice";
import { handleLogoutFromAllTabs } from "../../redux/GlobalStates";
import { useNavigate } from "react-router-dom";

const Subscribers = () => {
  const [showAddNewSubscriber, setShowAddNewSubscriber] = useState(false);
  const [showSubscriberDetails, setShowSubscriberDetails] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);

  const {
    subscribers,
    loading,
    deleteLoading,
    addNewSubscriberLoading,
    deleteSubscriberID,
    showMagazineDistributionPopup,
    singleSucriberLoading,
  } = useSelector((state) => state.root.subscribers);

  const { token, role } = useSelector((state) => state.root.auth);
  const { fileterdData, isSidebarOpen } = useSelector(
    (state) => state.root.globalStates,
  );

  const { AbortControllerRef } = useAbortApiCall();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();

  // pagination logic
  const subscribersPerPage = 8;
  const pageVisited = pageNumber * subscribersPerPage;
  let displaySubscibers = [];
  if (!loading) {
    displaySubscibers =
      subscribers.length > 0 && fileterdData.length === 0
        ? subscribers.slice(pageVisited, subscribersPerPage + pageVisited)
        : fileterdData.slice(pageVisited, subscribersPerPage + pageVisited);
  }
  const pageCount =
    fileterdData.length === 0
      ? Math.ceil(subscribers.length / subscribersPerPage)
      : Math.ceil(fileterdData.length / subscribersPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  useEffect(() => {
    if (showMagazineDistributionPopup) {
      window.document.body.style.overflow = "hidden";
    } else {
      window.document.body.style.overflow = "unset";
    }
  }, [showMagazineDistributionPopup]);

  const handleDeletesubscriber = (id, name) => {
    if (window.confirm(t("Are you sure?"))) {
      dispatch(handleChangeDeleteID(id));
      const response = dispatch(
        handleDeleteSUBSCRIBER({ id, token, signal: AbortControllerRef }),
      );
      if (response) {
        response.then((res) => {
          if (res?.payload?.status === "success") {
            dispatch(handleDeleteSubscriber(id));
            toast.success(`${name} ${t("subscriber Deleted Successfully.")}`);
          } else if (res?.payload?.status === "error") {
            toast.error(res?.payload?.message);
          }
        });
      }
    }
  };

  const handleFetchSingleSubscriber = (id, subId) => {
    if (singleSucriberLoading) return;
    toast.loading("Fetching...", { duration: Infinity });
    const response = dispatch(
      handleGetSubscriberById({ id, token, signal: AbortControllerRef }),
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.remove();
          navigate(`/subscribers/${subId}`, { state: { _id: id } });
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

  // fetch subscribers
  useEffect(() => {
    const response = dispatch(
      handleGetAllSubscribers({ token, signal: AbortControllerRef }),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet title="Subscribers | Bois news media" />

      <div className="w-full flex items-start lg:gap-3 flex-row h-auto">
        <Sidebar />
        <section
          className={`h-full space-y-5 bg-[#FBFBFB] min-h-screen ${isSidebarOpen ? "xl:w-10/12 lg:w-4/5 w-full" : "lg:w-[90%] w-full"
            }`}
        >
          <Header />
          <div className="lg:p-5 p-3 ">
            {showAddNewSubscriber && !showSubscriberDetails && (
              <AddNewSubscirber
                setShowAddNewSubscriber={setShowAddNewSubscriber}
              />
            )}
            {!showAddNewSubscriber && showSubscriberDetails && (
              <ShowSubscriberDetails
                setShowSubscriberDetails={setShowSubscriberDetails}
              />
            )}

            {!showAddNewSubscriber && !showSubscriberDetails && (
              <div className="lg:space-y-5 space-y-3 w-full">
                {/* search + buttons */}
                <div className="w-full flex items-center justify-between md:flex-row flex-col gap-4">
                  <div className="lg:w-1/3 md:w-1/2 w-full">
                    <Search data={subscribers} />
                  </div>
                  {role === "admin" && (
                    <div className="flex items-center gap-3">
                      {/* <button className="blue_button">{t("Import")}</button> */}
                      <button
                        className="gray_button"
                        onClick={() => setShowAddNewSubscriber(true)}
                      >
                        + {t("Add new")}
                      </button>
                    </div>
                  )}
                </div>
                {/* table */}
                <div className="shadow-sm outline-none rounded-2xl md:mt-5 mt-3 py-3 px-4 bg-white overflow-x-scroll scrollbar">
                  <table className="border-none outline-none w-full overflow-scroll">
                    <thead className="w-full border-b border-gray-100 text-center select-none">
                      <tr>
                        <th className="pl-10 whitespace-nowrap text-left">
                          <label htmlFor="id">
                            <span>ID</span>
                          </label>
                        </th>
                        <th className="p-4 pl-10 text-left">{t("Title")}</th>
                        <th className="p-4 pl-10 text-left">{t("Name")}</th>
                        <th className="p-4 pl-10 text-left">{t("company")}</th>
                        <th className="p-4 pl-10 text-left">{t("Email")}</th>
                        <th className="p-4">{t("Action")}</th>
                      </tr>
                    </thead>
                    <tbody className="w-full">
                      {loading ? (
                        <tr className="data_not_found_And_Loading">
                          <td colSpan="7">{t("Loading")}....</td>
                        </tr>
                      ) : subscribers.length !== 0 &&
                        subscribers !== undefined ? (
                        displaySubscibers.map((subscriber) => (
                          <tr
                            key={subscriber?._id}
                            className="border-b last:border-none border-gray-200 w-full text-left pl-10 select-none"
                          >
                            <td className="pl-10 whitespace-nowrap">
                              <label htmlFor={subscriber?.userId}>
                                <span className="font-bold text-center">
                                  {subscriber?.userId}
                                </span>
                              </label>
                            </td>

                            <td className="text-left p-4 pl-10 whitespace-nowrap">
                              {subscriber?.title !== ""
                                ? subscriber?.title
                                : "-"}
                            </td>
                            <td className="text-left p-4 pl-10 whitespace-nowrap">
                              {subscriber?.fname}&nbsp;{subscriber?.lname}
                            </td>
                            <td className="text-left p-4 pl-10 whitespace-nowrap">
                              {subscriber?.company !== ""
                                ? subscriber?.company
                                : "-"}
                            </td>
                            <td className="text-left p-4 pl-10 whitespace-nowrap">
                              {subscriber?.email}
                            </td>
                            <td className="flex items-center justify-center p-4">
                              {role === "admin" || role === "editor" ? (
                                <button
                                  onClick={() => {
                                    // setShowEditSubscriberDetails(true);
                                    // dispatch(
                                    //   handleFindSubscriber(subscriber?._id)
                                    // );
                                    handleFetchSingleSubscriber(
                                      subscriber?._id,
                                      subscriber?.userId,
                                    );
                                  }}
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
                                    setShowSubscriberDetails(true);
                                    dispatch(
                                      handleFindSubscriber(subscriber?._id),
                                    );
                                  }}
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
                                    handleDeletesubscriber(
                                      subscriber?._id,
                                      subscriber?.fname.concat(
                                        subscriber?.lname,
                                      ),
                                    )
                                  }
                                  disabled={
                                    addNewSubscriberLoading ||
                                    deleteLoading ||
                                    loading
                                  }
                                >
                                  {deleteLoading &&
                                    subscriber?._id === deleteSubscriberID ? (
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
                          <td colSpan="7">{t("No Subscribers here")}.</td>
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
                      ? (pageNumber + 1) * subscribersPerPage >
                        subscribers?.length
                        ? subscribers?.length
                        : (pageNumber + 1) * subscribersPerPage
                      : (pageNumber + 1) * subscribersPerPage >
                        fileterdData?.length
                        ? fileterdData?.length
                        : (pageNumber + 1) * subscribersPerPage}{" "}
                    {t("from")}{" "}
                    {fileterdData?.length === 0
                      ? subscribers?.length
                      : fileterdData.length}{" "}
                    {t("Subscribers")}
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

export default Subscribers;
