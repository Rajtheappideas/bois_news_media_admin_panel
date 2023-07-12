import React from "react";
import { AiOutlineSearch } from "react-icons/ai";

const Search = () => {
  return (
    <div className="w-full relative">
      <input
        type="text"
        className="w-full shadow-md rounded-md outline-none pl-3 p-3 placeholder:text-textColor"
        placeholder="Search..."
      />
      <AiOutlineSearch
        role="button"
        size={25}
        className="absolute text-textColor right-2 top-3"
      />
    </div>
  );
};

export default Search;
