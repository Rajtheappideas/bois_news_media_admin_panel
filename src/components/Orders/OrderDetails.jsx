import React from "react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { BiPrinter } from "react-icons/bi";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import Print from "react-to-print";
import { useSelector, useDispatch } from "react-redux";
import { handleFindSingleOrder } from "../../redux/OrderSlice";
import moment from "moment";

const OrderDetails = ({ setshowOrderDetails }) => {
  const { singleOrder, loading } = useSelector((s) => s.root.orders);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const printComponentRef = useRef();

  return (
    <div className="w-full lg:space-y-5 space-y-3">
      {/* title + buttons */}
      <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
        <p
          onClick={() => {
            dispatch(handleFindSingleOrder(null));
            setshowOrderDetails(false);
          }}
          className="font-semibold text-left lg:text-xl text-lg cursor-pointer"
        >
          <MdOutlineKeyboardBackspace
            size={25}
            className="inline-block pb-1 mr-1"
          />
          {t("Order Detail")}
        </p>
        <div className="flex flex-wrap cursor-pointer gray_button items-center text-black justify-start md:gap-3 gap-1">
          <Print
            trigger={() => (
              <button>
                <BiPrinter
                  size={25}
                  color="white"
                  className="inline-block mr-1"
                />
                {t("Print")}
              </button>
            )}
            documentTitle="Invoice_bois_news_media"
            content={() => printComponentRef.current}
          >
            {t("Print")}
          </Print>
        </div>
      </div>
      {/* main div */}
      <div
        ref={printComponentRef}
        className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-2"
      >
        <div>
          <p className="font-bold text-black md:text-4xl text-xl">
            {t("Invoice")}
          </p>
          <p className="font-bold text-black md:text-lg">
            {t("Status")}:<span className="text-green-500 ml-1">{singleOrder?.status}</span>
          </p>
        </div>
        {/*invoice details */}
        <div className="w-full grid xl:grid-cols-4 md:grid-cols-2 place-items-start items-start md:gap-5 gap-2">
          {/* date */}
          <div className="w-full md:space-y-2">
            <label htmlFor="date" className="Label">
              {t("Date")}
            </label>
            <p className="text-textBlack font-medium md:text-lg">
              {moment(singleOrder?.date).format("lll")}
            </p>
          </div>
          {/* Payment method */}
          <div className="w-full md:space-y-2">
            <label htmlFor="payment_method" className="Label">
              {t("Payment method")}
            </label>
            <p className="text-textBlack font-medium md:text-lg">Cash</p>
          </div>
          {/* Contact */}
          <div className="w-full md:space-y-2">
            <label htmlFor="Contact" className="Label">
              {t("Contact")}
            </label>
            <p className="text-textBlack font-medium md:text-lg">
              {singleOrder?.subscriber?.fname} {singleOrder?.subscriber?.lname}{" "}
            </p>
            <p className="text-textBlack font-medium md:text-lg">
              {singleOrder?.subscriber?.email}
            </p>
            <p className="text-textBlack font-medium md:text-lg">
              {singleOrder?.subscriber?.phone}
            </p>
          </div>
          {/* Address */}
          <div className="w-full md:space-y-2">
            <label htmlFor="Address" className="Label">
              {t("Address")}
            </label>
            <p className="text-textBlack font-medium md:text-lg">
              {singleOrder?.billingAddress?.zipCode}{" "}
              {singleOrder?.billingAddress?.address1},<br />{" "}
              {singleOrder?.billingAddress?.city},<br />{" "}
              {singleOrder?.billingAddress?.province},<br />
              {singleOrder?.billingAddress?.country}
            </p>
          </div>
        </div>
        {/* table */}
        <div className="outline-none rounded-2xl md:mt-5 mt-3 py-3 px-4 bg-white overflow-x-scroll scrollbar">
          <table className="border-none outline-none w-full overflow-scroll">
            <thead className="w-full border-b border-gray-100 text-center">
              <tr className="bg-textColor/20">
                <th className="p-4 whitespace-nowrap">
                  <span>Sr no.</span>
                </th>
                <th className="p-4 whitespace-nowrap">{t("Product title")}</th>
                <th className="p-4 whitespace-nowrap">{t("Quantity")}</th>
                <th className="p-4 whitespace-nowrap">{t("Item price")}</th>
                <th className="p-4 whitespace-nowrap">{t("Amount")}</th>
              </tr>
            </thead>
            <tbody className="w-full">
              {singleOrder?.items &&
                singleOrder?.items.map((item, i) => (
                  <tr
                    key={item?._id}
                    className="border-b border-gray-200 w-full text-center"
                  >
                    <td className="p-4 whitespace-nowrap">{i + 1}</td>
                    <td className="p-4 whitespace-nowrap">{item?.title}</td>
                    <td className="p-4 whitespace-nowrap">{item?.quantity}</td>
                    <td className="p-4 whitespace-nowrap">€ {item?.price}</td>
                    <td className="p-4 whitespace-nowrap">
                      € {parseFloat(item?.price) * parseInt(item?.quantity)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="border border-gray-200 w-full flex justify-between items-start rounded-md p-3">
          <div className="md:w-3/5 w-0" />
          <div className="md:w-2/5 w-full md:space-y-3 space-y-2">
            <div className="w-full flex items-center justify-between">
              <p className="w-1/2 font-semibold uppercase">{t("sub total")}</p>
              <p className="w-1/2 text-right">€ {parseFloat(singleOrder?.subtotal).toFixed(2)}</p>
            </div>
            <div className="w-full flex items-center justify-between">
              <p className="w-1/2 font-semibold uppercase">
                {t("shipping cost")}
              </p>
              <p className="w-1/2 text-right">€ {singleOrder?.shipping}</p>
            </div>
            <div className="w-full flex items-center justify-between">
              <p className="w-1/2 font-semibold uppercase">{"discount"}</p>
              <p className="w-1/2 text-right">€ {singleOrder?.discount}</p>
            </div>
            <div className="w-full flex items-center justify-between">
              <p className="w-1/2 font-semibold uppercase">
                {"promo code discount"}{" "}
                <span className="text-sm lowercase font-light">
                  (code : {singleOrder?.promoCode})
                </span>
              </p>
              <p className="w-1/2 text-right">
                € {singleOrder?.promoDiscount}{" "}
              </p>
            </div>
            <div className="w-full flex items-center justify-between">
              <p className="w-1/2 font-semibold uppercase">{"tax"}</p>
              <p className="w-1/2 text-right">€ {singleOrder?.tax}</p>
            </div>
            <div className="w-full flex items-center justify-between border-t-2">
              <p className="w-1/2 font-bold ">{t("Total Amount")}</p>
              <p className="w-1/2 text-right font-bold">
                € {parseFloat(singleOrder?.total).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
