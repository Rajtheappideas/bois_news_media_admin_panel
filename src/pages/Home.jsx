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

const Home = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [openSidebar, setOpenSidebar] = useState(false);

  const { token } = useSelector((state) => state.root.auth);

  const { abortApiCall, AbortControllerRef } = useAbortApiCall();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(handleGetAllUsers({ token, signal: AbortControllerRef }));
    dispatch(handleGetAllSubscribers({ token, signal: AbortControllerRef }));
    dispatch(handleGetAllProspects({ token, signal: AbortControllerRef }));
    dispatch(handleGetAllPartners({ token, signal: AbortControllerRef }));
    dispatch(handleGetAllPayers({ token, signal: AbortControllerRef }));
    dispatch(handleGetAllSubscription({ token, signal: AbortControllerRef }));
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
          className={`lg:p-5 p-3 h-full space-y-5 bg-[#FBFBFB] min-h-screen ${
            openSidebar ? "xl:w-10/12 lg:w-4/5 w-full" : "lg:w-[90%] w-full"
          }`}
        >
          <Header
            openSidebar={openSidebar}
            setOpenSidebar={setOpenSidebar}
            activeComponent={activeComponent}
            setActiveComponent={setActiveComponent}
          />

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
        </section>
      </div>
    </>
  );
};

export default Home;
