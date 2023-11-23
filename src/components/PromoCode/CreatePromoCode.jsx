import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import {
  handleCreatePromoCode,
  handleEditPromoCode,
  handleFindSinglePromoCode,
} from "../../redux/PromoCodeSlice";
import { useEffect } from "react";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import toast from "react-hot-toast";
import moment from "moment";

const CreatePromoCode = ({ setShowCreatePromoCode }) => {
  const { createAndUpdateLoading } = useSelector(
    (state) => state.root.promoCode
  );

  const { token } = useSelector((s) => s.root.auth);

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const createPromoCodeScheam = yup.object({
    code: yup
      .string()
      .required(t("code is required"))
      .min(2, t("minimum two character required")),
    expireDate: yup.date().required(t("date is required")).typeError("date is required"),
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
    formState: { errors, isDirty },
  } = useForm({
    shouldFocusError: true,
    reValidateMode: "onChange",
    mode: "onChange",
    resolver: yupResolver(createPromoCodeScheam),
  });

  const onSubmit = (data) => {
    const { code, discountPercentage, expireDate } = data;

    if (!isDirty) return;
    const response = dispatch(
      handleCreatePromoCode({
        code,
        discountPercentage,
        expireDate,
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
        </div>
      </div>
    </form>
  );
};

export default CreatePromoCode;
