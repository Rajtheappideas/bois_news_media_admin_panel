import moment from "moment";
import React, { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Search from "../components/Search";
import { BiChevronsLeft, BiChevronsRight } from "react-icons/bi";
import ReactPaginate from "react-paginate";
import {
  handleGetMessages,
  handleLogoutFromAllTabs,
  handlerFilterMessages,
} from "../redux/GlobalStates";
import { BsEye } from "react-icons/bs";
import MessgeDetails from "../components/MessgeDetails";
import { Helmet } from "react-helmet";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import useAbortApiCall from "../hooks/useAbortApiCall";
import { handleLogout } from "../redux/AuthSlice";
import toast from "react-hot-toast";

const MessagesList = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const [showMessageDetails, setShowMessageDetails] = useState(false);
  const [singleMessage, setSingleMessage] = useState(null);

  const { messages, messageLoading, fileterdData, isSidebarOpen } = useSelector(
    (state) => state.root.globalStates,
  );
  const { token } = useSelector((state) => state.root.auth);

  const dispatch = useDispatch();

  const { t } = useTranslation();
  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  // pagination logic
  const messagePerPage = 8;
  const pageVisited = pageNumber * messagePerPage;
  let displayMessages = [];
  if (!messageLoading) {
    displayMessages =
      messages?.length > 0 && fileterdData.length === 0
        ? messages.slice(pageVisited, messagePerPage + pageVisited)
        : fileterdData.slice(pageVisited, messagePerPage + pageVisited);
  }
  const pageCount =
    fileterdData.length === 0
      ? Math.ceil(messages?.length / messagePerPage)
      : Math.ceil(fileterdData?.length / messagePerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleFindSingleMessge = (id) => {
    if (messages.length > 0) {
      const findmsg = messages.find((message) => message._id === id);
      setSingleMessage(findmsg);
      setShowMessageDetails(true);
    }
  };

  useEffect(() => {
    if (fileterdData && fileterdData.length > 0) {
      setPageNumber(0);
    }
  }, [fileterdData]);

  useEffect(() => {
    const response = dispatch(
      handleGetMessages({ token, signal: AbortControllerRef }),
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
    return () => abortApiCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet title="Messages | Bois News Media" />
      <div className="w-full flex items-start lg:gap-3 flex-row h-auto">
        <Sidebar />
        <section
          className={`h-full space-y-5 bg-[#FBFBFB] min-h-screen ${
            isSidebarOpen ? "xl:w-10/12 lg:w-4/5 w-full" : "lg:w-[90%] w-full"
          }`}
        >
          <Header />
          <div className="lg:p-5 p-3 ">
            {showMessageDetails ? (
              <MessgeDetails
                setShowMessageDetails={setShowMessageDetails}
                singleMessage={singleMessage}
              />
            ) : (
              <div className="lg:space-y-5 select-none space-y-3 w-full">
                {/* search + buttons */}
                <div className="w-full flex items-center justify-between md:flex-row flex-col gap-4">
                  <div className="lg:w-1/3 md:w-1/2 w-full">
                    <Search data={messages} />
                  </div>
                </div>
                {/* table */}
                <div className="shadow-sm outline-none rounded-2xl md:mt-5 mt-3 py-3 px-4 bg-white overflow-x-scroll scrollbar">
                  <table className="border-none outline-none w-full overflow-scroll">
                    <thead className="w-full border-b border-gray-100 text-center select-none">
                      <tr>
                        <th className="p-4 whitespace-nowrap text-center">
                          <label htmlFor="id" className=" cursor-pointer">
                            <span>Sr no.</span>
                          </label>
                        </th>
                        <th className="p-4 text-left">{t("Name")}</th>
                        <th className="p-4 text-left">{t("Email")}</th>
                        <th className="p-4 text-left">{t("Phone")}</th>
                        <th className="p-4 text-left">{t("Comment")}</th>
                        <th className="p-4 text-left">{t("Date")}</th>
                        <th className="p-4 text-left">{t("Action")}</th>
                      </tr>
                    </thead>
                    <tbody className="w-full">
                      {messageLoading ? (
                        <tr className="data_not_found_And_Loading">
                          <td colSpan="7">{t("Loading")}....</td>
                        </tr>
                      ) : messages.length !== 0 && messages !== undefined ? (
                        displayMessages.map((message, i) => (
                          <tr
                            key={message?._id}
                            className="border-b last:border-none border-gray-200 w-full text-center"
                          >
                            <td className="p-4 whitespace-nowrap">
                              <span className="font-bold text-center">
                                {message?.index}
                              </span>
                            </td>

                            <td className="text-left p-4 whitespace-nowrap">
                              {message?.name}
                            </td>
                            <td className="text-left p-4 whitespace-nowrap">
                              {message?.email}
                            </td>
                            <td className="text-left p-4 whitespace-nowrap">
                              {message?.phone}
                            </td>
                            <td className="text-left p-4 max-w-[5rem] truncate">
                              {message?.comments}
                            </td>
                            <td className="text-left p-4 whitespace-nowrap">
                              {moment(message?.date).format("LLL")}
                            </td>
                            <td className="text-left p-4 ">
                              <button
                                onClick={() => {
                                  handleFindSingleMessge(message?._id);
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
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="data_not_found_And_Loading">
                          <td colSpan="7">{t("No messages here")}.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* pagination */}
                <div className="flex items-center justify-between py-5">
                  <p className="font-medium capitalize md:text-base text-sm text-textBlack">
                    {t("Showing")}{" "}
                    {fileterdData.length === 0
                      ? (pageNumber + 1) * messagePerPage > messages?.length
                        ? messages?.length
                        : (pageNumber + 1) * messagePerPage
                      : (pageNumber + 1) * messagePerPage > fileterdData?.length
                        ? fileterdData?.length
                        : (pageNumber + 1) * messagePerPage}{" "}
                    {t("from")}{" "}
                    {fileterdData?.length === 0
                      ? messages?.length
                      : fileterdData.length}{" "}
                    {t("messages")}
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

export default MessagesList;
