import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import {
  handleGetPricing,
  handleUpadtePricing,
} from "../redux/TaxAndShippingSlice";
import toast from "react-hot-toast";
import useAbortApiCall from "../hooks/useAbortApiCall";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { handleLogout } from "../redux/AuthSlice";
import { handleLogoutFromAllTabs } from "../redux/GlobalStates";

const TaxtAndShippingCharges = () => {
  const [isEditing, setIsEditing] = useState(false);

  const { token, role } = useSelector((state) => state.root.auth);
  const { isSidebarOpen } = useSelector((state) => state.root.globalStates);
  const { tax, loading, updateLoading, shipping } = useSelector(
    (state) => state.root.taxAndShipping,
  );

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const tax_shippingCharges_schema = yup.object({
    MetropolitanFranceTax: yup.string().required().trim(),
    EEC_Switzerland_OverseasTax: yup.string().required().trim(),
    RestOfTheWorldTax: yup.string().required().trim(),
    MetropolitanFranceShipping: yup
      .string()
      .required()
      .max(4, t("maximum 4 numbers"))
      .min(2, t("minmum 2 numbers"))
      .trim(""),
    EEC_Switzerland_OverseasShipping: yup
      .string()
      .required()
      .max(4, t("maximum 4 numbers"))
      .min(2, t("minmum 2 numbers"))
      .trim(""),
    RestOfTheWorldShipping: yup
      .string()
      .required()
      .max(4, t("maximum 4 numbers"))
      .min(2, t("minmum 2 numbers"))
      .trim(""),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    shouldFocusError: true,
    reValidateMode: "onChange",
    mode: "onChange",
    resolver: yupResolver(tax_shippingCharges_schema),
    defaultValues: {
      MetropolitanFranceShipping: shipping?.MetropolitanFrance,
      RestOfTheWorldShipping: shipping?.RestOfTheWorld,
      EEC_Switzerland_OverseasShipping: shipping?.EEC_Switzerland_Overseas,
      MetropolitanFranceTax: tax?.MetropolitanFrance,
      RestOfTheWorldTax: tax?.RestOfTheWorld,
      EEC_Switzerland_OverseasTax: tax?.EEC_Switzerland_Overseas,
    },
  });

  const onSubmit = (data) => {
    const {
      MetropolitanFranceShipping,
      MetropolitanFranceTax,
      EEC_Switzerland_OverseasShipping,
      EEC_Switzerland_OverseasTax,
      RestOfTheWorldShipping,
      RestOfTheWorldTax,
    } = data;

    const tax = {
      EEC_Switzerland_Overseas: EEC_Switzerland_OverseasTax,
      MetropolitanFrance: MetropolitanFranceTax,
      RestOfTheWorld: RestOfTheWorldTax,
    };

    const shipping = {
      EEC_Switzerland_Overseas: EEC_Switzerland_OverseasShipping,
      MetropolitanFrance: MetropolitanFranceShipping,
      RestOfTheWorld: RestOfTheWorldShipping,
    };

    const response = dispatch(
      handleUpadtePricing({
        tax,
        shipping,
        token,
        signal: AbortControllerRef,
      }),
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success(t("Tax & Shipping Charges edited successfully"), {
            duration: 3000,
          });
          setIsEditing(false);
        } else if (res?.payload?.status === "error") {
          toast.error(res?.payload?.message);
        }
      });
    }
  };

  useEffect(() => {
    const response = dispatch(
      handleGetPricing({ token, signal: AbortControllerRef }),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet title="Tax & Shipping Charges | Bois News Media" />
      <div className="w-full flex items-start lg:gap-3 flex-row h-auto">
        <Sidebar />
        <section
          className={`h-full space-y-5 bg-[#FBFBFB] min-h-screen ${
            isSidebarOpen ? "xl:w-10/12 lg:w-4/5 w-full" : "lg:w-[90%] w-full"
          }`}
        >
          <Header />
          <div className="lg:p-5 p-3 ">
            {loading ? (
              <div className="data_not_found_And_Loading">Loading...</div>
            ) : (
              <div className="w-full lg:space-y-5 space-y-3">
                {/* title + buttons */}
                <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
                  <p className="font-semibold text-left lg:text-xl text-lg">
                    {t("Tax & Shipping Charges")}
                  </p>
                  <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
                    {isEditing && (
                      <button
                        className={`gray_button `}
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                        }}
                        disabled={updateLoading || loading}
                      >
                        {t("Cancel")}
                      </button>
                    )}
                    {role === "admin" && (
                      <>
                        {isEditing ? (
                          <button
                            disabled={updateLoading || loading}
                            className={`green_button`}
                            onClick={() => handleSubmit(onSubmit(getValues()))}
                          >
                            {updateLoading
                              ? t("Saving").concat("...")
                              : t("Save")}
                          </button>
                        ) : (
                          <button
                            disabled={updateLoading || loading}
                            className={`green_button `}
                            type="button"
                            onClick={() => {
                              setIsEditing(true);
                            }}
                          >
                            {t("Edit")}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
                {/* main div */}
                <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
                  <p className="font-bold text-black md:text-xl capitalize">
                    {t("Tax Charges")}
                  </p>
                  {/* tax */}
                  <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
                    {/* MetropolitanFrance */}
                    <div className="w-full space-y-2">
                      <label htmlFor="MetropolitanFrance" className="Label">
                        {t("Metropolitan France")}
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            type="number"
                            placeholder={t("Type here...")}
                            className="input_field"
                            {...register("MetropolitanFranceTax")}
                          />
                          <span className="error">
                            {errors?.MetropolitanFranceTax?.message}
                          </span>
                        </>
                      ) : (
                        <p className="font-semibold">
                          {tax?.MetropolitanFrance} %
                        </p>
                      )}
                    </div>
                    {/* EEC_Switzerland_Overseas */}
                    <div className="w-full space-y-2">
                      <label
                        htmlFor="EEC_Switzerland_Overseas"
                        className="Label"
                      >
                        {t("EEC / Switzerland /Overseas")}
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            type="number"
                            placeholder={t("Type here...")}
                            className="input_field"
                            {...register("EEC_Switzerland_OverseasTax")}
                          />
                          <span className="error">
                            {errors?.EEC_Switzerland_OverseasTax?.message}
                          </span>
                        </>
                      ) : (
                        <p className="font-semibold">
                          {tax?.EEC_Switzerland_Overseas} %
                        </p>
                      )}
                    </div>
                    {/* RestOfTheWorld */}
                    <div className="w-full space-y-2">
                      <label htmlFor="RestOfTheWorld" className="Label">
                        {t("Rest Of The World")}
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            type="number"
                            placeholder={t("Type here...")}
                            className="input_field"
                            {...register("RestOfTheWorldTax")}
                          />
                          <span className="error">
                            {errors?.RestOfTheWorldTax?.message}
                          </span>
                        </>
                      ) : (
                        <p className="font-semibold">{tax?.RestOfTheWorld} %</p>
                      )}
                    </div>
                  </div>
                  <hr className="my-1" />
                  {/* shipping charges */}
                  <p className="font-bold text-black md:text-xl">
                    {t("Shipping Charges")}
                  </p>
                  <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
                    {/* MetropolitanFrance */}
                    <div className="w-full space-y-2">
                      <label htmlFor="MetropolitanFrance" className="Label">
                        {t("Metropolitan France")}
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            type="number"
                            placeholder={t("Type here...")}
                            className="input_field"
                            {...register("MetropolitanFranceShipping")}
                          />
                          <span className="error">
                            {errors?.MetropolitanFranceShipping?.message}
                          </span>
                        </>
                      ) : (
                        <p className="font-semibold">
                          {Intl.NumberFormat("us-FR", {
                            currency: "EUR",
                            style: "currency",
                          }).format(shipping?.MetropolitanFrance)}
                        </p>
                      )}
                    </div>
                    {/* EEC_Switzerland_Overseas */}
                    <div className="w-full space-y-2">
                      <label
                        htmlFor="EEC_Switzerland_Overseas"
                        className="Label"
                      >
                        {t("EEC / Switzerland /Overseas")}
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            type="number"
                            placeholder={t("Type here...")}
                            className="input_field"
                            {...register("EEC_Switzerland_OverseasShipping")}
                          />
                          <span className="error">
                            {errors?.EEC_Switzerland_OverseasShipping?.message}
                          </span>
                        </>
                      ) : (
                        <p className="font-semibold">
                          {Intl.NumberFormat("us-FR", {
                            currency: "EUR",
                            style: "currency",
                          }).format(shipping?.EEC_Switzerland_Overseas)}
                        </p>
                      )}
                    </div>
                    {/* RestOfTheWorld */}
                    <div className="w-full space-y-2">
                      <label htmlFor="RestOfTheWorld" className="Label">
                        {t("Rest Of The World")}
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            type="number"
                            placeholder={t("Type here...")}
                            className="input_field"
                            {...register("RestOfTheWorldShipping")}
                          />
                          <span className="error">
                            {errors?.RestOfTheWorldShipping?.message}
                          </span>
                        </>
                      ) : (
                        <p className="font-semibold">
                          {Intl.NumberFormat("us-FR", {
                            currency: "EUR",
                            style: "currency",
                          }).format(shipping?.RestOfTheWorld)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default TaxtAndShippingCharges;
