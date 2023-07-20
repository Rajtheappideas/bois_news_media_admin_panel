import React from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAbortApiCall from "../hooks/useAbortApiCall";
import { handleForgotPassword, handleVerifyOtp } from "../redux/AuthSlice";

const OTPVerify = ({ email }) => {
  const [numberField, setNumberField] = useState({
    stepOne: "",
    stepTwo: "",
    stepThree: "",
    stepFour: "",
    stepFive: "",
    stepSix: "",
  });
  const [resendOtpLoading, setResendOtpLoading] = useState(false);

  const { error, loading } = useSelector((state) => state.root.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const handleOnChange = (value, e) => {
    setNumberField({ ...numberField, [value]: e });
  };

  const handleInputFocus = (elmnt) => {
    if (elmnt.key === "Delete" || elmnt.key === "Backspace") {
      const next = elmnt.target.tabIndex - 2;
      if (next > -1) {
        elmnt.target.form.elements[next].focus();
      }
    } else {
      const next = elmnt.target.tabIndex;
      if (next < 6) {
        elmnt.target.form.elements[next].focus();
      }
    }
  };

  const handleSubmitVerfiyOtp = (e) => {
    e.preventDefault();
    if (Object.values(numberField).includes("")) {
      toast.remove();
      toast.error("Please fill all the fields!!");
      for (const key in numberField) {
        if (numberField.hasOwnProperty(key)) {
          const element = numberField[key];
          if (element === "") {
            document.getElementById(key).focus();
            break;
          }
        }
      }
      return true;
    }

    const response = dispatch(
      handleVerifyOtp({
        email,
        otp: Object.values(numberField).join(""),
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success("OTP verified successfully.", { duration: 2000 });
          navigate("/reset-password");
          resetValues();
        } else if (res?.payload?.status === "error") {
          toast.error(res?.payload?.message);
          resetValues();
        }
      });
    }
  };

  const handleResendOtp = () => {
    if (loading && resendOtpLoading) return true;
    setResendOtpLoading(true);
    const response = dispatch(
      handleForgotPassword({
        email,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          console.log("OTP=>", res?.payload?.otp);
          toast.success("Otp Sent to your email.", { duration: 4000 });
          setResendOtpLoading(false);
        } else if (res?.payload?.status === "error") {
          toast.error(res?.payload?.message);
          setResendOtpLoading(false);
        }
      });
    }
  };

  const resetValues = () => {
    setNumberField({
      stepOne: "",
      stepTwo: "",
      stepThree: "",
      stepFour: "",
      stepFive: "",
      stepSix: "",
    });
  };

  useEffect(() => {
    document.getElementById("stepOne").focus();
    return () => {
      abortApiCall();
    };
  }, []);

  return (
    <section className="bg-white absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-xl md:p-6 p-3 flex items-center flex-col mx-auto xl:w-4/12 lg:w-5/12 md:w-1/2 w-10/12 h-auto gap-y-2">
      {/* logo */}
      <div className="md:my-3 my-2">
        <Link to="/">
          <img
            src={require("../assets/images/logo.png")}
            className="w-20 h-fit object-contain object-center"
            alt="logo"
          />
        </Link>
      </div>
      {/* title */}
      <div className="space-y-2 text-center">
        <p className="font-semibold text-DarkBlue text-center md:text-lg text-base">
          Verification
        </p>
        <p className="text-sm text-teclborder-textColor leading-normal font-medium">
          Check your email for the OTP
        </p>
      </div>
      {error !== null && <span className="error">{error?.message}</span>}

      {/* form  */}
      <form
        className="md:space-y-5 space-y-2 w-full text-center"
        onSubmit={(e) => handleSubmitVerfiyOtp(e)}
      >
        {/* otp boxes */}
        <div className="flex w-full items-center justify-center md:gap-3 gap-1">
          <input
            type="number"
            className="otp_Field"
            onChange={(e) => {
              handleOnChange(
                "stepOne",
                e.target.value.length > 1
                  ? e.target.value.slice(-1)
                  : e.target.value.trim()
              );
            }}
            value={numberField?.stepOne}
            onKeyUp={(e) => handleInputFocus(e)}
            autoComplete="off"
            tabIndex="1"
            min="0"
            max="9"
            maxLength="1"
            name="stepOne"
            id="stepOne"
          />
          <input
            type="number"
            className="otp_Field"
            onChange={(e) =>
              handleOnChange(
                "stepTwo",
                e.target.value.length > 1
                  ? e.target.value.slice(-1)
                  : e.target.value.trim()
              )
            }
            onKeyUp={(e) => handleInputFocus(e)}
            autoComplete="off"
            tabIndex="2"
            min="0"
            max="9"
            value={numberField?.stepTwo}
            name="stepTwo"
            maxLength="1"
            id="stepTwo"
          />
          <input
            type="number"
            className="otp_Field"
            onChange={(e) =>
              handleOnChange(
                "stepThree",
                e.target.value.length > 1
                  ? e.target.value.slice(-1)
                  : e.target.value.trim()
              )
            }
            onKeyUp={(e) => handleInputFocus(e)}
            autoComplete="off"
            tabIndex="3"
            min="0"
            max="9"
            name="stepThree"
            id="stepThree"
            maxLength="1"
            value={numberField?.stepThree}
          />
          <input
            type="number"
            className="otp_Field"
            onChange={(e) =>
              handleOnChange(
                "stepFour",
                e.target.value.length > 1
                  ? e.target.value.slice(-1)
                  : e.target.value.trim()
              )
            }
            onKeyUp={(e) => handleInputFocus(e)}
            autoComplete="off"
            tabIndex="4"
            min="0"
            max="9"
            name="stepFour"
            id="stepFour"
            maxLength="1"
            value={numberField?.stepFour}
          />
          <input
            type="number"
            className="otp_Field"
            onChange={(e) =>
              handleOnChange(
                "stepFive",
                e.target.value.length > 1
                  ? e.target.value.slice(-1)
                  : e.target.value.trim()
              )
            }
            onKeyUp={(e) => handleInputFocus(e)}
            autoComplete="off"
            tabIndex="5"
            min="0"
            max="9"
            name="stepFive"
            id="stepFive"
            maxLength="1"
            value={numberField?.stepFive}
          />
          <input
            type="number"
            className="otp_Field"
            onChange={(e) =>
              handleOnChange(
                "stepSix",
                e.target.value.length > 1
                  ? e.target.value.slice(-1)
                  : e.target.value.trim()
              )
            }
            onKeyUp={(e) => handleInputFocus(e)}
            autoComplete="off"
            tabIndex="6"
            min="0"
            max="9"
            name="stepSix"
            id="stepSix"
            maxLength="1"
            value={numberField?.stepSix}
          />
        </div>

        {/* resend code */}
        <p className="text-teclborder-textColor text-sm">
          Didn’t recive a verification code? <br />
          <span
            onClick={() => handleResendOtp()}
            className="text-red-500 font-semibold cursor-pointer "
          >
            {resendOtpLoading ? "Sending..." : "Resend the code"}
          </span>{" "}
        </p>
        {/* butons */}
        <button
          type="submit"
          disabled={loading || resendOtpLoading}
          className={`bg-primaryBlue text-white font-medium text-center md:h-12 h-10 rounded-lg p-2 hover:bg-primaryBlue/80 active:scale-95 transition w-full 
          ${loading && "cursor-not-allowed"}`}
        >
          {loading && !resendOtpLoading ? "Verifying..." : "Continue"}
        </button>
      </form>
    </section>
  );
};

export default OTPVerify;
