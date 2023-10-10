import React, { useState, useEffect } from "react";
import Search from "../Search";
import ReactPaginate from "react-paginate";
import { BiChevronsLeft, BiChevronsRight, BiPencil } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import AddNewThirdPartyPayer from "../ThirdPartyPayer/AddNewThirdPartyPayer";
import EditDetailsThirdPartyPayer from "../ThirdPartyPayer/EditDetailsThirdPartyPayer";
import { useDispatch, useSelector } from "react-redux";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import { toast } from "react-hot-toast";
import { BsEye, BsFilterLeft } from "react-icons/bs";
import {
  handleChangeDeleteID,
  handleDeletePAYER,
  handleDeletePayer,
  handleFindPayer,
  handlerFilterPayers,
} from "../../redux/ThirdPartyPayerSlice";
import ShowThirdPartyPayerDetails from "../ThirdPartyPayer/ShowThirdPartyPayerDetails";
import { useTranslation } from "react-i18next";

const ThirdPartyPayer = () => {
  const [showAddnewPayer, setShowAddnewPayer] = useState(false);
  const [showEditDetailsPayer, setShowEditDetailsPayer] = useState(false);
  const [showPayerDetails, setShowPayerDetails] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);

  const {
    payers,
    loading,
    addNewPayerLoading,
    deletePayerLoading,
    deletePayerID,
  } = useSelector((state) => state.root.thirdPartyPayers);

  const { token, role } = useSelector((state) => state.root.auth);
  const { fileterdData } = useSelector((state) => state.root.globalStates);

  const { AbortControllerRef } = useAbortApiCall();

  const dispatch = useDispatch();

  const { t } = useTranslation();

  // pagination logic
  const payersPerPage = 8;
  const pageVisited = pageNumber * payersPerPage;
  let displayPayers = [];
  if (!loading) {
    displayPayers =
      payers?.length > 0 && fileterdData.length === 0
        ? payers.slice(pageVisited, payersPerPage + pageVisited)
        : fileterdData.slice(pageVisited, payersPerPage + pageVisited);
  }
  const pageCount =
    fileterdData.length === 0
      ? Math.ceil(payers?.length / payersPerPage)
      : Math.ceil(fileterdData?.length / payersPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleDeletepayer = (id, name) => {
    if (window.confirm(t("Are you sure?"))) {
      dispatch(handleChangeDeleteID(id));

      const response = dispatch(
        handleDeletePAYER({ id, token, signal: AbortControllerRef }),
      );
      if (response) {
        response.then((res) => {
          if (res?.payload?.status === "success") {
            dispatch(handleDeletePayer(id));
            toast.success(`${name} ${t("payer Deleted Successfully")}.`);
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
      {showAddnewPayer && !showEditDetailsPayer && !showPayerDetails && (
        <AddNewThirdPartyPayer setShowAddnewPayer={setShowAddnewPayer} />
      )}
      {!showAddnewPayer && showEditDetailsPayer && !showPayerDetails && (
        <EditDetailsThirdPartyPayer
          setShowEditDetailsPayer={setShowEditDetailsPayer}
        />
      )}
      {!showAddnewPayer && !showEditDetailsPayer && showPayerDetails && (
        <ShowThirdPartyPayerDetails setShowPayerDetails={setShowPayerDetails} />
      )}
      {!showAddnewPayer && !showEditDetailsPayer && !showPayerDetails && (
        <div className="lg:space-y-5 space-y-3 w-full">
          {/* search + buttons */}
          <div className="w-full flex items-center justify-between md:flex-row flex-col gap-4">
            <div className="lg:w-1/3 md:w-1/2 w-full">
              <Search data={payers} />
            </div>
            <div>
              <select
                name="filter"
                id="filter"
                onChange={(e) => dispatch(handlerFilterPayers(e.target.value))}
                className="filter_dropdown"
              >
                <option value="newest">{t("newest")}</option>
                <option value="oldest">{t("oldest")}</option>
              </select>
              <button
                className="gray_button"
                onClick={() => setShowAddnewPayer(true)}
              >
                + {t("Add new")}
              </button>
            </div>
          </div>
          {/* table */}
          <div className="shadow-sm outline-none rounded-2xl md:mt-5 mt-3 py-3 px-4 bg-white overflow-x-scroll scrollbar">
            <table className="border-none outline-none w-full overflow-scroll">
              <thead className="w-full border-b border-gray-100 text-left">
                <tr>
                  <th className="p-4 whitespace-nowrap">
                    {/* <input
                      type="checkbox"
                      className="rounded-lg inline-block mr-2 h-4 w-4"
                      id="accountName"
                    /> */}
                    <label htmlFor="accountName">
                      <span>{t("Account name")}</span>
                    </label>
                  </th>
                  <th className="p-4">{t("Account number")}</th>
                  <th className="p-4">{t("Postal code")}</th>
                  <th className="p-4">{t("Billing country")}</th>
                  <th className="p-4">{t("Status")}</th>
                  <th className="p-4 text-center">{t("Action")}</th>
                </tr>
              </thead>
              <tbody className="w-full">
                {loading ? (
                  <tr className="data_not_found_And_Loading">
                    <td colSpan="7">{t("Loading")}....</td>
                  </tr>
                ) : payers?.length !== 0 && payers !== undefined ? (
                  displayPayers.map((payer) => (
                    <tr
                      key={payer?._id}
                      className="border-b last:border-none border-gray-200 w-full text-left pl-10 select-none"
                    >
                      <td className="p-4 whitespace-nowrap">
                        {/* <input
                          type="checkbox"
                          id={payer?._id}
                          className="rounded-lg inline-block mr-2 w-4 h-4"
                        /> */}
                        <label htmlFor={payer?._id}>
                          <span className="font-bold text-center cursor-pointer">
                            {payer?.accountName}
                          </span>
                        </label>
                      </td>
                      <td className="text-left p-4 whitespace-nowrap">
                        {payer?.email}
                      </td>
                      <td className="text-left p-4 whitespace-nowrap">
                        {payer?.billingAddress?.zipCode ?? "-"}
                      </td>
                      <td className="text-left p-4 whitespace-nowrap">
                        {payer?.billingAddress?.country ?? "-"}
                      </td>
                      <td className="text-left p-4 whitespace-nowrap">
                        {payer?.status ?? "-"}
                      </td>
                      <td className="flex items-center justify-center p-4">
                        {role === "admin" || role === "editor" ? (
                          <button
                            onClick={() => {
                              setShowEditDetailsPayer(true);
                              dispatch(handleFindPayer(payer?._id));
                            }}
                            disabled={deletePayerLoading || loading}
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
                              setShowPayerDetails(true);
                              dispatch(handleFindPayer(payer?._id));
                            }}
                            disabled={deletePayerLoading || loading}
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
                              handleDeletepayer(payer?._id, payer?.accountName)
                            }
                            disabled={
                              addNewPayerLoading ||
                              deletePayerLoading ||
                              loading
                            }
                          >
                            {deletePayerLoading &&
                            payer?._id === deletePayerID ? (
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
                    <td colSpan="7">{t("No payers here")}.</td>
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
                ? (pageNumber + 1) * payersPerPage > payers?.length
                  ? payers?.length
                  : (pageNumber + 1) * payersPerPage
                : (pageNumber + 1) * payersPerPage > fileterdData?.length
                ? fileterdData?.length
                : (pageNumber + 1) * payersPerPage}{" "}
              {t("from")}{" "}
              {fileterdData?.length === 0
                ? payers?.length
                : fileterdData.length}{" "}
              {t("Payers")}
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

export default ThirdPartyPayer;
