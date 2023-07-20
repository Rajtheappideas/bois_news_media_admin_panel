import React, { useState } from "react";
import EditProfile from "../Profile/EditProfile";
import { useSelector } from "react-redux";
import BaseUrl from "../../BaseUrl";
import { FaUserCircle } from "react-icons/fa";

const Profile = () => {
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  const { user, loading } = useSelector((state) => state.root.auth);

  return (
    <>
      {showProfileEdit ? (
        <EditProfile setShowProfileEdit={setShowProfileEdit} />
      ) : (
        <div className="w-full lg:space-y-5 space-y-3">
          {/* title + buttons */}
          <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
            <p className="font-semibold text-left lg:text-xl text-lg"></p>
            <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
              <button
                className="gray_button"
                onClick={() => setShowProfileEdit(true)}
              >
                Edit profile
              </button>
            </div>
          </div>
          {/* main div */}
          <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
            <div className="relative md:w-24 w-20 block">
              {user?.profile !== null && user?.profile !== undefined ? (
                <img
                  src={BaseUrl.concat(user?.profile)}
                  alt="profile"
                  className="rounded-full border md:h-24 md:w-24 w-20 h-20"
                />
              ) : (
                <FaUserCircle
                  size={30}
                  color="lightgray"
                  className="h-full w-full"
                />
              )}
            </div>
            <p className="font-bold text-black md:text-xl">Personal Details</p>
            {/* personal details */}
            <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
              {/* name */}
              <div className="w-full space-y-2">
                <label htmlFor="name" className="Label">
                  name
                </label>
                <p className="text-textBlack font-medium capitalize">
                  {user?.name ?? "-"}
                </p>
              </div>
              {/* company */}
              <div className="w-full space-y-2">
                <label htmlFor="company" className="Label">
                  company
                </label>
                <p className="text-textBlack font-medium capitalize">
                  {user?.company ?? "-"}
                </p>
              </div>
              {/* email */}
              <div className="w-full space-y-2">
                <label htmlFor="email" className="Label">
                  email
                </label>
                <p className="text-textBlack font-medium">
                  {user?.email ?? "-"}{" "}
                </p>
              </div>
              {/* phone */}
              <div className="w-full space-y-2">
                <label htmlFor="phone" className="Label">
                  phone
                </label>
                <p className="text-textBlack font-medium">
                  {user?.phone ?? "-"}
                </p>
              </div>
            </div>
            <hr className="my-1" />
            {/* address */}
            <p className="font-bold text-black md:text-xl">Address</p>
            <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
              {/*address */}
              <div className="w-full col-span-full space-y-2">
                <label htmlFor="address" className="Label">
                  address
                </label>
                <p className="text-textBlack font-medium">
                  {user?.address ?? "-"}{" "}
                </p>
              </div>
              {/* city */}
              <div className="w-full space-y-2">
                <label htmlFor="city" className="Label">
                  city
                </label>
                <p className="text-textBlack font-medium capitalize">
                  {" "}
                  {user?.city ?? "-"}
                </p>
              </div>
              {/* country */}
              <div className="w-full space-y-2">
                <label htmlFor="country" className="Label">
                  country
                </label>
                <p className="text-textBlack font-medium capitalize">
                  {user?.country ?? "-"}
                </p>
              </div>
              {/* zipcode */}
              <div className="w-full space-y-2">
                <label htmlFor="zipcode" className="Label">
                  zipcode
                </label>
                <p className="text-textBlack font-medium">
                  {user?.zipCode ?? "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
