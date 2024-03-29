import React from "react";
import { BiImageAdd } from "react-icons/bi";
import { FaFileUpload } from "react-icons/fa";
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
import { handleAddNewMagazine } from "../../redux/MagazineSlice";
import { BsCloudUploadFill } from "react-icons/bs";
import { useTranslation } from "react-i18next";
<<<<<<< HEAD
=======
import RichTextEditor from "../RichTextEditor";
>>>>>>> raj_appideas

const AddnewMagazine = ({ setshowAddnewMagazine }) => {
  const [prevImage, setPrevImage] = useState(null);
  const [magazineImage, setmagazineImage] = useState(null);
  const [magazinePdf, setMagazinePdf] = useState(null);

  const { addNewMagazineLoading } = useSelector(
    (state) => state.root.magazines
  );
  const { token } = useSelector((state) => state.root.auth);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const addNewMagazineSchema = yup.object({
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
    pdf: yup
      .mixed()
      .required(t("please upload file"))
      .test(
        "fileSize",
        t("Only pdf up to 10MB are permitted."),
        (files) =>
          !files || // Check if `files` is defined
          files.length === 0 || // Check if `files` is not an empty list
          Array.from(files).every((file) => file.size <= 10000000)
      )
      .test("type", t("Only .pdf formats are accepted."), (value) => {
        return value && value[0]?.type === "application/pdf";
      }),
    stock: yup
      .string()
      .required(t("stock is required"))

      .typeError(t("stock is required")),
    priceDigital: yup.string().required(t("digital price is required")),
    pricePaper: yup.string().required(t("paper price is required")),
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
    formState: { errors },
    getValues,
<<<<<<< HEAD
=======
    setValue,
    control,
>>>>>>> raj_appideas
  } = useForm({
    shouldFocusError: true,
    reValidateMode: "onChange",
    mode: "onChange",
    resolver: yupResolver(addNewMagazineSchema),
    defaultValues: {
      image: magazineImage,
      pdf: magazinePdf,
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
    const response = dispatch(
      handleAddNewMagazine({
        title,
        priceDigital,
        pricePaper,
        magazineTitle,
        pdf: magazinePdf,
        stock,
        status,
        description,
<<<<<<< HEAD
=======
        detailDescription,
>>>>>>> raj_appideas
        image: magazineImage,
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
          toast.success(` ${title} ${t("magazine added Successfully")}.`, {
            duration: 3000,
          });
          setshowAddnewMagazine(false);
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

  // file upload
  const handleFileUpload = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
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

  useEffect(() => {
    return () => {
      abortApiCall();
    };
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full lg:space-y-5 space-y-3"
    >
      {/* title + buttons */}
      <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
        <p className="font-semibold text-left lg:text-xl text-lg">
          {t("Add new magazine")}
        </p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            className={`gray_button  ${
              addNewMagazineLoading && "cursor-not-allowed"
            }`}
            onClick={() => setshowAddnewMagazine(false)}
            type="button"
            disabled={addNewMagazineLoading}
          >
            {t("Cancel")}
          </button>
          <button
            className={`green_button ${
              addNewMagazineLoading && "cursor-not-allowed"
            }`}
            type="submit"
            disabled={addNewMagazineLoading}
          >
            {addNewMagazineLoading ? t("Saving").concat("...") : t("Save")}
          </button>
        </div>
      </div>
      {/* main div */}
      <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
        <div className=" w-full flex items-start md:gap-x-10 gap-x-4">
          {/* image */}
          <div className="text-center">
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
          {/* pdf */}
          <div className="text-center">
            <label htmlFor="pdf" className="Label">
              Pdf
            </label>

            <div className="relative md:w-24 w-20 h-24">
              <input
                type="file"
                className="text-3xl cursor-pointer opacity-0 z-10 absolute bottom-0 right-0 rounded-full text-white h-full w-full p-1"
                {...register("pdf", {
                  required: true,
                  onChange: (e) => {
                    handleFileUpload(e);
                  },
                })}
                accept="application/pdf"
              />
              {magazinePdf === null ? (
                <BsCloudUploadFill
                  role="button"
                  className="text-3xl absolute z-0 bottom-0 right-0 rounded-full bg-gray-300 text-black md:h-24 md:w-24 w-20 h-20 p-5"
                />
              ) : (
                <p className="text-sm text-center absolute z-0 bottom-0 right-0 rounded-full bg-gray-300 text-black md:h-24 md:w-24 w-20 h-20 p-5">
                  <span className="block">{magazinePdf?.name}</span>
                  <span className="block">{niceBytes(magazinePdf?.size)}</span>
                </p>
              )}
            </div>
            <span className="error">{errors?.pdf?.message}</span>
          </div>
        </div>

        <p className="font-bold text-black md:text-xl">Magazine details</p>
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
          <div className="w-full space-y-2">
            <label htmlFor="digital_price" className="Label">
              {t("digital price")}
=======
          {/*digital price */}
          <div className="w-full space-y-2">
            <label htmlFor="digital_price" className="Label">
              {t("Digital price")}
>>>>>>> raj_appideas
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
            <span className="error">{errors?.priceDigital?.message}</span>
          </div>
<<<<<<< HEAD
          {/* paper price */}
          <div className="w-full space-y-2">
            <label htmlFor="paper_price" className="Label">
              {t("paper price")}
=======
          {/*paper price */}
          <div className="w-full space-y-2">
            <label htmlFor="paper_price" className="Label">
              {t("Paper price")}
>>>>>>> raj_appideas
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
            <select {...register("magazineTitle")} className="input_field">
              <option label="choose magazine"></option>
              <option value="boismag">BOISmag</option>
              <option value="agenceur">Agenceur</option>
              <option value="artisans_and_bois">Artisans & Bois</option>
              <option value="toiture">Toiture</option>
            </select>
            <span className="error">{errors?.magazineTitle?.message}</span>
          </div>
<<<<<<< HEAD
=======
          {/* description */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="description" className="Label">
              {t("description")}
            </label>
            <textarea {...register("description")} className="input_field" />
            <span className="error">{errors?.description?.message}</span>
          </div>
>>>>>>> raj_appideas
          {/* summary */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="summary" className="Label">
              {t("summary")}
            </label>
<<<<<<< HEAD
            <textarea
              placeholder={t("Type here...")}
              {...register("description")}
              className="input_field"
            />
            <span className="error">{errors?.description?.message}</span>
=======
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
            <span className="error">{errors?.detailDescription?.message}</span>
>>>>>>> raj_appideas
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddnewMagazine;
