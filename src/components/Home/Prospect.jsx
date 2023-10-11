import React, { useState, useEffect } from "react";
import Search from "../Search";
import ReactPaginate from "react-paginate";
import { BiChevronsLeft, BiChevronsRight, BiPencil } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import AddNewProspect from "../Prospect/AddNewProspect";
import EditProspectDetails from "../Prospect/EditProspectDetails";
import { useDispatch, useSelector } from "react-redux";
import {
  handleChangeDeleteID,
  handleDeletePROSPECT,
  handleDeleteProspect,
  handleFindProspect,
  handlerFilterProspects,
} from "../../redux/ProspectSlice";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import { toast } from "react-hot-toast";
import ShowProspectDetails from "../Prospect/ShowProspectDetails";
import { useTranslation } from "react-i18next";

const Prospect = () => {
  const [showAddNewProspect, setShowAddNewProspect] = useState(false);
  const [showEditdetailsProspect, setShowEditdetailsProspect] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [showProspectDetails, setShowProspectDetails] = useState(false);

  const {
    prospects,
    loading,
    addNewProspectLoading,
    deleteProspectLoading,
    deleteProspectID,
    filterType,
  } = useSelector((state) => state.root.prospects);

  const { token, role } = useSelector((state) => state.root.auth);
  const { fileterdData } = useSelector((state) => state.root.globalStates);

  const { AbortControllerRef } = useAbortApiCall();

  const dispatch = useDispatch();

  const { t } = useTranslation();

  // pagination logic
  const prospectsPerPage = 8;
  const pageVisited = pageNumber * prospectsPerPage;
  let displayProspects = [];
  if (!loading) {
    displayProspects =
      prospects?.length > 0 && fileterdData.length === 0
        ? prospects.slice(pageVisited, prospectsPerPage + pageVisited)
        : fileterdData.slice(pageVisited, prospectsPerPage + pageVisited);
  }
  const pageCount =
    fileterdData.length === 0
      ? Math.ceil(prospects?.length / prospectsPerPage)
      : Math.ceil(fileterdData?.length / prospectsPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleDeleteprospect = (id, name) => {
    if (window.confirm(t("Are you sure?"))) {
      dispatch(handleChangeDeleteID(id));

      const response = dispatch(
        handleDeletePROSPECT({ id, token, signal: AbortControllerRef })
      );
      if (response) {
        response.then((res) => {
          if (res?.payload?.status === "success") {
            dispatch(handleDeleteProspect(id));
            toast.success(`${name} ${t("prospect Deleted Successfully")}.`);
          } else if (res?.payload?.status === "error") {
            toast.error(res?.payload?.message);
          }
        });
      }
    }
  };

  useEffect(() => {
    if (fileterdData && fileterdData.length > 0) {
      setPageNumber(0);
    }
  }, [fileterdData]);

  return (
    <>
      {showAddNewProspect &&
        !showEditdetailsProspect &&
        !showProspectDetails && (
          <AddNewProspect setShowAddNewProspect={setShowAddNewProspect} />
        )}
      {!showAddNewProspect &&
        showEditdetailsProspect &&
        !showProspectDetails && (
          <EditProspectDetails
            setShowEditdetailsProspect={setShowEditdetailsProspect}
          />
        )}
      {!showAddNewProspect &&
        !showEditdetailsProspect &&
        showProspectDetails && (
          <ShowProspectDetails
            setShowProspectDetails={setShowProspectDetails}
          />
        )}
      {!showAddNewProspect &&
        !showEditdetailsProspect &&
        !showProspectDetails && (
          <div className="lg:space-y-5 space-y-3 w-full">
            {/* search + buttons */}
            <div className="w-full flex items-center justify-between md:flex-row flex-col gap-4">
              <div className="lg:w-1/3 md:w-1/2 w-full">
                <Search data={prospects} />
              </div>
              <div>
                <select
                  onChange={(e) => {
                    dispatch(handlerFilterProspects(e.target.value));
                  }}
                  name="filter"
                  id="filter"
                  value={filterType}
                  className="filter_dropdown"
                >
                  <option value="newest">{t("newest")}</option>
                  <option value="oldest">{t("oldest")}</option>
                </select>
                <button
                  className="gray_button"
                  onClick={() => setShowAddNewProspect(true)}
                >
                  + {t("Add new")}
                </button>
              </div>
            </div>
            {/* table */}
            <div className="shadow-sm outline-none rounded-2xl md:mt-5 mt-3 py-3 px-4 bg-white overflow-x-scroll scrollbar">
              <table className="border-none outline-none w-full overflow-scroll">
                <thead className="w-full border-b border-gray-100 text-center select-none">
                  <tr>
                    <th className="p-4 whitespace-nowrap text-left pl-10">
                      {/* <input
                        type="checkbox"
                        className="rounded-lg inline-block mr-2 h-4 w-4"
                        id="id"
                      /> */}
                      <label htmlFor="id" className=" cursor-pointer">
                        <span>{t("Contact person")}</span>
                      </label>
                    </th>
                    <th className="p-4 text-left">{t("Email")}</th>
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
                  ) : prospects?.length !== 0 && prospects !== undefined ? (
                    displayProspects.map((prospect) => (
                      <tr
                        key={prospect?._id}
                        className="border-b last:border-none border-gray-200 w-full text-left pl-10 select-none"
                      >
                        <td className="pl-10 whitespace-nowrap">
                          {/* <input
                            type="checkbox"
                            id={prospect?._id}
                            className="rounded-lg inline-block mr-2 w-4 h-4"
                          /> */}
                          <label htmlFor={prospect?._id}>
                            <span className="font-bold text-center cursor-pointer">
                              {prospect?.billingAddress?.contactName}
                            </span>
                          </label>
                        </td>
                        <td className="text-left p-4 whitespace-nowrap">
                          {prospect?.email}
                        </td>
                        <td className="text-left p-4 whitespace-nowrap">
                          {prospect?.name ?? "-"}
                        </td>

                        <td className="text-left p-4 whitespace-nowrap">
                          {prospect?.billingAddress?.city ?? "-"}
                        </td>
                        <td className="flex items-center justify-center p-4">
                          {role === "admin" || role === "editor" ? (
                            <button
                              onClick={() => {
                                setShowEditdetailsProspect(true);
                                dispatch(handleFindProspect(prospect?._id));
                              }}
                              disabled={deleteProspectLoading || loading}
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
                                setShowProspectDetails(true);
                                dispatch(handleFindProspect(prospect?._id));
                              }}
                              disabled={deleteProspectLoading || loading}
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
                                handleDeleteprospect(
                                  prospect?._id,
                                  prospect?.name
                                )
                              }
                              disabled={
                                addNewProspectLoading ||
                                deleteProspectLoading ||
                                loading
                              }
                            >
                              {deleteProspectLoading &&
                              prospect?._id === deleteProspectID ? (
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
                      <td colSpan="7">{t("No prospects here")}.</td>
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
                  ? (pageNumber + 1) * prospectsPerPage > prospects?.length
                    ? prospects?.length
                    : (pageNumber + 1) * prospectsPerPage
                  : (pageNumber + 1) * prospectsPerPage > fileterdData?.length
                  ? fileterdData?.length
                  : (pageNumber + 1) * prospectsPerPage}{" "}
                {t("from")}{" "}
                {fileterdData?.length === 0
                  ? prospects?.length
                  : fileterdData.length}{" "}
                {t("prospects")}
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
    </>
  );
};

export default Prospect;
