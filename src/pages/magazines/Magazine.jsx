import React, { useEffect, useRef, useState } from "react";
import Search from "../../components/Search";
import ReactPaginate from "react-paginate";
import { BiChevronsLeft, BiChevronsRight, BiPencil } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { HiOutlineDownload } from "react-icons/hi";
import AddnewMagazine from "../../components/Magazine/AddnewMagazine";
<<<<<<< HEAD
import EditMagazineDetails from "./EditMagazineDetails";
=======
>>>>>>> raj_appideas
import {
  handleChangeDeleteID,
  handleDeleteMAGAZINE,
  handleDeleteMagazine,
  handleFindMagazine,
  handleGetAllMagazine,
  handleGetMagazineById,
  handlerFilterMagazine,
} from "../../redux/MagazineSlice";
import { useDispatch, useSelector } from "react-redux";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import { toast } from "react-hot-toast";
import { BsEye } from "react-icons/bs";
import ShowMagazineDetails from "../../components/Magazine/ShowMagazineDetails";
import BaseUrl from "../../BaseUrl";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { handleLogout } from "../../redux/AuthSlice";
import { handleLogoutFromAllTabs } from "../../redux/GlobalStates";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
=======
import DownloadButton from "../../components/DownloadButton";
>>>>>>> raj_appideas

