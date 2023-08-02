import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet";
import bgImage from "../assets/images/BG.jpg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import OTPVerify from "../components/OTPVerify";
import useAbortApiCall from "../hooks/useAbortApiCall";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { handleForgotPassword, handleStoreUserEmail } from "../redux/AuthSlice";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const [showOtpComponent, setShowOtpComponent] = useState(false);

  const signinSchema = yup.object({
    email: yup.string().email().required(t("Email is required")).trim(),
  });

  const { loading, user, error } = useSelector((state) => state.root.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    shouldFocusError: true,
    resolver: yupResolver(signinSchema),
  });

  const onSubmit = (data) => {
    const { email } = data;
    const response = dispatch(
      handleForgotPassword({
        email,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success(t("Check your mails."), { duration: 4000 });
          console.log("OTP=>", res.payload?.otp);
          dispatch(handleStoreUserEmail(getValues("email")));
          setShowOtpComponent(true);
        } else if (res?.payload?.status === "error") {
          toast.error(res?.payload?.message);
        }
      });
    }
  };

  useEffect(() => {
    if (user !== null) {
      toast(t("You already logged in."), { duration: 3000 });
      navigate("/");
    }
    return () => {
      abortApiCall();
    };
  }, []);

  return (
    <>
      <Helmet title={`${t("Forgot-password")} | Bois News Media`} />

      <div
        style={{
          background: `url(${bgImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
        }}
        className="w-full custom_scrollbar flex overflow-x-hidden items-center justify-center relative min-h-screen"
      >
        {showOtpComponent ? (
          <OTPVerify email={getValues("email")} />
        ) : (
          <section className="bg-white absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-xl md:px-5 md:py-5 px-4 py-4 flex items-center flex-col mx-auto xl:w-3/12 lg:w-5/12 md:w-1/2 w-11/12 h-auto gap-y-2">
            {/* logo */}
            <div className="md:my-3 my-2">
              <Link to="/">
                {" "}
                <img
                  src={require("../assets/images/logo.png")}
                  className="w-20 h-fit object-contain object-center"
                />
              </Link>
            </div>
            {/* title */}
            <p className="font-bold text-textBlack text-center md:text-lg">
              {t("Forgot password")}
            </p>
            {/* {error !== null && <span className="error">{error?.message}</span>} */}

            {/* form  */}
            <form
              className="lg:space-y-3 space-y-1 w-full"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* email */}
              <div className="space-y-1">
                <label
                  className="label block font-semibold text-left text-lg"
                  htmlFor="email"
                >
                  {t("E-Mail")}
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder={t("Enter your email")}
                  className="input_field"
                />
                <span className="error">{errors?.email?.message}</span>
              </div>

              {/* butons */}
              <button
                type="submit"
                disabled={loading}
                className={`bg-primaryBlue text-white font-medium text-center md:h-12 h-10 rounded-lg p-2 hover:bg-primaryBlue/80 active:scale-95 transition w-full ${
                  loading && "cursor-not-allowed"
                } `}
              >
                {loading ? t("Submitting").concat("...") : t("Submit")}
              </button>
            </form>
          </section>
        )}
      </div>
    </>
  );
};

export default ForgotPassword;
