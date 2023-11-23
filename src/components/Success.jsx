import React from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import success from "../assets/animations/success.json";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

const Success = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  useEffect(() => {
    setTimeout(() => {
      navigate("/sign-in");
      toast.success(t("You can signin now with your new password."), {
        duration: 4000,
      });
    }, 5000);
  }, []);
  return (
    <>
      <section className="bg-white absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-xl md:px-5 md:py-5 px-4 py-2 flex items-center flex-col mx-auto xl:w-4/12 lg:w-5/12 md:w-1/2 w-11/12 h-auto gap-y-2">
        <Lottie
          style={{
            pointerEvents: "none",
            height: "200px",
            width: "200px",
          }}
          animationData={success}
          loop
        />
        <p className="font-bold text-textBlack text-center md:text-lg">
          {t("Verification success")}{" "}
        </p>
        <p className="font-normal text-textColor text-center md:text-lg w-9/12">
          {t("Verification is success and now you can proceed")}{" "}
        </p>
        <button
          type="button"
          onClick={() => navigate("/sign-in")}
          className="bg-primaryBlue text-white font-medium text-center md:h-12 h-10 rounded-lg p-2 hover:bg-primaryBlue/80 active:scale-95 transition w-full"
        >
          {t("Sign in")}
        </button>
      </section>
    </>
  );
};

export default Success;
