import React from "react";
import { MdSavedSearch } from "react-icons/md";
import { FaRegHandshake } from "react-icons/fa";
import { GiWhiteBook } from "react-icons/gi";
import { BsCart3 } from "react-icons/bs";
import { AiOutlineUser, AiOutlineUsergroupAdd } from "react-icons/ai";

const Dashboard = ({ setActiveComponent }) => {
  return (
    <div className=" w-full grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 justify-items-stretch items-center place-items-start md:gap-5 gap-3">
      {/* users */}
      <div
        onClick={() => setActiveComponent("users")}
        className="w-full cursor-pointer bg-gradient-to-r flex items-center justify-between from-blueGradientFrom to-blueGradientTo hover:scale-105 transition text-white rounded-md h-auto p-6"
      >
        <div className="flex-1 tracking-wide">
          <p className="p-1 w-10 h-10 rounded-full text-center leading-10 align-middle bg-black/20">
            <AiOutlineUser size={30} className="mx-auto" />
          </p>
          <p className="font-normal text-lg">Users</p>
        </div>
        <div className="text-2xl font-semibold">12</div>
      </div>
      {/* subscribers */}
      <div
        onClick={() => setActiveComponent("subscribers")}
        className="w-full cursor-pointer bg-gradient-to-r flex items-center justify-between from-pinkGradientFrom to-pinkGradientTo  hover:scale-105 transition text-white rounded-md h-auto p-6"
      >
        <div className="flex-1 tracking-wide">
          <p className="p-1 w-10 h-10 rounded-full text-center leading-10 align-middle bg-black/20">
            <AiOutlineUsergroupAdd size={30} className="mx-auto" />
          </p>
          <p className="font-normal text-lg">Subscribers</p>
        </div>
        <div className="text-2xl font-semibold">100</div>
      </div>
      {/* prospect */}
      <div
        onClick={() => setActiveComponent("prospect")}
        className="w-full cursor-pointer bg-gradient-to-r flex items-center justify-between from-goldGradientFrom to-goldGradientTo hover:scale-105 transition text-white rounded-md h-auto p-6"
      >
        <div className="flex-1 tracking-wide">
          <p className="p-1 w-10 h-10 rounded-full text-center leading-10 align-middle bg-black/20">
            <MdSavedSearch size={30} className="mx-auto" />
          </p>
          <p className="font-normal text-lg">Prospect</p>
        </div>
        <div className="text-2xl font-semibold">4</div>
      </div>
      {/* partners */}
      <div
        onClick={() => setActiveComponent("partners")}
        className="w-full cursor-pointer bg-gradient-to-r flex items-center justify-between from-greenBlueGradientFrom to-greenBlueGradientTo hover:scale-105 transition text-white rounded-md h-auto p-6"
      >
        <div className="flex-1 tracking-wide">
          <p className="p-1 w-10 h-10 rounded-full text-center leading-10 align-middle bg-black/20">
            <FaRegHandshake size={30} className="mx-auto" />
          </p>
          <p className="font-normal text-lg">Partners</p>
        </div>
        <div className="text-2xl font-semibold">8</div>
      </div>
      {/* magazine */}
      <div
        onClick={() => setActiveComponent("magazine")}
        className="w-full cursor-pointer bg-gradient-to-r flex items-center justify-between from-purpleGradientFrom to-purpleGradientTo hover:scale-105 transition text-white rounded-md h-auto p-6"
      >
        <div className="flex-1 tracking-wide">
          <p className="p-1 w-10 h-10 rounded-full text-center leading-10 align-middle bg-black/20">
            <GiWhiteBook size={25} className="mx-auto mt-1" />
          </p>
          <p className="font-normal text-lg">Magazine</p>
        </div>
        <div className="text-2xl font-semibold">120</div>
      </div>
      {/* orders */}
      <div
        onClick={() => setActiveComponent("orders")}
        className="w-full cursor-pointer bg-gradient-to-r flex items-center justify-between from-darkBlueGradientFrom to-darkBlueGradientTo hover:scale-105 transition text-white rounded-md h-auto p-6"
      >
        <div className="flex-1 tracking-wide">
          <p className="p-1 w-10 h-10 rounded-full text-center leading-10 align-middle bg-black/20">
            <BsCart3 size={25} className="mx-auto mt-1" />
          </p>
          <p className="font-normal text-lg">Orders</p>
        </div>
        <div className="text-2xl font-semibold">68</div>
      </div>
    </div>
  );
};

export default Dashboard;
