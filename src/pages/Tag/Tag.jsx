import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Sidebar from "../../components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Header";
import Search from "../../components/Search";
import { BiChevronsLeft, BiChevronsRight, BiPencil } from "react-icons/bi";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { BsEye } from "react-icons/bs";
import ReactPaginate from "react-paginate";
import {
  handleChangeSingleTag,
  handleDeleteTag,
  handleGetTags,
} from "../../redux/CategoryAndTagsSlice";
import { handleLogout } from "../../redux/AuthSlice";
import { handleLogoutFromAllTabs } from "../../redux/GlobalStates";
import toast from "react-hot-toast";
import { RiDeleteBin6Line } from "react-icons/ri";
import AddTag from "../../components/Tag/AddTag";

const Tag = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const [showAddTag, setShowAddTag] = useState(false);
  const [categoryId, setTagId] = useState(null);

  const { token, role } = useSelector((state) => state.root.auth);

  const { tags, tagLoading, tagRemoveLoading } = useSelector(
    (state) => state.root.categoryandtag
  );

  const { fileterdData, isSidebarOpen, language } = useSelector(
    (state) => state.root.globalStates
  );

  const { AbortControllerRef } = useAbortApiCall();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();

  // pagination logic
  const tagsPerPage = 8;
  const pageVisited = pageNumber * tagsPerPage;
  let displayTags = [];
  if (!tagLoading) {
    displayTags =
      tags.length > 0 && fileterdData.length === 0
        ? tags.slice(pageVisited, tagsPerPage + pageVisited)
        : fileterdData.slice(pageVisited, tagsPerPage + pageVisited);
  }
  const pageCount =
    fileterdData.length === 0
      ? Math.ceil(tags.length / tagsPerPage)
      : Math.ceil(fileterdData.length / tagsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleDeleteTagFunction = (id, name) => {
    if (window.confirm(t("Are you sure?"))) {
      setTagId(id);
      const response = dispatch(
        handleDeleteTag({ token, id, signal: AbortControllerRef })
      );
      toast.loading("Deleting...");
      if (response) {
        response.then((res) => {
          if (res?.payload?.status === "success") {
            toast.remove();
            toast.success(`${name} ${t("tag Deleted Successfully")}.`);
          } else if (res?.payload?.status === "error") {
            toast.remove();
            toast.error(res?.payload?.message);
          }
          setTagId(null);
        });
      }
    }
  };

  useEffect(() => {
    const response = dispatch(handleGetTags({ token, lang: language }));
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
      <Helmet title="Tags | Bois news media" />
      <div className="w-full flex items-start lg:gap-3 flex-row h-auto">
        <Sidebar />
        <section
          className={`h-full space-y-5 bg-[#FBFBFB] min-h-screen ${
            isSidebarOpen ? "xl:w-10/12 lg:w-4/5 w-full" : "lg:w-[90%] w-full"
          }`}
        >
          <Header />
          {showAddTag && <AddTag setShowAddTag={setShowAddTag} />}
          {!showAddTag && (
            <div className="lg:space-y-5 space-y-3 lg:p-5 p-3 w-full">
              {/* search + buttons */}
              <div className="w-full flex items-center justify-between md:flex-row flex-col gap-4">
                <div className="md:w-1/2 w-full">
                  <Search data={tags} />
                </div>
                <div className="flex items-center gap-2 w-full justify-end">
                  {role === "admin" && (
                    <div className="relative w-auto flex-initial">
                      <button
                        className="blue_button"
                        onClick={() => {
                          setShowAddTag(true);
                        }}
                      >
                        + Add Tag
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {/* table */}
              <div className="shadow-sm outline-none rounded-2xl md:mt-5 mt-3 py-3 px-4 bg-white overflow-x-scroll scrollbar">
                <table className="border-none outline-none w-full overflow-scroll">
                  <thead className="w-full border-b border-gray-100 text-center select-none">
                    <tr>
                      <th className="p-4 pl-10 text-center">{t("Name")}</th>
                      <th className="p-4 pl-10 text-center">{t("Website")}</th>
                      <th className="p-4 pl-10 text-center">{t("Actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="w-full">
                    {tagLoading ? (
                      <tr className="data_not_found_And_Loading">
                        <td colSpan="7">{t("Loading")}....</td>
                      </tr>
                    ) : tags.length !== 0 && tags !== undefined ? (
                      displayTags.map((tag) => (
                        <tr
                          key={tag?._id}
                          className="border-b last:border-none border-gray-200 w-full text-left pl-10 select-none"
                        >
                          <td className="text-center p-4 pl-10 whitespace-nowrap">
                            {tag?.name ? tag?.name : "-"}
                          </td>
                          <td className="text-center p-4 pl-10 whitespace-nowrap">
                            {tag?.website}
                          </td>

                          <td className="flex items-center justify-center p-4 pl-10">
                            {(role === "admin" || role === "editor") && (
                              <button
                                onClick={() => {
                                  navigate(`/tag/edit/${tag?._id}`);
                                  dispatch(handleChangeSingleTag(tag));
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
                            )}
                            <button
                              onClick={() => {
                                navigate(`/tag/${tag?._id}`);
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
                            {role === "admin" && (
                              <button
                                type="button"
                                className="hover:bg-red-200 p-1 rounded-full h-10 w-10"
                                onClick={() =>
                                  handleDeleteTagFunction(tag?._id, tag?.name)
                                }
                                disabled={tagRemoveLoading || tagLoading}
                              >
                                {tagRemoveLoading && tag?._id === categoryId ? (
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
                      <tr className="data_not_found_And_Loading capitalize">
                        <td colSpan="7">{t("No tags here")}.</td>
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
                    ? (pageNumber + 1) * tagsPerPage > tags?.length
                      ? tags?.length
                      : (pageNumber + 1) * tagsPerPage
                    : (pageNumber + 1) * tagsPerPage > fileterdData?.length
                    ? fileterdData?.length
                    : (pageNumber + 1) * tagsPerPage}{" "}
                  {t("from")}{" "}
                  {fileterdData?.length === 0
                    ? tags?.length
                    : fileterdData.length}{" "}
                  {t("Categories")}
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
        </section>
      </div>
    </>
  );
};

export default Tag;
