import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import toast from "react-hot-toast";
import { handleUpdateHomePageConent } from "../../redux/HomeArticleSiteSlice";
import { handleGetArticles } from "../../redux/ArticleSlice";
import { handleGetImages } from "../../redux/ImageSlice";
import { handleLogout } from "../../redux/AuthSlice";
import { handleLogoutFromAllTabs } from "../../redux/GlobalStates";

const AddHomePageContent = () => {
  const [heroSection, setHeroSection] = useState([]);
  const [otherSections, setOtherSections] = useState([]);
  const [imageAndArticles, setImageAndArticles] = useState([]);

  const { token } = useSelector((state) => state.root.auth);

  const { articles, articleLoading } = useSelector(
    (state) => state.root.article
  );

  const { images, loading } = useSelector((state) => state.root.image);

  const { homePageContentUpdateLoading } = useSelector(
    (state) => state.root.homepagecontent
  );

  const { fileterdData, isSidebarOpen, language } = useSelector(
    (state) => state.root.globalStates
  );

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const addContent = yup.object({
    website: yup.string().required("website is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
    reValidateMode: "onChange",
    mode: "onChange",
    resolver: yupResolver(addContent),
  });

  const onSubmit = (data) => {
    const { website } = data;
    toast.remove();
    if (heroSection.length === 0) {
      return toast.error("Add atleast one content for hero section");
    }
    const response = dispatch(
      handleUpdateHomePageConent({
        heroSection: heroSection.map((item, key, self) => {
          if (item.type === "Article") {
            return {
              type: item?.type,
              contentId: item?.contentId,
              category: item.categoryId,
            };
          } else {
            return {
              type: item?.type,
              contentId: item?.contentId,
            };
          }
        }),
        otherSections: otherSections.map((item, key, self) => {
          return item?.contentId;
        }),
        website,
        token,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success(`${t("content added successfully.")}`, {
            duration: 2000,
          });
          navigate("/home-article-site");
        } else if (res?.payload?.status === "error") {
          toast.error(res?.payload?.message);
        }
      });
    }
  };

  //   add article & image
  const handleAddImageAndArticles = (data, from) => {
    const findData = imageAndArticles.find(
      (content) => content.contentId === data?.value
    );
    if (findData) {
      if (from === "herosection") {
        if (heroSection.some((content) => content.place === data?.name)) {
          setHeroSection((prev) =>
            prev.map((content) =>
              content?.place === data?.name ? findData : content
            )
          );
        } else {
          setHeroSection([...heroSection, { ...findData, place: data.name }]);
        }
      } else {
        if (otherSections.some((content) => content.place === data?.name)) {
          setOtherSections((prev) =>
            prev.map((content) =>
              content?.place === data?.name ? findData : content
            )
          );
        } else {
          setOtherSections([
            ...otherSections,
            { ...findData, place: data.name },
          ]);
        }
      }
    }
  };

  useEffect(() => {
    const response = dispatch(handleGetArticles({ token, lang: language }));
    dispatch(handleGetImages({ token, lang: language })).then((res) => {
      const images = res.payload.images.map((image) => {
        return {
          type: "Image",
          contentId: image?._id,
          title: image?.name,
        };
      });
      if (res?.payload?.status === "success") {
        setImageAndArticles((prev) => [...prev, ...images]);
      }
    });
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          const articles = res.payload.articles.map((article) => {
            return {
              type: "Article",
              contentId: article?._id,
              categoryId: article?.category?._id,
              title: article?.fr?.title,
            };
          });
          setImageAndArticles((prev) => [...prev, ...articles]);
        }
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

    return () => {
      abortApiCall();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet title="Add home page content | Bois news media" />
      <div className="w-full flex items-start lg:gap-3 flex-row h-auto">
        <Sidebar />
        <section
          className={`h-full space-y-5 bg-[#FBFBFB] min-h-screen ${
            isSidebarOpen ? "xl:w-10/12 lg:w-4/5 w-full" : "lg:w-[90%] w-full"
          }`}
        >
          <Header />
          {loading || articleLoading ? (
            <div className="data_not_found_And_Loading">{t("Loading")}....</div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="lg:space-y-5 space-y-3 lg:p-5 p-3 w-full"
            >
              {/* buttons */}
              <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
                <p className="font-semibold text-left lg:text-xl text-lg">
                  {t("Add new content")}
                </p>
                <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
                  <button
                    className={`gray_button ${
                      homePageContentUpdateLoading && "cursor-not-allowed"
                    }`}
                    onClick={() => {
                      //     setShowAddImage(false);
                      navigate("/home-article-site");
                    }}
                    disabled={homePageContentUpdateLoading}
                    type="reset"
                  >
                    {t("Cancel")}
                  </button>
                  <button
                    className={`green_button ${
                      homePageContentUpdateLoading && "cursor-not-allowed"
                    }`}
                    type="submit"
                    disabled={homePageContentUpdateLoading}
                  >
                    {homePageContentUpdateLoading
                      ? t("Submitting").concat("...")
                      : t("Submit")}
                  </button>
                </div>
              </div>
              <div className="md:p-8 p-4 grid md:grid-cols-2 md:gap-5 gap-3 place-items-start items-start rounded-md shadow-md bg-white">
                <p className="font-semibold text-xl col-span-full">
                  Add Content for hero section
                </p>
                {/* first image for herosection */}
                <div className="w-full space-y-2">
                  <label htmlFor="herosection" className="Label">
                    {t("Hero section first image")}
                  </label>
                  <select
                    onChange={(e) => {
                      handleAddImageAndArticles(e.target, "herosection");
                    }}
                    name="first"
                    className="input_field"
                  >
                    <option label="select first content"></option>
                    {(articles.length > 0 || images.length > 0) &&
                      imageAndArticles.map((content, i) => (
                        <option value={content.contentId} key={i}>
                          {content?.title}
                        </option>
                      ))}
                  </select>
                  <span className="error">{errors?.name?.message}</span>
                </div>
                {/* second image for herosection */}
                <div className="w-full space-y-2">
                  <label htmlFor="herosection" className="Label">
                    {t("Hero section second image")}
                  </label>
                  <select
                    onChange={(e) => {
                      handleAddImageAndArticles(e.target, "herosection");
                    }}
                    name="second"
                    className="input_field"
                  >
                    <option label="select second content"></option>
                    {(articles.length > 0 || images.length > 0) &&
                      imageAndArticles.map((content, i) => (
                        <option value={content.contentId} key={i}>
                          {content?.title}
                        </option>
                      ))}
                  </select>
                  <span className="error">{errors?.name?.message}</span>
                </div>
                {/* third image for herosection */}
                <div className="w-full space-y-2">
                  <label htmlFor="herosection" className="Label">
                    {t("Hero section third image")}
                  </label>
                  <select
                    onChange={(e) => {
                      handleAddImageAndArticles(e.target, "herosection");
                    }}
                    name="third"
                    className="input_field"
                  >
                    <option label="select third content"></option>
                    {(articles.length > 0 || images.length > 0) &&
                      imageAndArticles.map((content, i) => (
                        <option value={content.contentId} key={i}>
                          {content?.title}
                        </option>
                      ))}
                  </select>
                  <span className="error">{errors?.name?.message}</span>
                </div>
                {/* four image for herosection */}
                <div className="w-full space-y-2">
                  <label htmlFor="herosection" className="Label">
                    {t("Hero section four image")}
                  </label>
                  <select
                    onChange={(e) => {
                      handleAddImageAndArticles(e.target, "herosection");
                    }}
                    name="four"
                    className="input_field"
                  >
                    <option label="select fourth content"></option>
                    {(articles.length > 0 || images.length > 0) &&
                      imageAndArticles.map((content, i) => (
                        <option value={content.contentId} key={i}>
                          {content?.title}
                        </option>
                      ))}
                  </select>
                  <span className="error">{errors?.name?.message}</span>
                </div>

                <p className="font-semibold text-xl col-span-full">
                  Add Content for other section
                </p>
                {/* first image for othersection */}
                <div className="w-full space-y-2">
                  <label htmlFor="othersection" className="Label">
                    {t("Other section first image")}
                  </label>
                  <select
                    onChange={(e) => {
                      handleAddImageAndArticles(e.target, "othersection");
                    }}
                    name="first"
                    className="input_field"
                  >
                    <option label="select first content"></option>
                    {images.length > 0 &&
                      imageAndArticles
                        .filter((c) => c.type === "Image")
                        .map((content, i) => (
                          <option value={content.contentId} key={i}>
                            {content?.title}
                          </option>
                        ))}
                  </select>
                  <span className="error">{errors?.name?.message}</span>
                </div>
                {/* second image for othersection */}
                <div className="w-full space-y-2">
                  <label htmlFor="othersection" className="Label">
                    {t("Other section second image")}
                  </label>
                  <select
                    onChange={(e) => {
                      handleAddImageAndArticles(e.target, "othersection");
                    }}
                    name="second"
                    className="input_field"
                  >
                    <option label="select second content"></option>
                    {images.length > 0 &&
                      imageAndArticles
                        .filter((c) => c.type === "Image")
                        .map((content, i) => (
                          <option value={content.contentId} key={i}>
                            {content?.title}
                          </option>
                        ))}
                  </select>
                  <span className="error">{errors?.name?.message}</span>
                </div>
                {/* website */}
                <div className="w-full space-y-2">
                  <label htmlFor="website" className="Label">
                    {t("website")}
                  </label>
                  <select {...register("website")} className="input_field">
                    <option label="choose website"></option>
                    <option value="boismag">BOISmag</option>
                    <option value="agenceur">Agenceur</option>
                    <option value="artisans_and_bois">Artisans & Bois</option>
                    <option value="toiture">Toiture</option>
                  </select>
                  <span className="error">{errors?.website?.message}</span>
                </div>
              </div>
            </form>
          )}
        </section>
      </div>
    </>
  );
};

export default AddHomePageContent;
