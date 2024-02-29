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
import { handleLogout } from "../../redux/AuthSlice";
import { handleLogoutFromAllTabs } from "../../redux/GlobalStates";
import toast from "react-hot-toast";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  handleDeleteArticle,
  handleGetArticles,
  handleChangeSingleArticle,
} from "../../redux/ArticleSlice";
import AddArticle from "../../components/Article/AddArticle";
import { handleGetCategories, handleGetTags } from "../../redux/CategoryAndTagsSlice";

const Articles = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const [showAddArticle, setShowAddArticle] = useState(false);
  const [categoryId, setArticleId] = useState(null);

  const { token, role } = useSelector((state) => state.root.auth);

  const { articles, articleLoading, removeLoading } = useSelector(
    (state) => state.root.article
  );

  const { fileterdData, isSidebarOpen, language } = useSelector(
    (state) => state.root.globalStates
  );

  const { AbortControllerRef } = useAbortApiCall();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();

  // pagination logic
  const articlesPerPage = 8;
  const pageVisited = pageNumber * articlesPerPage;
  let displayArticles = [];
  if (!articleLoading) {
    displayArticles =
      articles.length > 0 && fileterdData.length === 0
        ? articles.slice(pageVisited, articlesPerPage + pageVisited)
        : fileterdData.slice(pageVisited, articlesPerPage + pageVisited);
  }
  const pageCount =
    fileterdData.length === 0
      ? Math.ceil(articles.length / articlesPerPage)
      : Math.ceil(fileterdData.length / articlesPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleDeleteArticleFunction = (id, name) => {
    if (window.confirm(t("Are you sure?"))) {
      setArticleId(id);
      const response = dispatch(
        handleDeleteArticle({ token, id, signal: AbortControllerRef })
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
          setArticleId(null);
        });
      }
    }
  };

  useEffect(() => {
    const response = dispatch(handleGetArticles({ token, lang: language }));
    dispatch(handleGetTags({ token, lang: language }));
    dispatch(handleGetCategories({ token, lang: language }))
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
      <Helmet title="Articles | Bois news media" />
      <div className="w-full flex items-start lg:gap-3 flex-row h-auto">
        <Sidebar />
        <section
          className={`h-full space-y-5 bg-[#FBFBFB] min-h-screen ${
            isSidebarOpen ? "xl:w-10/12 lg:w-4/5 w-full" : "lg:w-[90%] w-full"
          }`}
        >
          <Header />
          {showAddArticle && <AddArticle setShowAddArticle={setShowAddArticle} />}
          {!showAddArticle && (
            <div className="lg:space-y-5 space-y-3 lg:p-5 p-3 w-full">
              {/* search + buttons */}
              <div className="w-full flex items-center justify-between md:flex-row flex-col gap-4">
                <div className="md:w-1/2 w-full">
                  <Search data={articles} />
                </div>
                <div className="flex items-center gap-2 w-full justify-end">
                  {role === "admin" && (
                    <div className="relative w-auto flex-initial">
                      <button
                        className="blue_button"
                        onClick={() => {
                          setShowAddArticle(true);
                        }}
                      >
                        + Add Article
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
                      <th className="p-4 pl-10 text-center">
                        {t("Name")}
                      </th>
                      <th className="p-4 pl-10 text-center">{t("author")}</th>
                      <th className="p-4 pl-10 text-center">{t("website")}</th>
                      <th className="p-4 pl-10 text-center">{t("paid")}</th>
                      <th className="p-4 pl-10 text-center">{t("Actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="w-full">
                    {articleLoading ? (
                      <tr className="data_not_found_And_Loading">
                        <td colSpan="7">{t("Loading")}....</td>
                      </tr>
                    ) : articles.length !== 0 && articles !== undefined ? (
                      displayArticles.map((article) => (
                        <tr
                          key={article?._id}
                          className="border-b last:border-none border-gray-200 w-full text-left pl-10 select-none"
                        >
                          <td className="text-center p-4 pl-10 whitespace-nowrap">
                            {article?.fr?.title ? article?.fr?.title : "-"}
                          </td>
                          <td className="text-center p-4 pl-10 whitespace-nowrap">
                            {article?.author?.name}
                          </td>
                          <td className="text-center p-4 pl-10 whitespace-nowrap">
                            {article?.website}
                          </td>
                          <td className="text-center p-4 pl-10 whitespace-nowrap">
                            {article?.paid ? "Paid" : "Free"}
                          </td>

                          <td className="flex items-center justify-center p-4 pl-10">
                            {(role === "admin" || role === "editor") && (
                              <button
                                onClick={() => {
                                  navigate(`/article/edit/${article?._id}`);
                                  dispatch(handleChangeSingleArticle(article));
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
                                navigate(`/article/${article?._id}`);
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
                                  handleDeleteArticleFunction(
                                    article?._id,
                                    article?.name
                                  )
                                }
                                disabled={removeLoading || articleLoading}
                              >
                                {removeLoading &&
                                article?._id === categoryId ? (
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
                        <td colSpan="7">{t("No articles here")}.</td>
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
                    ? (pageNumber + 1) * articlesPerPage > articles?.length
                      ? articles?.length
                      : (pageNumber + 1) * articlesPerPage
                    : (pageNumber + 1) * articlesPerPage > fileterdData?.length
                    ? fileterdData?.length
                    : (pageNumber + 1) * articlesPerPage}{" "}
                  {t("from")}{" "}
                  {fileterdData?.length === 0
                    ? articles?.length
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

export default Articles;
