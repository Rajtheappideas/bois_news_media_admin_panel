import React, { useRef } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { handleSearch } from "../redux/GlobalStates";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

const Search = ({ data }) => {
  const { searchTerm } = useSelector((state) => state.root.globalStates);
  const dispatch = useDispatch();

  const searchRef = useRef(null);

  const { t } = useTranslation();

  const handleClickOnSearch = () => {
    toast.remove();
    if (searchTerm === "") {
      toast.error(t("Enter a word"));
      searchRef.current.focus();
    } else {
      dispatch(
        handleSearch({
          data,
          value: searchTerm.trim().toLocaleLowerCase(),
        })
      );
    }
  };

  return (
    <div className="w-full relative">
      <input
        type="text"
        ref={searchRef}
        className="w-full shadow-md rounded-md outline-none pr-10 pl-3 p-3 placeholder:text-textColor"
        placeholder={t("Search...")}
        value={searchTerm}
        onChange={(e) => {
          dispatch(
            handleSearch({
              data,
              value: e.target.value.trim().toLocaleLowerCase(),
            })
          );
        }}
      />
      <AiOutlineSearch
        role="button"
        size={25}
        className="absolute text-textColor right-2 top-3"
        onClick={() => handleClickOnSearch()}
      />
    </div>
  );
};

export default Search;
