import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Helmet } from "react-helmet";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import {
  handleChangeSingleCategory,
  handleDeleteCategory,
  handleEditCategory,
  handleGetCategoryById,
} from "../../redux/CategoryAndTagsSlice";
import { handleLogout } from "../../redux/AuthSlice";
import { handleLogoutFromAllTabs } from "../../redux/GlobalStates";
import toast from "react-hot-toast";
import { PublicS3Url } from "../../BaseUrl";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import { HiPencil } from "react-icons/hi2";

const EditCategory = () => {
  const [prevImage, setPrevImage] = useState(null);
  const [categoryImage, setCategoryImage] = useState(null);

  const { token, role } = useSelector((state) => state.root.auth);

  const {
    categoryLoading,
    singleCategory,
    categoryRemoveLoading,
    categoryAddAndEditLoading,
  } = useSelector((state) => state.root.categoryandtag);

  const { isSidebarOpen, language } = useSelector(
    (state) => state.root.globalStates
  );

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const { t } = useTranslation();

  const { id } = useParams();

  const dispatch = useDispatch();

  const navigate = useNavigate();

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
  } = useForm({
    shouldFocusError: true,
    reValidateMode: "onChange",
    mode: "onChange",
    resolver: yupResolver(addCategory),
    defaultValues: {
      frname: singleCategory?.fr?.name,
      enname: singleCategory?.en?.name,
      website: singleCategory?.website,
    },
  });

  const onSubmit = (data) => {
    const { frname, enname, website } = data;
    toast.remove();
    const response = dispatch(
      handleEditCategory({
        token,
        lang: language,
        frname,
        enname,
        image: categoryImage ? categoryImage : singleCategory?.image,
        website,
        id: singleCategory?._id,
        showOnHomePage: singleCategory?.showOnHomePage,
        showOnNavbar: singleCategory?.showOnNavbar,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success(`${t("category edited successfully.")}`, {
            duration: 2000,
          });
          dispatch(handleChangeSingleCategory(null));
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

  const handleDeleteCategoryFunction = () => {
    if (window.confirm(t("Are you sure?"))) {
      const response = dispatch(
        handleDeleteCategory({
          token,
          id: singleCategory?._id,
          signal: AbortControllerRef,
        })
      );
      toast.loading("Deleting...");
      if (response) {
        response.then((res) => {
          if (res?.payload?.status === "success") {
            toast.remove();
            toast.success(
              `${singleCategory?.fr?.name} ${t(
                "category Deleted Successfully"
              )}.`
            );
            navigate("/category");
          } else if (res?.payload?.status === "error") {
            toast.remove();
            toast.error(res?.payload?.message);
          }
        });
      }
    }
  };

  useEffect(() => {
    const response = dispatch(
      handleGetCategoryById({ token, id, lang: language })
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
    return () => {
      abortApiCall();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet title="Edit Category | Bois news media" />
      <div className="w-full flex items-start lg:gap-3 flex-row h-auto">
        <Sidebar />
        <section
          className={`h-full space-y-5 bg-[#FBFBFB] min-h-screen ${
            isSidebarOpen ? "xl:w-10/12 lg:w-4/5 w-full" : "lg:w-[90%] w-full"
          }`}
        >
          <Header />
          {categoryLoading ? (
            <div className="data_not_found_And_Loading">{t("Loading")}...</div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full lg:space-y-5 space-y-3 lg:p-5 p-3"
            >
              {/* title + buttons */}
              <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
                <p
                  onClick={() => {
                    dispatch(handleChangeSingleCategory(null));
                    navigate("/category");
                  }}
                  className="font-semibold text-left lg:text-xl text-lg capitalize cursor-pointer"
                >
                  <MdOutlineKeyboardBackspace
                    size={25}
                    className="inline-block pb-1 mr-1"
                  />
                  {t("edit category Detail")}
                </p>
                <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
                  <button
                    className={`gray_button ${
                      categoryAddAndEditLoading && "cursor-not-allowed"
                    }`}
                    onClick={() => {
                      dispatch(handleChangeSingleCategory(null));
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
                  {role === "admin" && (
                    <button
                      className={`red_button ${
                        (categoryRemoveLoading || categoryAddAndEditLoading) &&
                        "cursor-not-allowed"
                      } `}
                      type="button"
                      disabled={
                        categoryRemoveLoading || categoryAddAndEditLoading
                      }
                      onClick={() => handleDeleteCategoryFunction()}
                    >
                      {categoryRemoveLoading
                        ? t("Deleting").concat("...")
                        : t("Delete")}
                    </button>
                  )}
                </div>
              </div>
              {/* main div */}
              <div className="md:p-8 p-4 grid md:grid-cols-2 md:gap-5 gap-3 place-items-start items-start rounded-md shadow-md bg-white md:space-y-5 space-y-3">
                <div className="text-left space-y-2 col-span-full">
                  <label htmlFor="image" className="Label">
                    {t("Image")}
                  </label>
                  <div className="relative md:w-24 w-20 h-24 block">
                    {prevImage === null ? (
                      <img
                        src={PublicS3Url.concat(singleCategory?.image)}
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
                  <label htmlFor="fnrame" className="Label">
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
          )}
        </section>
      </div>
    </>
  );
};

export default EditCategory;
