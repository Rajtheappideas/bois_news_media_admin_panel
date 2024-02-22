import React, { useEffect } from "react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { BiPrinter } from "react-icons/bi";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import Print from "react-to-print";
import { useSelector, useDispatch } from "react-redux";
import { handleFindsingleInvoice } from "../../redux/OrderSlice";
import moment from "moment";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { handleClearFilteredData } from "../../redux/GlobalStates";
import { handleFindInvoice } from "../../redux/InvoiceSlice";

const InvoiceDetails = ({ setShowInvoiceDetails }) => {
  const { singleInvoice } = useSelector((s) => s.root.invoice);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const printComponentRef = useRef();

  function getProductTitle(item) {
    return `${t(item?.itemType)} ${t(item?.support)} ${item?.title}`;
  }


  return (
    <div className="w-full lg:space-y-5 space-y-3 lg:p-5 p-3">
      {/* title + buttons */}
      <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
        <p
          onClick={() => {
            dispatch(handleFindInvoice(null));
            setShowInvoiceDetails(false);
            dispatch(handleClearFilteredData());
          }}
          className="font-semibold text-left lg:text-xl text-lg cursor-pointer"
        >
          <MdOutlineKeyboardBackspace
            size={25}
            className="inline-block pb-1 mr-1"
          />
          {t("Invoice Detail")}
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
          <p className="font-bold text-black md:text-2xl">
            {t("Invoice ID")}:
            <span className="ml-1 text-lg text-green-500">
              {singleInvoice?.invoiceId}
            </span>
          </p>
          <p className="font-bold text-black">
            {t("Order ID")}:
            <span className="ml-2  text-gray-400 font-medium">
              {singleInvoice?.orderId}
            </span>
          </p>
          <p className="font-bold text-black">
            {t("Generated Date")}:
            <span className="ml-2  text-gray-400 font-medium">
              {moment(singleInvoice?.date).format("LLL")}
            </span>
          </p>
        </div>
        {/*invoice details */}
        <div className="w-full grid xl:grid-cols-3 md:grid-cols-2 place-items-start items-start md:gap-5 gap-2">
          {/* date */}
          <div className="w-full md:space-y-2">
            <label htmlFor="date" className="Label">
              {t("Date")}
            </label>
            <p className="text-textBlack font-medium md:text-lg">
              {moment(singleInvoice?.date).format("lll")}
            </p>
          </div>
          {/* Payment method */}
          <div className="w-full md:space-y-2">
            <label htmlFor="payment_method" className="Label">
              {t("Payment method")}
            </label>
            <p className="text-textBlack font-medium md:text-lg">
              {singleInvoice?.paymentMethod}
            </p>
          </div>
          {/* Contact */}
          <div className="w-full md:space-y-2">
            <label htmlFor="Contact" className="Label">
              {t("Contact")}
            </label>
            <p className="text-textBlack font-medium md:text-lg">
              {singleInvoice?.subscriber?.fname}{" "}
              {singleInvoice?.subscriber?.lname}{" "}
            </p>
            <p className="text-textBlack break-words font-medium md:text-lg">
              {singleInvoice?.subscriber?.email}
            </p>
            <p className="text-textBlack font-medium md:text-lg">
              {singleInvoice?.subscriber?.phone}
            </p>
          </div>
          {/* <hr className="col-span-3 w-full" /> */}
          {/* Contact */}
          {singleInvoice?.VAT ? (
            <div className="w-full md:space-y-2">
              <label htmlFor="Contact" className="Label">
                {t("Company")}
              </label>
              <p className="text-textBlack font-medium md:text-lg">
                {singleInvoice?.companyName ??
                  singleInvoice?.billingAddress?.companyName ??
                  singleInvoice?.shippingAddress?.companyName}
              </p>
              <p className="text-textBlack font-medium md:text-lg">
                VAT: {singleInvoice?.VAT}
              </p>
            </div>
          ) : null}
          {/* billing Address */}
          <div className="w-full md:space-y-2">
            <label htmlFor="Address" className="Label">
              {t("Billing Address")}
            </label>
            <p className="text-textBlack font-medium md:text-lg">
              {singleInvoice?.billingAddress?.zipCode}{" "}
              {singleInvoice?.billingAddress?.address1},<br />{" "}
              {singleInvoice?.billingAddress?.city},<br />{" "}
              {singleInvoice?.billingAddress?.province},<br />
              {singleInvoice?.billingAddress?.country}
            </p>
          </div>
          {/* shipping Address */}
          <div className="w-full md:space-y-2">
            <label htmlFor="Address" className="Label">
              {t("Shipping Address")}
            </label>
            <p className="text-textBlack font-medium md:text-lg">
              {singleInvoice?.shippingAddress?.zipCode}{" "}
              {singleInvoice?.shippingAddress?.address1},<br />{" "}
              {singleInvoice?.shippingAddress?.city},<br />{" "}
              {singleInvoice?.shippingAddress?.province},<br />
              {singleInvoice?.shippingAddress?.country}
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
              {singleInvoice?.items &&
                singleInvoice?.items.map((item, i) => (
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
            {singleInvoice?.shippingAddress?.country.toLowerCase() ===
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
                  }).format(parseFloat(singleInvoice?.subtotal * 97.9) / 100)}
                </p>
              </div>
            )}
            {singleInvoice?.shippingAddress?.country.toLowerCase() ===
              "france" && (
              <div className="w-full flex items-center justify-between">
                <p className="w-1/2 font-semibold uppercase">{t("Tax")}</p>
                <p className="w-1/2 text-right">€&nbsp; 2.1 %</p>
              </div>
            )}
            <div className="w-full flex items-center justify-between">
              <p className="w-1/2 font-semibold uppercase">{t("Sub total")}</p>
              <p className="w-1/2 text-right">
                €&nbsp;
                {Intl.NumberFormat("fr-FR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(parseFloat(singleInvoice?.subtotal))}
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
              }).format(parseFloat(singleInvoice?.shipping))}
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
                }).format(parseFloat(singleInvoice?.discount))}
              </p>
            </div>
            {singleInvoice?.promoCode && (
              <div className="w-full flex items-center justify-between">
                <p className="w-1/2 font-semibold ">
                  <span className="uppercase">{"promo code discount"} </span>
                  <span className="text-sm font-light">
                    (code : {singleInvoice?.promoCode})
                  </span>
                </p>
                <p className="w-1/2 text-right">
                  €&nbsp;-
                  {Intl.NumberFormat("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(parseFloat(singleInvoice?.promoDiscount))}
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
                }).format(parseFloat(singleInvoice?.total))}
              </p>
            </div>
          </div>
        </div>
        {singleInvoice?.shippingAddress?.country.toLowerCase() !== "france" && (
          <div className="text-center font-semibold text-lg">
            FACTURATION HORS TAXES | Livraison intracommunautaire - Art 262ter
            du CGI
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetails;
