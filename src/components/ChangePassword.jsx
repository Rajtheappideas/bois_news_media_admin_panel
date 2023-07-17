import React from "react";
import { useState } from "react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import useAbortApiCall from "../hooks/useAbortApiCall";
import { handleChangePassword } from "../redux/AuthSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setshowNewPassword] = useState(false);

  const { loading, token } = useSelector((state) => state.root.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { AbortControllerRef } = useAbortApiCall();

  const changepasswordSchema = yup.object({
    oldPassword: yup.string().required("old password is required!!!").trim(),
    newPassword: yup
      .string()
      .required("new password is required!!!")
      .matches(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
        "Minimum 6 characters, at least one special character, at least one digit!!!"
      )
      .trim(),
    confirmPassword: yup
      .string()
      .required("confirm password is required!!!")
      .oneOf([yup.ref("newPassword"), null], "Password not match!!!"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
    resolver: yupResolver(changepasswordSchema),
  });

  const onSubmit = (data) => {
    const { oldPassword, newPassword } = data;
    const response = dispatch(
      handleChangePassword({
        oldPassword,
        newPassword,
        token,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success("Password change successfully.", { duration: 4000 });
          navigate("/sign-in");
          window.localStorage.clear();
        } else if (res?.payload?.status === "error") {
          toast.error(res?.payload?.message);
        }
      });
    }
  };

  return (
    <div className="w-full lg:space-y-5 space-y-3">
      {/* title + buttons */}
      <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
        <p className="font-semibold text-left lg:text-xl text-lg">
          Change password
        </p>
      </div>
      {/* main div */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3"
      >
        {/* personal details */}
        {/* old password */}
        <div className="w-full md:w-1/2 xl:w-1/3 space-y-2 relative">
          <label htmlFor="old_password" className="Label">
            Old password
          </label>
          <input
            {...register("oldPassword")}
            type={showOldPassword ? "text" : "password"}
            placeholder="Type here..."
            className="input_field"
          />
          <button
            type="button"
            onClick={() => setShowOldPassword(!showOldPassword)}
            className="absolute top-9 cursor-pointer right-3 text-gray-400 bg-white"
          >
            {showOldPassword ? (
              <BsEyeFill size={24} />
            ) : (
              <BsEyeSlashFill size={24} />
            )}
          </button>
          <span role="alert" className="error">
            {errors?.oldPassword?.message}
          </span>
        </div>
        {/* new password */}
        <div className="w-full md:w-1/2 xl:w-1/3 space-y-2 relative">
          <label htmlFor="new_password" className="Label">
            new password
          </label>
          <input
            {...register("newPassword")}
            type={showNewPassword ? "text" : "password"}
            placeholder="Type here..."
            className="input_field"
          />
          <button
            type="button"
            onClick={() => setshowNewPassword(!showNewPassword)}
            className="absolute top-9 cursor-pointer right-3 text-gray-400 bg-white"
          >
            {showNewPassword ? (
              <BsEyeFill size={24} />
            ) : (
              <BsEyeSlashFill size={24} />
            )}
          </button>
          <span role="alert" className="error">
            {errors?.newPassword?.message}
          </span>
        </div>
        {/* confirm password */}
        <div className="w-full md:w-1/2 xl:w-1/3 space-y-2">
          <label htmlFor="confirm_password" className="Label">
            confirm password
          </label>
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="Type here..."
            className="input_field"
          />
          <span role="alert" className="error">
            {errors?.confirmPassword?.message}
          </span>
        </div>
        {/* btn */}
        <button
          type="submit"
          className={`bg-primaryBlue text-white font-medium text-center md:h-12 h-10 rounded-lg p-2 hover:bg-primaryBlue/80 active:scale-95 transition xl:w-1/3 md:w-1/2 w-full ${
            loading && "cursor-not-allowed"
          } `}
          disabled={loading}
        >
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
