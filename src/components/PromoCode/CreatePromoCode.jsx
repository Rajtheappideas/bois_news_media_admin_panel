import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
<<<<<<< HEAD
import {
  handleCreatePromoCode,
  handleEditPromoCode,
  handleFindSinglePromoCode,
} from "../../redux/PromoCodeSlice";
=======
import { handleCreatePromoCode } from "../../redux/PromoCodeSlice";
>>>>>>> raj_appideas
import { useEffect } from "react";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import toast from "react-hot-toast";
import moment from "moment";
<<<<<<< HEAD
=======
import Select from "react-select";
import Animated from "react-select/animated";
>>>>>>> raj_appideas

const CreatePromoCode = ({ setShowCreatePromoCode }) => {
  const { createAndUpdateLoading } = useSelector(
    (state) => state.root.promoCode
  );

<<<<<<< HEAD
=======
  const { subscriptions, loading } = useSelector(
    (state) => state.root.subscriptions
  );
  const { subscribers } = useSelector((state) => state.root.subscribers);

>>>>>>> raj_appideas
  const { token } = useSelector((s) => s.root.auth);

  const { t } = useTranslation();
  const dispatch = useDispatch();

<<<<<<< HEAD
=======
  const animatedComponents = Animated();

>>>>>>> raj_appideas
  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const createPromoCodeScheam = yup.object({
    code: yup
      .string()
      .required(t("code is required"))
      .min(2, t("minimum two character required")),
<<<<<<< HEAD
    expireDate: yup.date().required(t("date is required")).typeError("date is required"),
=======
    expireDate: yup
      .date()
      .required(t("date is required"))
      .typeError("date is required"),
    subscription: yup.string(),
    subscribers: yup.array(),
    maxUsage: yup.string(),
    totalMaxUsage: yup.string(),
>>>>>>> raj_appideas
    discountPercentage: yup
      .number()
      .positive()
      .test(
        "length",
        "must be more than 1 digit or less than or equal to 3 digits ",
        (val) => {
          return (
            !val ||
            (val && val.toString().length < 1) ||
            (val && val.toString().length <= 3)
          );
        }
      )
      .required(t("discount is required"))
      .typeError("Only number allowed."),
  });

  const {
    register,
    handleSubmit,
<<<<<<< HEAD
=======
    setValue,
>>>>>>> raj_appideas
    formState: { errors, isDirty },
  } = useForm({
    shouldFocusError: true,
    reValidateMode: "onChange",
    mode: "onChange",
    resolver: yupResolver(createPromoCodeScheam),
  });

  const onSubmit = (data) => {
<<<<<<< HEAD
    const { code, discountPercentage, expireDate } = data;

=======
    const {
      code,
      discountPercentage,
      expireDate,
      maxUsage,
      totalMaxUsage,
      subscription,
      subscribers,
    } = data;
>>>>>>> raj_appideas
    if (!isDirty) return;
    const response = dispatch(
      handleCreatePromoCode({
        code,
        discountPercentage,
        expireDate,
<<<<<<< HEAD
=======
        maxUsage,
        totalMaxUsage,
        subscription,
        subscribers: subscribers?.map((sub) => sub?.value),
>>>>>>> raj_appideas
        token,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success(`${t("promo code created successfully.")}`, {
            duration: 2000,
          });
          setShowCreatePromoCode(false);
        }
      });
    }
  };

  useEffect(() => {
    return () => {
      abortApiCall();
    };
  }, []);
<<<<<<< HEAD
=======

  const subscriberOptions = subscribers.map((subscriber) => {
    return {
      value: subscriber?._id,
      label: subscriber?.fname.concat(subscriber?.lname),
    };
  });

>>>>>>> raj_appideas
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full lg:space-y-5 space-y-3"
    >
      {/* title + buttons */}
      <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
        <p className="font-semibold text-left lg:text-xl text-lg">
          {t("Create new promo code")}
        </p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            className={`gray_button ${
              createAndUpdateLoading && "cursor-not-allowed"
            }`}
            onClick={() => {
              setShowCreatePromoCode(false);
            }}
            disabled={createAndUpdateLoading}
            type="reset"
          >
            {t("Cancel")}
          </button>
          <button
            className={`green_button ${
              createAndUpdateLoading && "cursor-not-allowed"
            }`}
            type="submit"
            disabled={createAndUpdateLoading}
          >
            {createAndUpdateLoading
              ? t("Submitting").concat("...")
              : t("Submit")}
          </button>
        </div>
      </div>
      {/* main div */}
      <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
        {/* personal details */}
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/* code */}
          <div className="w-full space-y-2">
            <label htmlFor="code" className="Label">
              {t("Code")}
            </label>
            <input
              type="text"
              placeholder={t("Type here...")}
              className="input_field"
              {...register("code")}
            />
            <span className="error">{errors?.code?.message}</span>
          </div>
          {/* expire date */}
          <div className="w-full space-y-2">
            <label htmlFor="expireDate" className="Label">
              {t("expire date")}
            </label>
            <input
              type="date"
              placeholder={t("Type here...")}
              className="input_field"
              {...register("expireDate")}
              min={moment().format("YYYY-MM-DD")}
            />
            <span className="error">{errors?.expireDate?.message}</span>
          </div>
          {/* discount */}
          <div className="w-full space-y-2">
            <label htmlFor="company" className="Label">
              {t("Discount percentage")}
            </label>
            <input
              type="number"
              placeholder={t("Type here...")}
              className="input_field"
              {...register("discountPercentage")}
            />
            <span className="error">{errors?.discountPercentage?.message}</span>
          </div>
<<<<<<< HEAD
=======
          {/* subscriptoin */}
          <div className="w-full space-y-2">
            <label htmlFor="subscriptoin" className="Label">
              {t("subscriptoin")}
            </label>
            <select
              type="text"
              placeholder={t("Type here...")}
              className="input_field"
              {...register("subscription")}
            >
              <option label="select subscription"></option>
              {subscriptions.map((subscription) => (
                <option key={subscription?._id} value={subscription?._id}>
                  {subscription?.title}
                </option>
              ))}
            </select>
            <span className="error">{errors?.subscription?.message}</span>
          </div>
          {/* subscriber */}
          <div className="w-full space-y-2">
            <label htmlFor="Subscriber" className="Label">
              {t("Subscriber")}
            </label>
            <Select
              options={subscriberOptions}
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              onChange={(e) => {
                setValue("subscribers", e);
              }}
            />

            <span className="error">{errors?.subscribers?.message}</span>
          </div>
          {/* max usage */}
          <div className="w-full space-y-2">
            <label htmlFor="maxUsage" className="Label">
              {t("Max Usage")}
            </label>
            <input
              type="number"
              placeholder={t("Type here...")}
              className="input_field"
              {...register("maxUsage")}
            />
            <span className="error">{errors?.maxUsage?.message}</span>
          </div>
          {/* total max usage */}
          <div className="w-full space-y-2">
            <label htmlFor="totalMaxUsage" className="Label">
              {t("Total max usage")}
            </label>
            <input
              type="number"
              placeholder={t("Type here...")}
              className="input_field"
              {...register("totalMaxUsage")}
            />
            <span className="error">{errors?.totalMaxUsage?.message}</span>
          </div>
>>>>>>> raj_appideas
        </div>
      </div>
    </form>
  );
};

export default CreatePromoCode;
