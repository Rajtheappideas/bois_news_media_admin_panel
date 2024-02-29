import React, { useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { Helmet } from "react-helmet";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import {
  handleChangeSingleTag,
  handleGetTagById,
} from "../../redux/CategoryAndTagsSlice";
import { handleLogout } from "../../redux/AuthSlice";
import { handleLogoutFromAllTabs } from "../../redux/GlobalStates";
import toast from "react-hot-toast";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

const TagDetails = () => {
  const { token } = useSelector((state) => state.root.auth);

  const { tagLoading, singelTag } = useSelector(
    (state) => state.root.categoryandtag
  );

  const { isSidebarOpen, language } = useSelector(
    (state) => state.root.globalStates
  );

  const { t } = useTranslation();

  const { id } = useParams();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    const response = dispatch(handleGetTagById({ token, id, lang: language }));
    if (response) {
      response.then((res) => {
        if (
          res?.payload?.status === "fail" &&
          (res?.payload?.message === "Please provide authentication token." ||
            res?.payload?.message === "Invalid token.")
        ) {
          dispatch(handleLogout());
          dispatch(handleLogoutFromAllTabs());
          toast.error("Please login again");
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet title="Tag details | Bois news media" />
      <div className="w-full flex items-start lg:gap-3 flex-row h-auto">
        <Sidebar />
        <section
          className={`h-full space-y-5 bg-[#FBFBFB] min-h-screen ${
            isSidebarOpen ? "xl:w-10/12 lg:w-4/5 w-full" : "lg:w-[90%] w-full"
          }`}
        >
          <Header />
          {tagLoading ? (
            <div className="data_not_found_And_Loading">{t("Loading")}...</div>
          ) : (
            <div className="lg:space-y-5 space-y-3 lg:p-5 p-3 w-full">
              <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
                <p
                  onClick={() => {
                    dispatch(handleChangeSingleTag(null));
                    navigate("/tags");
                  }}
                  className="font-semibold text-left lg:text-xl text-lg capitalize cursor-pointer"
                >
                  <MdOutlineKeyboardBackspace
                    size={25}
                    className="inline-block pb-1 mr-1"
                  />
                  {t("tag Detail")}
                </p>
                <div className="flex flex-wrap  items-center text-black justify-start md:gap-3 gap-1"></div>
              </div>
              <div className="shadow-sm outline-none rounded-2xl md:mt-5 mt-3 py-3 px-4 bg-white overflow-x-scroll scrollbar">
                <div className="w-full grid md:grid-cols-2 place-items-start items-center md:gap-5 gap-2">
                  {/* name */}
                  <div className="w-full space-y-2">
                    <label htmlFor="name" className="Label">
                      {t("Name")}
                    </label>
                    <p className="font-semibold">{singelTag?.name}</p>
                  </div>
                  {/* website */}
                  <div className="w-full space-y-2">
                    <label htmlFor="website" className="Label">
                      {t("website")}
                    </label>
                    <p className="font-semibold">{singelTag?.website}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default TagDetails;
