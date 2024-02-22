import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
// import Dashboard from "../components/Home/Dashboard";
// import Users from "../components/Home/Users";
// import Subscribers from "../components/Home/Subscribers";
// import Prospect from "../components/Home/Prospect";
// import Partners from "../components/Home/Partners";
// import ThirdPartyPayer from "../components/Home/ThirdPartyPayer";
// import Subcriptions from "../components/Home/Subcriptions";
// import Settings from "../components/Home/Settings";
// import Orders from "../components/Home/Orders";
// import Magazine from "../components/Home/Magazine";
import { Helmet } from "react-helmet";
// import Profile from "./Profile";
import ChangePassword from "../components/ChangePassword";
import useAbortApiCall from "../hooks/useAbortApiCall";
import { useDispatch, useSelector } from "react-redux";
import { handleGetAllUsers } from "../redux/UserSlice";
import { handleGetAllSubscribers } from "../redux/SubscriberSlice";
import { handleGetAllProspects } from "../redux/ProspectSlice";
import { handleGetAllPartners } from "../redux/PartnerSlice";
import { handleGetAllPayers } from "../redux/ThirdPartyPayerSlice";
import { handleGetAllSubscription } from "../redux/SubscriptionSlice";
import { handleGetAllMagazine } from "../redux/MagazineSlice";
import { handleGetAllOrder } from "../redux/OrderSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { handleLogout } from "../redux/AuthSlice";
import {
  handleGetMessages,
  handleGetNewsLetter,
  handleLogoutFromAllTabs,
} from "../redux/GlobalStates";
import toast from "react-hot-toast";
import TaxtAndShippingCharges from "./TaxtAndShippingCharges";
import { handleGetPricing } from "../redux/TaxAndShippingSlice";
import MessagesList from "./MessagesList";
import NewsLetterList from "./NewsLetterList";
import PromoCode from "./PromoCode";
import { handleGetAllPromoCodes } from "../redux/PromoCodeSlice";

const Home = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [openSidebar, setOpenSidebar] = useState(false);

  const { token, user } = useSelector((state) => state.root.auth);

  const { abortApiCall, AbortControllerRef } = useAbortApiCall();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const handleGetContent = () => {
    if (user === null) {
      return navigate("/sign-in");
    }
    const response = dispatch(
      handleGetAllUsers({ token, signal: AbortControllerRef })
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
    // dispatch(handleGetAllSubscribers({ token, signal: AbortControllerRef }));
    // dispatch(handleGetAllProspects({ token, signal: AbortControllerRef }));
    // dispatch(handleGetAllPartners({ token, signal: AbortControllerRef }));
    // dispatch(handleGetAllPayers({ token, signal: AbortControllerRef }));
    // dispatch(handleGetAllSubscription({ token, signal: AbortControllerRef }));
    // dispatch(handleGetAllMagazine({ token, signal: AbortControllerRef }));
    // dispatch(handleGetPricing({ token, signal: AbortControllerRef }));
    // dispatch(handleGetNewsLetter({ token, signal: AbortControllerRef }));
    // dispatch(handleGetMessages({ token, signal: AbortControllerRef }));
    // dispatch(handleGetAllOrder({ token, signal: AbortControllerRef }));
    // dispatch(handleGetAllPromoCodes({ token, signal: AbortControllerRef }));
  };

  useEffect(() => {
    handleGetContent();
    return () => {
      abortApiCall();
    };
  }, []);

  return (
    <>
      <Helmet title={`${activeComponent} | Bois News Media`} />

      <div className="w-full flex items-start lg:gap-3 flex-row h-auto">
        <Sidebar
          setActiveComponent={setActiveComponent}
          activeComponent={activeComponent}
          openSidebar={openSidebar}
          setOpenSidebar={setOpenSidebar}
        />
        <section
          className={`h-full space-y-5 bg-[#FBFBFB] min-h-screen ${
            openSidebar ? "xl:w-10/12 lg:w-4/5 w-full" : "lg:w-[90%] w-full"
          }`}
        >
          <Header
            openSidebar={openSidebar}
            setOpenSidebar={setOpenSidebar}
            activeComponent={activeComponent}
            setActiveComponent={setActiveComponent}
          />
          {/* <div className="lg:p-5 p-3">
            // {activeComponent === "dashboard" && (
              <Dashboard setActiveComponent={setActiveComponent} />
            )}
            {activeComponent === t("users") && <Users />}
            {activeComponent === t("subscribers") && <Subscribers />}
            {activeComponent === t("prospect") && <Prospect />}
            {activeComponent === t("partners") && <Partners />}
            {activeComponent === t("third-party payer") && <ThirdPartyPayer />}
            {activeComponent === t("subscriptions") && <Subcriptions />}
            {activeComponent === t("magazine") && <Magazine />}
            {activeComponent === t("orders") && <Orders />}
            {activeComponent === t("profile") && <Profile />}
            {activeComponent === t("change password") && <ChangePassword />}
            {activeComponent === t("messages") && <MessagesList />}
            {/* {activeComponent === t("newsLetter") && <NewsLetterList />} */}
          {/* {activeComponent === t("tax & shipping") && (
              <TaxtAndShippingCharges />
            )} */}
          {/* {activeComponent === t("promo codes") && <PromoCode />}
          </div> */}
        </section>
      </div>
    </>
  );
};

export default Home;
