import React from "react";
import { HiPencil } from "react-icons/hi";

const EditProfile = ({ setShowProfileEdit }) => {
  return (
    <div className="w-full lg:space-y-5 space-y-3">
      {/* title + buttons */}
      <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
        <p className="font-semibold text-left lg:text-xl text-lg">Edit profile</p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            className="gray_button"
            onClick={() => setShowProfileEdit(false)}
          >
            Cancel
          </button>
          <button
            className="green_button"
            onClick={() => setShowProfileEdit(false)}
          >
            Save
          </button>
        </div>
      </div>
      {/* main div */}
      <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
        <div className="relative md:w-24 w-20 block">
          <img
            src={require("../../assets/images/profile.png")}
            alt="profile"
            className="rounded-full md:h-24 md:w-24 w-20 h-20"
          />
          <input
            type="file"
            className="text-3xl cursor-pointer opacity-0 z-10 absolute bottom-0 right-0 rounded-full bg-red-600 text-white h-8 w-8 p-1"
          />
          <HiPencil
            role="button"
            className="text-3xl absolute z-0 bottom-0 right-0 rounded-full bg-green-600 text-white h-8 w-8 p-1"
          />
        </div>
        <p className="font-bold text-black md:text-xl">Personal Details</p>
        {/* personal details */}
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/* name */}
          <div className="w-full space-y-2">
            <label htmlFor="name" className="Label">
              User name
            </label>
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/* role */}
          <div className="w-full space-y-2">
            <label htmlFor="role" className="Label">
              Role
            </label>
            <select className="input_field">
              <option value="Editor">Editor</option>
              <option value="Admin">Admin</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
          {/* company */}
          <div className="w-full space-y-2">
            <label htmlFor="company" className="Label">
              company
            </label>
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/* email */}
          <div className="w-full space-y-2">
            <label htmlFor="email" className="Label">
              email
            </label>
            <input
              type="email"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/* phone */}
          <div className="w-full space-y-2">
            <label htmlFor="phone" className="Label">
              phone
            </label>
            <input
              type="number"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
        </div>
        <hr className="my-1" />
        {/* address */}
        <p className="font-bold text-black md:text-xl">Address</p>
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/*company address */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="company_address" className="Label">
              Company address
            </label>
            <textarea
              type="text"
              placeholder="Type here..."
              className="input_field min-h-[5rem] max-h-[15rem]"
            />
          </div>
          {/* city */}
          <div className="w-full space-y-2">
            <label htmlFor="city" className="Label">
              city
            </label>
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/* country */}
          <div className="w-full space-y-2">
            <label htmlFor="country" className="Label">
              country
            </label>
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/* zipcode */}
          <div className="w-full space-y-2">
            <label htmlFor="zipcode" className="Label">
              zipcode
            </label>
            <input
              type="number"
              placeholder="Type here..."
              className="input_field"
              maxLength={6}
              minLength={6}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
