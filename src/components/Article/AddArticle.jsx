import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import { useNavigate } from "react-router";
import { handleAddArticle } from "../../redux/ArticleSlice";
import Select from "react-select";
import Animated from "react-select/animated";
import { BiImageAdd } from "react-icons/bi";
import RichTextEditor from "../RichTextEditor";

const AddArticle = ({ setShowAddArticle }) => {
  const [prevImage, setPrevImage] = useState(null);
  const [articleImage, setArticleImage] = useState(null);

  const { addAndEditLoading } = useSelector((state) => state.root.article);
  const { categories, tags } = useSelector(
    (state) => state.root.categoryandtag
  );

  const { token } = useSelector((state) => state.root.auth);

  const { language } = useSelector((state) => state.root.globalStates);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { t } = useTranslation();

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const addArticleSchema = yup.object({
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
    image: yup
      .mixed()
      .required(t("Image is required."))
      .test(articleImage !== null, t("Image is required."), () => {
        return true;
      }),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
  } = useForm({
    shouldFocusError: true,
    reValidateMode: "onChange",
    mode: "onChange",
    resolver: yupResolver(addArticleSchema),
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
      handleAddArticle({
        token,
        lang: language,
        frtitle,
        frcontent,
        entitle,
        encontent,
        image: articleImage,
        paid,
        website,
        category,
        tags: tags?.map((tag) => tag?.value),
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success(`${t("article created successfully.")}`, {
            duration: 2000,
          });
          setShowAddArticle(false);
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

  useEffect(() => {
    return () => {
      abortApiCall();
    };
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full lg:space-y-5 space-y-3 lg:p-5 p-3"
    >
      {/* title + buttons */}
      <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
        <p className="font-semibold text-left lg:text-xl text-lg">
          {t("Add new article")}
        </p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            className={`gray_button ${
              addAndEditLoading && "cursor-not-allowed"
            }`}
            onClick={() => {
              setShowAddArticle(false);
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
            {addAndEditLoading ? t("Submitting").concat("...") : t("Submit")}
          </button>
        </div>
      </div>
      {/* main div */}
      <div className="md:p-8 p-4 grid md:grid-cols-2 md:gap-5 gap-3 place-items-start items-start rounded-md shadow-md bg-white">
        <div className="text-left space-y-2 col-span-full">
          <label htmlFor="image" className="Label">
            {t("Image")}
          </label>
          <div className="relative md:w-24 w-20 h-24">
            {prevImage !== null ? (
              <>
                <img
                  src={prevImage}
                  alt=""
                  className="h-full w-full object-contain object-center rounded-full border"
                />
                <input
                  type="file"
                  name="image"
                  id="image"
                  className="text-3xl cursor-pointer opacity-0 z-10 absolute bottom-0 right-0 rounded-full text-white h-full w-full p-1"
                  {...register("image", {
                    required: true,
                    onChange: (e) => {
                      handleImageUpload(e);
                    },
                  })}
                  accept="image/*"
                />
              </>
            ) : (
              <>
                <input
                  type="file"
                  name="image"
                  id="image"
                  className="text-3xl cursor-pointer opacity-0 z-10 absolute bottom-0 right-0 rounded-full text-white h-full w-full p-1"
                  aria-invalid={errors.image ? "true" : "false"}
                  {...register("image", {
                    required: true,
                    onChange: (e) => {
                      handleImageUpload(e);
                    },
                  })}
                  accept="image/*"
                />
                <BiImageAdd
                  role="button"
                  className="text-3xl absolute z-0 bottom-0 right-0 rounded-full bg-gray-300 text-black md:h-24 md:w-24 w-20 h-20 p-5"
                />
              </>
            )}
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
        {/*fr content */}
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
          <select {...register("category")} className="input_field">
            <option label="choose category"></option>
            {categories.map((category) => (
              <option value={category?._id} key={category?._id}>
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
  );
};

export default AddArticle;
