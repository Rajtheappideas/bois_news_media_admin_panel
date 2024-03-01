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
  handleChangeSingleCategory,
  handleDeleteCategory,
  handleEditCategory,
  handleGetCategories,
} from "../../redux/CategoryAndTagsSlice";
import { handleLogout } from "../../redux/AuthSlice";
import { handleLogoutFromAllTabs } from "../../redux/GlobalStates";
import toast from "react-hot-toast";
import AddCategory from "../../components/Category/AddCategory";
import { RiDeleteBin6Line } from "react-icons/ri";

const Category = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [categoryId, setCategoryId] = useState(null);

  const { token, role } = useSelector((state) => state.root.auth);

  const { categories, categoryLoading, categoryRemoveLoading } = useSelector(
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
  const categoriesPerPage = 8;
  const pageVisited = pageNumber * categoriesPerPage;
  let displayCategories = [];
  if (!categoryLoading) {
    displayCategories =
      categories.length > 0 && fileterdData.length === 0
        ? categories.slice(pageVisited, categoriesPerPage + pageVisited)
        : fileterdData.slice(pageVisited, categoriesPerPage + pageVisited);
  }
  const pageCount =
    fileterdData.length === 0
      ? Math.ceil(categories.length / categoriesPerPage)
      : Math.ceil(fileterdData.length / categoriesPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleDeleteCategoryFunction = (id, name) => {
    if (window.confirm(t("Are you sure?"))) {
      setCategoryId(id);
      const response = dispatch(
        handleDeleteCategory({ token, id, signal: AbortControllerRef })
      );
      toast.loading("Deleting...");
      if (response) {
        response.then((res) => {
          if (res?.payload?.status === "success") {
            toast.remove();
            toast.success(`${name} ${t("category Deleted Successfully")}.`);
          } else if (res?.payload?.status === "error") {
            toast.remove();
            toast.error(res?.payload?.message);
          }
          setCategoryId(null);
        });
      }
    }
  };

  const handleEditCategoryUsingSwitch = (category, name) => {
    toast.loading("Editing...", { id: "loading" });
    const response = dispatch(
      handleEditCategory({
        token,
        lang: language,
        frname: category?.fr?.name,
        enname: category?.en?.name,
        image: category?.image,
        website: category?.website,
        id: category?._id,
        showOnHomePage:
          name === "new_post"
            ? !category?.showOnHomePage
            : category?.showOnHomePage,
        showOnNavbar:
          name === "navbar" ? !category?.showOnNavbar : category?.showOnNavbar,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        toast.remove("loading")
        if (res?.payload?.status === "success") {
          if (name === "new_post")
            return toast.success(
              `${t(
                `category ${
                  category?.showOnHomePage ? "removed from" : "added to"
                } new post successfully.`
              )}`,
              {
                duration: 2000,
              }
            );
          else
            return toast.success(
              `${t(
                `category ${
                  category?.showOnNavbar ? "removed from" : "added to"
                } navbar successfully.`
              )}`,
              {
                duration: 2000,
              }
            );
        } else if (res?.payload?.status === "error") {
          toast.error(res?.payload?.message);
        }
      });
    }
  };

  useEffect(() => {
    const response = dispatch(handleGetCategories({ token, lang: language }));
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
      <Helmet title="Category | Bois news media" />
      <div className="w-full flex items-start lg:gap-3 flex-row h-auto">
        <Sidebar />
        <section
          className={`h-full space-y-5 bg-[#FBFBFB] min-h-screen ${
            isSidebarOpen ? "xl:w-10/12 lg:w-4/5 w-full" : "lg:w-[90%] w-full"
          }`}
        >
          <Header />
          {showAddCategory && (
            <AddCategory setShowAddCategory={setShowAddCategory} />
          )}
          {!showAddCategory && (
            <div className="lg:space-y-5 space-y-3 lg:p-5 p-3 w-full">
              {/* search + buttons */}
              <div className="w-full flex items-center justify-between md:flex-row flex-col gap-4">
                <div className="md:w-1/2 w-full">
                  <Search data={categories} />
                </div>
                <div className="flex items-center gap-2 w-full justify-end">
                  {role === "admin" && (
                    <div className="relative w-auto flex-initial">
                      <button
                        className="blue_button"
                        onClick={() => {
                          setShowAddCategory(true);
                        }}
                      >
                        + Add Category
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
                        France {t("Name")}
                      </th>
                      <th className="p-4 pl-10 text-center">
                        English {t("Name")}
                      </th>
                      <th className="p-4 pl-10 text-center">{t("Website")}</th>
                      <th className="p-4 pl-10 text-center capitalize">
                        {t("navbar(article-site)")}
                      </th>
                      <th className="p-4 pl-10 text-center capitalize">
                        {t("new posts(article-site)")}
                      </th>
                      <th className="p-4 pl-10 text-center">{t("Actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="w-full">
                    {categoryLoading ? (
                      <tr className="data_not_found_And_Loading">
                        <td colSpan="7">{t("Loading")}....</td>
                      </tr>
                    ) : categories.length !== 0 && categories !== undefined ? (
                      displayCategories.map((category) => (
                        <tr
                          key={category?._id}
                          className="border-b last:border-none border-gray-200 w-full text-left pl-10 select-none"
                        >
                          <td className="text-center p-4 pl-10 whitespace-nowrap">
                            {category?.fr?.name ? category?.fr?.name : "-"}
                          </td>
                          <td className="text-center p-4 pl-10 whitespace-nowrap">
                            {category?.en?.name ? category?.en?.name : "-"}
                          </td>
                          <td className="text-center p-4 pl-10 whitespace-nowrap">
                            {category?.website}
                          </td>
                          <td className="text-center p-4 pl-10 whitespace-nowrap">
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                value=""
                                checked={category?.showOnNavbar}
                                className="sr-only peer"
                                name="navbar"
                                onChange={(e) =>
                                  handleEditCategoryUsingSwitch(
                                    category,
                                    e.target.name
                                  )
                                }
                              />
                              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                          </td>
                          <td className="text-center p-4 pl-10 whitespace-nowrap">
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={category?.showOnHomePage}
                                value=""
                                name="new_post"
                                className="sr-only peer"
                                onChange={(e) =>
                                  handleEditCategoryUsingSwitch(
                                    category,
                                    e.target.name
                                  )
                                }
                              />
                              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                          </td>

                          <td className="flex items-center justify-center p-4 pl-10">
                            {(role === "admin" || role === "editor") && (
                              <button
                                onClick={() => {
                                  navigate(`/category/edit/${category?._id}`);
                                  dispatch(
                                    handleChangeSingleCategory(category)
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
                            )}
                            <button
                              onClick={() => {
                                navigate(`/category/${category?._id}`);
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
                                  handleDeleteCategoryFunction(
                                    category?._id,
                                    category?.fr?.name
                                  )
                                }
                                disabled={
                                  categoryRemoveLoading || categoryLoading
                                }
                              >
                                {categoryRemoveLoading &&
                                category?._id === categoryId ? (
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
                        <td colSpan="7">{t("No categories here")}.</td>
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
                    ? (pageNumber + 1) * categoriesPerPage > categories?.length
                      ? categories?.length
                      : (pageNumber + 1) * categoriesPerPage
                    : (pageNumber + 1) * categoriesPerPage >
                      fileterdData?.length
                    ? fileterdData?.length
                    : (pageNumber + 1) * categoriesPerPage}{" "}
                  {t("from")}{" "}
                  {fileterdData?.length === 0
                    ? categories?.length
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

export default Category;
