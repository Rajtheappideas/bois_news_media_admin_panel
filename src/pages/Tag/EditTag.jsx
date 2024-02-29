import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import {
  handleAddTag,
  handleDeleteTag,
  handleEditTag,
  handleGetTagById,
} from "../../redux/CategoryAndTagsSlice";
import { useNavigate, useParams } from "react-router";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { handleLogout } from "../../redux/AuthSlice";
import { handleLogoutFromAllTabs } from "../../redux/GlobalStates";
import { Helmet } from "react-helmet";

const EditTag = () => {
  const { tagAddAndEditLoading, tagLoading, singelTag, tagRemoveLoading } =
    useSelector((state) => state.root.categoryandtag);

  const { token, role } = useSelector((state) => state.root.auth);

  const { isSidebarOpen, language } = useSelector(
    (state) => state.root.globalStates
  );

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { t } = useTranslation();

  const { id } = useParams();

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const addTag = yup.object({
    name: yup.string().required("name is required"),
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
    resolver: yupResolver(addTag),
    defaultValues: { name: singelTag?.name, website: singelTag?.website },
  });

  const onSubmit = (data) => {
    const { name, website } = data;
    toast.remove();
    const response = dispatch(
      handleEditTag({
        token,
        lang: language,
        name,
        id: singelTag?._id,
        website,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success(`${t("tag edited successfully.")}`, {
            duration: 2000,
          });
          navigate("/tags");
        } else if (res?.payload?.status === "error") {
          toast.error(res?.payload?.message);
        }
      });
    }
  };

  const handleDeleteTagFunction = () => {
    if (window.confirm(t("Are you sure?"))) {
      const response = dispatch(
        handleDeleteTag({
          token,
          id: singelTag?._id,
          signal: AbortControllerRef,
        })
      );
      toast.loading("Deleting...");
      if (response) {
        response.then((res) => {
          if (res?.payload?.status === "success") {
            toast.remove();
            toast.success(
              `${singelTag?.name} ${t("tag Deleted Successfully")}.`
            );
            navigate("/tags");
          } else if (res?.payload?.status === "error") {
            toast.remove();
            toast.error(res?.payload?.message);
          }
        });
      }
    }
  };

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
    return () => {
      abortApiCall();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet title="Edit Tag | Bois news media" />
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
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full lg:space-y-5 space-y-3 lg:p-5 p-3"
            >
              {/* title + buttons */}
              <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
                <p className="font-semibold text-left lg:text-xl text-lg">
                  {t("Edit tag details")}
                </p>
                <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
                  <button
                    className={`gray_button ${
                      tagAddAndEditLoading && "cursor-not-allowed"
                    }`}
                    onClick={() => {
                      navigate("/tags");
                    }}
                    disabled={tagAddAndEditLoading}
                    type="reset"
                  >
                    {t("Cancel")}
                  </button>
                  <button
                    className={`green_button ${
                      tagAddAndEditLoading && "cursor-not-allowed"
                    }`}
                    type="submit"
                    disabled={tagAddAndEditLoading}
                  >
                    {tagAddAndEditLoading
                      ? t("Submitting").concat("...")
                      : t("Submit")}
                  </button>
                  {role === "admin" && (
                    <button
                      className={`red_button ${
                        (tagRemoveLoading ||
                          tagLoading ||
                          tagAddAndEditLoading) &&
                        "cursor-not-allowed"
                      } `}
                      type="button"
                      disabled={
                        tagRemoveLoading || tagLoading || tagAddAndEditLoading
                      }
                      onClick={() => handleDeleteTagFunction()}
                    >
                      {tagRemoveLoading
                        ? t("Deleting").concat("...")
                        : t("Delete")}
                    </button>
                  )}
                </div>
              </div>
              {/* main div */}
              <div className="md:p-8 p-4 grid md:grid-cols-2 md:gap-5 gap-3 place-items-start items-start rounded-md shadow-md bg-white">
                {/* name */}
                <div className="w-full space-y-2">
                  <label htmlFor="rame" className="Label">
                    {t("Name")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("Type here...")}
                    className="input_field"
                    {...register("name")}
                  />
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

export default EditTag;
