import React from "react";
import Lottie from "lottie-react";
import pagenotfound from "../assets/animations/pagenotfound.json";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PageNotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <Lottie
        style={{
          pointerEvents: "none",
          height: "80%",
          width: "80%",
        }}
        animationData={pagenotfound}
        loop
      />
      <Link to="/">
        <button className="blue_button">{t("Go to home")}</button>
      </Link>
    </div>
  );
};

export default PageNotFound;
