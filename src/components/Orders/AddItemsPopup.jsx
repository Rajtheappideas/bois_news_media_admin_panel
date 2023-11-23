import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import ReactModal from "react-modal";
import { AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const AddItemsPopup = ({ setShowPopup, showPopup, handleChangeItems }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { t } = useTranslation();

  const { subscriptions } = useSelector((state) => state.root.subscriptions);
  const { magazines } = useSelector((state) => state.root.magazines);

  const createSubscribptionSchema = yup.object({
    subscription: yup.string(),
    magazine: yup.string(),
    quantity: yup.string().required(t("quantity is required")),
    support: yup.string().required(t("support is required")),
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    resetField,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
    resolver: yupResolver(createSubscribptionSchema),
    defaultValues: {
      quantity: 1,
      subscription: "",
      magazine: "",
      support: "",
    },
  });

  const onSubmit = (data) => {
    const { subscription, magazine, quantity, support } = data;
    if (!magazine && !subscription) {
      toast.remove();
      return toast.error("Choose subscription or magazine");
    }
    const val = {
      quantity: parseInt(quantity),
      support,
      itemType: subscription ? "Subscription" : "Magazine",
      itemId: subscription ? subscription : magazine,
      title: selectedProduct?.title,
      price: selectedProduct?.price,
    };
    handleChangeItems(val);
    reset();
    setSelectedProduct(null);
    toast.success("Item added");
  };

  useEffect(() => {
    resetField("subscription", "");
  }, [watch("magazine")]);

  useEffect(() => {
    resetField("magazine", "");
  }, [watch("subscription")]);

  return (
    <>
      <ReactModal
        className={`overflow-hidden scrollbar bg-black/20 z-50 w-full min-h-screen max-h-screen inset-0 backdrop-blur-sm`}
        appElement={document.getElementById("root")}
        isOpen={showPopup}
        onRequestClose={() => {
          setShowPopup(false);
        }}
        shouldCloseOnEsc={true}
        style={{ content: { zIndex: 999 } }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`bg-white overflow-y-scroll scrollbar max-h-[80%] select-none p-4 xl:w-2/5 md:w-1/2 w-11/12 rounded-md absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 md:space-y-3 space-y-1`}
        >
          {/* title + button */}
          <div className="flex items-center justify-between w-full">
            <p className="font-semibold text-lg select-none">{t("Add item")}</p>
            <button
              onClick={() => {
                setShowPopup(false);
              }}
            >
              <AiOutlineClose size={30} />
            </button>
          </div>
          {/* subscription */}
          <label htmlFor="subscription" className="Label">
            {t("Subcscription")}
          </label>
          <select
            name="subscription"
            className="input_field"
            {...register("subscription", {
              onChange: (e) =>
                setSelectedProduct(
                  subscriptions.find((s) => s?._id === e.target.value)
                ),
            })}
          >
            <option label="Choose subscription"></option>
            {subscriptions.length > 0 &&
              subscriptions.map((subscription) => (
                <option value={subscription?._id} key={subscription?._id}>
                  {subscription?.title}
                </option>
              ))}
          </select>

          <p className="w-full text-center flex items-center gap-2">
            <hr className="w-1/2 mt-1" />
            or
            <hr className="w-1/2 mt-1" />
          </p>
          {/* magazine */}
          <label htmlFor="subscription" className="Label">
            {t("Magazines")}
          </label>
          <select
            name="Magazines"
            className="input_field"
            {...register("magazine", {
              onChange: (e) =>
                setSelectedProduct(
                  magazines.find((s) => s?._id === e.target.value)
                ),
            })}
          >
            <option label="Choose magazine"></option>
            {magazines.length > 0 &&
              magazines.map((magazine) => (
                <option value={magazine?._id} key={magazine?._id}>
                  {magazine?.title}
                </option>
              ))}
          </select>

          <span className="error">{errors?.subscription?.message}</span>
          <div className="w-full flex md:flex-row flex-col items-center justify-start gap-3">
            <div className="md:space-y-2 space-y-1 md:w-1/2 w-full">
              <label htmlFor="Quantity" className="Label">
                {t("Quantity")}
              </label>
              <input
                type="number"
                name="quantity"
                {...register("quantity")}
                className="input_field"
              />
              <span className="error">{errors?.quantity?.message}</span>
            </div>
            <div className="md:space-y-2 space-y-1 md:w-1/2 w-full">
              <label htmlFor="Quantity" className="Label">
                {t("Support")}
              </label>
              <select
                name="support"
                className="input_field"
                {...register("support")}
              >
                <option label="select support"></option>
                <option value="digital">digital</option>
                <option value="paper">paper</option>
              </select>
              <span className="error">{errors?.support?.message}</span>
            </div>
          </div>

          {/* button */}
          <button
            type="submit"
            className="bg-primaryBlue text-white font-medium text-center md:h-12 h-10 rounded-lg p-2 hover:bg-primaryBlue/80 active:scale-95 transition w-full"
          >
            {/* {loading ? t("Saving").concat("...") : t("Save")} */}
            Add
          </button>
        </form>
      </ReactModal>
    </>
  );
};

export default AddItemsPopup;
