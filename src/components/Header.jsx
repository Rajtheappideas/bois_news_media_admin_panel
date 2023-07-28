import React, { useEffect, useRef, useState } from "react";
import { HiMenuAlt2 } from "react-icons/hi";
import { FiChevronDown } from "react-icons/fi";
import { FaUserAlt } from "react-icons/fa";
import { BsChevronDown } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { handleChangeLanguage, handleLogout } from "../redux/AuthSlice";
import { toast } from "react-hot-toast";
import BaseUrl from "../BaseUrl";

const Header = ({
  openSidebar,
  setOpenSidebar,
  activeComponent,
  setActiveComponent,
}) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [stickyHeader, setStickyHeader] = useState(false);

  const { loading, language, user } = useSelector((state) => state.root.auth);

  const profileRef = useRef(null);
  const languageRef = useRef(null);

  const dispatch = useDispatch();

  // for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event?.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutsideForProfile]);

  function handleClickOutsideForProfile() {
    setShowProfileDropdown(false);
  }

  // for language dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        languageRef.current &&
        !languageRef.current.contains(event?.target)
      ) {
        setShowLanguageDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutsideForNotification]);

  function handleClickOutsideForNotification() {
    setShowLanguageDropdown(false);
  }

  // for sticky header
  // useEffect(() => {
  //   window.addEventListener("scroll", () => {
  //     if (window.scrollY > 80) {
  //       setStickyHeader(true);
  //     } else {
  //       setStickyHeader(false);
  //     }
  //   });
  //   return () => {
  //     window.removeEventListener("scroll", () => {});
  //   };
  // }, [stickyHeader]);

  return (
    <div
      className={`w-full ${
        stickyHeader && "sticky bg-white top-0 z-30 shadow-sm"
      } lg:p-5 p-3 transition flex flex-wrap items-center md:justify-between gap-2 justify-center`}
    >
      {/* left side */}
      <div className="flex items-center flex-1 gap-x-2">
        <HiMenuAlt2
          onClick={() => setOpenSidebar(!openSidebar)}
          role="button"
          className="md:text-2xl text-xl"
        />
        <p className="font-bold lg:text-2xl text-textBlack md:text-xl text-sm capitalize">
          {activeComponent} <br className="md:hidden block" />{" "}
          {activeComponent !== "dashboard" &&
            activeComponent !== "profile" &&
            "management"}
        </p>
      </div>
      {/* right side profile */}
      <div className="flex items-center md:gap-x-5 gap-x-1 relative">
        {/* language butn */}
        <button ref={languageRef}>
          <p
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className={`md:text-xl text-xs p-1 border hover:bg-gray-200 transition rounded-lg ${
              showLanguageDropdown && "bg-gray-200"
            }`}
          >
            {language === "en" ? (
              <img
                src={require("../assets/images/english.png")}
                alt="french"
                className="md:h-10 h-7 md:w-10 w-7 mr-1 inline-block"
              />
            ) : (
              <img
                src={require("../assets/images/french.png")}
                alt="french"
                className="md:h-10 h-5 md:w-10 w-5 md:mr-1 inline-block"
              />
            )}

            <span className="inline-block">
              {language === "en" ? "English" : "French"}
            </span>
            <span>
              <FiChevronDown
                className={`inline-block md:ml-2 ml-0.5 mb-1 ${
                  showLanguageDropdown ? "rotate-180" : "rotate-0"
                } transition duration-100`}
              />
            </span>
          </p>
          {/* dropdown for notifications */}
          <div
            className={`font-normal md:text-lg transition origin-top transform bg-white ${
              showLanguageDropdown ? "scale-100" : "scale-0"
            } absolute top-11 left-0 shadow-2xl rounded-md md:p-2 p-0.5 z-10`}
          >
            <div
              onClick={() => {
                dispatch(handleChangeLanguage("en"));
                setShowLanguageDropdown(false);
              }}
              className="flex items-center justify-start text-left hover:bg-gray-100 w-full p-1 gap-x-1"
            >
              <img
                src={require("../assets/images/english.png")}
                alt="french"
                className="md:h-10 h-5 md:w-10 w-5"
              />
              <div className="text-textBlack w-full rounded-md  hover:font-semibold transition cursor-pointer">
                English
              </div>
            </div>
            <div
              onClick={() => {
                dispatch(handleChangeLanguage("fr"));
                setShowLanguageDropdown(false);
              }}
              className="flex items-center justify-start text-left  hover:bg-gray-100 p-1 w-full gap-x-1"
            >
              <img
                src={require("../assets/images/french.png")}
                alt="french"
                className="md:h-10 h-5 md:w-10 w-5"
              />
              <div className="text-textBlack w-full rounded-md hover:font-semibold transition cursor-pointer">
                French
              </div>
            </div>
          </div>
        </button>
        {/* profile btn & div */}
        <div
          ref={profileRef}
          onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          className="cursor-pointer select-none font-bold lg:text-2xl text-textBlack md:text-xl text-xs capitalize"
        >
          <div className="flex items-center gap-x-2">
            {user?.name}
            {user?.profile !== null && user?.profile !== undefined ? (
              <img
                src={BaseUrl.concat(user?.profile)}
                alt={user?.name}
                className="md:h-12 md:w-12 h-9 w-9 object-contain object-center border rounded-md text-sm bg-blend-multiply bg-transparent"
              />
            ) : (
              <FaUserAlt className="bg-gray-200 md:h-10 md:w-10 h-6 w-6 p-1 rounded-md inline-block" />
            )}
            <BsChevronDown
              className={`md:inline-block hidden text-sm ml-1 ${
                showProfileDropdown ? "rotate-180" : "rotate-0"
              } transition duration-300 `}
            />
          </div>
          {/* dropdown for profile */}
          <div
            className={`font-normal origin-top bg-white md:text-lg transition transform ${
              showProfileDropdown ? "scale-100" : "scale-0"
            } absolute md:top-11 top-8 md:left-16 left-5 shadow-2xl rounded-md p-2 z-10 md:min-w-[10rem] min-w-[7rem]`}
          >
            <p
              onClick={() => {
                setActiveComponent("profile");
                setShowProfileDropdown(false);
              }}
              className="hover:font-semibold duration-300 w-full p-1 rounded-md transition cursor-pointer"
            >
              Profile
            </p>
            <button
              onClick={() => {
                setActiveComponent("change password");
              }}
              className="text-textBlack text-left w-full p-1 rounded-md hover:font-semibold transition cursor-pointer"
            >
              Change Password
            </button>
            <button
              disabled={loading}
              onClick={() => {
                toast.loading("Logout...");
                setTimeout(() => {
                  toast.remove();
                  dispatch(handleLogout());
                }, 1000);
              }}
              className={`text-red-500 text-left w-full p-1 rounded-md hover:font-semibold transition ${
                loading && "cursor-not-allowed"
              } `}
            >
              {loading ? "..." : "Logout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
