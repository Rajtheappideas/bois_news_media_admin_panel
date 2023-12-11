import React, { useState, useEffect, useCallback, useRef } from "react";
import { HiPencil } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import { toast } from "react-hot-toast";
import { handleAddNewUser } from "../../redux/UserSlice";
import "react-phone-input-2/lib/style.css";
import {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
} from "react-phone-number-input";
import { useTranslation } from "react-i18next";
import AddItemsPopup from "./AddItemsPopup";
import { AiOutlineClose } from "react-icons/ai";
import { handleCreateOrder } from "../../redux/OrderSlice";

const AddOrder = ({ setShowAddOrder }) => {
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [searchResult, setSearchResult] = useState([]);
  const [items, setItems] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const { createLoading } = useSelector((state) => state.root.orders);
  const { subscribers } = useSelector((state) => state.root.subscribers);
  const { token } = useSelector((state) => state.root.auth);

  const dispatch = useDispatch();
  const searchRef = useRef(null);

  const { t } = useTranslation();

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const addNewUserSchema = yup.object({
    VAT: yup.string(),
    purchaseOrder: yup.string(),
    orderNotes: yup.string(),
    paymentMethod: yup.string().required("payment method is required"),
    status: yup.string().required("status is required"),
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
    const { VAT, purchaseOrder, orderNotes, paymentMethod, status } = data;
    toast.remove();
    if (!selectedSubscriber) return toast.error("select the subscriber");
    if (items.length === 0) {
      return toast.error("Add at least one product to items");
    }
    const response = dispatch(
      handleCreateOrder({
        subscriber: selectedSubscriber?._id,
        items,
        VAT,
        purchaseOrder,
        orderNotes,
        paymentMethod,
        status,
        token,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success(`${t("order created successfully.")}`, {
            duration: 2000,
          });
          setShowAddOrder(false);
        } else if (res?.payload?.status === "error") {
          toast.error(res?.payload?.message);
        }
      });
    }
  };

  useEffect(() => {
    return () => {
      abortApiCall();
    };
  }, []);

  const handleSearchSubscriber = (e) => {
    if (!searchRef.current?.value || !e) {
      setSearchResult([]);
      setSelectedSubscriber(null);
      return;
    }
    const findSubscriber = subscribers.filter((s) => {
      return (
        s.fname?.toLocaleLowerCase()?.includes(e) ||
        s?.lname?.toLocaleLowerCase()?.includes(e)
      );
    });
    if (findSubscriber?.length > 0) {
      setSearchResult(findSubscriber);
    } else {
      setSearchResult([]);
    }
  };

  const handleChangeSubscriber = (value) => {
    if (!value) return setSelectedSubscriber(null);
    setSelectedSubscriber(subscribers.find((s) => s._id === value));
    setSearchResult([]);
  };

  const handleChangeItems = (val) => {
    if (!val) return;
    setItems([...items, val]);
  };

  const handleRemoveItem = (id) => {
    const filteredArr = items.filter((item) => item?.itemId !== id);
    if (filteredArr) {
      setItems(filteredArr);
    }
  };

  useEffect(() => {
    handleSearchSubscriber();
  }, [searchRef]);

  return (
    <>
      {showPopup && (
        <AddItemsPopup
          handleChangeItems={handleChangeItems}
          setShowPopup={setShowPopup}
          showPopup={showPopup}
        />
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full lg:space-y-5 space-y-3"
      >
        {/* title + buttons */}
        <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
          <p className="font-semibold text-left lg:text-xl text-lg">
            {t("Add new order")}
          </p>
          <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
            <button
              className={`gray_button ${createLoading && "cursor-not-allowed"
                }`}
              onClick={() => setShowAddOrder(false)}
              disabled={createLoading}
              type="reset"
            >
              {t("Cancel")}
            </button>
            <button
              className={`green_button ${createLoading && "cursor-not-allowed"
                }`}
              type="submit"
              disabled={createLoading}
            >
              {createLoading ? t("Submitting").concat("...") : t("Submit")}
            </button>
          </div>
        </div>
        {/* main div */}
        <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
          {/* search + dropdown subscriber */}
          <div className="w-full flex md:flex-row flex-col items-center justify-between md:gap-3 gap-1">
            <div className="md:w-1/2 w-full relative">
              <input
                ref={searchRef}
                type="text"
                placeholder={t("search subscriber")}
                className="input_field"
                onChange={(e) => {
                  handleSearchSubscriber(e.target.value.toLocaleLowerCase());
                }}
              />

              <div
                className={`absolute ${searchResult.length > 0 ? "scale-100" : "scale-0"
                  } transition-all duration-300 top-12 w-full max-h-80 overflow-y-scroll scrollbar left-0 bg-white z-10 shadow-md rounded-lg space-y-2`}
              >
                {searchResult.map((r) => (
                  <p
                    key={searchResult?._id}
                    className="cursor-pointer hover:bg-gray-100 p-3"
                    onClick={() => handleChangeSubscriber(r?._id)}
                  >
                    {r?.fname}&nbsp;{r?.lname}
                  </p>
                ))}
              </div>
            </div>
            <span>or</span>
            <div className="md:w-1/2  w-full">
              <select
                onChange={(e) => {
                  handleChangeSubscriber(e.target.value);
                }}
                name="select_subscriber"
                className="input_field"
              >
                <option label="select subscriber"></option>
                {subscribers.map((subscriber) => (
                  <option key={subscriber?._id} value={subscriber?._id}>
                    {subscriber?.fname}&nbsp;
                    {subscriber?.lname}
                  </option>
                ))}
              </select>
            </div>
          </div>
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
              {selectedSubscriber?.fname ?? "-"}&nbsp;{" "}
              {selectedSubscriber?.lname}
            </div>
            {/* email */}
            <div className="w-full space-y-2">
              <label htmlFor="email" className="Label">
                {t("email")}
              </label>
              {selectedSubscriber?.email ?? "-"}
            </div>
            {/* phone */}
            <div className="w-full space-y-2">
              <label htmlFor="phone" className="Label">
                {t("phone")}
              </label>
              {selectedSubscriber?.phone ?? "-"}
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
              {selectedSubscriber?.shippingAddress?.address1 ?? "-"}
            </div>
            {/* city */}
            <div className="w-full space-y-2">
              <label htmlFor="city" className="Label">
                {t("city")}
              </label>
              {selectedSubscriber?.shippingAddress?.city ?? "-"}
            </div>
            {/* country */}
            <div className="w-full space-y-2">
              <label htmlFor="country" className="Label">
                {t("country")}
              </label>
              {selectedSubscriber?.shippingAddress?.country ?? "-"}
            </div>
            {/* zipcode */}
            <div className="w-full space-y-2">
              <label htmlFor="zipcode" className="Label">
                {t("zipcode")}
              </label>
              {selectedSubscriber?.shippingAddress?.zipCode ?? "-"}
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
              {selectedSubscriber?.thirdPartyPayer !== null
                ? selectedSubscriber?.thirdPartyPayer?.billingAddress
                  ?.companyAddress ?? "-"
                : selectedSubscriber?.billingAddress?.address1 ?? "-"}
            </div>
            {/* city */}
            <div className="w-full space-y-2">
              <label htmlFor="city" className="Label">
                {t("city")}
              </label>
              {selectedSubscriber?.thirdPartyPayer !== null
                ? selectedSubscriber?.thirdPartyPayer?.billingAddress?.city ??
                "-"
                : selectedSubscriber?.billingAddress?.city ?? "-"}
            </div>
            {/* country */}
            <div className="w-full space-y-2">
              <label htmlFor="country" className="Label">
                {t("country")}
              </label>
              {selectedSubscriber?.thirdPartyPayer !== null
                ? selectedSubscriber?.thirdPartyPayer?.billingAddress
                  ?.country ?? "-"
                : selectedSubscriber?.billingAddress?.country ?? "-"}
            </div>
            {/* zipcode */}
            <div className="w-full space-y-2">
              <label htmlFor="zipcode" className="Label">
                {t("zipcode")}
              </label>
              {selectedSubscriber?.thirdPartyPayer !== null
                ? selectedSubscriber?.thirdPartyPayer?.billingAddress
                  ?.zipCode ?? "-"
                : selectedSubscriber?.billingAddress?.zipCode ?? "-"}
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
            <div className="w-full space-y-2 col-span-full">
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
            </div>
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
              </select>
              <span className="error">{errors?.paymentMethod?.message}</span>
            </div>
            <div className="md:w-1/2 w-full space-y-2">
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
            </div>
          </div>
          <hr className="my-1" />
          {/* items */}
          <p className="font-bold capitalize text-black md:text-xl flex items-center justify-between">
            <span>{t("items")}</span>
            <button
              className="gray_button text-base"
              type="button"
              onClick={() => setShowPopup(true)}
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
          </div>
        </div>
      </form>
    </>
  );
};

export default AddOrder;