const Magazine = () => {
  const [showAddnewMagazine, setshowAddnewMagazine] = useState(false);
  const [showMagazineDetails, setShowMagazineDetails] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
  const [downloadDropdownId, setDownloadDropdownId] = useState(null);

  const {
    magazines,
    loading,
    addNewMagazineLoading,
    deleteMagazineLoading,
    deleteMagazineID,
    filterType,
    singleMagazineLoading,
  } = useSelector((state) => state.root.magazines);

  const { token, role } = useSelector((state) => state.root.auth);
  const { fileterdData, isSidebarOpen } = useSelector(
    (state) => state.root.globalStates,
  );

  const { AbortControllerRef } = useAbortApiCall();

  const downloadRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();

  // pagination logic
  const magazinePerPage = 8;
  const pageVisited = pageNumber * magazinePerPage;
  let displayMagazine = [];
  if (!loading) {
    displayMagazine =
      magazines?.length > 0 && fileterdData.length === 0
        ? magazines.slice(pageVisited, magazinePerPage + pageVisited)
        : fileterdData.slice(pageVisited, magazinePerPage + pageVisited);
  }
  const pageCount =
    fileterdData.length === 0
      ? Math.ceil(magazines?.length / magazinePerPage)
      : Math.ceil(fileterdData.length / magazinePerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleDeletemagazine = (id, name) => {
    if (window.confirm(t("Are you sure?"))) {
      dispatch(handleChangeDeleteID(id));

      const response = dispatch(
        handleDeleteMAGAZINE({ id, token, signal: AbortControllerRef }),
      );
      if (response) {
        response.then((res) => {
          if (res?.payload?.status === "success") {
            dispatch(handleDeleteMagazine(id));
            toast.success(`${name} ${t("magazine Deleted Successfully")}.`);
          } else if (res?.payload?.status === "error") {
            toast.error(res?.payload?.message);
          }
        });
      }
    }
  };

  const handleFetchSingleMagazine = (id, magId) => {
    if (singleMagazineLoading) return;
    toast.loading("Fetching...", { duration: Infinity });
    const response = dispatch(
      handleGetMagazineById({ id, token, signal: AbortControllerRef }),
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.remove();
          navigate(`/magazines/${magId}`, { state: { _id: id } });
        } else {
          toast.remove();
        }
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (downloadRef.current && !downloadRef.current.contains(event?.target)) {
        setShowDownloadDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    setShowDownloadDropdown(false);
  }

  useEffect(() => {
    if (fileterdData && fileterdData.length > 0) {
      setPageNumber(0);
    }
  }, [fileterdData]);

  // fetch magainzes
  useEffect(() => {
    const response = dispatch(
      handleGetAllMagazine({ token, signal: AbortControllerRef }),
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
      <Helmet title="Magazines | Bois News Media" />
      <div className="w-full flex items-start lg:gap-3 flex-row h-auto">
        <Sidebar />
        <section
<<<<<<< HEAD
          className={`h-full space-y-5 bg-[#FBFBFB] min-h-screen ${
            isSidebarOpen ? "xl:w-10/12 lg:w-4/5 w-full" : "lg:w-[90%] w-full"
          }`}
=======
          className={`h-full space-y-5 bg-[#FBFBFB] min-h-screen ${isSidebarOpen ? "xl:w-10/12 lg:w-4/5 w-full" : "lg:w-[90%] w-full"
            }`}
>>>>>>> raj_appideas
        >
          <Header />
          <div className="lg:p-5 p-3 ">
            {showAddnewMagazine && !showMagazineDetails && (
              <AddnewMagazine setshowAddnewMagazine={setshowAddnewMagazine} />
            )}

            {!showAddnewMagazine && showMagazineDetails && (
              <ShowMagazineDetails
                setShowMagazineDetails={setShowMagazineDetails}
              />
            )}
            {!showAddnewMagazine && !showMagazineDetails && (
              <div className="lg:space-y-5 space-y-3 w-full">
                {/* search + buttons */}
                <div className="w-full flex items-center justify-between md:flex-row flex-col md:gap-4 gap-2">
                  <div className="lg:w-1/3 md:w-1/2 w-full">
                    <Search data={magazines} />
                  </div>
                  <div>
                    <select
                      name="filter"
                      onChange={(e) =>
                        dispatch(handlerFilterMagazine(e.target.value))
                      }
                      value={filterType}
                      id="filter"
                      className="filter_dropdown"
                    >
                      <option value="newest">{t("newest")}</option>
                      <option value="oldest">{t("oldest")}</option>
                    </select>
                    {role === "admin" && (
                      <button
                        className="gray_button"
                        onClick={() => setshowAddnewMagazine(true)}
                      >
                        + {t("Add new")}
                      </button>
                    )}
                  </div>
                </div>
                {/* table */}
                <div className="shadow-sm outline-none rounded-2xl md:mt-5 mt-3 py-3 px-4 bg-white overflow-x-scroll scrollbar h-auto">
                  <table className="border-none outline-none w-full overflow-scroll">
                    <thead className="w-full border-b border-gray-100 text-left">
                      <tr className="whitespace-nowrap">
                        <th className="md:p-4 p-2 whitespace-nowrap">
                          <label htmlFor="sr_no">
                            <span>Sr no</span>
                          </label>
                        </th>
                        <th className="md:p-4 p-2">{t("Magazine name")}</th>
                        <th className="md:p-4 p-2">{t("Digital Price")}</th>
                        <th className="md:p-4 p-2">{t("Paper Price")}</th>
                        <th className="md:p-4 p-2">{t("Stock")}</th>
                        <th className="md:p-4 p-2 text-center">
                          {t("Status")}
                        </th>
                        <th className="md:p-4 p-2 text-center">
                          {t("Action")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="w-full">
                      {loading ? (
                        <tr className="data_not_found_And_Loading">
                          <td colSpan="7">{t("Loading")}....</td>
                        </tr>
                      ) : magazines?.length !== 0 && magazines !== undefined ? (
                        displayMagazine.map((magazine) => (
                          <tr
                            key={magazine?._id}
                            className="border-b last:border-none border-gray-200 whitespace-nowrap w-full text-left pl-10 select-none"
                          >
                            <td className="md:p-4 p-2">
                              <label htmlFor={magazine?._id}>
                                <span className="font-bold text-center">
                                  {magazine?.magazineId}
                                </span>
                              </label>
                            </td>
                            <td className="text-left md:p-4 p-2 whitespace-nowrap">
                              {magazine?.title}
                            </td>
                            <td className="text-left md:p-4 p-2 whitespace-nowrap">
                              $ {magazine?.priceDigital}
                            </td>
                            <td className="text-left md:p-4 p-2 whitespace-nowrap">
                              $ {magazine?.pricePaper}
                            </td>

                            <td className="text-left md:p-4 p-2 whitespace-nowrap">
                              {magazine?.stock ?? "-"}
                            </td>
                            <td className="text-center md:p-4 p-2 whitespace-nowrap">
                              {magazine?.status ?? "-"}
                            </td>
                            <td className="flex items-center justify-center md:p-4 p-2">
                              {role === "admin" || role === "editor" ? (
                                <button
                                  onClick={() => {
                                    handleFetchSingleMagazine(
                                      magazine?._id,
                                      magazine?.magazineId,
                                    );
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
                                    setShowMagazineDetails(true);
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

                              <div className="relative">
                                <button
                                  type="button"
                                  className="hover:bg-green-200 p-1 rounded-full h-10 w-10"
                                  onClick={() => {
                                    setShowDownloadDropdown(true);
                                    setDownloadDropdownId(magazine?._id);
                                  }}
                                >
                                  <HiOutlineDownload
                                    color="green"
                                    size={30}
                                    className="inline-block mr-1"
                                  />
                                </button>
                                <p
<<<<<<< HEAD
                                  className={`origin-center ${
                                    showDownloadDropdown &&
                                    downloadDropdownId === magazine?._id
                                      ? "scale-100"
                                      : "scale-0"
                                  } absolute z-10 -top-16 md:-left-6 -left-16 shadow-md rounded-lg bg-white w-44 whitespace-nowrap h-auto p-3 transition`}
=======
                                  className={`origin-center ${showDownloadDropdown &&
                                    downloadDropdownId === magazine?._id
                                    ? "scale-100"
                                    : "scale-0"
                                    } absolute z-10 -top-16 md:-left-6 -left-16 shadow-md rounded-lg bg-white w-44 whitespace-nowrap h-auto p-3 transition`}
>>>>>>> raj_appideas
                                  ref={downloadRef}
                                >
                                  <ul className="space-y-1 text-sm">
                                    <li className="hover:bg-gray-200 transition duration-100 cursor-pointer p-1">
<<<<<<< HEAD
                                      <a
                                        href={BaseUrl.concat(magazine?.pdf)}
                                        download
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        Magazine pdf
                                      </a>
                                    </li>
                                    <hr />
                                    <li className="hover:bg-gray-200 transition break-words whitespace-normal duration-100 cursor-pointer p-1">
                                      <a
                                        href={BaseUrl.concat(
                                          magazine?.digitalSubscribers,
                                        )}
                                        download
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        Routing file (digital subscribers)
                                      </a>
                                    </li>
                                    <hr />
                                    <li className="hover:bg-gray-200 transition  break-words whitespace-normal duration-100 cursor-pointer p-1">
                                      <a
                                        href={BaseUrl.concat(
                                          magazine?.paperSubscribers,
                                        )}
                                        download
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        Routing file (paper subscribers)
                                      </a>
                                    </li>
                                    <hr />

                                    <li className="hover:bg-gray-200 transition break-words whitespace-normal duration-100 cursor-pointer p-1">
                                      <a
                                        href={BaseUrl.concat(
                                          magazine?.paperProspectsPartners,
                                        )}
                                        download
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        Routing file (paper partners &
                                        prospects)
                                      </a>
=======
                                      <DownloadButton filePath={magazine?.pdf} label="Magazine pdf" />
                                    </li>
                                    <hr />
                                    <li className="hover:bg-gray-200 transition break-words whitespace-normal duration-100 cursor-pointer p-1">
                                      <DownloadButton filePath={magazine?.digitalSubscribers} label="Routing file (digital subscribers)" />
                                    </li>
                                    <hr />
                                    <li className="hover:bg-gray-200 transition  break-words whitespace-normal duration-100 cursor-pointer p-1">
                                      <DownloadButton filePath={magazine?.paperSubscribers} label="Routing file (paper subscribers)" />
                                    </li>
                                    <hr />
                                    <li className="hover:bg-gray-200 transition break-words whitespace-normal duration-100 cursor-pointer p-1">
                                      <DownloadButton filePath={magazine?.paperProspectsPartners} label="Routing file (paper partners &
                                        prospects)" />
>>>>>>> raj_appideas
                                    </li>
                                    <hr />

                                    <li className="hover:bg-gray-200 break-words  whitespace-normal transition duration-100 cursor-pointer p-1">
<<<<<<< HEAD
                                      <a
                                        href={BaseUrl.concat(
                                          magazine?.digitalProspectsPartners,
                                        )}
                                        download
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        Routing file (digital partners &
                                        prospects)
                                      </a>
=======
                                      <DownloadButton filePath={magazine?.digitalProspectsPartners} label=" Routing file (digital partners &
                                        prospects)" />
>>>>>>> raj_appideas
                                    </li>
                                  </ul>
                                </p>
                              </div>
                              {role === "admin" && (
                                <button
                                  type="button"
                                  className="hover:bg-red-200 p-1 rounded-full h-10 w-10"
                                  onClick={() =>
                                    handleDeletemagazine(
                                      magazine?._id,
                                      magazine?.title,
                                    )
                                  }
                                  disabled={
                                    addNewMagazineLoading ||
                                    deleteMagazineLoading ||
                                    loading
                                  }
                                >
                                  {deleteMagazineLoading &&
<<<<<<< HEAD
                                  magazine?._id === deleteMagazineID ? (
=======
                                    magazine?._id === deleteMagazineID ? (
>>>>>>> raj_appideas
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
                          <td colSpan="7">{t("No magazines here")}.</td>
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
                      ? (pageNumber + 1) * magazinePerPage > magazines?.length
                        ? magazines?.length
                        : (pageNumber + 1) * magazinePerPage
                      : (pageNumber + 1) * magazinePerPage >
<<<<<<< HEAD
                          fileterdData?.length
=======
                        fileterdData?.length
>>>>>>> raj_appideas
                        ? fileterdData?.length
                        : (pageNumber + 1) * magazinePerPage}{" "}
                    {t("from")}{" "}
                    {fileterdData?.length === 0
                      ? magazines?.length
                      : fileterdData.length}{" "}
                    {t("Magazines")}
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

export default Magazine;
