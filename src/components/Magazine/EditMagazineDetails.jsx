import React from "react";
import { HiPencil } from "react-icons/hi";

const EditMagazineDetails = ({ setshowEditMagazine }) => {
  return (
    <div className="w-full lg:space-y-5 space-y-3 ">
      {/* title + buttons */}
      <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
        <p className="font-semibold text-left lg:text-xl text-lg">
          Magazine details
        </p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            className="text-green-500 border border-green-400 font-medium text-center md:w-32 w-24 h-10 rounded-lg p-2 hover:bg-green-200 active:scale-95 transition"
            onClick={() => setshowEditMagazine(false)}
          >
            Download
          </button>
          <button
            className="gray_button"
            onClick={() => setshowEditMagazine(false)}
          >
            Cancel
          </button>
          <button
            className="green_button"
            onClick={() => setshowEditMagazine(false)}
          >
            Save
          </button>
          <button
            className="red_button"
            onClick={() => setshowEditMagazine(false)}
          >
            Delete
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
        <p className="font-bold text-black md:text-xl">Magazine details</p>
        {/* personal details */}
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/* title */}
          <div className="w-full space-y-2">
            <label htmlFor="title" className="Label">
              title
            </label>
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/* stock */}
          <div className="w-full space-y-2">
            <label htmlFor="stock" className="Label">
              stock
            </label>
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/* price */}
          <div className="w-full space-y-2">
            <label htmlFor="price" className="Label">
              price
            </label>
            <input
              type="number"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/* discriptions */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="discriptions" className="Label">
              discriptions
            </label>
            <textarea placeholder="Type here..." className="input_field" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMagazineDetails;
