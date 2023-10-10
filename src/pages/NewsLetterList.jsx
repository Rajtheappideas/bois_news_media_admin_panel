import moment from "moment";
import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Search from "../components/Search";
import { BiChevronsLeft, BiChevronsRight } from "react-icons/bi";
import ReactPaginate from "react-paginate";
import { handlerFilterNewsLetters } from "../redux/GlobalStates";

const NewsLetterList = () => {
  const [pageNumber, setPageNumber] = useState(0);

  const { newsLetters, newsLetterLoading, fileterdData } = useSelector(
    (state) => state.root.globalStates,
  );

  const dispatch = useDispatch();

  const { t } = useTranslation();

  // pagination logic
  const newsLetterPerPage = 8;
  const pageVisited = pageNumber * newsLetterPerPage;
  let displayNewsLetters = [];
  if (!newsLetterLoading) {
    displayNewsLetters =
      newsLetters?.length > 0 && fileterdData.length === 0
        ? newsLetters.slice(pageVisited, newsLetterPerPage + pageVisited)
        : fileterdData.slice(pageVisited, newsLetterPerPage + pageVisited);
  }
  const pageCount =
    fileterdData.length === 0
      ? Math.ceil(newsLetters?.length / newsLetterPerPage)
      : Math.ceil(fileterdData?.length / newsLetterPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div className="lg:space-y-5 select-none space-y-3 w-full">
      {/* search + buttons */}
      <div className="w-full flex items-center justify-between md:flex-row flex-col gap-4">
        <div className="lg:w-1/3 md:w-1/2 w-full">
          <Search data={newsLetters} />
        </div>
        <div>
          <select
            name="filter"
            onChange={(e) => {
              dispatch(handlerFilterNewsLetters(e.target.value));
            }}
            id="filter"
            className="filter_dropdown outline-none"
          >
            <option value="newest">{t("newest")}</option>
            <option value="oldest">{t("oldest")}</option>
          </select>
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
              <th className="p-4 text-left">{t("Email")}</th>
              <th className="p-4 text-left">{t("Date")}</th>
            </tr>
          </thead>
          <tbody className="w-full">
            {newsLetterLoading ? (
              <tr className="data_not_found_And_Loading">
                <td colSpan="7">{t("Loading")}....</td>
              </tr>
            ) : newsLetters.length !== 0 && newsLetters !== undefined ? (
              displayNewsLetters.map((newsLetter, i) => (
                <tr
                  key={newsLetter?._id}
                  className="border-b last:border-none border-gray-200 w-full text-center"
                >
                  <td className="p-4 whitespace-nowrap">
                    <span className="font-bold text-center">
                      {newsLetter?.index}
                    </span>
                  </td>

                  <td className="text-left p-4 whitespace-nowrap">
                    {newsLetter?.email}
                  </td>
                  <td className="text-left p-4 whitespace-nowrap">
                    {moment(newsLetter?.date).format("LLL")}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="data_not_found_And_Loading">
                <td colSpan="7">{t("No newsletter here")}.</td>
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
            ? (pageNumber + 1) * newsLetterPerPage > newsLetters?.length
              ? newsLetters?.length
              : (pageNumber + 1) * newsLetterPerPage
            : (pageNumber + 1) * newsLetterPerPage > fileterdData?.length
            ? fileterdData?.length
            : (pageNumber + 1) * newsLetterPerPage}{" "}
          {t("from")}{" "}
          {fileterdData?.length === 0
            ? newsLetters?.length
            : fileterdData.length}{" "}
          {t("newsLetters")}
        </p>
        <ReactPaginate
          onPageChange={changePage}
          previousLabel={
            <BiChevronsLeft className="text-blue-500 text-2xl" role="button" />
          }
          nextLabel={
            <BiChevronsRight className="text-blue-500 text-2xl" role="button" />
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
  );
};

export default NewsLetterList;
