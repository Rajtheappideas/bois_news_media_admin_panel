import React, { useEffect, useState } from "react";
import Search from "./Search";
import ReactPaginate from "react-paginate";
import { BiChevronsLeft, BiChevronsRight, BiPencil } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import useAbortApiCall from "../hooks/useAbortApiCall";
import EditPromoCode from "./PromoCode/EditPromoCode";
import { BsEye } from "react-icons/bs";
import moment from "moment";
import {
  handleDeletePromoCode,
  handleDeletePromoCodeAction,
  handleFindSinglePromoCode,
} from "../redux/PromoCodeSlice";
import toast from "react-hot-toast";
import { RiDeleteBin6Line } from "react-icons/ri";
import { handleChangeDeleteID } from "../redux/SubscriptionSlice";
import CreatePromoCode from "./PromoCode/CreatePromoCode";
import ShowPromoCodeDetails from "./PromoCode/ShowPromoCodeDetails";

const PromoCode = () => {
  const [showEditPromoCode, setShowEditPromoCode] = useState(false);
  const [showCreatePromoCode, setShowCreatePromoCode] = useState(false);
  const [showPromoCodeDetails, setShowPromoCodeDetails] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);

  const {
    promoCodes,
    loading,
    createAndUpdateLoading,
    deleteLoading,
    deletePromoCodeId,
  } = useSelector((state) => state.root.promoCode);
  const { fileterdData } = useSelector((state) => state.root.globalStates);
  const { role, token } = useSelector((state) => state.root.auth);

  const dispatch = useDispatch();

  const { abortApiCall, AbortControllerRef } = useAbortApiCall();

  const { t } = useTranslation();

  // pagination logic
  const promoPerPage = 8;
  const pageVisited = pageNumber * promoPerPage;
  let displayPromoCodes = [];
  if (!loading) {
    displayPromoCodes =
      promoCodes?.length > 0 && fileterdData.length === 0
        ? promoCodes.slice(pageVisited, promoPerPage + pageVisited)
        : fileterdData.slice(pageVisited, promoPerPage + pageVisited);
  }
  const pageCount =
    fileterdData.length === 0
      ? Math.ceil(promoCodes?.length / promoPerPage)
      : Math.ceil(fileterdData?.length / promoPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleDeletePromo = (id, name) => {
    if (window.confirm(t("Are you sure?"))) {
      dispatch(handleChangeDeleteID(id));

      const response = dispatch(
        handleDeletePromoCode({ id, token, signal: AbortControllerRef })
      );
      if (response) {
        response.then((res) => {
          if (res?.payload?.status === "success") {
            dispatch(handleDeletePromoCodeAction(id));
            toast.success(`${name} ${t("PromoCode Deleted Successfully")}.`);
          } else if (res?.payload?.status === "error") {
            toast.error(res?.payload?.message);
          }
        });
      }
    }
  };

  useEffect(() => {
    return () => abortApiCall();
  }, []);

  return (
    <>
      {showEditPromoCode && !showCreatePromoCode && !showPromoCodeDetails && (
        <EditPromoCode setShowEditPromoCode={setShowEditPromoCode} />
      )}
      {!showEditPromoCode && showCreatePromoCode && !showPromoCodeDetails && (
        <CreatePromoCode setShowCreatePromoCode={setShowCreatePromoCode} />
      )}
      {!showEditPromoCode && !showCreatePromoCode && showPromoCodeDetails && (
        <ShowPromoCodeDetails
          setShowPromoCodeDetails={setShowPromoCodeDetails}
        />
      )}
      {!showEditPromoCode && !showCreatePromoCode && !showPromoCodeDetails && (
        <div className="lg:space-y-5 space-y-3 w-full">
          {/* search + buttons */}
          <div className="w-full flex items-center justify-between md:flex-row flex-col gap-4">
            <div className="lg:w-1/3 md:w-1/2 w-full">
              <Search data={promoCodes} />
            </div>
            <button
              className="gray_button"
              onClick={() => setShowCreatePromoCode(true)}
            >
              + {t("Add new")}
            </button>
          </div>
          {/* table */}
          <div className="shadow-sm outline-none rounded-2xl md:mt-5 mt-3 py-3 px-4 bg-white overflow-x-scroll scrollbar">
            <table className="border-none outline-none w-full overflow-scroll">
              <thead className="w-full border-b border-gray-100 text-left">
                <tr>
                  <th className="p-4 text-center">{t("Code")}</th>
                  <th className="p-4 text-center">{t("ExpireDate")}</th>
                  <th className="p-4 text-center">
                    {t("Discount Percentage")} %
                  </th>
                  <th className="p-4 text-center">{t("Action")}</th>
                </tr>
              </thead>
              <tbody className="w-full">
                {loading ? (
                  <tr className="data_not_found_And_Loading">
                    <td colSpan="7">{t("Loading")}....</td>
                  </tr>
                ) : promoCodes !== undefined && promoCodes.length > 0 ? (
                  displayPromoCodes.map((promo) => (
                    <tr
                      key={promo?._id}
                      className="border-b last:border-none border-gray-200 w-full text-left"
                    >
                      <td className="p-4 whitespace-nowrap text-center">
                        {promo?.code}
                      </td>

                      <td className="text-center p-4 whitespace-nowrap">
                        {moment(promo?.expireDate).format("lll")}
                      </td>
                      <td className="text-center p-4 whitespace-nowrap">
                        {promo?.discountPercentage} %
                      </td>

                      <td className="flex items-center justify-center p-4">
                        {role === "admin" || role === "editor" ? (
                          <button
                            onClick={() => {
                              setShowEditPromoCode(true);
                              dispatch(handleFindSinglePromoCode(promo?._id));
                            }}
                            disabled={
                              deleteLoading || loading || createAndUpdateLoading
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
                              setShowPromoCodeDetails(true);
                              dispatch(handleFindSinglePromoCode(promo?._id));
                            }}
                            disabled={
                              deleteLoading || createAndUpdateLoading || loading
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
                              handleDeletePromo(promo?._id, promo?.code)
                            }
                            disabled={
                              createAndUpdateLoading || deleteLoading || loading
                            }
                          >
                            {deleteLoading &&
                            promo?._id === deletePromoCodeId ? (
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
                    <td colSpan="7">{t("No Promo Code here")}.</td>
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
                ? (pageNumber + 1) * promoPerPage > promoCodes?.length
                  ? promoCodes?.length
                  : (pageNumber + 1) * promoPerPage
                : (pageNumber + 1) * promoPerPage > fileterdData?.length
                ? fileterdData?.length
                : (pageNumber + 1) * promoPerPage}{" "}
              {t("from")}{" "}
              {fileterdData?.length === 0
                ? promoCodes?.length
                : fileterdData.length}{" "}
              {t("PromoCodes")}
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

export default PromoCode;
