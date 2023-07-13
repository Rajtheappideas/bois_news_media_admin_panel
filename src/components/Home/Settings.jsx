import React, { useState } from "react";

const Settings = () => {
const [toggleSwitch, setToggleSwitch] = useState(false)

  return (
    <div className="shadow-md h-screen rounded-2xl bg-white p-4 md:space-y-5 space-y-3 mb-10">
      <p className="font-bold text-lg">Preference</p>
      <div className="text-left select-none">
        <span className="text-sm text-textGray block">Notification</span>
        <label className="relative mt-2 inline-flex items-center mr-5 cursor-pointer">
          <input
            onClick={() => setToggleSwitch(!toggleSwitch)}
            type="checkbox"
            value=""
            className="sr-only peer"
          />
          {toggleSwitch ? (
            <span className="absolute top-3 left-3 text-white">On</span>
          ) : (
            <span className="absolute top-3 right-3 text-black">Off</span>
          )}
          <div className="w-20 h-12 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1.5 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-9 after:w-9 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
        </label>
      </div>
      <div className="text-left">
        <span className="text-sm text-textGray block mb-2">Languange</span>
        <select
          // onChange={(e) => setSelectedLang(e.target.value)}
          className="font-bold text-lg text-black md:w-60 w-48 md:h-12 h-10
        rounded-3xl px-2.5 border-2 border-gray-300"
        >
          <option
            value={"en"}
            // selected={
            //   JSON.parse(window.localStorage.getItem("user_lang")) === "en"
            // }
          >
            English
          </option>
          <option
            value={"fr"}
            // selected={
            //   JSON.parse(window.localStorage.getItem("user_lang")) === "fr"
            // }
          >
            French
          </option>
        </select>
      </div>
      <button
        type="button"
        className="md:w-40 w-32 md:h-12 h-10 text-center bg-primaryBlue text-white hover:bg-primaryBlue/70 transition active:scale-95 rounded-3xl"
        onClick={() => {
          // window.localStorage.setItem(
          //   "user_lang",
          //   JSON.stringify(selectedLang)
          // );
          // dispatch(handleChangeUserLanguage(selectedLang));
          // window.location.reload();
        }}
      >
        Save Setting
      </button>
    </div>
  );
};

export default Settings;
