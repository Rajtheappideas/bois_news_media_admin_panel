import React from "react";
import { MdSavedSearch } from "react-icons/md";
import { FaRegHandshake } from "react-icons/fa";
import { GiWhiteBook } from "react-icons/gi";
import { BsCart3 } from "react-icons/bs";
import { AiOutlineUser, AiOutlineUsergroupAdd } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const Dashboard = ({ setActiveComponent }) => {
  const { users, loading } = useSelector((state) => state.root.users);
  const { subscribers } = useSelector((state) => state.root.subscribers);
  const { prospects } = useSelector((state) => state.root.prospects);
  const { partners } = useSelector((state) => state.root.partners);
  const { orders } = useSelector((state) => state.root.orders);
  const { magazines } = useSelector((state) => state.root.magazines);

  const { t } = useTranslation();

  return (
    <div className=" w-full grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 justify-items-stretch items-center place-items-start md:gap-5 gap-3">
      {/* users */}
      <div
        onClick={() => setActiveComponent(t("users"))}
        className="w-full cursor-pointer bg-gradient-to-r flex items-center justify-between from-blueGradientFrom to-blueGradientTo hover:scale-105 transition text-white rounded-md h-auto p-6"
      >
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
      {/* subscribers */}
      <div
        onClick={() => setActiveComponent(t("subscribers"))}
        className="w-full cursor-pointer bg-gradient-to-r flex items-center justify-between from-pinkGradientFrom to-pinkGradientTo  hover:scale-105 transition text-white rounded-md h-auto p-6"
      >
        <div className="flex-1 tracking-wide">
          <p className="p-1 w-10 h-10 rounded-full text-center leading-10 align-middle bg-black/20">
            <AiOutlineUsergroupAdd size={30} className="mx-auto" />
          </p>
          <p className="font-normal text-lg capitalize">{t("subscribers")}</p>
        </div>
        <div className="text-2xl font-semibold">
          {" "}
          {loading ? "-" : subscribers?.length > 0 ? subscribers?.length : "00"}
        </div>
      </div>
      {/* prospect */}
      <div
        onClick={() => setActiveComponent(t("prospect"))}
        className="w-full cursor-pointer bg-gradient-to-r flex items-center justify-between from-goldGradientFrom to-goldGradientTo hover:scale-105 transition text-white rounded-md h-auto p-6"
      >
        <div className="flex-1 tracking-wide">
          <p className="p-1 w-10 h-10 rounded-full text-center leading-10 align-middle bg-black/20">
            <MdSavedSearch size={30} className="mx-auto" />
          </p>
          <p className="font-normal text-lg capitalize">{t("prospect")}</p>
        </div>
        <div className="text-2xl font-semibold">
          {loading ? "-" : prospects?.length > 0 ? prospects?.length : "00"}
        </div>
      </div>
      {/* partners */}
      <div
        onClick={() => setActiveComponent(t("partners"))}
        className="w-full cursor-pointer bg-gradient-to-r flex items-center justify-between from-greenBlueGradientFrom to-greenBlueGradientTo hover:scale-105 transition text-white rounded-md h-auto p-6"
      >
        <div className="flex-1 tracking-wide">
          <p className="p-1 w-10 h-10 rounded-full text-center leading-10 align-middle bg-black/20">
            <FaRegHandshake size={30} className="mx-auto" />
          </p>
          <p className="font-normal text-lg capitalize">{t("partners")}</p>
        </div>
        <div className="text-2xl font-semibold">
          {loading ? "-" : partners?.length > 0 ? partners?.length : "00"}
        </div>
      </div>
      {/* magazine */}
      <div
        onClick={() => setActiveComponent(t("magazine"))}
        className="w-full cursor-pointer bg-gradient-to-r flex items-center justify-between from-purpleGradientFrom to-purpleGradientTo hover:scale-105 transition text-white rounded-md h-auto p-6"
      >
        <div className="flex-1 tracking-wide">
          <p className="p-1 w-10 h-10 rounded-full text-center leading-10 align-middle bg-black/20">
            <GiWhiteBook size={25} className="mx-auto mt-1" />
          </p>
          <p className="font-normal text-lg capitalize">{t("magazine")}</p>
        </div>
        <div className="text-2xl font-semibold">
          {" "}
          {loading ? "-" : magazines?.length > 0 ? magazines?.length : "00"}
        </div>
      </div>
      {/* orders */}
      <div
        onClick={() => setActiveComponent(t("orders"))}
        className="w-full cursor-pointer bg-gradient-to-r flex items-center justify-between from-darkBlueGradientFrom to-darkBlueGradientTo hover:scale-105 transition text-white rounded-md h-auto p-6"
      >
        <div className="flex-1 tracking-wide">
          <p className="p-1 w-10 h-10 rounded-full text-center leading-10 align-middle bg-black/20">
            <BsCart3 size={25} className="mx-auto mt-1" />
          </p>
          <p className="font-normal text-lg capitalize">{t("orders")}</p>
        </div>
        <div className="text-2xl font-semibold">
          {" "}
          {loading ? "-" : orders?.length > 0 ? orders?.length : "00"}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
