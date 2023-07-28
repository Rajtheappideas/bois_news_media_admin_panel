import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Dashboard from "../components/Home/Dashboard";
import Users from "../components/Home/Users";
import Subscribers from "../components/Home/Subscribers";
import Prospect from "../components/Home/Prospect";
import Partners from "../components/Home/Partners";
import ThirdPartyPayer from "../components/Home/ThirdPartyPayer";
import Subcriptions from "../components/Home/Subcriptions";
import Settings from "../components/Home/Settings";
import Orders from "../components/Home/Orders";
import Magazine from "../components/Home/Magazine";
import { Helmet } from "react-helmet";
import Profile from "../components/Home/Profile";
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
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [openSidebar, setOpenSidebar] = useState(false);

  const { token, user } = useSelector((state) => state.root.auth);

  const { abortApiCall, AbortControllerRef } = useAbortApiCall();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGetContent = () => {
    if (user === null) {
      navigate("/sign-in");
      return true;
    }
    dispatch(handleGetAllUsers({ token, signal: AbortControllerRef }));
    dispatch(handleGetAllSubscribers({ token, signal: AbortControllerRef }));
    dispatch(handleGetAllProspects({ token, signal: AbortControllerRef }));
    dispatch(handleGetAllPartners({ token, signal: AbortControllerRef }));
    dispatch(handleGetAllPayers({ token, signal: AbortControllerRef }));
    dispatch(handleGetAllSubscription({ token, signal: AbortControllerRef }));
    dispatch(handleGetAllMagazine({ token, signal: AbortControllerRef }));
  };

  useEffect(() => {
    handleGetContent();
    return () => {
      abortApiCall();
    };
  }, []);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (openSidebar && window.screen.width < 1024) {
        window.document.body.style.overflow = "hidden";
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.document.body.style.overflow = "unset";
      }
    });
    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, [openSidebar]);

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
          <div className="lg:p-5 p-3">
            {activeComponent === "dashboard" && (
              <Dashboard setActiveComponent={setActiveComponent} />
            )}
            {activeComponent === "users" && <Users />}
            {activeComponent === "subscribers" && <Subscribers />}
            {activeComponent === "prospect" && <Prospect />}
            {activeComponent === "partners" && <Partners />}
            {activeComponent === "third-party payer" && <ThirdPartyPayer />}
            {activeComponent === "subscriptions" && <Subcriptions />}
            {activeComponent === "magazine" && <Magazine />}
            {activeComponent === "orders" && <Orders />}
            {activeComponent === "settings" && <Settings />}
            {activeComponent === "profile" && <Profile />}
            {activeComponent === "change password" && <ChangePassword />}
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
