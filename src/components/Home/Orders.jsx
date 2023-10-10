import React, { useState } from "react";
import Search from "../Search";
import ReactPaginate from "react-paginate";
import { BiChevronsLeft, BiChevronsRight, BiPencil } from "react-icons/bi";
import { BiPrinter } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import OrderDetails from "../Orders/OrderDetails";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { handleFindSingleOrder } from "../../redux/OrderSlice";

const Orders = () => {
  const [showOrderDetails, setshowOrderDetails] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);

  const {
    orders,
    loading,
    addNewOrderLoading,
    deleteOrderLoading,
    deleteOrderID,
  } = useSelector((state) => state.root.orders);
  const { token, role } = useSelector((state) => state.root.auth);
  const { fileterdData } = useSelector((state) => state.root.globalStates);

  const dispatch = useDispatch();
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

  return (
    <>
      {showOrderDetails ? (
        <OrderDetails setshowOrderDetails={setshowOrderDetails} />
      ) : (
        <div className="lg:space-y-5 space-y-3 w-full">
          {/* search + buttons */}
          <div className="w-full flex items-center justify-between md:flex-row flex-col gap-4">
            <div className="lg:w-1/3 md:w-1/2 w-full">
              <Search data={orders} />
            </div>
            <div>
              <select name="filter" id="filter" className="filter_dropdown">
                <option value="newest">{t("newest")}</option>
                <option value="oldest">{t("oldest")}</option>
              </select>
            </div>
          </div>
          {/* table */}
          <div className="shadow-sm outline-none rounded-2xl md:mt-5 mt-3 py-3 px-4 bg-white overflow-x-scroll scrollbar">
            <table className="border-none outline-none w-full overflow-scroll">
              <thead className="w-full border-b border-gray-100 text-left">
                <tr>
                  <th className="p-4 whitespace-nowrap">
                    <span>Invoice no</span>
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
                    <tr
                      key={order?._id}
                      className="border-b last:border-none border-gray-200 w-full text-left"
                    >
                      <td className="p-4 whitespace-nowrap">
                        {order?.orderId}
                      </td>

                      <td className="text-left p-4 whitespace-nowrap">
                        {moment(order?.date).format("lll")}
                      </td>
                      <td className="text-left p-4 whitespace-nowrap">
                        {order?.subscriber?.fname} {order?.subscriber?.lname}
                      </td>
                      <td className="text-left p-4 whitespace-nowrap">Cash</td>
                      <td className="text-left p-4 whitespace-nowrap">
                        € {order?.total}
                      </td>
                      <td className="text-left p-4">
                        <select
                          name="status"
                          className="border border-gray-200 rounded-md p-1 font-medium"
                        >
                          <option value="on_hold">On hold</option>
                          <option value="order_received">Order received</option>
                          <option value="order_accepted">Order accepted</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="flex items-center justify-start p-4">
                        {/* <button
                          type="button"
                          className="hover:bg-gray-200 p-1 rounded-full h-10 w-10"
                        >
                          <BiPrinter
                            color="gray"
                            size={30}
                            className="inline-block mr-1"
                          />
                        </button> */}
                        <button
                          onClick={() => {
                            dispatch(handleFindSingleOrder(order?._id));
                            setshowOrderDetails(true);
                          }}
                          type="button"
                          className="hover:bg-gray-200 p-1 rounded-full h-10 w-10"
                        >
                          <BsEye
                            color="gray"
                            size={30}
                            className="inline-block"
                          />
                        </button>
                      </td>
                    </tr>
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
    </>
  );
};

export default Orders;
