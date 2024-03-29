import React, { useState, useEffect } from "react";
import Search from "../../components/Search";
import ReactPaginate from "react-paginate";
import { BiChevronsLeft, BiChevronsRight, BiPencil } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import AddNewPartner from "../../components/Partners/AddNewPartner";
import EditPartnerDetails from "./EditPartnerDetails";
import { useDispatch, useSelector } from "react-redux";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import {
  handleChangeDeleteID,
  handleDeletePARTNER,
  handleDeletePartner,
  handleFindPartner,
  handleGetAllPartners,
  handleGetPartnerById,
  handlerFilterPartners,
} from "../../redux/PartnerSlice";
import { toast } from "react-hot-toast";
import { BsEye } from "react-icons/bs";
import ShowPartnerDetails from "../../components/Partners/ShowPartnerDetails";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { handleLogout } from "../../redux/AuthSlice";
import { handleLogoutFromAllTabs } from "../../redux/GlobalStates";
import { useNavigate } from "react-router-dom";

const Partners = () => {
  const [showAddnewPartner, setShowAddnewPartner] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [showPartnerDetails, setShowPartnerDetails] = useState(false);

  const {
    partners,
    loading,
    addNewPartnerLoading,
    deletePartnerLoading,
    deletePartnerID,
    filterType,
    singlePartnerLoading,
  } = useSelector((state) => state.root.partners);

  const { token, role } = useSelector((state) => state.root.auth);
  const { fileterdData, isSidebarOpen } = useSelector(
    (state) => state.root.globalStates,
  );

  const { AbortControllerRef } = useAbortApiCall();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();

  // pagination logic
  const partnersPerPage = 8;
  const pageVisited = pageNumber * partnersPerPage;
  let displayPartners = [];
  if (!loading) {
    displayPartners =
      partners?.length > 0 && fileterdData.length === 0
        ? partners.slice(pageVisited, partnersPerPage + pageVisited)
        : fileterdData.slice(pageVisited, partnersPerPage + pageVisited);
  }
  const pageCount =
    fileterdData.length === 0
      ? Math.ceil(partners?.length / partnersPerPage)
      : Math.ceil(fileterdData?.length / partnersPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleDeletepartner = (id, name) => {
<<<<<<< HEAD
=======
    console.log(name);
>>>>>>> raj_appideas
    if (window.confirm(t("Are you sure?"))) {
      dispatch(handleChangeDeleteID(id));

      const response = dispatch(
        handleDeletePARTNER({ id, token, signal: AbortControllerRef }),
      );
      if (response) {
        response.then((res) => {
          if (res?.payload?.status === "success") {
            dispatch(handleDeletePartner(id));
            toast.success(` ${name} ${t("partner Deleted Successfully.")}`);
            navigate("/partners");
          } else if (res?.payload?.status === "error") {
            toast.error(res?.payload?.message);
          }
        });
      }
    }
  };

  const handleFetchSingleProspect = (id, userId) => {
    if (singlePartnerLoading) return;
    toast.loading("Fetching...", { duration: Infinity });
    const response = dispatch(
      handleGetPartnerById({ id, token, signal: AbortControllerRef }),
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.remove();
          navigate(`/partners/${userId}`, { state: { _id: id } });
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

  // fetch partners
  useEffect(() => {
    const response = dispatch(
      handleGetAllPartners({ token, signal: AbortControllerRef }),
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
      <Helmet title="Partners | Bois news media" />
      <div className="w-full flex items-start lg:gap-3 flex-row h-auto">
        <Sidebar />
        <section
          className={`h-full space-y-5 bg-[#FBFBFB] min-h-screen ${
            isSidebarOpen ? "xl:w-10/12 lg:w-4/5 w-full" : "lg:w-[90%] w-full"
          }`}
        >
          <Header />
          <div className="lg:p-5 p-3 ">
            {showAddnewPartner && !showPartnerDetails && (
              <AddNewPartner setShowAddnewPartner={setShowAddnewPartner} />
            )}

            {!showAddnewPartner && showPartnerDetails && (
              <ShowPartnerDetails
                setShowPartnerDetails={setShowPartnerDetails}
              />
            )}
            {!showAddnewPartner && !showPartnerDetails && (
              <div className="lg:space-y-5 space-y-3 w-full">
                {/* search + buttons */}
                <div className="w-full flex items-center justify-between md:flex-row flex-col gap-4">
                  <div className="lg:w-1/3 md:w-1/2 w-full">
                    <Search data={partners} />
                  </div>
                  <div>
                    <select
                      name="filter"
                      onChange={(e) =>
                        dispatch(handlerFilterPartners(e.target.value))
                      }
                      id="filter"
                      value={filterType}
                      className="filter_dropdown"
                    >
                      <option value="newest">{t("newest")}</option>
                      <option value="oldest">{t("oldest")}</option>
                    </select>
                    {role === "admin" && (
                      <button
                        className="gray_button"
                        onClick={() => setShowAddnewPartner(true)}
                      >
                        + {t("Add new")}
                      </button>
                    )}
                  </div>
                </div>
                {/* table */}
                <div className="shadow-sm outline-none rounded-2xl md:mt-5 mt-3 py-3 px-4 bg-white overflow-x-scroll scrollbar">
                  <table className="border-none outline-none w-full overflow-scroll">
                    <thead className="w-full border-b border-gray-100 text-center">
                      <tr>
                        <th className="p-4 whitespace-nowrap text-left pl-10">
                          {/* <input
                      type="checkbox"
                      className="rounded-lg inline-block mr-2 h-4 w-4"
                      id="partnerName"
                    /> */}
                          <label htmlFor="partnerName">
                            <span>{t("Partner name")}</span>
                          </label>
                        </th>
                        <th className="p-4 text-left">{t("email")}</th>
                        <th className="p-4 text-left">{t("Phone")}</th>
                        <th className="p-4 text-left">{t("city")}</th>
                        <th className="p-4">{t("Action")}</th>
                      </tr>
                    </thead>
                    <tbody className="w-full">
                      {loading ? (
                        <tr className="data_not_found_And_Loading">
                          <td colSpan="7">{t("Loading")}....</td>
                        </tr>
                      ) : partners?.length !== 0 && partners !== undefined ? (
                        displayPartners.map((partner) => (
                          <tr
                            key={partner?._id}
                            className="border-b last:border-none border-gray-200 w-full text-left pl-10 select-none"
                          >
                            <td className="pl-10 whitespace-nowrap">
                              <span className="font-bold text-center">
                                {partner?.fname} {partner?.lname}
                              </span>
                            </td>
                            <td className="text-left p-4 whitespace-nowrap">
                              {partner?.email}
                            </td>
                            <td className="text-left p-4 whitespace-nowrap">
                              {partner?.mobile ?? "-"}
                            </td>

                            <td className="text-left p-4 whitespace-nowrap">
                              {partner?.shippingAddress?.city !== ""
                                ? partner?.shippingAddress?.city
                                : "-"}
                            </td>
                            <td className="flex items-center justify-center p-4">
                              {role === "admin" || role === "editor" ? (
                                <button
                                  onClick={() => {
                                    handleFetchSingleProspect(
                                      partner?._id,
                                      partner?.userId,
                                    );
                                  }}
                                  disabled={deletePartnerLoading || loading}
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
                                    setShowPartnerDetails(true);
                                    dispatch(handleFindPartner(partner?._id));
                                  }}
                                  disabled={deletePartnerLoading || loading}
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
                                    handleDeletepartner(
                                      partner?._id,
<<<<<<< HEAD
                                      partner?.name,
=======
                                      partner?.fname.concat(partner?.lname),
>>>>>>> raj_appideas
                                    )
                                  }
                                  disabled={
                                    addNewPartnerLoading ||
                                    deletePartnerLoading ||
                                    loading
                                  }
                                >
                                  {deletePartnerLoading &&
                                  partner?._id === deletePartnerID ? (
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
                          <td colSpan="7">{t("No partners here")}.</td>
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
                      ? (pageNumber + 1) * partnersPerPage > partners?.length
                        ? partners?.length
                        : (pageNumber + 1) * partnersPerPage
                      : (pageNumber + 1) * partnersPerPage >
                          fileterdData?.length
                        ? fileterdData?.length
                        : (pageNumber + 1) * partnersPerPage}{" "}
                    {t("from")}{" "}
                    {fileterdData?.length === 0
                      ? partners?.length
                      : fileterdData.length}{" "}
                    {t("Partners")}
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

export default Partners;
