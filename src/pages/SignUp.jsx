import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import bgImage from "../assets/images/BG.jpg";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { handleRegisterUser } from "../redux/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import useAbortApiCall from "../hooks/useAbortApiCall";
import { toast } from "react-hot-toast";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { loading, user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const localStorageData = JSON.parse(window.localStorage.getItem("user"));

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const signupSchema = yup.object({
    email: yup.string().email().required("Email is required!!!").trim(),
    password: yup
      .string()
      .required("Password is required!!!")
      .matches(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
        "Minimum 6 characters, at least one special character, at least one digit!!!"
      )
      .trim(),
    name: yup.string().required("Name is required!!!").trim(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    shouldFocusError: true,
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = (data) => {
    const { email, name, role, password } = data;
    const response = dispatch(
      handleRegisterUser({
        name,
        email,
        role,
        password,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success("Sign up Successfully.", { duration: 2000 });
          window.localStorage.setItem(
            "user",
            JSON.stringify(res?.payload?.user)
          );
          window.localStorage.setItem(
            "token",
            JSON.stringify(res?.payload?.token)
          );
          window.localStorage.setItem(
            "role",
            JSON.stringify(res?.payload?.user?.role)
          );
          navigate("/");
        } else if (res?.payload?.status === "Error") {
          toast.error(res?.payload?.message);
        }
      });
    }
  };

  useEffect(() => {
    if (localStorageData !== null && user !== null) {
      toast.success("You already logged in.");
      navigate("/");
    }
    return () => {
      abortApiCall();
    };
  }, []);

  return (
    <>
      <Helmet title="Sign-up | Bois Mega News" />
      <div
        style={{
          background: `url(${bgImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
        }}
        className="w-full custom_scrollbar flex overflow-x-hidden items-center justify-center relative min-h-screen overflow-y-scroll"
      >
        <section className="bg-white absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-xl md:px-5 md:py-5 px-4 py-2 flex items-center flex-col mx-auto xl:w-3/12 lg:w-5/12 md:w-1/2 w-11/12 h-auto gap-y-1">
          {/* logo */}
          <div className="md:my-3 my-1">
            <Link to="/">Logo</Link>
          </div>
          {/* title */}
          <p className="font-bold text-textBlack text-center md:text-lg">
            Sign in your account
          </p>
          {/* form  */}
          <form
            className="lg:space-y-2 space-y-1 w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* radio btns */}
            <div className="flex flex-wrap flex-row items-center gap-2 md:text-lg justify-center font-semibold select-none">
              <div className="flex md:text-base text-sm items-center md:gap-x-2 gap-x-1">
                <input
                  {...register("role")}
                  defaultChecked
                  type="radio"
                  name="role"
                  id="admin"
                  value="admin"
                />
                <label htmlFor="admin" className="cursor-pointer">
                  <span>Administrator</span>
                </label>
              </div>
              <div className="flex md:text-base text-sm items-center md:gap-x-2 gap-x-1">
                <input
                  {...register("role")}
                  type="radio"
                  name="role"
                  id="editor"
                  value="editor"
                />
                <label htmlFor="editor" className="cursor-pointer">
                  <span>Editor</span>
                </label>
              </div>
              <div className="flex md:text-base text-sm items-center md:gap-x-2 gap-x-1">
                <input
                  {...register("role")}
                  type="radio"
                  name="role"
                  id="viewer"
                  value="viewer"
                />
                <label htmlFor="viewer" className="cursor-pointer">
                  <span>View only</span>
                </label>
              </div>
            </div>
            {/* name */}
            <div className="space-y-1">
              <label
                className="label block font-semibold text-left md:text-base text-sm"
                htmlFor="name"
              >
                User name
              </label>
              <input
                {...register("name")}
                type="text"
                placeholder="Enter your name"
                className="input_field"
              />
              <span role="alert" className="error">
                {errors?.name?.message}
              </span>
            </div>
            {/* email */}
            <div className="space-y-1">
              <label
                className="label block font-semibold text-left md:text-base text-sm"
                htmlFor="email"
              >
                E-Mail
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
                className="input_field"
              />
              <span role="alert" className="error">
                {errors?.email?.message}
              </span>
            </div>
            {/* password */}
            <div className="space-y-1 relative">
              <label
                className="label block font-semibold text-left md:text-base text-sm"
                htmlFor="password"
              >
                Password
              </label>{" "}
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="input_field"
              />
              <span role="alert" className="error">
                {errors?.password?.message}
              </span>
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
            <button
              type="submit"
              disabled={loading}
              className="bg-primaryBlue text-white font-medium text-center md:h-12 h-10 rounded-lg p-2 hover:bg-primaryBlue/80 active:scale-95 transition w-full"
            >
              {loading ? "Signing up..." : "Sign up"}
            </button>

            {/* signin link */}
            <div className="text-center font-normal">
              Already have an account?
              <Link
                to="/sign-in"
                className="text-primaryBlue ml-1 font-medium hover:underline"
              >
                Sign in
              </Link>
            </div>
          </form>
        </section>
      </div>
    </>
  );
};

export default SignUp;
