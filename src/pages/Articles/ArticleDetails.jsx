import React, { useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { Helmet } from "react-helmet";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { handleLogout } from "../../redux/AuthSlice";
import { handleLogoutFromAllTabs } from "../../redux/GlobalStates";
import toast from "react-hot-toast";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import {
  handleChangeSingleArticle,
  handleGetArticleById,
} from "../../redux/ArticleSlice";
import {
  handleGetCategories,
  handleGetTags,
} from "../../redux/CategoryAndTagsSlice";
import { PublicS3Url } from "../../BaseUrl";

const ArticleDetails = () => {
  const { token } = useSelector((state) => state.root.auth);

  const { articleLoading, singleArticle } = useSelector(
    (state) => state.root.article
  );

  const { isSidebarOpen, language } = useSelector(
    (state) => state.root.globalStates
  );

  const { t } = useTranslation();

  const { id } = useParams();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    const response = dispatch(
      handleGetArticleById({ token, id, lang: language })
    );

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
      <Helmet title="Article details | Bois news media" />
      <div className="w-full flex items-start lg:gap-3 flex-row h-auto">
        <Sidebar />
        <section
          className={`h-full space-y-5 bg-[#FBFBFB] min-h-screen ${
            isSidebarOpen ? "xl:w-10/12 lg:w-4/5 w-full" : "lg:w-[90%] w-full"
          }`}
        >
          <Header />
          {articleLoading ? (
            <div className="data_not_found_And_Loading">{t("Loading")}...</div>
          ) : (
            <div className="lg:space-y-5 space-y-3 lg:p-5 p-3 w-full">
              <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
                <p
                  onClick={() => {
                    dispatch(handleChangeSingleArticle(null));
                    navigate("/articles");
                  }}
                  className="font-semibold text-left lg:text-xl text-lg capitalize cursor-pointer"
                >
                  <MdOutlineKeyboardBackspace
                    size={25}
                    className="inline-block pb-1 mr-1"
                  />
                  {t("article Detail")}
                </p>
                <div className="flex flex-wrap  items-center text-black justify-start md:gap-3 gap-1"></div>
              </div>
              <div className="shadow-sm outline-none rounded-2xl md:mt-5 mt-3 py-3 px-4 bg-white overflow-x-scroll scrollbar">
                <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
                  {/* image */}
                  <div className="w-full col-span-full space-y-2">
                    <label htmlFor="image" className="Label">
                      {t("image")}
                    </label>
                    <img
                      src={PublicS3Url.concat(singleArticle?.image)}
                      alt=""
                      className="w-full max-h-[40vh] object-contain rounded-lg"
                    />
                  </div>
                  {/*france name */}
                  <div className="w-full space-y-2">
                    <label htmlFor="frname" className="Label">
                      {t("france title")}
                    </label>
                    <p className="font-semibold">{singleArticle?.fr?.title}</p>
                  </div>
                  {/*english name */}
                  <div className="w-full space-y-2">
                    <label htmlFor="enname" className="Label">
                      {t("english title")}
                    </label>
                    <p className="font-semibold">
                      {singleArticle?.en?.title
                        ? singleArticle?.en?.title
                        : "-"}
                    </p>
                  </div>
                  {/* website */}
                  <div className="w-full space-y-2">
                    <label htmlFor="website" className="Label">
                      {t("website")}
                    </label>
                    <p className="font-semibold">{singleArticle?.website}</p>
                  </div>
                  {/*france content */}
                  <div className="w-full space-y-2 col-span-full">
                    <label htmlFor="frcontent" className="Label">
                      {t("france content")}
                    </label>
                    <p className="font-semibold">
                      {singleArticle?.fr?.content}
                    </p>
                  </div>
                  {/*english content */}
                  <div className="w-full space-y-2 col-span-full">
                    <label htmlFor="encontent" className="Label">
                      {t("english content")}
                    </label>
                    <p className="font-semibold">
                      {singleArticle?.en?.content
                        ? singleArticle?.en?.content
                        : "-"}
                    </p>
                  </div>
                  {/*author */}
                  <div className="w-full space-y-2">
                    <label htmlFor="author" className="Label">
                      {t("author")}
                    </label>
                    <p className="font-semibold">
                      {singleArticle?.author?.name}
                    </p>
                  </div>
                  {/*category */}
                  <div className="w-full space-y-2">
                    <label htmlFor="category" className="Label">
                      {t("category")}
                    </label>
                    <p className="font-semibold">
                      {singleArticle?.category?.name}
                    </p>
                  </div>
                  {/*tags */}
                  <div className="w-full space-y-2">
                    <label htmlFor="tags" className="Label">
                      {t("tags")}
                    </label>
                    <p className="font-semibold">
                      {singleArticle?.tags.map((tag) => tag?.name).join(", ")}
                    </p>
                  </div>
                  {/*paid */}
                  <div className="w-full space-y-2">
                    <label htmlFor="paid" className="Label">
                      {t("paid ")}
                    </label>
                    <p className="font-semibold">
                      {singleArticle?.paid ? "Paid" : "Free"}
                    </p>
                  </div>
                  {/*slug */}
                  <div className="w-full space-y-2">
                    <label htmlFor="slug" className="Label">
                      {t("slug")}
                    </label>
                    <p className="font-semibold">{singleArticle?.slug}</p>
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

export default ArticleDetails;
