import React, { useState } from "react";
import Search from "../Search";
import ReactPaginate from "react-paginate";
import { BiChevronsLeft, BiChevronsRight, BiPencil } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { HiOutlineDownload } from "react-icons/hi";
import AddnewMagazine from "../Magazine/AddnewMagazine";
import EditMagazineDetails from "../Magazine/EditMagazineDetails";
import {
  handleChangeDeleteID,
  handleDeleteMAGAZINE,
  handleDeleteMagazine,
  handleFindMagazine,
  handlerFilterMagazine,
} from "../../redux/MagazineSlice";
import { useDispatch, useSelector } from "react-redux";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import { toast } from "react-hot-toast";
import { BsEye } from "react-icons/bs";
import ShowMagazineDetails from "../Magazine/ShowMagazineDetails";

const Magazine = () => {
  const [showAddnewMagazine, setshowAddnewMagazine] = useState(false);
  const [showEditMagazine, setshowEditMagazine] = useState(false);
  const [showMagazineDetails, setShowMagazineDetails] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);

  const {
    magazines,
    loading,
    addNewMagazineLoading,
    deleteMagazineLoading,
    deleteMagazineID,
  } = useSelector((state) => state.root.magazines);

  const { token, role } = useSelector((state) => state.root.auth);

  const { AbortControllerRef } = useAbortApiCall();

  const dispatch = useDispatch();

  // pagination logic
  const magazinePerPage = 8;
  const pageVisited = pageNumber * magazinePerPage;
  let displayMagazine = [];
  if (!loading) {
    displayMagazine =
      magazines?.length > 0 &&
      magazines.slice(pageVisited, magazinePerPage + pageVisited);
  }
  const pageCount = Math.ceil(magazines?.length / magazinePerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleDeletemagazine = (id, name) => {
    if (window.confirm("Are you sure?")) {
      dispatch(handleChangeDeleteID(id));

      const response = dispatch(
        handleDeleteMAGAZINE({ id, token, signal: AbortControllerRef })
      );
      if (response) {
        response.then((res) => {
          if (res?.payload?.status === "success") {
            dispatch(handleDeleteMagazine(id));
            toast.success(`${name} magazine Deleted Successfully.`);
          } else if (res?.payload?.status === "error") {
            toast.error(res?.payload?.message);
          }
        });
      }
    }
  };

  return (
    <>
      {showAddnewMagazine && !showEditMagazine && !showMagazineDetails && (
        <AddnewMagazine setshowAddnewMagazine={setshowAddnewMagazine} />
      )}
      {!showAddnewMagazine && showEditMagazine && !showMagazineDetails && (
        <EditMagazineDetails setshowEditMagazine={setshowEditMagazine} />
      )}
      {!showAddnewMagazine && !showEditMagazine && showMagazineDetails && (
        <ShowMagazineDetails setShowMagazineDetails={setShowMagazineDetails} />
      )}
      {!showAddnewMagazine && !showEditMagazine && !showMagazineDetails && (
        <div className="lg:space-y-5 space-y-3 w-full">
          {/* search + buttons */}
          <div className="w-full flex items-center justify-between md:flex-row flex-col gap-4">
            <div className="lg:w-1/3 md:w-1/2 w-full">
              <Search />
            </div>
            <div>
              <select
                name="filter"
                onChange={(e) =>
                  dispatch(handlerFilterMagazine(e.target.value))
                }
                id="filter"
                className="filter_dropdown"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
              <button
                className="gray_button"
                onClick={() => setshowAddnewMagazine(true)}
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
                      className="rounded-lg inline-block mr-2 h-4 w-4"
                      id="sr_no"
                    />
                    <label htmlFor="sr_no">
                      <span>Sr no</span>
                    </label>
                  </th>
                  <th className="p-4">Magazine name</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="w-full">
                {loading ? (
                  <tr className="data_not_found_And_Loading">
                    <td colSpan="7">Loading....</td>
                  </tr>
                ) : magazines?.length !== 0 && magazines !== undefined ? (
                  displayMagazine.map((magazine, srNo) => (
                    <tr
                      key={magazine?._id}
                      className="border-b border-gray-200 w-full text-left pl-10 select-none"
                    >
                      <td className="p-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          id={magazine?._id}
                          className="rounded-lg inline-block mr-2 w-4 h-4"
                        />
                        <label htmlFor={magazine?._id}>
                          <span className="font-bold text-center cursor-pointer">
                            {srNo + 1}
                          </span>
                        </label>
                      </td>
                      <td className="text-left p-4 whitespace-nowrap">
                        {magazine?.title}
                      </td>
                      <td className="text-left p-4 whitespace-nowrap">
                        $ {magazine?.price}
                      </td>

                      <td className="text-left p-4 whitespace-nowrap">
                        {magazine?.stock ?? "-"}
                      </td>
                      <td className="text-center p-4 whitespace-nowrap">
                        {magazine?.status ?? "-"}
                      </td>
                      <td className="flex items-center justify-center p-4">
                        {role === "admin" || role === "editor" ? (
                          <button
                            onClick={() => {
                              setshowEditMagazine(true);
                              dispatch(handleFindMagazine(magazine?._id));
                            }}
                            disabled={deleteMagazineLoading || loading}
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
                              setshowEditMagazine(true);
                              dispatch(handleFindMagazine(magazine?._id));
                            }}
                            disabled={deleteMagazineLoading || loading}
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
                              handleDeletemagazine(
                                magazine?._id,
                                magazine?.title
                              )
                            }
                            disabled={
                              addNewMagazineLoading ||
                              deleteMagazineLoading ||
                              loading
                            }
                          >
                            {deleteMagazineLoading &&
                            magazine?._id === deleteMagazineID ? (
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
                    <td colSpan="7">No magazines here.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* pagination */}
          <div className="flex items-center justify-between py-5">
            <p className="font-medium md:text-base text-sm text-textBlack">
              Showing{" "}
              {(pageNumber + 1) * magazinePerPage > magazines?.length ?? "-"
                ? magazines?.length ?? "-"
                : (pageNumber + 1) * magazinePerPage}{" "}
              from {magazines?.length ?? "-"} Magazines
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

export default Magazine;
