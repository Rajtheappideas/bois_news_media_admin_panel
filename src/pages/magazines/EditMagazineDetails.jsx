import React from "react";
import { HiPencil } from "react-icons/hi";
<<<<<<< HEAD
import { useForm } from "react-hook-form";
=======
import { Controller, useForm } from "react-hook-form";
>>>>>>> raj_appideas
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useEffect } from "react";
import {
  handleChangeDeleteID,
  handleChangeSingleMagazine,
  handleDeleteMAGAZINE,
  handleDeleteMagazine,
  handleEditMagazine,
  handleGetMagazineById,
} from "../../redux/MagazineSlice";
<<<<<<< HEAD
import BaseUrl from "../../BaseUrl";
=======
import { PublicS3Url } from "../../BaseUrl";
>>>>>>> raj_appideas
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
<<<<<<< HEAD
=======
import RichTextEditor from "../../components/RichTextEditor";
>>>>>>> raj_appideas

const EditMagazineDetails = () => {
  const [prevImage, setPrevImage] = useState(null);
  const [magazineImage, setmagazineImage] = useState(null);
<<<<<<< HEAD
  const [magazinePdf, setMagazinePdf] = useState(null);
=======
>>>>>>> raj_appideas

  const {
    singleMagazine,
    editMagazineLoading,
    deleteMagazineLoading,
    singleMagazineLoading,
  } = useSelector((state) => state.root.magazines);
  const { token, role } = useSelector((state) => state.root.auth);
  const { isSidebarOpen } = useSelector((state) => state.root.globalStates);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const state = useLocation().state;

  const { t } = useTranslation();

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const editMagazineSchema = yup.object({
    title: yup.string().required(t("title is required")),
    status: yup.string().required(t("status is required")),
    description: yup.string().required(t("description is required")),
<<<<<<< HEAD
=======
    detailDescription: yup
      .string()
      .required(t("detail description is required")),
>>>>>>> raj_appideas
    magazineTitle: yup.string().required(t("select magazine")),

    stock: yup
      .string()
      .required(t("stock is required"))
      .typeError(t("stock is required")),
<<<<<<< HEAD
    priceDigital: yup.string().required(t("digital price is required")),
    pricePaper: yup.string().required(t("paper price is required")),
=======
    priceDigital: yup.string().required(t("price is required")),
    pricePaper: yup.string().required(t("price is required")),

>>>>>>> raj_appideas
    image: yup
      .mixed()
      .required(t("Image is required."))
      .test(magazineImage !== null, t("Image is required."), () => {
        return true;
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    getValues,
    setValue,
    control,
  } = useForm({
    shouldFocusError: true,
    reValidateMode: "onChange",
    mode: "onChange",
    resolver: yupResolver(editMagazineSchema),
    defaultValues: {
      title: singleMagazine?.title,
      priceDigital: singleMagazine?.priceDigital,
      pricePaper: singleMagazine?.pricePaper,
      status: singleMagazine?.status,
      description: singleMagazine?.description,
<<<<<<< HEAD
=======
      detailDescription: singleMagazine?.detailDescription,
>>>>>>> raj_appideas
      image: singleMagazine?.image,
      stock: singleMagazine?.stock,
      magazineTitle: singleMagazine?.magazineTitle,
      pdf: singleMagazine?.pdf,
    },
  });

  const onSubmit = (data) => {
    const {
      title,
      priceDigital,
      pricePaper,
      stock,
      description,
      status,
      magazineTitle,
<<<<<<< HEAD
=======
      detailDescription,
>>>>>>> raj_appideas
    } = data;
    if (!isDirty) {
      return true;
    }
    const response = dispatch(
      handleEditMagazine({
        title,
        priceDigital,
        pricePaper,
        magazineTitle,
        pdf: singleMagazine?.pdf,
        stock,
        status,
        description,
<<<<<<< HEAD
=======
        detailDescription,
>>>>>>> raj_appideas
        image: magazineImage,
        id: state?._id,
        token,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
<<<<<<< HEAD
=======
          toast.remove();
>>>>>>> raj_appideas
          toast.success(` ${title} ${t("magazine edited Successfully")}.`, {
            duration: 3000,
          });
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
    setmagazineImage(file);
  };

<<<<<<< HEAD
  // file upload
  const handleFileUpload = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    // setPrevImage(URL.createObjectURL(file));
    setMagazinePdf(file);
  };

  const units = ["bytes", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"];

  function niceBytes(x) {
    let l = 0,
      n = parseInt(x, 10) || 0;

    while (n >= 1024 && ++l) {
      n = n / 1024;
    }

    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
  }

=======
>>>>>>> raj_appideas
  const handleDeletemagazine = (id) => {
    if (window.confirm(t("Are you sure?"))) {
      dispatch(handleChangeDeleteID(id));

      const response = dispatch(
        handleDeleteMAGAZINE({ id, token, signal: AbortControllerRef })
      );
      if (response) {
        response.then((res) => {
          if (res?.payload?.status === "success") {
            dispatch(handleDeleteMagazine(id));
            toast.success(
              `${singleMagazine?.title} ${t("magazine Deleted Successfully")}.`
            );
            navigate("/magazines");
          } else if (res?.payload?.status === "error") {
            toast.error(res?.payload?.message);
          }
        });
      }
    }
  };

  const handleFetchSingleMagazine = () => {
    if (singleMagazine !== null) return;
    const response = dispatch(
      handleGetMagazineById({
        id: state?._id,
        token,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status !== "success") {
          navigate(`/magazines`);
        } else {
          const userDetails = res?.payload?.magazine;
          for (const key in res?.payload?.magazine) {
            if (Object.keys(getValues()).includes(key)) {
              setValue(key, userDetails[key]);
            }
          }
        }
      });
    }
  };

  const handleOnClickCancel = () => {
    dispatch(handleChangeSingleMagazine());
    navigate("/magazines");
  };

  // fetch user
  useEffect(() => {
    handleFetchSingleMagazine();
    if (state === null) {
      navigate("/magazines");
    }
    return () => {
      abortApiCall();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {singleMagazineLoading ? (
        <div className="data_not_found_And_Loading">{t("Loading")}...</div>
      ) : (
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
                  {t("Magazine details")}
                </p>
                <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
<<<<<<< HEAD
                  {/* <button
            type="button"
            className="text-green-500 border border-green-400 font-medium text-center md:w-32 w-24 h-10 rounded-lg p-2 hover:bg-green-200 active:scale-95 transition"
          >
            <a href={BaseUrl.concat(pdf)} download target="_blank">
              {t("Download")}
            </a>
          </button> */}
=======
>>>>>>> raj_appideas
                  <button
                    className={`gray_button ${
                      (editMagazineLoading || deleteMagazineLoading) &&
                      "cursor-not-allowed"
                    } `}
                    onClick={() => handleOnClickCancel()}
                    type="button"
                    disabled={editMagazineLoading || deleteMagazineLoading}
                  >
                    {t("Cancel")}
                  </button>
                  <button
                    className={`green_button ${
                      (editMagazineLoading || deleteMagazineLoading) &&
                      "cursor-not-allowed"
                    } `}
                    type="submit"
                    disabled={editMagazineLoading || deleteMagazineLoading}
                  >
                    {editMagazineLoading
                      ? t("Saving").concat("...")
                      : t("Save")}
                  </button>
                  {role === "admin" && (
                    <button
                      className={`red_button ${
                        (editMagazineLoading || deleteMagazineLoading) &&
                        "cursor-not-allowed"
                      } `}
                      type="button"
                      disabled={editMagazineLoading || deleteMagazineLoading}
                      onClick={() => handleDeletemagazine(singleMagazine?._id)}
                    >
                      {deleteMagazineLoading
                        ? t("Deleting").concat("...")
                        : t("Delete")}
                    </button>
                  )}
                </div>
              </div>
              {/* main div */}
              <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
                <div className=" w-full flex items-start md:gap-x-10 gap-x-4">
                  <div className="text-center">
                    <label htmlFor="image" className="Label">
                      {t("Image")}
                    </label>
                    <div className="relative md:w-24 w-20 h-24 block">
                      {prevImage === null ? (
                        <img
<<<<<<< HEAD
                          src={BaseUrl.concat(singleMagazine?.image)}
=======
                          src={PublicS3Url.concat(singleMagazine?.image)}
>>>>>>> raj_appideas
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
                </div>

                <p className="font-bold text-black md:text-xl">
                  {t("Magazine details")}
                </p>
                {/* personal details */}
                <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
                  {/* title */}
                  <div className="w-full space-y-2">
                    <label htmlFor="title" className="Label">
                      {t("title")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("Type here...")}
                      className="input_field"
                      {...register("title")}
                    />
                    <span className="error">{errors?.title?.message}</span>
                  </div>
<<<<<<< HEAD
                  {/* digital price */}
=======
                  {/*digital price */}
>>>>>>> raj_appideas
                  <div className="w-full space-y-2">
                    <label htmlFor="digital_price" className="Label">
                      {t("Digital price")}
                    </label>
                    <input
                      type="number"
                      placeholder={t("Type here...")}
                      className="input_field"
<<<<<<< HEAD
=======
                      step="0.0001"
>>>>>>> raj_appideas
                      {...register("priceDigital")}
                    />
                    <span className="error">
                      {errors?.priceDigital?.message}
                    </span>
                  </div>
                  {/*paper price */}
                  <div className="w-full space-y-2">
                    <label htmlFor="paper_price" className="Label">
                      {t("Paper price")}
                    </label>
                    <input
                      type="number"
                      placeholder={t("Type here...")}
                      className="input_field"
<<<<<<< HEAD
=======
                      step="0.0001"
>>>>>>> raj_appideas
                      {...register("pricePaper")}
                    />
                    <span className="error">{errors?.pricePaper?.message}</span>
                  </div>
<<<<<<< HEAD
=======

>>>>>>> raj_appideas
                  {/* stock */}
                  <div className="w-full space-y-2">
                    <label htmlFor="stock" className="Label">
                      {t("stock")}
                    </label>
                    <input
                      type="number"
                      placeholder={t("Type here...")}
                      className="input_field"
                      {...register("stock")}
                    />
                    <span className="error">{errors?.stock?.message}</span>
                  </div>
                  {/* status */}
                  <div className="w-full space-y-2">
                    <label htmlFor="status" className="Label">
                      {t("status")}
                    </label>
                    <select {...register("status")} className="input_field">
                      <option label="choose status"></option>
                      <option value="active">{t("active")}</option>
                      <option value="deactive">{t("deactive")}</option>
                    </select>
                    <span className="error">{errors?.status?.message}</span>
                  </div>
                  {/* magazines */}
                  <div className="w-full space-y-2">
                    <label htmlFor="magazineTitle" className="Label">
                      {t("Magazine")}
                    </label>
                    <select
                      {...register("magazineTitle")}
                      className="input_field"
                    >
                      <option label="choose magazine"></option>
                      <option value="boismag">BOISmag</option>
                      <option value="agenceur">Agenceur</option>
                      <option value="artisans_and_bois">Artisans & Bois</option>
                      <option value="toiture">Toiture</option>
                    </select>
                    <span className="error">
                      {errors?.magazineTitle?.message}
                    </span>
                  </div>
                  {/* summary */}
                  <div className="w-full col-span-full space-y-2">
<<<<<<< HEAD
                    <label htmlFor="summary" className="Label">
                      {t("summary")}
                    </label>
                    <textarea
                      placeholder={t("Type here...")}
                      {...register("description")}
                      className="input_field"
                    />
=======
                    <label htmlFor="description" className="Label">
                      {t("description")}
                    </label>
                    <textarea
                      {...register("description")}
                      className="input_field"
                    ></textarea>
>>>>>>> raj_appideas
                    <span className="error">
                      {errors?.description?.message}
                    </span>
                  </div>
<<<<<<< HEAD
=======
                  {/* summary */}
                  <div className="w-full col-span-full space-y-2">
                    <label htmlFor="summary" className="Label">
                      {t("summary")}
                    </label>
                    <Controller
                      control={control}
                      name={"detailDescription"}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <RichTextEditor
                          onBlur={onBlur}
                          value={value}
                          setValue={setValue}
                        />
                      )}
                    />
                    <span className="error">
                      {errors?.detailDescription?.message}
                    </span>
                  </div>
>>>>>>> raj_appideas
                </div>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
};

export default EditMagazineDetails;
