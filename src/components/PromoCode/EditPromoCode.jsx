import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import {
  handleEditPromoCode,
  handleFindSinglePromoCode,
} from "../../redux/PromoCodeSlice";
import { useEffect } from "react";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import toast from "react-hot-toast";
import moment from "moment";
import { handleGetAllSubscription } from "../../redux/SubscriptionSlice";
import Select from "react-select";
import Animated from "react-select/animated";

const EditPromoCode = ({ setShowEditPromoCode }) => {
  const { createAndUpdateLoading, singlePromoCode } = useSelector(
    (state) => state.root.promoCode
  );

  const { subscriptions, loading } = useSelector(
    (state) => state.root.subscriptions
  );

  const { subscribers } = useSelector((state) => state.root.subscribers);

  const subscriberOptions = subscribers.map((subscriber) => {
    return {
      value: subscriber?._id,
      label: subscriber?.fname.concat(subscriber?.lname),
    };
  });

  const animatedComponents = Animated();

  const { token } = useSelector((s) => s.root.auth);

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const createPromoCodeScheam = yup.object({
    code: yup
      .string()
      .required(t("code is required"))
      .min(2, t("minimum two character required")),
    expireDate: yup.date().required(t("date is required")),
    subscribers: yup.array(),
    subscriptoin: yup.string(),
    maxUsage: yup.string(),
    totalMaxUsage: yup.string(),
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
    setValue,
    getValues,
    formState: { errors, isDirty },
  } = useForm({
    shouldFocusError: true,
    reValidateMode: "onChange",
    mode: "onChange",
    resolver: yupResolver(createPromoCodeScheam),
    defaultValues: {
      code: singlePromoCode?.code,
      discountPercentage: singlePromoCode?.discountPercentage,
      expireDate: moment(singlePromoCode?.expireDate).format("YYYY-MM-DD"),
      subscriptoin: singlePromoCode?.subscription,
      maxUsage: singlePromoCode?.maxUsage,
      totalMaxUsage: singlePromoCode?.totalMaxUsage,
      subscribers: singlePromoCode?.subscribers,
    },
  });

  const onSubmit = (data) => {
    const {
      code,
      discountPercentage,
      expireDate,
      subscription,
      maxUsage,
      totalMaxUsage,
      subscribers,
    } = data;

    const response = dispatch(
      handleEditPromoCode({
        code,
        id: singlePromoCode?._id,
        discountPercentage,
        expireDate,
        subscription,
        maxUsage,
        totalMaxUsage,
        subscribers: subscribers.map((sub) => {
          if (sub.hasOwnProperty("value")) {
            return sub?.value;
          } else {
            return sub;
          }
        }),
        token,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success(`${t("promo code edited successfully.")}`, {
            duration: 2000,
          });
          setShowEditPromoCode(false);
          dispatch(handleFindSinglePromoCode(null));
        }
      });
    }
  };

  useEffect(() => {
    return () => {
      abortApiCall();
    };
  }, []);

  // fetch subscriptions
  useEffect(() => {
    dispatch(handleGetAllSubscription({ token, signal: AbortControllerRef }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full lg:space-y-5 space-y-3"
    >
      {/* title + buttons */}
      <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
        <p className="font-semibold text-left lg:text-xl text-lg">
          {t("edit promo code details")}
        </p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            className={`gray_button ${
              createAndUpdateLoading && "cursor-not-allowed"
            }`}
            onClick={() => {
              setShowEditPromoCode(false);
              dispatch(handleFindSinglePromoCode(null));
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
          {/* subscriptoin */}
          <div className="w-full space-y-2">
            <label htmlFor="subscription" className="Label">
              {t("subscription")}
            </label>
            <select
              type="text"
              placeholder={t("Type here...")}
              className="input_field"
              {...register("subscription")}
            >
              <option label="select subscription"></option>
              {subscriptions.map((subscription) => (
                <option
                  selected={subscription?._id === singlePromoCode?.subscription}
                  key={subscription?._id}
                  value={subscription?._id}
                >
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
              defaultValue={subscriberOptions.filter((sub) =>
                getValues().subscribers.some((subs) => sub.value === subs)
              )}
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
        </div>
      </div>
    </form>
  );
};

export default EditPromoCode;
