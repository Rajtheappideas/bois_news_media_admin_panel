import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Search from "../../components/Search";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import { useTranslation } from "react-i18next";
import { BiChevronsLeft, BiChevronsRight, BiPencil } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import AddInvoice from "../../components/Invoice/AddInvoice";
import {
  handleFindInvoice,
  handleGetAllInvoice,
} from "../../redux/InvoiceSlice";
import { handleLogout } from "../../redux/AuthSlice";
import { handleLogoutFromAllTabs } from "../../redux/GlobalStates";
import { handleGetAllOrder } from "../../redux/OrderSlice";
import toast from "react-hot-toast";
import InvoiceDetails from "../../components/Invoice/InvoiceDetails";
import moment from "moment";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const Invoices = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState([]);

  const { token, role } = useSelector((state) => state.root.auth);

  const { invoices, loading, updateLoading } = useSelector(
    (state) => state.root.invoice
  );

  const { fileterdData, isSidebarOpen } = useSelector(
    (state) => state.root.globalStates
  );

  const { AbortControllerRef } = useAbortApiCall();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const modalRef = useRef(null);

  const { state } = useLocation();

  const { t } = useTranslation();

  // pagination logic
  const invoicesPerPage = 8;
  const pageVisited = pageNumber * invoicesPerPage;
  let displayInvoices = [];
  if (!loading) {
    displayInvoices =
      invoices.length > 0 && fileterdData.length === 0
        ? invoices.slice(pageVisited, invoicesPerPage + pageVisited)
        : fileterdData.slice(pageVisited, invoicesPerPage + pageVisited);
  }
  const pageCount =
    fileterdData.length === 0
      ? Math.ceil(invoices.length / invoicesPerPage)
      : Math.ceil(fileterdData.length / invoicesPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  function ExcelExport(data, fileName) {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    let products = data.map(
      ({
        order,
        subscriber,
        invoiceId,
        total,
        subtotal,
        items,
        email,
        VAT,
        companyName,
        paymentMethod,
        date,
        discount,
      }) => ({
        invoiceId,
        orderId: order,
        subscriberName: `${subscriber?.fname} ${subscriber?.lname}`,
        subscriberEmail: subscriber?.email,
        email,
        companyName,
        paymentMethod,
        date: moment(date).format("LLL"),
        subtotal,
        discount,
        total,
        items: items.map((item) => item),
        VAT,
      })
    );

    const exportToCSV = (products) => {
      const ws = XLSX.utils.json_to_sheet(products);
      XLSX.utils.sheet_add_aoa(
        ws,
        [
          [
            "invoiceId",
            "order",
            "subscriberName",
            "subscriberEmail",
            "email",
            "companyName",
            "paymentMethod",
            "date",
            "subtotal",
            "discount",
            "total",
            "items",
            "VAT",
          ],
        ],
        {
          origin: "A1",
        }
      );

      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, {
        bookType: "xlsx",
        type: "array",
      });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, fileName + fileExtension);
      setShowDateModal(false);
      setSelectedDate([]);
      toast.remove();
    };

    exportToCSV(products);
  }

  function ExportDataInBetweenRange(e) {
    if (e[1] === undefined || e[1] === null) return;
    const startDate = moment(e[0]).format("L").split("/");
    const endDate = moment(e[1]).format("L").split("/");
    let modifyStartDate = startDate.splice(startDate.length - 1, 1);
    let modifyEndDate = endDate.splice(endDate.length - 1, 1);
    modifyStartDate = modifyStartDate.concat(startDate).join("-");
    modifyEndDate = modifyEndDate.concat(endDate).join("-");
    const data = invoices.map((i) => {
      if (moment(i.date).isBetween(modifyStartDate, modifyEndDate, "date")) {
        return i;
      } else if (
        moment(i.date).isSame(modifyStartDate, "date") ||
        moment(i.date).isSame(modifyEndDate, "date")
      ) {
        return i;
      }
    });
    toast.loading("Downloading...");
    return ExcelExport(data, `invoices ${modifyStartDate} to ${modifyEndDate}`);
  }

  function showButtonText() {
    if (!showDateModal && selectedDate.length === 0) {
      return `Download Invoices`;
    } else if (showDateModal && selectedDate.length === 0) {
      return `Select first date`;
    } else if (showDateModal && selectedDate.length === 1) {
      return `Select second date`;
    }
  }

  useEffect(() => {
    if (fileterdData && fileterdData.length > 0) {
      setPageNumber(0);
    }
  }, [fileterdData]);

  useEffect(() => {
    if (state) {
      setShowAddInvoice(true);
      setOrderId(state?.orderId);
    }

    const response = dispatch(
      handleGetAllInvoice({ token, signal: AbortControllerRef })
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
    dispatch(handleGetAllOrder({ token, signal: AbortControllerRef }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event?.target)) {
        setShowDateModal(false);
        setSelectedDate([]);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);
  
  function handleClickOutside() {
    setShowDateModal(false);
    setSelectedDate([]);
  }

  return (
    <>
      <Helmet title="Invoices | Bois news media" />
      <div className="w-full flex items-start lg:gap-3 flex-row h-auto">
        <Sidebar />
        <section
          className={`h-full space-y-5 bg-[#FBFBFB] min-h-screen ${
            isSidebarOpen ? "xl:w-10/12 lg:w-4/5 w-full" : "lg:w-[90%] w-full"
          }`}
        >
          <Header />
          {showInvoiceDetails && !showAddInvoice && (
            <InvoiceDetails setShowInvoiceDetails={setShowInvoiceDetails} />
          )}
          {showAddInvoice && !showInvoiceDetails && (
            <AddInvoice
              orderId={orderId}
              setOrderId={setOrderId}
              setShowAddInvoice={setShowAddInvoice}
            />
          )}{" "}
          {!showAddInvoice && !showInvoiceDetails && (
            <div className="lg:space-y-5 space-y-3 lg:p-5 p-3 w-full">
              {/* search + buttons */}
              <div className="w-full flex items-center justify-between md:flex-row flex-col gap-4">
                <div className="lg:w-1/3 md:w-1/2 w-full">
                  <Search data={invoices} />
                </div>
                <div className="flex items-center gap-2 w-full justify-end">
                  {role === "admin" && (
                    <div
                      ref={modalRef}
                      className="relative w-auto flex-initial"
                    >
                      <button
                        className="blue_button"
                        onClick={() => {
                          setShowDateModal((prev) => !prev);
                          setSelectedDate([]);
                        }}
                      >
                        {t("Download Invoices")}
                        {/* {showButtonText()} */}
                      </button>
                      <Calendar
                        maxDate={new Date()}
                        goToRangeStartOnSelect={true}
                        selectRange={true}
                        onChange={(e) => {
                          setSelectedDate(e);
                          ExportDataInBetweenRange(e);
                        }}
                        minDate={new Date(invoices[0]?.date)}
                        value={selectedDate}
                        className={`absolute top-10 md:right-0 -right-10 md:min-w-[25vw] min-w-fit ${
                          showDateModal ? "scale-100" : "scale-0"
                        } transition-all duration-300 ease-in origin-top `}
                      />
                    </div>
                  )}
                  {role === "admin" && (
                    <div className="flex items-center gap-3">
                      <button
                        className="gray_button"
                        onClick={() => setShowAddInvoice(true)}
                      >
                        + {t("Add new")}
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
                      <th className="pl-10 whitespace-nowrap text-center">
                        <label htmlFor="id">
                          <span>ID</span>
                        </label>
                      </th>
                      <th className="p-4 pl-10 text-center">{t("Name")}</th>
                      <th className="p-4 pl-10 text-center">{t("company")}</th>
                      <th className="p-4 pl-10 text-center">{t("Email")}</th>
                      <th className="p-4">{t("Action")}</th>
                    </tr>
                  </thead>
                  <tbody className="w-full">
                    {loading ? (
                      <tr className="data_not_found_And_Loading">
                        <td colSpan="7">{t("Loading")}....</td>
                      </tr>
                    ) : invoices.length !== 0 && invoices !== undefined ? (
                      displayInvoices.map((invoice) => (
                        <tr
                          key={invoice?._id}
                          className="border-b last:border-none border-gray-200 w-full text-left pl-10 select-none"
                        >
                          <td className="pl-10 text-center whitespace-nowrap">
                            <label htmlFor={invoice?.invoiceId}>
                              <span className="font-bold text-center">
                                {invoice?.invoiceId}
                              </span>
                            </label>
                          </td>

                          <td className="text-center p-4 pl-10 whitespace-nowrap">
                            {invoice?.subscriber?.fname}&nbsp;
                            {invoice?.subscriber?.lname}
                          </td>
                          <td className="text-center p-4 pl-10 whitespace-nowrap">
                            {invoice?.companyName ? invoice?.companyName : "-"}
                          </td>
                          <td className="text-center p-4 pl-10 whitespace-nowrap">
                            {invoice?.subscriber?.email}
                          </td>
                          <td className="flex items-center justify-center p-4">
                            {(role === "admin" || role === "editor") && (
                              <button
                                onClick={() => {
                                  navigate(`/invoice/${invoice?._id}`);
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
                                setShowInvoiceDetails(true);
                                dispatch(handleFindInvoice(invoice?._id));
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
                            {/* {role === "admin" && (
                                <button
                                  type="button"
                                  className="hover:bg-red-200 p-1 rounded-full h-10 w-10"
                                  // onClick={() =>
                                  // //   handleDeletesubscriber(
                                  // //     subscriber?._id,
                                  // //     subscriber?.fname.concat(subscriber?.lname)
                                  // //   )
                                  // }
                                  disabled={
                                    updateLoading ||
                                    loading
                                  }
                                >
                                  {deleteLoading &&
                                  invoice?._id === deleteSubscriberID ? (
                                    "..."
                                  ) : (
                                    <RiDeleteBin6Line
                                      color="red"
                                      size={30}
                                      className="inline-block"
                                    />
                                  )}
                                </button>
                              )} */}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="data_not_found_And_Loading">
                        <td colSpan="7">{t("No Invoices here")}.</td>
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
                    ? (pageNumber + 1) * invoicesPerPage > invoices?.length
                      ? invoices?.length
                      : (pageNumber + 1) * invoicesPerPage
                    : (pageNumber + 1) * invoicesPerPage > fileterdData?.length
                    ? fileterdData?.length
                    : (pageNumber + 1) * invoicesPerPage}{" "}
                  {t("from")}{" "}
                  {fileterdData?.length === 0
                    ? invoices?.length
                    : fileterdData.length}{" "}
                  {t("Subscribers")}
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

export default Invoices;
