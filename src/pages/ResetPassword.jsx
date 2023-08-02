import React, { useState } from "react";
import { Helmet } from "react-helmet";
import bgImage from "../assets/images/BG.jpg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Success from "../components/Success";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { handleResetPassword } from "../redux/AuthSlice";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import useAbortApiCall from "../hooks/useAbortApiCall";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const [showSuccessComponent, setShowSuccessComponent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { loading, user, verifyToken, email, error } = useSelector(
    (state) => state.root.auth
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const resetSchema = yup.object({
    password: yup
      .string()
      .required(t("Password is required"))
      .matches(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
        t(
          "Minimum 6 characters, at least one special character, at least one digit"
        )
      )
      .trim(),
    confirmPassword: yup
      .string()
      .required(t("Confirm password is required!!!"))
      .oneOf([yup.ref("password"), null], t("Password not match!!!")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
    resolver: yupResolver(resetSchema),
  });

  const onSubmit = (data) => {
    const { password } = data;
    const response = dispatch(
      handleResetPassword({
        email,
        password,
        verifyToken,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success(t("Password Reset successfully."), { duration: 4000 });
          setShowSuccessComponent(true);
          window.localStorage.clear();
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
      <Helmet title={`${t("Reset-password")} | Bois News Media`} />

      <div
        style={{
          background: `url(${bgImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
        }}
        className="w-full custom_scrollbar flex overflow-x-hidden items-center justify-center relative min-h-screen"
      >
        {showSuccessComponent ? (
          <Success />
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
              {t("Reset password")}
            </p>
            {/* {error !== null && <span className="error">{error?.message}</span>} */}

            {/* form  */}
            <form
              className="lg:space-y-3 space-y-1 w-full"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* new password */}
              <div className="space-y-1 ">
                <label
                  className="label block font-semibold text-left text-lg"
                  htmlFor="password"
                >
                  {t("New password")}
                </label>{" "}
                <div className="relative h-auto">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder={t("Enter your password")}
                    className="input_field"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <BsEyeFill
                        size={24}
                        className="absolute top-1/2 -translate-y-1/2 cursor-pointer right-3 text-gray-400"
                      />
                    ) : (
                      <BsEyeSlashFill
                        size={24}
                        className="absolute top-1/2 -translate-y-1/2 cursor-pointer right-3 text-gray-400"
                      />
                    )}
                  </button>
                </div>
                <span role="alert" className="error">
                  {errors?.password?.message}
                </span>
              </div>
              {/* confirm password */}
              <div className="space-y-1">
                <label
                  className="label block font-semibold text-left text-lg"
                  htmlFor="confirm_password"
                >
                  {t("Confirm password")}
                </label>{" "}
                <input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder={t("Enter your password")}
                  className="input_field"
                />
                <span role="alert" className="error">
                  {errors?.confirmPassword?.message}
                </span>
                {/* butons */}
                <button
                  type="submit"
                  className={`bg-primaryBlue text-white font-medium text-center md:h-12 h-10 rounded-lg p-2 hover:bg-primaryBlue/80 active:scale-95 transition w-full ${
                    loading && "cursor-not-allowed"
                  } `}
                  disabled={loading}
                >
                  {loading ? t("Submitting").concat("...") : t("Submit")}
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </>
  );
};

export default ResetPassword;
