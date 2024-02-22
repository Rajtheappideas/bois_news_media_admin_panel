import React, { useEffect, useRef, useState } from "react";
import { handleGetAllOrder } from "../../redux/OrderSlice";
import { handleLogout } from "../../redux/AuthSlice";
import { handleLogoutFromAllTabs } from "../../redux/GlobalStates";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import { AiOutlineClose } from "react-icons/ai";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  handleCreateAndEditInvoice,
  handleGetInvoiceById,
} from "../../redux/InvoiceSlice";
import { Helmet } from "react-helmet";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

const EditInvoice = () => {
  const { isSidebarOpen } = useSelector((state) => state.root.globalStates);

  const { loading, updateLoading, singleInvoice } = useSelector(
    (state) => state.root.invoice
  );

  const { token } = useSelector((state) => state.root.auth);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { id } = useParams();

  const { t } = useTranslation();

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const addNewUserSchema = yup.object({
    companyName: yup.string(),
    VAT: yup.string(),
    purchaseOrder: yup.string(),
    //     orderNotes: yup.string(),
    paymentMethod: yup.string().required("payment method is required"),
    //     status: yup.string().required("status is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    control,
  } = useForm({
    shouldFocusError: true,
    reValidateMode: "onChange",
    mode: "onChange",
    resolver: yupResolver(addNewUserSchema),
    defaultValues: {
      VAT: singleInvoice?.VAT,
      companyName: singleInvoice?.companyName,
      paymentMethod: singleInvoice?.paymentMethod,
      purchaseOrder: singleInvoice?.purchaseOrder,
    },
  });

  const onSubmit = (data) => {
    const { VAT, companyName, purchaseOrder, paymentMethod } = data;
    toast.remove();

    const response = dispatch(
      handleCreateAndEditInvoice({
        VAT,
        companyName,
        purchaseOrder,
        paymentMethod,
        id,
        token,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success(`${t("invoice edited successfully.")}`, {
            duration: 2000,
          });
          navigate("/invoices");
        } else if (res?.payload?.status === "error") {
          toast.error(res?.payload?.message);
        }
      });
    }
  };

  useEffect(() => {
    const response = dispatch(
      handleGetInvoiceById({ token, id, signal: AbortControllerRef })
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
    return () => {
      abortApiCall();
    };
  }, []);

  return (
    <>
      {/* {showPopup && (
          <AddItemsPopup
            handleChangeItems={handleChangeItems}
            setShowPopup={setShowPopup}
            showPopup={showPopup}
            selectedSubscriber={selectedSubscriber}
          />
        )} */}
      <Helmet title="Invoice | Bois news media" />
      <div className="w-full flex items-start lg:gap-3 flex-row h-auto">
        <Sidebar />
        <section
          className={`h-full space-y-5 bg-[#FBFBFB] min-h-screen ${
            isSidebarOpen ? "xl:w-10/12 lg:w-4/5 w-full" : "lg:w-[90%] w-full"
          }`}
        >
          <Header />
          {loading ? (
            <div className="data_not_found_And_Loading">{t("Loading")}...</div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full lg:space-y-5 space-y-3 lg:p-5 p-3"
            >
              {/* title + buttons */}
              <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
                <p className="font-semibold text-left lg:text-xl text-lg">
                  {t("Edit invoice")}
                </p>
                <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
                  <button
                    className={`gray_button ${
                      (loading || updateLoading) && "cursor-not-allowed"
                    }`}
                    onClick={() => {
                      navigate("/invoices");
                    }}
                    disabled={loading || updateLoading}
                    type="reset"
                  >
                    {t("Cancel")}
                  </button>
                  <button
                    className={`green_button ${
                      (loading || updateLoading) && "cursor-not-allowed"
                    }`}
                    type="submit"
                    disabled={loading || updateLoading}
                  >
                    {updateLoading
                      ? t("Submitting").concat("...")
                      : t("Submit")}
                  </button>
                </div>
              </div>
              {/* main div */}
              <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
                <p className="font-bold text-black md:text-xl capitalize">
                  {t("Invoice ID")}
                </p>
                {/* invoice id */}
                <div className="w-full space-y-2">
                  <label htmlFor="invoiceId" className="Label">
                    {t("InvoiceId")}
                  </label>
                  {singleInvoice?.invoiceId ?? "-"}
                </div>
                <hr className="my-1" />
                <p className="font-bold text-black md:text-xl capitalize">
                  {t("subscriber details")}
                </p>
                {/* personal details */}
                <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
                  {/* name */}
                  <div className="w-full space-y-2">
                    <label htmlFor="name" className="Label">
                      {t("name")}
                    </label>
                    {singleInvoice?.subscriber?.fname ?? "-"}&nbsp;{" "}
                    {singleInvoice?.subscriber?.lname}
                  </div>
                  {/* email */}
                  <div className="w-full space-y-2">
                    <label htmlFor="email" className="Label">
                      {t("email")}
                    </label>
                    {singleInvoice?.subscriber?.email ?? "-"}
                  </div>
                  {/* phone */}
                  <div className="w-full space-y-2">
                    <label htmlFor="phone" className="Label">
                      {t("phone")}
                    </label>
                    {singleInvoice?.subscriber?.phone ?? "-"}
                  </div>
                </div>
                <hr className="my-1" />
                {/*shipping address */}
                <p className="font-bold text-black md:text-xl capitalize">
                  {t("Shipping Address")}
                </p>
                <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
                  {/*company address */}
                  <div className="w-full col-span-full space-y-2">
                    <label htmlFor="address" className="Label">
                      {t("address")}
                    </label>
                    {singleInvoice?.shippingAddress?.address1 ?? "-"}
                  </div>
                  {/* city */}
                  <div className="w-full space-y-2">
                    <label htmlFor="city" className="Label">
                      {t("city")}
                    </label>
                    {singleInvoice?.shippingAddress?.city ?? "-"}
                  </div>
                  {/* province */}
                  <div className="w-full space-y-2">
                    <label htmlFor="province" className="Label">
                      {t("province")}
                    </label>
                    {singleInvoice?.shippingAddress?.province ?? "-"}
                  </div>
                  {/* country */}
                  <div className="w-full space-y-2">
                    <label htmlFor="country" className="Label">
                      {t("country")}
                    </label>
                    {singleInvoice?.shippingAddress?.country ?? "-"}
                  </div>
                  {/* zipcode */}
                  <div className="w-full space-y-2">
                    <label htmlFor="zipcode" className="Label">
                      {t("zipcode")}
                    </label>
                    {singleInvoice?.shippingAddress?.zipCode ?? "-"}
                  </div>
                </div>
                <hr className="my-1" />
                {/*billing address */}
                <p className="font-bold text-black md:text-xl capitalize">
                  {t("billing Address")}
                </p>
                <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
                  {/*company address */}
                  <div className="w-full col-span-full space-y-2">
                    <label htmlFor="address" className="Label">
                      {t("address")}
                    </label>
                    {singleInvoice?.billingAddress?.address1 ?? "-"}
                  </div>
                  {/* city */}
                  <div className="w-full space-y-2">
                    <label htmlFor="city" className="Label">
                      {t("city")}
                    </label>
                    {singleInvoice?.billingAddress?.city ?? "-"}
                  </div>
                  {/* province */}
                  <div className="w-full space-y-2">
                    <label htmlFor="province" className="Label">
                      {t("province")}
                    </label>
                    {singleInvoice?.billingAddress?.province ?? "-"}
                  </div>
                  {/* country */}
                  <div className="w-full space-y-2">
                    <label htmlFor="country" className="Label">
                      {t("country")}
                    </label>
                    {singleInvoice?.billingAddress?.country ?? "-"}
                  </div>
                  {/* zipcode */}
                  <div className="w-full space-y-2">
                    <label htmlFor="zipcode" className="Label">
                      {t("zipcode")}
                    </label>
                    {singleInvoice?.billingAddress?.zipCode ?? "-"}
                  </div>
                </div>
                <hr className="my-1" />

                {/* vat + note + purchase order */}
                <div className="w-full grid md:grid-cols-2 place-items-start items-center md:gap-5 gap-2">
                  {/* purhcse order */}
                  <div className="w-full space-y-2">
                    <label htmlFor="purchase_order" className="Label">
                      {t("Purchase orders")} (optional)
                    </label>
                    <input
                      type="text"
                      placeholder={t("Type here...")}
                      className="input_field"
                      {...register("purchaseOrder")}
                    />
                    <span className="error">
                      {errors?.purchaseOrder?.message}
                    </span>
                  </div>
                  {/* Company name */}
                  <div className="w-full space-y-2">
                    <label htmlFor="Company_Name" className="Label">
                      {t("Company Name")} (optional)
                    </label>
                    <input
                      type="text"
                      placeholder={t("Type here...")}
                      className="input_field"
                      {...register("companyName")}
                    />
                  </div>
                  {/* VAT Number */}
                  <div className="w-full space-y-2">
                    <label htmlFor="VAT_number" className="Label">
                      {t("VAT Number")} (optional)
                    </label>
                    <input
                      type="text"
                      placeholder={t("Type here...")}
                      className="input_field"
                      {...register("VAT")}
                    />
                  </div>
                  {/* notes */}
                  {/* <div className="w-full space-y-2">
                <label htmlFor="note" className="Label">
                  {t("Order Note")} (optional)
                </label>
                <input
                  type="text"
                  placeholder={t("Type here...")}
                  className="input_field"
                  {...register("orderNotes")}
                />
                <span className="error">{errors?.orderNotes?.message}</span>
              </div> */}
                </div>
                <hr className="my-1" />
                <div className="w-full flex items-center gap-3">
                  <div className="md:w-1/2 w-full space-y-2">
                    <p className="font-bold text-black md:text-xl capitalize">
                      {t("payment method")}
                    </p>
                    <select
                      {...register("paymentMethod")}
                      name="paymentMethod"
                      className="input_field"
                    >
                      <option label="select payment method"></option>
                      <option value="Card">Card</option>
                      <option value="Cash">Cash</option>
                      <option value="FinanceCheque">Finance cheque</option>
                      <option value="BankTransfer">Bank transfer</option>
                    </select>
                    <span className="error">
                      {errors?.paymentMethod?.message}
                    </span>
                  </div>
                  {/* <div className="md:w-1/2 w-full space-y-2">
                <p className="font-bold text-black md:text-xl capitalize">
                  {t("status")}
                </p>
                <select
                  {...register("status")}
                  name="status"
                  className="input_field"
                >
                  <option label="choose order status"></option>
                  <option value="On Hold">On hold</option>
                  <option value="Order Received">Order received</option>
                  <option value="Order Accepted">Order accepted</option>
                  <option value="Delivered">Delivered</option>
                </select>
                <span className="error">{errors?.status?.message}</span>
              </div> */}
                </div>
                {/* <hr className="my-1" /> */}
                {/* items */}
                {/* <p className="font-bold capitalize text-black md:text-xl flex items-center justify-between">
              <span>{t("items")}</span>
              <button
                className="gray_button text-base"
                type="button"
                onClick={() => {
                  handleOnclickAdditems();
                }}
              >
                {t("Add")}
              </button>
            </p>
  
            <div className="outline-none rounded-2xl md:mt-5 mt-3 py-3 bg-white overflow-x-scroll scrollbar">
              <table className="border-none outline-none w-full overflow-scroll">
                <thead className="w-full border-b border-gray-100 text-center">
                  <tr className="bg-textColor/20">
                    <th className="p-4 whitespace-nowrap">
                      <span>Sr no.</span>
                    </th>
                    <th className="p-4 whitespace-nowrap">
                      {t("Product title")}
                    </th>
                    <th className="p-4 whitespace-nowrap">{t("Quantity")}</th>
                    <th className="p-4 whitespace-nowrap">{t("Item support")}</th>
                    <th className="p-4 whitespace-nowrap">{t("Amount")}</th>
                    <th className="p-4 whitespace-nowrap">{t("Action")}</th>
                  </tr>
                </thead>
                <tbody className="w-full">
                  {items?.length > 0 &&
                    items.map((item, i) => (
                      <tr
                        key={item?._id}
                        className="border-b border-gray-200 w-full text-center"
                      >
                        <td className="p-4 whitespace-nowrap">{i + 1}</td>
                        <td className="p-4 whitespace-nowrap">{item?.title}</td>
                        <td className="p-4 whitespace-nowrap">
                          {item?.quantity}
                        </td>
                        <td className="p-4 whitespace-nowrap">{item?.support}</td>
                        <td className="p-4 whitespace-nowrap">
                          € {parseFloat(item?.price) * parseInt(item?.quantity)}
                        </td>
                        <td
                          onClick={() => handleRemoveItem(item?.itemId)}
                          className="p-4 text-center"
                        >
                          <AiOutlineClose
                            role="button"
                            type="button"
                            color="red"
                            size={20}
                            className="mx-auto"
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div> */}
              </div>
            </form>
          )}
        </section>
      </div>
    </>
  );
};

export default EditInvoice;
