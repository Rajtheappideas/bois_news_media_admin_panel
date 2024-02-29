import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import { handleAddCategory } from "../../redux/CategoryAndTagsSlice";
import { BiImageAdd } from "react-icons/bi";
import { useNavigate } from "react-router";

const AddCategory = ({ setShowAddCategory }) => {
  const [prevImage, setPrevImage] = useState(null);
  const [categoryImage, setCategoryImage] = useState(null);

  const { categoryAddAndEditLoading } = useSelector(
    (state) => state.root.categoryandtag
  );

  const { token } = useSelector((state) => state.root.auth);

  const { language } = useSelector((state) => state.root.globalStates);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { t } = useTranslation();

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const addCategory = yup.object({
    frname: yup.string().required("france name is required"),
    enname: yup.string(),
    website: yup.string().required("website is required"),
    image: yup
      .mixed()
      .required(t("Image is required."))
      .test(categoryImage !== null, t("Image is required."), () => {
        return true;
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    control,
  } = useForm({
    shouldFocusError: true,
    reValidateMode: "onChange",
    mode: "onChange",
    resolver: yupResolver(addCategory),
  });

  const onSubmit = (data) => {
    const { frname, enname, website } = data;
    toast.remove();
    const response = dispatch(
      handleAddCategory({
        token,
        lang: language,
        frname,
        enname,
        image: categoryImage,
        website,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success(`${t("category created successfully.")}`, {
            duration: 2000,
          });
          setShowAddCategory(false);
          navigate("/category");
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
    setCategoryImage(file);
  };

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
          {t("Add new category")}
        </p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            className={`gray_button ${
              categoryAddAndEditLoading && "cursor-not-allowed"
            }`}
            onClick={() => {
              setShowAddCategory(false);
              navigate("/category");
            }}
            disabled={categoryAddAndEditLoading}
            type="reset"
          >
            {t("Cancel")}
          </button>
          <button
            className={`green_button ${
              categoryAddAndEditLoading && "cursor-not-allowed"
            }`}
            type="submit"
            disabled={categoryAddAndEditLoading}
          >
            {categoryAddAndEditLoading
              ? t("Submitting").concat("...")
              : t("Submit")}
          </button>
        </div>
      </div>
      {/* main div */}
      <div className="md:p-8 p-4 grid md:grid-cols-2 md:gap-5 gap-3 place-items-start items-start rounded-md shadow-md bg-white md:space-y-5 space-y-3">
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
          <label htmlFor="frname" className="Label">
            {t("france name")}
          </label>
          <input
            type="text"
            placeholder={t("Type here...")}
            className="input_field"
            {...register("frname")}
          />
          <span className="error">{errors?.frname?.message}</span>
        </div>
        {/* en name */}
        <div className="w-full space-y-2">
          <label htmlFor="enname" className="Label">
            {t("english name")}
          </label>
          <input
            type="text"
            placeholder={t("Type here...")}
            className="input_field"
            {...register("enname")}
          />
          <span className="error">{errors?.enname?.message}</span>
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
  );
};

export default AddCategory;
