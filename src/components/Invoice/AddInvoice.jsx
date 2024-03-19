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
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { handleCreateAndEditInvoice } from "../../redux/InvoiceSlice";

const AddInvoice = ({ setShowAddInvoice, orderId, setOrderId }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchResult, setSearchResult] = useState([]);

  const { orders } = useSelector((state) => state.root.orders);

  const { loading, updateLoading } = useSelector((state) => state.root.invoice);

  const { token } = useSelector((state) => state.root.auth);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const searchRef = useRef(null);
  const selectRef = useRef(null);

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
  });

  const onSubmit = (data) => {
    const { VAT, companyName, purchaseOrder, paymentMethod } = data;
    toast.remove();
    if (!selectedOrder) return toast.error("select the order");

    if (selectedOrder?.invoiceGenerated)
      return toast.error("Invoice already generated");
    const findOrder = orders.find(
      (order) => order?.orderId === selectedOrder?.orderId
    );

    // const itemsToSend = selectedOrder?.items.map((item) => {
    //   return {
    //     itemType: item?.itemType,
    //     itemId: item?._id,
    //     support: item?.support,
    //     quantity: item?.quantity,
    //   };
    // });

    const response = dispatch(
      handleCreateAndEditInvoice({
        orderId: findOrder?.orderId,
        order: findOrder?._id,
        subscriberId: selectedOrder?.subscriber?._id,
        VAT,
        items: selectedOrder?.items,
        companyName,
        purchaseOrder,
        paymentMethod,
        token,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success(`${t("invoice created successfully.")}`, {
            duration: 2000,
          });
          setShowAddInvoice(false);
          navigate("/invoices", { state: null });
        } else if (res?.payload?.status === "error") {
          toast.error(res?.payload?.message);
        }
      });
    }
  };

  const handleSearchOrder = (e) => {
    if (!searchRef.current?.value || !e) {
      setSearchResult([]);
      setSelectedOrder(null);
      return;
    }
    const findOrder = orders.filter((order) => {
      return (
        order?.subscriber?.fname?.toLocaleLowerCase()?.includes(e) ||
        order?.subscriber?.lname?.toLocaleLowerCase()?.includes(e) ||
        order?.orderId?.toLocaleLowerCase()?.includes(e)
      );
    });
    if (findOrder?.length > 0) {
      setSearchResult(findOrder);
    } else {
      setSearchResult([]);
    }
  };

  const handleChangeOrder = (value, inputType) => {
    if (!value) return setSelectedOrder(null);
    if (inputType === "search") {
      selectRef.current.value = "";
    }
    setSelectedOrder(orders.find((s) => s._id === value));
    searchRef.current.value = "";
    setSearchResult([]);
  };

  useEffect(() => {
    handleSearchOrder();
  }, [searchRef]);

  useEffect(() => {
    if (orderId !== null) {
      const findOrder = orders.find((order) => order?.orderId === orderId);
      setSelectedOrder(findOrder);
    }
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
    return () => {
      abortApiCall();
    };
  }, []);

  useEffect(() => {
    setValue("VAT", selectedOrder?.VAT);
    setValue("companyName", selectedOrder?.billingAddress?.companyName);
    setValue("purchaseOrder", selectedOrder?.purchaseOrder);
    setValue("paymentMethod", selectedOrder?.paymentMethod);
  }, [selectedOrder]);

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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full lg:space-y-5 space-y-3 lg:p-5 p-3"
      >
        {/* title + buttons */}
        <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
          <p className="font-semibold text-left lg:text-xl text-lg">
            {t("Add new invoice")}
          </p>
          <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
            <button
              className={`gray_button ${
                (loading || updateLoading) && "cursor-not-allowed"
              }`}
              onClick={() => {
                setShowAddInvoice(false);
                setOrderId(null);
                navigate("/invoices", { state: null });
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
              {updateLoading ? t("Submitting").concat("...") : t("Submit")}
            </button>
          </div>
        </div>
        {/* main div */}
        <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
          {/* search + dropdown order */}
          <div className="w-full flex md:flex-row flex-col items-center justify-between md:gap-3 gap-1">
            <div className="md:w-1/2 w-full relative">
              <input
                ref={searchRef}
                type="text"
                placeholder={t("search order by name & order id")}
                className="input_field"
                onChange={(e) => {
                  handleSearchOrder(e.target.value.toLocaleLowerCase());
                }}
              />

              <div
                className={`absolute ${
                  searchResult.length > 0 ? "scale-100" : "scale-0"
                } transition-all duration-300 top-12 w-full max-h-80 overflow-y-scroll scrollbar left-0 bg-white z-10 shadow-md rounded-lg space-y-2`}
              >
                {searchResult.map((order, i) => (
                  <p
                    key={i}
                    className="cursor-pointer hover:bg-gray-100 p-3"
                    onClick={() => handleChangeOrder(order?._id, "search")}
                  >
                    {order?.subscriber?.fname}&nbsp;{order?.subscriber?.lname} (
                    {order?.orderId})
                  </p>
                ))}
              </div>
            </div>
            <span>or</span>
            <div className="md:w-1/2  w-full">
              <select
                onChange={(e) => {
                  handleChangeOrder(e.target.value, "select");
                }}
                ref={selectRef}
                name="select_subscriber"
                className="input_field"
              >
                <option label="select order"></option>
                {orders.map((order) => (
                  <option key={order?._id} value={order?._id}>
                    {order?.orderId}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="font-bold text-black md:text-xl capitalize">
            {t("Order ID")}
          </p>
          {/* order id */}
          <div className="w-full space-y-2">
            <label htmlFor="orderId" className="Label">
              {t("orderId")}
            </label>
            {selectedOrder?.orderId ?? "-"}
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
              {selectedOrder?.subscriber?.fname ?? "-"}&nbsp;{" "}
              {selectedOrder?.subscriber?.lname}
            </div>
            {/* email */}
            <div className="w-full space-y-2">
              <label htmlFor="email" className="Label">
                {t("email")}
              </label>
              {selectedOrder?.subscriber?.email ?? "-"}
            </div>
            {/* phone */}
            <div className="w-full space-y-2">
              <label htmlFor="phone" className="Label">
                {t("phone")}
              </label>
              {selectedOrder?.subscriber?.phone ?? "-"}
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
              {selectedOrder?.shippingAddress?.address1 ?? "-"}
            </div>
            {/* city */}
            <div className="w-full space-y-2">
              <label htmlFor="city" className="Label">
                {t("city")}
              </label>
              {selectedOrder?.shippingAddress?.city ?? "-"}
            </div>
            {/* province */}
            <div className="w-full space-y-2">
              <label htmlFor="province" className="Label">
                {t("province")}
              </label>
              {selectedOrder?.shippingAddress?.province ?? "-"}
            </div>
            {/* country */}
            <div className="w-full space-y-2">
              <label htmlFor="country" className="Label">
                {t("country")}
              </label>
              {selectedOrder?.shippingAddress?.country ?? "-"}
            </div>
            {/* zipcode */}
            <div className="w-full space-y-2">
              <label htmlFor="zipcode" className="Label">
                {t("zipcode")}
              </label>
              {selectedOrder?.shippingAddress?.zipCode ?? "-"}
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
              {selectedOrder?.billingAddress?.address1 ?? "-"}
            </div>
            {/* city */}
            <div className="w-full space-y-2">
              <label htmlFor="city" className="Label">
                {t("city")}
              </label>
              {selectedOrder?.billingAddress?.city ?? "-"}
            </div>
            {/* province */}
            <div className="w-full space-y-2">
              <label htmlFor="province" className="Label">
                {t("province")}
              </label>
              {selectedOrder?.billingAddress?.province ?? "-"}
            </div>
            {/* country */}
            <div className="w-full space-y-2">
              <label htmlFor="country" className="Label">
                {t("country")}
              </label>
              {selectedOrder?.billingAddress?.country ?? "-"}
            </div>
            {/* zipcode */}
            <div className="w-full space-y-2">
              <label htmlFor="zipcode" className="Label">
                {t("zipcode")}
              </label>
              {selectedOrder?.billingAddress?.zipCode ?? "-"}
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
              <span className="error">{errors?.purchaseOrder?.message}</span>
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
              <span className="error">{errors?.paymentMethod?.message}</span>
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
    </>
  );
};

export default AddInvoice;
