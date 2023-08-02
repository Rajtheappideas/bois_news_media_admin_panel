import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { BsEyeSlashFill, BsEyeFill } from "react-icons/bs";
import bgImage from "../assets/images/BG.jpg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useAbortApiCall from "../hooks/useAbortApiCall";
import { handleLoginUser } from "../redux/AuthSlice";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { handleSuccess } from "../redux/GlobalStates";
import { useTranslation } from "react-i18next";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { loading, user, error } = useSelector((state) => state.root.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const signinSchema = yup.object({
    email: yup.string().email().required(t("Email is required")).trim(),
    password: yup.string().required(t("Password is required")).trim(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
    resolver: yupResolver(signinSchema),
  });

  const onSubmit = (data) => {
    const { email, password } = data;
    const response = dispatch(
      handleLoginUser({
        email,
        password,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success(t("Sign in Successfully."), { duration: 2000 });
          dispatch(handleSuccess());
          navigate("/");
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
      <Helmet title={`${t("Sign-in")} | Bois News Media`} />
      <div
        style={{
          background: `url(${bgImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
        }}
        className="w-full custom_scrollbar flex overflow-x-hidden items-center justify-center relative min-h-screen"
      >
        <section className="bg-white absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-xl md:px-5 md:py-5 px-4 py-4 flex items-center flex-col mx-auto xl:w-3/12 lg:w-5/12 md:w-1/2 w-11/12 h-auto gap-y-2">
          {/* logo */}
          <div className="md:my-5 my-3">
            <Link to="/">
              <img
                src={require("../assets/images/logo.png")}
                className="w-20 h-fit object-contain object-center"
              />
            </Link>
          </div>
          {/* title */}
          <p className="font-bold text-textBlack text-center md:text-lg">
            {t("Sign in your account")}
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
                className="label block font-semibold text-left md:text-base text-sm"
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
            {/* password */}
            <div className="space-y-1 ">
              <label
                className="label block font-semibold text-left md:text-base text-sm"
                htmlFor="password"
              >
                {t("Password")}
              </label>
              <div className="relative">
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
            {/* butons */}
            <button
              type="submit"
              className={`bg-primaryBlue text-white font-medium text-center md:h-12 h-10 rounded-lg p-2 hover:bg-primaryBlue/80 active:scale-95 transition w-full  ${
                loading && "cursor-not-allowed"
              }`}
              disabled={loading}
            >
              {loading ? t("Logging in").concat("...") : t("Login")}
            </button>

            {/* forgot password */}
            <div className="text-center text-lg">
              <Link
                to="/forgot-password"
                className="text-DarkBlue font-semibold hover:underline duration-100"
                aria-disabled={loading}
              >
                {t("Forgot password")} ?
              </Link>
            </div>

            {/* register link */}
            <div className="text-center font-normal">
              {t("Don’t have an account")}?
              <Link
                to="/sign-up"
                className="text-primaryBlue ml-1 font-medium hover:underline"
              >
                {t("Register Now")}!
              </Link>
            </div>
          </form>
        </section>
      </div>
    </>
  );
};

export default SignIn;
