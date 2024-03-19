import React, { useEffect } from "react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { BiPrinter } from "react-icons/bi";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import Print from "react-to-print";
import { useSelector, useDispatch } from "react-redux";
import { handleFindSingleOrder } from "../../redux/OrderSlice";
import moment from "moment";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { handleClearFilteredData } from "../../redux/GlobalStates";

const OrderDetails = ({ setshowOrderDetails }) => {
  const { singleOrder, loading } = useSelector((s) => s.root.orders);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const printComponentRef = useRef();

  function getProductTitle(item) {
    return `${t(item?.itemType)} ${t(item?.support)} ${item?.title}`;
  }

  return (
    <div className="w-full lg:space-y-5 space-y-3">
      {/* title + buttons */}
      <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
        <p
          onClick={() => {
            dispatch(handleFindSingleOrder(null));
            setshowOrderDetails(false);
            dispatch(handleClearFilteredData());
          }}
          className="font-semibold text-left lg:text-xl text-lg cursor-pointer"
        >
          <MdOutlineKeyboardBackspace
            size={25}
            className="inline-block pb-1 mr-1"
          />
          {t("Order Detail")}
        </p>
        <div className="flex flex-wrap  items-center text-black justify-start md:gap-3 gap-1">
          {/* <button className="gray_button">
            <FaFileInvoiceDollar
              size={25}
              color="white"
              className="inline-block mr-1 "
            />
            {t("Generate invoice")}
          </button> */}
          <Print
            trigger={() => (
              <button className="gray_button">
                <BiPrinter
                  size={25}
                  color="white"
                  className="inline-block mr-1 "
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
          <p className="font-bold text-black md:text-lg">
            {t("Status")}:
            <span className="text-green-500 ml-1">{singleOrder?.status}</span>
          </p>
          <p className="font-bold text-black md:text-lg">
            {t("Order No")}:
            <span className="text-gray-600 ml-1">{singleOrder?.orderId}</span>
          </p>
        </div>
        {/*invoice details */}
        <div className="w-full grid xl:grid-cols-5 md:grid-cols-2 place-items-start items-start md:gap-5 gap-2">
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
            <p className="text-textBlack font-medium md:text-lg">
              {singleOrder?.paymentMethod}
            </p>
          </div>
          {/* Contact */}
          <div className="w-full md:space-y-2">
            <label htmlFor="Contact" className="Label">
              {t("Contact")}
            </label>
            <p className="text-textBlack font-medium md:text-lg">
              {singleOrder?.subscriber?.fname} {singleOrder?.subscriber?.lname}{" "}
            </p>
            <p className="text-textBlack break-words font-medium md:text-lg">
              {singleOrder?.subscriber?.email}
            </p>
            <p className="text-textBlack font-medium md:text-lg">
              {singleOrder?.subscriber?.phone}
            </p>
          </div>
          {/* Contact */}
          {singleOrder?.VAT ? (
            <div className="w-full md:space-y-2">
              <label htmlFor="Contact" className="Label">
                {t("Company")}
              </label>
              <p className="text-textBlack font-medium md:text-lg">
                {singleOrder?.companyName ??
                  singleOrder?.billingAddress?.companyName ??
                  singleOrder?.shippingAddress?.companyName}
              </p>
              <p className="text-textBlack font-medium md:text-lg">
                VAT: {singleOrder?.VAT}
              </p>
            </div>
          ) : null}

          {/* Address */}
          <div className="w-full md:space-y-2">
            <label htmlFor="Address" className="Label">
              {t("Billing Address")}
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
                    <td className="p-4 whitespace-nowrap">
                      {getProductTitle(item)}
                    </td>
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
            {singleOrder?.shippingAddress?.country.toLowerCase() ===
              "france" && (
              <div className="w-full flex items-center justify-between">
                <p className="w-1/2 font-semibold uppercase">
                  {t("Total without tax")}
                </p>
                <p className="w-1/2 text-right">
                  €&nbsp;
                  {Intl.NumberFormat("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(parseFloat(singleOrder?.subtotal * 97.9) / 100)}
                </p>
              </div>
            )}
            {singleOrder?.shippingAddress?.country.toLowerCase() ===
              "france" && (
              <div className="w-full flex items-center justify-between">
                <p className="w-1/2 font-semibold uppercase">
                  {t("Tax")} (2.1 %)
                </p>
                <p className="w-1/2 text-right">
                  €&nbsp; €&nbsp;
                  {Intl.NumberFormat("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(parseFloat(singleOrder?.subtotal * 2.1) / 100)}
                </p>
              </div>
            )}
            <div className="w-full flex items-center justify-between">
              <p className="w-1/2 font-semibold uppercase">{t("Sub total")}</p>
              <p className="w-1/2 text-right">
                €&nbsp;
                {Intl.NumberFormat("fr-FR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(parseFloat(singleOrder?.subtotal))}
              </p>
            </div>
            {/* <div className="w-full flex items-center justify-between">
              <p className="w-1/2 font-semibold uppercase">
                {t("shipping cost")}
              </p>
              <p className="w-1/2 text-right">
                €&nbsp;
                {Intl.NumberFormat("fr-FR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(parseFloat(singleOrder?.shipping))}
              </p>
            </div> */}

            <div className="w-full flex items-center justify-between">
              <p className="w-1/2 font-semibold uppercase">{t("discount")}</p>
              <p className="w-1/2 text-right">
                {" "}
                €&nbsp;-
                {Intl.NumberFormat("fr-FR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(parseFloat(singleOrder?.discount))}
              </p>
            </div>
            {singleOrder?.promoCode && (
              <div className="w-full flex items-center justify-between">
                <p className="w-1/2 font-semibold ">
                  <span className="uppercase">{"promo code discount"} </span>
                  <span className="text-sm font-light">
                    (code : {singleOrder?.promoCode})
                  </span>
                </p>
                <p className="w-1/2 text-right">
                  €&nbsp;-
                  {Intl.NumberFormat("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(parseFloat(singleOrder?.promoDiscount))}
                </p>
              </div>
            )}

            <div className="w-full flex items-center justify-between border-t-2">
              <p className="w-1/2 font-bold ">{t("Total Amount")}</p>
              <p className="w-1/2 text-right font-bold">
                €&nbsp;
                {Intl.NumberFormat("fr-FR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(parseFloat(singleOrder?.total))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
