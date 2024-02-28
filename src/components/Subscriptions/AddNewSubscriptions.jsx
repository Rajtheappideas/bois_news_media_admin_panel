import React from "react";
import { BiImageAdd } from "react-icons/bi";
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
import { handleAddNewSubscription } from "../../redux/SubscriptionSlice";
import { useTranslation } from "react-i18next";
<<<<<<< HEAD
=======
import RichTextEditor from "../RichTextEditor";
>>>>>>> raj_appideas

const AddNewSubscriptions = ({ setShowAddnewSubscription }) => {
  const [prevImage, setPrevImage] = useState(null);
  const [subscriptionImage, setSubscriptionImage] = useState(null);

  const { addNewSubscriptionLoading } = useSelector(
    (state) => state.root.subscriptions
  );
  const { magazines } = useSelector((state) => state.root.magazines);
  const { token } = useSelector((state) => state.root.auth);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const addNewSubscriptionSchema = yup.object({
    title: yup.string().required(t("title is required")),
    status: yup.string().required(t("status is required")),
    description: yup.string().required(t("description is required")),
<<<<<<< HEAD
    priceDigital: yup.string().required(t("digital price is required")),
    pricePaper: yup.string().required(t("paper price is required")),
=======
    detailDescription: yup
      .string()
      .required(t("detail description is required")),
    priceDigital: yup.string().required(t("digital price is required")),
    pricePaperFrance: yup.string().required(t("paper price is required")),
    pricePaperEEC: yup.string().required(t("paper price is required")),
    pricePaperRestOfWorld: yup.string().required(t("paper price is required")),
>>>>>>> raj_appideas
    image: yup
      .mixed()
      .required(t("Image is required."))
      .test(subscriptionImage !== null, t("Image is required"), () => {
        return true;
      }),
    magazineTitle: yup.string().required("choose magazine"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    control,
<<<<<<< HEAD
=======
    setValue,
>>>>>>> raj_appideas
  } = useForm({
    shouldFocusError: true,
    reValidateMode: "onChange",
    mode: "onChange",
    resolver: yupResolver(addNewSubscriptionSchema),
    defaultValues: {
      image: subscriptionImage,
    },
  });

  const onSubmit = (data) => {
    const {
      title,
      priceDigital,
<<<<<<< HEAD
      pricePaper,
      description,
      status,
      magazineTitle,
    } = data;

=======
      pricePaperEEC,
      pricePaperRestOfWorld,
      pricePaperFrance,
      description,
      status,
      magazineTitle,
      detailDescription,
    } = data;
>>>>>>> raj_appideas
    const response = dispatch(
      handleAddNewSubscription({
        title,
        priceDigital,
<<<<<<< HEAD
        pricePaper,
        status,
        description,
=======
        pricePaperEEC,
        pricePaperFrance,
        pricePaperRestOfWorld,
        status,
        description,
        detailDescription,
>>>>>>> raj_appideas
        image: subscriptionImage,
        magazineTitle,
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
          toast.success(` ${title} ${t("subscription added Successfully")}.`, {
            duration: 2000,
          });
          setShowAddnewSubscription(false);
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
    setSubscriptionImage(file);
  };

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
          {t("Add new subscriptions")}
        </p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            className={`gray_button ${
              addNewSubscriptionLoading && "cursor-not-allowed"
            } `}
            disabled={addNewSubscriptionLoading}
            onClick={() => setShowAddnewSubscription(false)}
            type="button"
          >
            {t("Cancel")}
          </button>
          <button
            className={`green_button ${
              addNewSubscriptionLoading && "cursor-not-allowed"
            } `}
            type="submit"
            disabled={addNewSubscriptionLoading}
          >
            {addNewSubscriptionLoading ? t("Saving") : t("Save")}
          </button>
        </div>
      </div>
      {/* main div */}
      <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
        <div className="relative md:w-24 w-20 h-24 block">
          {prevImage !== null ? (
            <>
              <img
                src={prevImage}
                alt=""
                className="h-full w-full object-contain object-center rounded-full border"
              />
              <input
                type="file"
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
                className="text-3xl cursor-pointer opacity-0 z-10 absolute bottom-0 right-0 rounded-full text-white h-full w-full p-1"
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
        <p className="font-bold text-black md:text-xl">
          {t("Subscription details")}
        </p>
        {/* personal details */}
        <div className="w-full grid md:grid-cols-2 place-items-start items-center md:gap-5 gap-2">
          {/* title */}
          <div className="w-full space-y-2">
            <label htmlFor="title" className="Label">
              {t("title")}
            </label>
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
              {...register("title")}
            />
            <span className="error">{errors?.title?.message}</span>
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

          {/* magazine title */}
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
          {/* digital price */}
          <div className="w-full space-y-2">
            <label htmlFor="digital_price" className="Label">
              {t("digital price")}
            </label>
            <input
              type="number"
              placeholder="Type here..."
              className="input_field"
=======
          {/*digital price */}
          <div className="w-full space-y-2">
            <label htmlFor="digital_price" className="Label">
              {t("Digital price")}
            </label>
            <input
              type="number"
              placeholder={t("Type here...")}
              className="input_field"
              step="0.0001"
>>>>>>> raj_appideas
              {...register("priceDigital")}
            />
            <span className="error">{errors?.priceDigital?.message}</span>
          </div>
<<<<<<< HEAD
          {/*paper price */}
          <div className="w-full space-y-2">
            <label htmlFor="paper_price" className="Label">
              {t("paper price")}
            </label>
            <input
              type="number"
              placeholder="Type here..."
              className="input_field"
              {...register("pricePaper")}
            />
            <span className="error">{errors?.pricePaper?.message}</span>
          </div>

          {/* discriptions */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="discriptions" className="Label">
              {t("discriptions")}
            </label>
=======
          {/*france paper price */}
          <div className="w-full space-y-2">
            <label htmlFor="paper_price" className="Label">
              {t("France paper price")}
            </label>
            <input
              type="number"
              placeholder={t("Type here...")}
              className="input_field"
              step="0.0001"
              {...register("pricePaperFrance")}
            />
            <span className="error">{errors?.pricePaperFrance?.message}</span>
          </div>
          {/*eec paper price */}
          <div className="w-full space-y-2">
            <label htmlFor="paper_price" className="Label">
              {t("EEC/Switzerland/France Overseas Territories paper price")}
            </label>
            <input
              type="number"
              placeholder={t("Type here...")}
              className="input_field"
              step="0.0001"
              {...register("pricePaperEEC")}
            />
            <span className="error">{errors?.pricePaperEEC?.message}</span>
          </div>
          {/*rest paper price */}
          <div className="w-full space-y-2">
            <label htmlFor="paper_price" className="Label">
              {t("Rest of the world paper price")}
            </label>
            <input
              type="number"
              placeholder={t("Type here...")}
              className="input_field"
              step="0.0001"
              {...register("pricePaperRestOfWorld")}
            />
            <span className="error">
              {errors?.pricePaperRestOfWorld?.message}
            </span>
          </div>

          {/* descriptions */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="description" className="Label">
              {t("description")}
            </label>

>>>>>>> raj_appideas
            <textarea
              placeholder="Type here..."
              className="input_field"
              {...register("description")}
            />
            <span className="error">{errors?.description?.message}</span>
          </div>
<<<<<<< HEAD
=======
          {/* detail descriptions */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="detailDescription" className="Label">
              {t("Detail description")}
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

            <span className="error">{errors?.detailDescription?.message}</span>
          </div>
>>>>>>> raj_appideas
        </div>
      </div>
    </form>
  );
};

export default AddNewSubscriptions;
