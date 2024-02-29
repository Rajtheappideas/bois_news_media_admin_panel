import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import { useNavigate } from "react-router";
import {
  handleDeleteArticle,
  handleEditArticle,
} from "../../redux/ArticleSlice";
import Select from "react-select";
import Animated from "react-select/animated";
import { Helmet } from "react-helmet";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { PublicS3Url } from "../../BaseUrl";
import { HiPencil } from "react-icons/hi2";
import RichTextEditor from "../../components/RichTextEditor";

const EditArticle = () => {
  const [prevImage, setPrevImage] = useState(null);
  const [articleImage, setArticleImage] = useState(null);

  const { addAndEditLoading, singleArticle, removeLoading } = useSelector(
    (state) => state.root.article
  );
  const { categories, tags } = useSelector(
    (state) => state.root.categoryandtag
  );

  const { token, role } = useSelector((state) => state.root.auth);

  const { language, isSidebarOpen } = useSelector(
    (state) => state.root.globalStates
  );

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { t } = useTranslation();

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const editArticleSchema = yup.object({
    frtitle: yup.string().required("france name is required"),
    entitle: yup.string(),
    frcontent: yup.string().required("france content is required"),
    encontent: yup.string(),
    paid: yup.boolean().required("select paid or free"),
    category: yup.string().required("cateogry is required"),
    tags: yup
      .array()
      .min(1, "choose at least 1 tag")
      .required("tag is required"),
    website: yup.string().required("website is required"),
    image: yup.mixed(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },control
  } = useForm({
    shouldFocusError: true,
    reValidateMode: "onChange",
    mode: "onChange",
    resolver: yupResolver(editArticleSchema),
    defaultValues: {
      frtitle: singleArticle?.fr?.title,
      entitle: singleArticle?.en?.title,
      frcontent: singleArticle?.fr?.content,
      encontent: singleArticle?.en?.content,
      category: singleArticle?.category?._id,
      tags: singleArticle?.tags,
      image: singleArticle?.image,
      paid: singleArticle?.paid,
      website: singleArticle?.website,
    },
  });

  const onSubmit = (data) => {
    const {
      frtitle,
      frcontent,
      entitle,
      encontent,
      paid,
      website,
      category,
      tags,
    } = data;
    toast.remove();

    const response = dispatch(
      handleEditArticle({
        token,
        lang: language,
        frtitle,
        frcontent,
        entitle,
        encontent,
        image: articleImage ? articleImage : singleArticle?.image,
        paid,
        website,
        category,
        id: singleArticle?._id,
        tags: tags?.map((tag) => {
          if (tag.hasOwnProperty("value")) {
            return tag?.value;
          } else {
            return tag?._id;
          }
        }),
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success(`${t("article created successfully.")}`, {
            duration: 2000,
          });
          navigate("/articles");
        } else if (res?.payload?.status === "error") {
          toast.error(res?.payload?.message);
        }
      });
    }
  };

  // image upload
  const handleImageUpload = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setPrevImage(URL.createObjectURL(file));
    setArticleImage(file);
  };

  const animatedComponents = Animated();

  const tagOptions = tags.map((tag) => {
    return {
      value: tag?._id,
      label: tag?.name,
    };
  });

  const handleDeleteArticleFunction = () => {
    if (window.confirm(t("Are you sure?"))) {
      const response = dispatch(
        handleDeleteArticle({
          token,
          id: singleArticle?._id,
          signal: AbortControllerRef,
        })
      );
      toast.loading("Deleting...");
      if (response) {
        response.then((res) => {
          if (res?.payload?.status === "success") {
            toast.remove();
            toast.success(
              `${singleArticle?.fr?.title} ${t("tag Deleted Successfully")}.`
            );
            navigate("/articles");
          } else if (res?.payload?.status === "error") {
            toast.remove();
            toast.error(res?.payload?.message);
          }
        });
      }
    }
  };

  useEffect(() => {
    return () => {
      abortApiCall();
    };
  }, []);

  return (
    <>
      <Helmet title="Edit Article | Bois news media" />
      <div className="w-full flex items-start lg:gap-3 flex-row h-auto">
        <Sidebar />
        <section
          className={`h-full space-y-5 bg-[#FBFBFB] min-h-screen ${
            isSidebarOpen ? "xl:w-10/12 lg:w-4/5 w-full" : "lg:w-[90%] w-full"
          }`}
        >
          <Header />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full lg:space-y-5 space-y-3 lg:p-5 p-3"
          >
            {/* title + buttons */}
            <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
              <p className="font-semibold text-left lg:text-xl text-lg">
                {t("Edit article details")}
              </p>
              <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
                <button
                  className={`gray_button ${
                    addAndEditLoading && "cursor-not-allowed"
                  }`}
                  onClick={() => {
                    navigate("/articles");
                  }}
                  disabled={addAndEditLoading}
                  type="reset"
                >
                  {t("Cancel")}
                </button>
                <button
                  className={`green_button ${
                    addAndEditLoading && "cursor-not-allowed"
                  }`}
                  type="submit"
                  disabled={addAndEditLoading}
                >
                  {addAndEditLoading
                    ? t("Submitting").concat("...")
                    : t("Submit")}
                </button>
                {role === "admin" && (
                  <button
                    className={`red_button ${
                      (removeLoading || addAndEditLoading) &&
                      "cursor-not-allowed"
                    } `}
                    type="button"
                    disabled={removeLoading || addAndEditLoading}
                    onClick={() => handleDeleteArticleFunction()}
                  >
                    {removeLoading ? t("Deleting").concat("...") : t("Delete")}
                  </button>
                )}
              </div>
            </div>
            {/* main div */}
            <div className="md:p-8 p-4 grid md:grid-cols-2 md:gap-5 gap-3 place-items-start items-start rounded-md shadow-md bg-white">
              <div className="text-left space-y-2 col-span-full">
                <label htmlFor="image" className="Label">
                  {t("Image")}
                </label>
                <div className="relative md:w-24 w-20 h-24 block">
                  {prevImage === null ? (
                    <img
                      src={PublicS3Url.concat(singleArticle?.image)}
                      alt=""
                      className="rounded-full object-contain object-center md:h-24 md:w-24 w-20 h-20 border"
                    />
                  ) : (
                    <img
                      src={prevImage}
                      alt=""
                      className="rounded-full object-contain object-center md:h-24 md:w-24 w-20 h-20 border"
                    />
                  )}
                  <input
                    type="file"
                    className="text-3xl cursor-pointer opacity-0 z-10 absolute bottom-0 right-0 rounded-full bg-red-600 text-white h-8 w-8 p-1"
                    accept="image/*"
                    {...register("image", {
                      required: true,
                      onChange: (e) => {
                        handleImageUpload(e);
                      },
                    })}
                  />
                  <HiPencil
                    role="button"
                    className="text-3xl absolute z-0 bottom-0 right-0 rounded-full bg-green-600 text-white h-8 w-8 p-1"
                  />
                </div>
                <span className="error">{errors?.image?.message}</span>
              </div>

              {/* fr name */}
              <div className="w-full space-y-2">
                <label htmlFor="frtitle" className="Label">
                  {t("france name")}
                </label>
                <input
                  type="text"
                  placeholder={t("Type here...")}
                  className="input_field"
                  {...register("frtitle")}
                />
                <span className="error">{errors?.frtitle?.message}</span>
              </div>
              {/* en name */}
              <div className="w-full space-y-2">
                <label htmlFor="entitle" className="Label">
                  {t("english name")}
                </label>
                <input
                  type="text"
                  placeholder={t("Type here...")}
                  className="input_field"
                  {...register("entitle")}
                />
                <span className="error">{errors?.entitle?.message}</span>
              </div>
              {/* fr content */}
              <div className="w-full space-y-2 col-span-full">
                <label htmlFor="frcontent" className="Label">
                  {t("france content")}
                </label>
                <Controller
                  control={control}
                  name={"frcontent"}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <RichTextEditor
                      onBlur={onBlur}
                      value={value}
                      setValue={setValue}
                    />
                  )}
                />

                <span className="error">{errors?.frcontent?.message}</span>
              </div>
              {/*en content */}
              <div className="w-full space-y-2 col-span-full">
                <label htmlFor="encontent" className="Label">
                  {t("english content")}
                </label>
                <Controller
                  control={control}
                  name={"encontent"}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <RichTextEditor
                      onBlur={onBlur}
                      value={value}
                      setValue={setValue}
                    />
                  )}
                />

                <span className="error">{errors?.encontent?.message}</span>
              </div>
              {/* category */}
              <div className="w-full space-y-2">
                <label htmlFor="category" className="Label">
                  {t("category")}
                </label>
                <select defaultValue={singleArticle?.category?._id} {...register("category")} className="input_field">
                  <option label="choose category"></option>
                  {categories.map((category) => (
                    <option
                      value={category?._id}
                      key={category?._id}
                    >
                      {category?.fr?.name}
                    </option>
                  ))}
                </select>
                <span className="error">{errors?.category?.message}</span>
              </div>
              {/* tag */}
              <div className="w-full space-y-2">
                <label htmlFor="tags" className="Label">
                  {t("tags")}
                </label>
                <Select
                  options={tagOptions}
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  onChange={(e) => {
                    setValue("tags", e, {
                      shouldDirty: false,
                      shouldTouch: false,
                      shouldValidate: false,
                    });
                  }}
                  defaultValue={tagOptions.filter((tag) =>
                    singleArticle?.tags.some((tags) => tag.label === tags?.name)
                  )}
                />
                <span className="error">{errors?.tags?.message}</span>
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
              {/* paid */}
              <div className="w-full space-y-2">
                <label htmlFor="paid" className="Label">
                  {t("paid")}
                </label>
                <select {...register("paid")} className="input_field">
                  <option label="choose option"></option>
                  <option value="true">paid</option>
                  <option value="false">free</option>
                </select>
                <span className="error">{errors?.paid?.message}</span>
              </div>
            </div>
          </form>
        </section>
      </div>
    </>
  );
};

export default EditArticle;
