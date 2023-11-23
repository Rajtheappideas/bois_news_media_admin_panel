import React from "react";
import { MdSavedSearch } from "react-icons/md";
import { FaRegHandshake } from "react-icons/fa";
import { GiWhiteBook } from "react-icons/gi";
import { BsCart3 } from "react-icons/bs";
import { AiOutlineUser, AiOutlineUsergroupAdd } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const Dashboard = () => {
  const { users, loading } = useSelector((state) => state.root.users);
  const { subscribers } = useSelector((state) => state.root.subscribers);
  const { prospects } = useSelector((state) => state.root.prospects);
  const { partners } = useSelector((state) => state.root.partners);
  const { orders } = useSelector((state) => state.root.orders);
  const { magazines } = useSelector((state) => state.root.magazines);
  const { isSidebarOpen } = useSelector((state) => state.root.globalStates);

  const { t } = useTranslation();

  return (
    <>
      <Helmet title="Dashboard | Bois News Media" />
      <div className="w-full flex items-start lg:gap-3 flex-row h-auto">
        <Sidebar />
        <section
          className={`h-full space-y-5 bg-[#FBFBFB] min-h-screen ${
            isSidebarOpen ? "xl:w-10/12 lg:w-4/5 w-full" : "lg:w-[90%] w-full"
          }`}
        >
          <Header />
          <div className="grid lg:p-5 p-3 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 justify-items-stretch items-center place-items-start md:gap-5 gap-3">
            {/* users */}
            <Link to="/users">
              <div className="w-full cursor-pointer bg-gradient-to-r flex items-center justify-between from-blueGradientFrom to-blueGradientTo hover:scale-105 transition text-white rounded-md h-auto p-6">
                <div className="flex-1 tracking-wide">
                  <p className="p-1 w-10 h-10 rounded-full text-center leading-10 align-middle bg-black/20">
                    <AiOutlineUser size={30} className="mx-auto" />
                  </p>
                  <p className="font-normal text-lg capitalize">{t("users")}</p>
                </div>
                <div className="text-2xl font-semibold">
                  {loading ? "-" : users?.length > 0 ? users?.length : "00"}
                </div>
              </div>
            </Link>
            {/* subscribers */}

            <Link to="/subscribers">
              <div className="w-full cursor-pointer bg-gradient-to-r flex items-center justify-between from-pinkGradientFrom to-pinkGradientTo  hover:scale-105 transition text-white rounded-md h-auto p-6">
                <div className="flex-1 tracking-wide">
                  <p className="p-1 w-10 h-10 rounded-full text-center leading-10 align-middle bg-black/20">
                    <AiOutlineUsergroupAdd size={30} className="mx-auto" />
                  </p>
                  <p className="font-normal text-lg capitalize">
                    {t("subscribers")}
                  </p>
                </div>
                <div className="text-2xl font-semibold">
                  {" "}
                  {loading
                    ? "-"
                    : subscribers?.length > 0
                    ? subscribers?.length
                    : "00"}
                </div>
              </div>
            </Link>
            {/* prospect */}
            <Link to="/prospects">
              <div className="w-full cursor-pointer bg-gradient-to-r flex items-center justify-between from-goldGradientFrom to-goldGradientTo hover:scale-105 transition text-white rounded-md h-auto p-6">
                <div className="flex-1 tracking-wide">
                  <p className="p-1 w-10 h-10 rounded-full text-center leading-10 align-middle bg-black/20">
                    <MdSavedSearch size={30} className="mx-auto" />
                  </p>
                  <p className="font-normal text-lg capitalize">
                    {t("prospect")}
                  </p>
                </div>
                <div className="text-2xl font-semibold">
                  {loading
                    ? "-"
                    : prospects?.length > 0
                    ? prospects?.length
                    : "00"}
                </div>
              </div>
            </Link>

            {/* partners */}
            <Link to="/partners">
              <div className="w-full cursor-pointer bg-gradient-to-r flex items-center justify-between from-greenBlueGradientFrom to-greenBlueGradientTo hover:scale-105 transition text-white rounded-md h-auto p-6">
                <div className="flex-1 tracking-wide">
                  <p className="p-1 w-10 h-10 rounded-full text-center leading-10 align-middle bg-black/20">
                    <FaRegHandshake size={30} className="mx-auto" />
                  </p>
                  <p className="font-normal text-lg capitalize">
                    {t("partners")}
                  </p>
                </div>
                <div className="text-2xl font-semibold">
                  {loading
                    ? "-"
                    : partners?.length > 0
                    ? partners?.length
                    : "00"}
                </div>
              </div>
            </Link>
            {/* magazine */}
            <Link to="/magazine">
              <div className="w-full cursor-pointer bg-gradient-to-r flex items-center justify-between from-purpleGradientFrom to-purpleGradientTo hover:scale-105 transition text-white rounded-md h-auto p-6">
                <div className="flex-1 tracking-wide">
                  <p className="p-1 w-10 h-10 rounded-full text-center leading-10 align-middle bg-black/20">
                    <GiWhiteBook size={25} className="mx-auto mt-1" />
                  </p>
                  <p className="font-normal text-lg capitalize">
                    {t("magazine")}
                  </p>
                </div>
                <div className="text-2xl font-semibold">
                  {" "}
                  {loading
                    ? "-"
                    : magazines?.length > 0
                    ? magazines?.length
                    : "00"}
                </div>
              </div>
            </Link>
            {/* orders */}
            <Link to="/orders">
              <div className="w-full cursor-pointer bg-gradient-to-r flex items-center justify-between from-darkBlueGradientFrom to-darkBlueGradientTo hover:scale-105 transition text-white rounded-md h-auto p-6">
                <div className="flex-1 tracking-wide">
                  <p className="p-1 w-10 h-10 rounded-full text-center leading-10 align-middle bg-black/20">
                    <BsCart3 size={25} className="mx-auto mt-1" />
                  </p>
                  <p className="font-normal text-lg capitalize">
                    {t("orders")}
                  </p>
                </div>
                <div className="text-2xl font-semibold">
                  {" "}
                  {loading ? "-" : orders?.length > 0 ? orders?.length : "00"}
                </div>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
