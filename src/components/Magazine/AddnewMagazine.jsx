import React from "react";
import { BiImageAdd } from "react-icons/bi";

const AddnewMagazine = ({ setshowAddnewMagazine }) => {
  return (
    <div className="w-full lg:space-y-5 space-y-3">
      {/* title + buttons */}
      <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
        <p className="font-semibold text-left lg:text-xl text-lg">
          Add new magazine
        </p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            className="gray_button"
            onClick={() => setshowAddnewMagazine(false)}
          >
            Cancel
          </button>
          <button
            className="green_button"
            onClick={() => setshowAddnewMagazine(false)}
          >
            Save
          </button>
        </div>
      </div>
      {/* main div */}
      <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
        <div className="relative md:w-24 w-20 h-24 block">
          <input
            type="file"
            className="text-3xl cursor-pointer opacity-0 z-10 absolute bottom-0 right-0 rounded-full text-white h-full w-full p-1"
          />
          <BiImageAdd
            role="button"
            className="text-3xl absolute z-0 bottom-0 right-0 rounded-full bg-gray-300 text-black md:h-24 md:w-24 w-20 h-20 p-5"
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
          {/* stock */}
          <div className="w-full space-y-2">
            <label htmlFor="stock" className="Label">
              stock
            </label>
            <input
              type="number"
              placeholder="Type here..."
              className="input_field"
            />
          </div>
          {/* summary */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="summary" className="Label">
              summary
            </label>
            <textarea placeholder="Type here..." className="input_field" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddnewMagazine;
