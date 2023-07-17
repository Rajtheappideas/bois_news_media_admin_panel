import React, { useEffect, useRef } from "react";
import { BiHome } from "react-icons/bi";
import { MdSavedSearch } from "react-icons/md";
import { FaRegHandshake } from "react-icons/fa";
import { TbUserDollar } from "react-icons/tb";
import { CgNotes } from "react-icons/cg";
import { GiWhiteBook } from "react-icons/gi";
import { BsCart3 } from "react-icons/bs";
import { LuSettings2 } from "react-icons/lu";
import { HiOutlineXMark } from "react-icons/hi2";
import { AiOutlineUser, AiOutlineUsergroupAdd } from "react-icons/ai";

const Sidebar = ({
  setActiveComponent,
  activeComponent,
  setOpenSidebar,
  openSidebar,
}) => {
  const sidebarRef = useRef(null);

  const sidebarList = [
    { title: "dashboard", icon: BiHome },
    { title: "users", icon: AiOutlineUser },
    { title: "subscribers", icon: AiOutlineUsergroupAdd },
    { title: "prospect", icon: MdSavedSearch },
    { title: "partners", icon: FaRegHandshake },
    { title: "third-party payer", icon: TbUserDollar },
    { title: "subscriptions", icon: CgNotes },
    { title: "magazine", icon: GiWhiteBook },
    { title: "orders", icon: BsCart3 },
    { title: "settings", icon: LuSettings2 },
  ];

  useEffect(() => {
    if (window.screen.width < 1024) {
      const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event?.target)) {
          setOpenSidebar(false);
        }
      };
      document.addEventListener("click", handleClickOutside, true);
      return () => {
        document.removeEventListener("click", handleClickOutside, true);
        document.removeEventListener("resize", () => {});
      };
    }
  }, [handleClickOutside, window.screen.width]);

  function handleClickOutside() {
    setOpenSidebar(false);
  }

  return (
    <div
      className={` ${
        openSidebar ? "xl:w-2/12 lg:w-1/5" : "lg:w-[10%]"
      } h-auto capitalize`}
    >
      {/* for desktop */}
      <div
        className={`min-h-screen w-full xl:px-6 lg:px-3 lg:block hidden py-3`}
      >
        <p className="my-3 xl:text-4xl text-2xl font-semibold text-center">
          <img
            src={require("../assets/images/logo.png")}
            className="w-20 h-fit object-contain object-center"
          />
        </p>
        <ul className="w-full space-y-3 text-sm ">
          {sidebarList.map((list) => (
            <li
              onClick={() => setActiveComponent(list.title)}
              key={list.title}
              className={`flex items-center ${
                openSidebar ? "justify-start" : "justify-center"
              } ${
                activeComponent === list.title
                  ? "bg-primaryBlue text-white"
                  : "text-textColor bg-white"
              } xl:px-4 px-2 py-1 rounded-md xl:gap-x-5 gap-x-2 w-full font-medium cursor-pointer`}
            >
              <list.icon
                className={`${
                  activeComponent === list.title
                    ? "text-white"
                    : "text-textColor"
                }`}
                size={25}
              />
              {openSidebar && <span>{list?.title}</span>}
            </li>
          ))}
          {openSidebar && (
            <li className="text-textColor text-xs xl:pt-5 pt-2">
              Copyright © {new Date().getFullYear()}. All Rights Reserved By
              Bois News Media.
            </li>
          )}
        </ul>
      </div>
      {/* for tablet / mobile */}
      <div
        ref={sidebarRef}
        className={`min-h-screen absolute md:w-1/2 w-4/5 z-50 bg-white ${
          openSidebar ? "translate-x-0" : "-translate-x-[100%]"
        } px-4 transition duration-300 ease-in-out lg:hidden block py-3 shadow-xl`}
      >
        <p className="my-3 xl:text-4xl text-2xl font-semibold text-center">
          <img
            src={require("../assets/images/logo.png")}
            className="w-20 h-fit object-contain object-center"
          />
          <HiOutlineXMark
            onClick={() => setOpenSidebar(false)}
            role="button"
            size={25}
            className="inline-block float-right"
          />
        </p>
        <ul className="w-full space-y-2 md:text-base text-sm md:whitespace-nowrap">
          {sidebarList.map((list) => (
            <li
              onClick={() => {
                setActiveComponent(list.title);
                setOpenSidebar(false);
              }}
              key={list.title}
              className={`flex items-center justify-start whitespace-nowrap
               ${
                 activeComponent === list.title
                   ? "bg-primaryBlue text-white"
                   : "text-textColor bg-white"
               } px-2 md:py-2 py-1 rounded-md xl:gap-x-5 gap-x-2 w-full font-medium cursor-pointer`}
            >
              <list.icon
                className={`${
                  activeComponent === list.title
                    ? "text-white"
                    : "text-textColor"
                }`}
                size={25}
              />
              <span>{list?.title}</span>
            </li>
          ))}
          <li className="text-textColor text-xs pt-1">
            Copyright © {new Date().getFullYear()}. All Rights Reserved By Bois
            News Media.
          </li>
        </ul>
      </div>
      {openSidebar && (
        <div className="absolute lg:hidden block z-30 inset-0 bg-black bg-opacity-20 backdrop-blur-sm max-w-[100%] h-full" />
      )}
    </div>
  );
};

export default Sidebar;
