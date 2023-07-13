import React, { useEffect, useRef, useState } from "react";
import { HiMenuAlt2 } from "react-icons/hi";
import { CiBellOn } from "react-icons/ci";
import { FaUserAlt } from "react-icons/fa";
import { BsChevronDown } from "react-icons/bs";

const Header = ({
  openSidebar,
  setOpenSidebar,
  activeComponent,
  setActiveComponent,
}) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

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

  // for notification dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event?.target)
      ) {
        setShowNotificationDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutsideForNotification]);

  function handleClickOutsideForNotification() {
    setShowNotificationDropdown(false);
  }

  return (
    <div className="w-full flex items-center justify-between">
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
        {/* notification butn */}
        <button ref={notificationRef}>
          <CiBellOn
            onClick={() =>
              setShowNotificationDropdown(!showNotificationDropdown)
            }
            className={`md:text-3xl text-xl md:h-10 md:w-10 h-7 w-7 p-1 hover:bg-gray-200 transition rounded-full ${
              showNotificationDropdown && "bg-gray-200"
            }`}
          />
          {/* dropdown for notifications */}
          <div
            className={`font-normal md:text-lg transition origin-top transform bg-white ${
              showNotificationDropdown ? "scale-100" : "scale-0"
            } absolute top-10 md:-left-28 -left-36 shadow-2xl rounded-md md:p-4 p-2 z-10 space-y-2`}
          >
            <div className="flex items-center justify-start text-left w-full gap-x-1">
              <p className="bg-gray-300 rounded-full p-5 text-black"></p>
              <div className="text-textBlack w-full p-1 rounded-md hover:font-semibold transition cursor-pointer">
                <p>Lorem, ipsum dolor sit amet.</p>
                <p className="text-textColor text-sm">29 Jul 2023 - 02:26 PM</p>
              </div>
            </div>
            <hr />
            <div className="flex items-center justify-start text-left w-full">
              <p className="bg-gray-300 rounded-full p-5 text-black"></p>
              <div className="text-textBlack w-full p-1 rounded-md hover:font-semibold transition cursor-pointer">
                <p>Lorem, ipsum dolor sit amet.</p>
                <p className="text-textColor text-sm">29 Jul 2023 - 02:26 PM</p>
              </div>
            </div>
            <hr />
            <div className="flex items-center justify-start text-left w-full">
              <p className="bg-gray-300 rounded-full p-5 text-black"></p>
              <div className="text-textBlack w-full p-1 rounded-md hover:font-semibold transition cursor-pointer">
                <p>Lorem, ipsum dolor sit amet.</p>
                <p className="text-textColor text-sm">29 Jul 2023 - 02:26 PM</p>
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
          Adam jackson{" "}
          <FaUserAlt className="bg-gray-200 md:h-10 md:w-10 h-6 w-6 p-1 rounded-md inline-block" />
          <BsChevronDown className="md:inline-block hidden text-sm ml-1" />
          {/* dropdown for profile */}
          <div
            className={`font-normal origin-top bg-white md:text-lg transition transform ${
              showProfileDropdown ? "scale-100" : "scale-0"
            } absolute md:top-10 top-7 md:left-10 left-5 shadow-2xl rounded-md p-2 z-10 md:min-w-[10rem] min-w-[7rem]`}
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
            <p className="text-red-500 w-full p-1 rounded-md hover:font-semibold transition cursor-pointer">
              Logout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
