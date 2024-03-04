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
  handleEditCategory,
} from "../../redux/CategoryAndTagsSlice";
import { handleLogout } from "../../redux/AuthSlice";
import { handleLogoutFromAllTabs } from "../../redux/GlobalStates";
import toast from "react-hot-toast";
import { RiDeleteBin6Line } from "react-icons/ri";
import { handleChangesingleImage, handleDeleteImage, handleGetImages } from "../../redux/ImageSlice";
import { PublicS3Url } from "../../BaseUrl";
import AddImage from "../../components/Image/AddImage";

const Images = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const [showAddImage, setShowAddImage] = useState(false);
  const [imageId, setImageId] = useState(null);

  const { token, role } = useSelector((state) => state.root.auth);

  const { images, loading, deleteLoading } = useSelector(
    (state) => state.root.image
  );

  const { fileterdData, isSidebarOpen, language } = useSelector(
    (state) => state.root.globalStates
  );

  const { AbortControllerRef } = useAbortApiCall();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();

  // pagination logic
  const imagesPerPage = 8;
  const pageVisited = pageNumber * imagesPerPage;
  let displayImages = [];
  if (!loading) {
    displayImages =
      images.length > 0 && fileterdData.length === 0
        ? images.slice(pageVisited, imagesPerPage + pageVisited)
        : fileterdData.slice(pageVisited, imagesPerPage + pageVisited);
  }
  const pageCount =
    fileterdData.length === 0
      ? Math.ceil(images.length / imagesPerPage)
      : Math.ceil(fileterdData.length / imagesPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleDeleteImageFunction = (id, name) => {
    if (window.confirm(t(`Are you sure?`))) {
      setImageId(id);
      const response = dispatch(
        handleDeleteImage({ token, id, signal: AbortControllerRef })
      );
      toast.loading("Deleting...");
      if (response) {
        response.then((res) => {
          if (res?.payload?.status === "success") {
            toast.remove();
            toast.success(`${name} ${t("Deleted Successfully")}.`);
          } else if (res?.payload?.status === "error") {
            toast.remove();
            toast.error(res?.payload?.message);
          }
          setImageId(null);
        });
      }
    }
  };

  useEffect(() => {
    const response = dispatch(handleGetImages({ token, lang: language }));
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
      <Helmet title="Image | Bois news media" />
      <div className="w-full flex items-start lg:gap-3 flex-row h-auto">
        <Sidebar />
        <section
          className={`h-full space-y-5 bg-[#FBFBFB] min-h-screen ${
            isSidebarOpen ? "xl:w-10/12 lg:w-4/5 w-full" : "lg:w-[90%] w-full"
          }`}
        >
          <Header />
          {showAddImage && <AddImage setShowAddImage={setShowAddImage} />}
          {!showAddImage && (
            <div className="lg:space-y-5 space-y-3 lg:p-5 p-3 w-full">
              {/* search + buttons */}
              <div className="w-full flex items-center justify-between md:flex-row flex-col gap-4">
                <div className="md:w-1/2 w-full">
                  <Search data={images} />
                </div>
                <div className="flex items-center gap-2 w-full justify-end">
                  {role === "admin" && (
                    <div className="relative w-auto flex-initial">
                      <button
                        className="blue_button"
                        onClick={() => {
                          setShowAddImage(true);
                        }}
                      >
                        + Add Image
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
                      <th className="p-4 pl-10 text-center">{t("Image")}</th>
                      <th className="p-4 pl-10 text-center">{t("Name")}</th>
                      <th className="p-4 pl-10 text-center">{t("Website")}</th>
                      <th className="p-4 pl-10 text-center">{t("Actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="w-full">
                    {loading ? (
                      <tr className="data_not_found_And_Loading">
                        <td colSpan="7">{t("Loading")}....</td>
                      </tr>
                    ) : images.length !== 0 && images !== undefined ? (
                      displayImages.map((image) => (
                        <tr
                          key={image?._id}
                          className="border-b last:border-none border-gray-200 w-full text-left pl-10 select-none"
                        >
                          <td className="text-center p-4 pl-10 whitespace-nowrap">
                            <img
                              src={PublicS3Url.concat(image?.image)}
                              alt=""
                              className="w-20 h-20 mx-auto object-contain rounded-lg"
                            />
                          </td>
                          <td className="text-center p-4 pl-10 whitespace-nowrap">
                            {image?.name}
                          </td>
                          <td className="text-center p-4 pl-10 whitespace-nowrap">
                            {image?.website}
                          </td>
                          <td className="flex items-center justify-center p-4 pl-10">
                            {(role === "admin" || role === "editor") && (
                              <button
                                onClick={() => {
                                  navigate(`/image/edit/${image?._id}`);
                                  dispatch(handleChangesingleImage(image));
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
                                navigate(`/image/${image?._id}`);
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
                                onClick={() => {
                                  handleDeleteImageFunction(
                                    image?._id,
                                    image?.name
                                  );
                                }}
                                disabled={deleteLoading || loading}
                              >
                                {deleteLoading && image?._id === imageId ? (
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
                        <td colSpan="7">{t("No images here")}.</td>
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
                    ? (pageNumber + 1) * imagesPerPage > images?.length
                      ? images?.length
                      : (pageNumber + 1) * imagesPerPage
                    : (pageNumber + 1) * imagesPerPage > fileterdData?.length
                    ? fileterdData?.length
                    : (pageNumber + 1) * imagesPerPage}{" "}
                  {t("from")}{" "}
                  {fileterdData?.length === 0
                    ? images?.length
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

export default Images;
