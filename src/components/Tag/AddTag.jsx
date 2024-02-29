import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import { handleAddTag } from "../../redux/CategoryAndTagsSlice";
import { useNavigate } from "react-router";

const AddTag = ({ setShowAddTag }) => {
  const { tagAddAndEditLoading } = useSelector(
    (state) => state.root.categoryandtag
  );

  const { token } = useSelector((state) => state.root.auth);

  const { language } = useSelector((state) => state.root.globalStates);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { t } = useTranslation();

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const addTag = yup.object({
    name: yup.string().required("name is required"),
    website: yup.string().required("website is required"),
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
    resolver: yupResolver(addTag),
  });

  const onSubmit = (data) => {
    const { name, website } = data;
    toast.remove();
    const response = dispatch(
      handleAddTag({
        token,
        lang: language,
        name,
        website,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success(`${t("tag created successfully.")}`, {
            duration: 2000,
          });
          setShowAddTag(false);
          navigate("/tags");
        } else if (res?.payload?.status === "error") {
          toast.error(res?.payload?.message);
        }
      });
    }
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
          {t("Add new tag")}
        </p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            className={`gray_button ${
              tagAddAndEditLoading && "cursor-not-allowed"
            }`}
            onClick={() => {
              setShowAddTag(false);
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
            {tagAddAndEditLoading ? t("Submitting").concat("...") : t("Submit")}
          </button>
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
  );
};

export default AddTag;
