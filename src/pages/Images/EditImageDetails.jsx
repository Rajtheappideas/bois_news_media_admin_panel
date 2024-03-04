import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import { useNavigate } from "react-router";
import { handleEditImage } from "../../redux/ImageSlice";
import Sidebar from "../../components/Sidebar";
import { Helmet } from "react-helmet";
import Header from "../../components/Header";
import { PublicS3Url } from "../../BaseUrl";
import { HiPencil } from "react-icons/hi2";

const EditImageDetails = () => {
  const [prevImage, setPrevImage] = useState(null);
  const [Image, setImage] = useState(null);

  const { addAndEditLoading, loading, singleImage } = useSelector(
    (state) => state.root.image
  );

  const { token } = useSelector((state) => state.root.auth);

  const { isSidebarOpen } = useSelector((state) => state.root.globalStates);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { t } = useTranslation();

  const { abortApiCall, AbortControllerRef } = useAbortApiCall();

  const editimage = yup.object({
    frcontent: yup.string(),
    encontent: yup.string(),
    url: yup.string(),
    name: yup.string().required("name is required"),
    website: yup.string().required("website is required"),
    image: yup
      .mixed()
      .required(t("Image is required."))
      .test(Image !== null, t("Image is required."), () => {
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
    resolver: yupResolver(editimage),
    defaultValues: {
      frcontent: singleImage?.fr?.content,
      encontent: singleImage?.en?.content,
      name: singleImage?.name,
      url: singleImage?.url,
      website: singleImage?.website,
    },
  });

  const onSubmit = (data) => {
    const { name, frcontent, encontent, url, website } = data;
    toast.remove();
    const response = dispatch(
      handleEditImage({
        name,
        encontent,
        frcontent,
        url,
        website,
        token,
        image: Image ? Image : singleImage?.image,
        id: singleImage?._id,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success(`${t("image edited successfully.")}`, {
            duration: 2000,
          });
          navigate("/images");
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
    setImage(file);
  };

  useEffect(() => {
    return () => {
      abortApiCall();
    };
  }, []);

  return (
    <>
      <Helmet title="Edit image | Bois news media" />
      <div className="w-full flex items-start lg:gap-3 flex-row h-auto">
        <Sidebar />
        <section
          className={`h-full space-y-5 bg-[#FBFBFB] min-h-screen ${
            isSidebarOpen ? "xl:w-10/12 lg:w-4/5 w-full" : "lg:w-[90%] w-full"
          }`}
        >
          <Header />
          {loading ? (
            <div className="data_not_found_And_Loading">{t("Loading")}...</div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full lg:space-y-5 space-y-3 lg:p-5 p-3"
            >
              {/* title + buttons */}
              <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
                <p className="font-semibold text-left lg:text-xl text-lg">
                  {t("Edit image details")}
                </p>
                <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
                  <button
                    className={`gray_button ${
                      addAndEditLoading && "cursor-not-allowed"
                    }`}
                    onClick={() => {
                      navigate("/images");
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
                        src={PublicS3Url.concat(singleImage?.image)}
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
                {/* Name */}
                <div className="w-full space-y-2">
                  <label htmlFor="name" className="Label">
                    {t("image name")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("Type here...")}
                    className="input_field"
                    {...register("name")}
                  />
                  <span className="error">{errors?.name?.message}</span>
                </div>
                {/* fr content */}
                <div className="w-full space-y-2">
                  <label htmlFor="frcontent" className="Label">
                    {t("france content on image")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("Type here...")}
                    className="input_field"
                    {...register("frcontent")}
                  />
                  <span className="error">{errors?.frcontent?.message}</span>
                </div>
                {/* en content */}
                <div className="w-full space-y-2">
                  <label htmlFor="encontent" className="Label">
                    {t("english content on image")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("Type here...")}
                    className="input_field"
                    {...register("encontent")}
                  />
                  <span className="error">{errors?.encontent?.message}</span>
                </div>
                {/* url */}
                <div className="w-full space-y-2">
                  <label htmlFor="url" className="Label">
                    {t("url")}
                  </label>
                  <input
                    {...register("url")}
                    placeholder="Enter url for image"
                    className="input_field"
                  />
                  <span className="error">{errors?.url?.message}</span>
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

export default EditImageDetails;
