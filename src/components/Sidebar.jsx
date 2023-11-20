import React, { useEffect, useRef, useState } from "react";
import { BiHome, BiMessageSquareDots } from "react-icons/bi";
import { MdSavedSearch } from "react-icons/md";
import { FaRegHandshake, FaUserAlt } from "react-icons/fa";
import { TbUserDollar } from "react-icons/tb";
import { CgNotes } from "react-icons/cg";
import { GiWhiteBook } from "react-icons/gi";
import { BsCart3 } from "react-icons/bs";
import { RiCoupon3Line } from "react-icons/ri";
import { HiOutlineXMark } from "react-icons/hi2";
import { SlEnvolopeLetter } from "react-icons/sl";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { AiOutlineUser, AiOutlineUsergroupAdd } from "react-icons/ai";
import BaseUrl from "../BaseUrl";
import { useDispatch, useSelector } from "react-redux";
import {
  handleChagneActiveSidebarTab,
  handleClearFilteredData,
  handleToggleSidebar,
} from "../redux/GlobalStates";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { user } = useSelector((state) => state.root.auth);
  const { isSidebarOpen, activeSidebarTab } = useSelector(
    (state) => state.root.globalStates
  );

  const sidebarRef = useRef(null);

  const dispatch = useDispatch();

  const { pathname } = useLocation();

  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handeCloseSidebar = () => {
    dispatch(handleToggleSidebar(false));
  };

  const handleChangeTabTitle = (name) => {
    dispatch(handleChagneActiveSidebarTab(name.toLocaleLowerCase()));
  };

  const sidebarList = [
    { title: t("dashboard"), icon: BiHome, url: "" },
    { title: t("users"), icon: AiOutlineUser, url: "users" },
    {
      title: t("subscribers"),
      icon: AiOutlineUsergroupAdd,
      url: "subscribers",
    },
    { title: t("prospects"), icon: MdSavedSearch, url: "prospects" },
    { title: t("partners"), icon: FaRegHandshake, url: "partners" },
    {
      title: t("third-party-payer"),
      icon: TbUserDollar,
      url: "third-party-payer",
    },
    { title: t("subscriptions"), icon: CgNotes, url: "subscriptions" },
    { title: t("magazines"), icon: GiWhiteBook, url: "magazines" },
    { title: t("orders"), icon: BsCart3, url: "orders" },
    {
      title: t("tax-shipping"),
      icon: HiOutlineReceiptTax,
      url: "tax-shipping",
    },
    { title: t("promo-codes"), icon: RiCoupon3Line, url: "promo-codes" },
    { title: t("messages"), icon: BiMessageSquareDots, url: "messages" },
    // { title: t("newsLetter"), icon: SlEnvolopeLetter },
    // { title: "settings", icon: LuSettings2 },
  ];

  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 1024) {
      window.document.body.style.overflow = "hidden";
    } else {
      window.document.body.style.overflow = "unset";
    }
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event?.target) &&
        window.innerWidth < 1024 &&
        isSidebarOpen
      ) {
        handeCloseSidebar();
        window.document.body.style.overflow = "unset";
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside, isSidebarOpen]);

  function handleClickOutside() {
    handeCloseSidebar();
  }

  useEffect(() => {
    const url = pathname.split("/")[1];

    if (pathname === "/") {
      dispatch(handleChagneActiveSidebarTab("dashboard"));
    } else if (
      !url.toLocaleLowerCase().includes(activeSidebarTab.toLocaleLowerCase())
    ) {
      dispatch(handleChagneActiveSidebarTab(url.toLocaleLowerCase()));
    }
  }, [pathname]);

  return (
    <div
      className={`lg:sticky lg:top-0 ${
        isSidebarOpen ? "xl:w-2/12 lg:w-1/5" : "lg:w-[10%]"
      } h-auto capitalize `}
    >
      {/* for desktop */}
      <div
        className={` sticky top-0 min-h-screen max-h-screen w-full overflow-y-scroll no_scrollbar xl:px-6 lg:px-3 lg:block hidden py-3`}
      >
        <Link
          to="/profile"
          className="my-3 cursor-pointer xl:text-4xl text-2xl font-semibold text-center"
          onClick={() => {
            handleChangeTabTitle("profile");
          }}
        >
          {user?.profile !== null && user?.profile !== undefined ? (
            <img
              src={BaseUrl.concat(user?.profile)}
              alt={user?.name}
              className="md:h-12 md:w-12 h-9 w-9 mx-auto object-contain object-center bg-cover bg-center border rounded-full text-sm"
            />
          ) : (
            <FaUserAlt className="bg-gray-200 md:h-10 md:w-10 mx-auto h-6 w-6 p-1 rounded-md" />
          )}
        </Link>
        <ul className="w-full space-y-3 text-sm mt-3">
          {sidebarList.map((list) => (
            <Link
              to={`/${list.url}`}
              className="flex items-center gap-2 w-full"
              key={list.title}
            >
              <li
                onClick={() => {
                  dispatch(handleClearFilteredData());
                  scrollToTop();
                  handleChangeTabTitle(list.title);
                }}
                className={`flex items-center ${
                  isSidebarOpen ? "justify-start" : "justify-center"
                } ${
                  activeSidebarTab.toLocaleLowerCase() ===
                  list.title.toLocaleLowerCase()
                    ? "bg-primaryBlue text-white"
                    : "text-textColor bg-white"
                } xl:px-4 px-2 py-1 rounded-md xl:gap-x-5 gap-x-2 w-full font-medium cursor-pointer`}
                title={list.title}
              >
                <list.icon
                  className={`${
                    activeSidebarTab.toLocaleLowerCase() ===
                    list.title.toLocaleLowerCase()
                      ? "text-white"
                      : "text-textColor"
                  }`}
                  size={25}
                />
                {isSidebarOpen && <span>{list?.title}</span>}
              </li>
            </Link>
          ))}
          {isSidebarOpen && (
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
        className={`min-h-screen max-h-[90vh] overflow-y-scroll scrollbar inset-0 absolute md:w-1/2 w-4/5 z-50 bg-white ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-[100%]"
        } px-4 transition duration-300 ease-in-out lg:hidden block py-3 shadow-xl`}
      >
        {/* profile image */}
        <p
          onClick={() => {
            handeCloseSidebar(false);
          }}
          className="my-3 xl:text-4xl text-2xl font-semibold text-center flex items-center justify-between"
        >
          {user?.profile !== null && user?.profile !== undefined ? (
            <img
              src={BaseUrl.concat(user?.profile)}
              alt={user?.name}
              className="md:h-16 md:w-16 h-14 w-14 object-contain object-center border rounded-full text-sm bg-blend-multiply bg-transparent"
            />
          ) : (
            <FaUserAlt className="bg-gray-200 md:h-14 md:w-14 h-12 w-12 p-1 rounded-md inline-block" />
          )}
          <HiOutlineXMark
            onClick={() => handeCloseSidebar(false)}
            role="button"
            size={25}
            className="inline-block float-right"
          />
        </p>
        <ul className="w-full space-y-2 md:text-base text-sm md:whitespace-nowrap">
          {sidebarList.map((list) => (
            <Link key={list.title} to={`/${list.url}`}>
              <li
                onClick={() => {
                  handeCloseSidebar();
                  dispatch(handleClearFilteredData());
                  scrollToTop();
                }}
                className={`flex items-center justify-start whitespace-nowrap
               ${
                 activeSidebarTab.toLocaleLowerCase() ===
                 list.title.toLocaleLowerCase()
                   ? "bg-primaryBlue text-white"
                   : "text-textColor bg-white"
               } px-2 md:py-2 py-1 rounded-md xl:gap-x-5 gap-x-2 w-full font-medium cursor-pointer`}
              >
                <list.icon
                  className={`${
                    activeSidebarTab.toLocaleLowerCase() ===
                    list.title.toLocaleLowerCase()
                      ? "text-white"
                      : "text-textColor"
                  }`}
                  size={25}
                />
                {list?.title}
              </li>
            </Link>
          ))}
          <li className="text-textColor text-xs pt-1">
            Copyright © {new Date().getFullYear()}. All Rights Reserved By Bois
            News Media.
          </li>
        </ul>
      </div>
      {isSidebarOpen && (
        <div className="absolute lg:hidden block z-40 inset-0 bg-black bg-opacity-20 backdrop-blur-sm max-w-[100%] max-h-screen min-h-screen" />
      )}
    </div>
  );
};

export default Sidebar;
