import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { BsEyeSlashFill, BsEyeFill } from "react-icons/bs";
import bgImage from "../assets/images/BG.jpg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
// import useAbortApiCall from "../hooks/useAbortApiCall";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setloading] = useState(false)

  // const { loading, user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const localStorageData = JSON.parse(window.localStorage.getItem("user"));

  const signinSchema = yup.object({
    email: yup.string().email().required("Email is required!!!").trim(),
    password: yup.string().required("Password is required!!!").trim(),
    role: yup.string().required("Choose your role!!!").trim(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    shouldFocusError: true,
    resolver: yupResolver(signinSchema),
  });

  // const onSubmit = (data) => {
  //   const { email: username, role, password } = data;
  //   const response = dispatch(
  //     handleLoginUser({
  //       username,
  //       role,
  //       password,
  //       signal: AbortControllerRef,
  //     })
  //   );
  //   if (response) {
  //     response.then((res) => {
  //       if (res?.payload?.status === "Success") {
  //         if (res?.payload?.message === "Your account not verify!") {
  //           setShowOtpComponent(true);
  //           console.log("OTP=>", res?.payload?.data?.otp);
  //         } else {
  //           toast.success("Sign in Successfully.", { duration: 2000 });
  //           window.localStorage.setItem(
  //             "user",
  //             JSON.stringify(res?.payload?.data)
  //           );
  //           window.localStorage.setItem(
  //             "token",
  //             JSON.stringify(res?.payload?.data?.api_token)
  //           );
  //           window.localStorage.setItem(
  //             "role",
  //             JSON.stringify(res?.payload?.data?.role)
  //           );
  //           navigate("/");
  //         }
  //       } else if (res?.payload?.status === "Error") {
  //         toast.error(res?.payload?.message);
  //       }
  //     });
  //   }
  // };

  // useEffect(() => {
  //   if (localStorageData !== null && user !== null) {
  //     toast.success("You already logged in.");
  //     navigate("/");
  //   }
  //   return () => {
  //     abortApiCall();
  //   };
  // }, []);

  return (
    <>
      <Helmet title="Sign-in | Bois Mega News" />
      <div
        style={{
          background: `url(${bgImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
        }}
        className="w-full custom_scrollbar flex overflow-x-hidden items-center justify-center relative min-h-screen"
      >
        <section className="bg-white absolute xl:mt-0 mt-28 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-xl md:p-6 pb-10 p-3 flex items-center flex-col mx-auto 2xl:w-3/12 xl:w-4/12 lg:w-5/12 md:w-1/2 w-11/12 h-auto gap-y-2">
          {/* logo */}
          <div className="md:my-5">
            <a href="/">
              {/* <img
                src={require("../assets/images/Brand/Logo.png")}
                className="md:h-24 h-16 w-fit object-fill object-center"
              /> */}
              Logo
            </a>
          </div>
          {/* title */}
          <div className="space-y-2 text-left mr-auto">
            <p className="font-semibold text-DarkBlue text-left md:text-3xl text-xl">
              Login
            </p>
          </div>
          {/* form  */}
          <form
            className="lg:space-y-3 space-y-2 w-full"
            // onSubmit={handleSubmit(onSubmit)}
          >
            {/* selection */}
            <div className="space-y-1">
              <label className="label">Role</label>
              <select {...register("role")} className="Input">
                <option label="Choose your role"></option>
                <option label="Brand" value="1" className="w-10/12">
                  Brand
                </option>
                <option label="Agency" value="2">
                  Agency
                </option>
              </select>
              <p className="text-red-600 font-medium">
                {errors?.role?.message}
              </p>
            </div>
            {/* email */}
            <div className="space-y-1">
              <label className="label">E-Mail</label>
              <input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
                className="Input"
              />
              <p className="text-red-600 font-medium">
                {errors?.email?.message}
              </p>
            </div>
            {/* password */}
            <div className="space-y-1 relative">
              <label className="label">password</label>
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="Input"
              />
              <p role="alert" className="text-red-600 font-medium">
                {errors?.password?.message}
              </p>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <BsEyeFill
                    size={24}
                    className="absolute top-10 cursor-pointer right-3 text-gray-400"
                  />
                ) : (
                  <BsEyeSlashFill
                    size={24}
                    className="absolute top-10 cursor-pointer right-3 text-gray-400"
                  />
                )}
              </button>
            </div>
            {/* butons */}
            <div className="flex md:flex-row flex-col w-full items-center gap-3">
              <button
                // disabled={loading}
                onClick={() => {
                  // abortApiCall();
                }}
                type="button"
                className="md:w-1/2 w-full Cancel_Button"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                type="submit"
                className="md:w-1/2 w-full Submit_Button"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

            {/* forgot password */}
            <div className="text-center text-lg">
              <a
                href="/forgot-password"
                className="text-DarkBlue font-semibold hover:underline duration-100"
                aria-disabled={loading}
              >
                Forgot password ?
              </a>
            </div>

            <hr />

            {/* join now */}
            <div className="w-1/2 mx-auto">
              <a aria-disabled={loading} href="/sign-up" className="w-full">
                <button
                  type="button"
                  className="bg-gray-300 font-semibold active:scale-90 text-lg text-DarkBlue w-full text-center p-3 rounded-lg hover:bg-gray-400 duration-100"
                >
                  Join Now
                </button>
              </a>
            </div>
          </form>
        </section>
      </div>
    </>
  );
};

export default SignIn;
