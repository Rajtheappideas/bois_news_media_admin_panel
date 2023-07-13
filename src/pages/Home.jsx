import React, { useState } from "react";
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

const Home = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <>
      <Helmet title={`${activeComponent} | Bois Mega News`} />
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
        </section>
      </div>
    </>
  );
};

export default Home;
