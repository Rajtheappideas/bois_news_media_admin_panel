import React, { useEffect, useState } from "react";
import Search from "../../components/Search";
import ReactPaginate from "react-paginate";
import { BiChevronsLeft, BiChevronsRight } from "react-icons/bi";
import OrderDetails from "../../components/Orders/OrderDetails";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { handleGetAllOrder, handlerFilterOrders } from "../../redux/OrderSlice";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import SingleOrderList from "../../components/Orders/SingleOrderList";
import AddOrder from "../../components/Orders/AddOrder";
import { Helmet } from "react-helmet";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { handleLogout } from "../../redux/AuthSlice";
import { handleLogoutFromAllTabs } from "../../redux/GlobalStates";
import toast from "react-hot-toast";

const Orders = () => {
  const [showOrderDetails, setshowOrderDetails] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [showAddOrder, setShowAddOrder] = useState(false);

  const { orders, loading, filterType } = useSelector(
    (state) => state.root.orders
  );
  const { fileterdData, isSidebarOpen } = useSelector(
    (state) => state.root.globalStates
  );
  const { role, token } = useSelector((state) => state.root.auth);

  const dispatch = useDispatch();

  const { abortApiCall ,AbortControllerRef} = useAbortApiCall();

  const { t } = useTranslation();

  // pagination logic
  const ordersPerPage = 8;
  const pageVisited = pageNumber * ordersPerPage;
  let displayOrders = [];
  if (!loading) {
    displayOrders =
      orders?.length > 0 && fileterdData.length === 0
        ? orders.slice(pageVisited, ordersPerPage + pageVisited)
        : fileterdData.slice(pageVisited, ordersPerPage + pageVisited);
  }
  const pageCount =
    fileterdData.length === 0
      ? Math.ceil(orders?.length / ordersPerPage)
      : Math.ceil(fileterdData?.length / ordersPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  useEffect(() => {
    return () => abortApiCall();
  }, []);

  useEffect(() => {
    if (fileterdData && fileterdData.length > 0) {
      setPageNumber(0);
    }
  }, [fileterdData]);

  
  // fetch orders
  useEffect(() => {
    const response = dispatch(
      handleGetAllOrder({ token, signal: AbortControllerRef })
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
  }, []);

  return (
    <>
      <Helmet title="Orders | Bois News Media" />
      <div className="w-full flex items-start lg:gap-3 flex-row h-auto">
        <Sidebar />
        <section
          className={`h-full space-y-5 bg-[#FBFBFB] min-h-screen ${
            isSidebarOpen ? "xl:w-10/12 lg:w-4/5 w-full" : "lg:w-[90%] w-full"
          }`}
        >
          <Header />
          <div className="lg:p-5 p-3 ">
            {showOrderDetails && !showAddOrder && (
              <OrderDetails setshowOrderDetails={setshowOrderDetails} />
            )}
            {!showOrderDetails && showAddOrder && (
              <AddOrder setShowAddOrder={setShowAddOrder} />
            )}

            {!showOrderDetails && !showAddOrder && (
              <div className="lg:space-y-5 space-y-3 w-full">
                {/* search + buttons */}
                <div className="w-full flex items-center justify-between md:flex-row flex-col gap-4">
                  <div className="lg:w-1/3 md:w-1/2 w-full">
                    <Search data={orders} />
                  </div>
                  <div>
                    <select
                      onChange={(e) =>
                        dispatch(handlerFilterOrders(e.target.value))
                      }
                      name="filter"
                      id="filter"
                      className="filter_dropdown"
                      value={filterType}
                    >
                      <option value="newest">{t("newest")}</option>
                      <option value="oldest">{t("oldest")}</option>
                    </select>
                    {role === "admin" && (
                      <button
                        className="gray_button"
                        onClick={() => setShowAddOrder(true)}
                      >
                        + {t("Add new")}
                      </button>
                    )}
                  </div>
                </div>
                {/* table */}
                <div className="shadow-sm outline-none rounded-2xl md:mt-5 mt-3 py-3 px-4 bg-white overflow-x-scroll scrollbar">
                  <table className="border-none outline-none w-full overflow-scroll">
                    <thead className="w-full border-b border-gray-100 text-left">
                      <tr>
                        <th className="p-4 whitespace-nowrap">
                          <span>Invoice Id</span>
                        </th>
                        <th className="p-4">{t("Order date & time")}</th>
                        <th className="p-4">{t("Customer name")}</th>
                        <th className="p-4">{t("Pay method")}</th>
                        <th className="p-4">{t("Amount")}</th>
                        <th className="p-4">{t("Status")}</th>
                        <th className="p-4">{t("Action")}</th>
                      </tr>
                    </thead>
                    <tbody className="w-full">
                      {loading ? (
                        <tr className="data_not_found_And_Loading">
                          <td colSpan="7">{t("Loading")}....</td>
                        </tr>
                      ) : orders !== undefined && orders.length > 0 ? (
                        displayOrders.map((order) => (
                          <SingleOrderList
                            key={order?._id}
                            order={order}
                            setshowOrderDetails={setshowOrderDetails}
                          />
                        ))
                      ) : (
                        <tr className="data_not_found_And_Loading">
                          <td colSpan="7">{t("No Orders here")}.</td>
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
                      ? (pageNumber + 1) * ordersPerPage > orders?.length
                        ? orders?.length
                        : (pageNumber + 1) * ordersPerPage
                      : (pageNumber + 1) * ordersPerPage > fileterdData?.length
                      ? fileterdData?.length
                      : (pageNumber + 1) * ordersPerPage}{" "}
                    {t("from")}{" "}
                    {fileterdData?.length === 0
                      ? orders?.length
                      : fileterdData.length}{" "}
                    {t("Orders")}
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

export default Orders;
