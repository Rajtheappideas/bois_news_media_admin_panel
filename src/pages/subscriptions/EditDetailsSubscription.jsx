import React from "react";
import { HiPencil } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useEffect } from "react";
import {
  handleChangeDeleteID,
  handleChangeSingleSubscription,
  handleDeleteSubscription,
  handleDeletesUBSCRIPTION,
  handleEditSubscription,
  handleGetSubscriptionById,
} from "../../redux/SubscriptionSlice";
import BaseUrl from "../../BaseUrl";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

const EditDetailsSubscription = () => {
  const [prevImage, setPrevImage] = useState(null);
  const [subscriptionImage, setSubscriptionImage] = useState(null);

  const {
    deleteSubscriptionLoading,
    editSubscriptionLoading,
    singleSubscription,
    singleSubscriptionLoading,
  } = useSelector((state) => state.root.subscriptions);
  const { token, role } = useSelector((state) => state.root.auth);
  const { isSidebarOpen } = useSelector((state) => state.root.globalStates);

  // const { title, price, status, description, image, _id, magazineTitle } =
  //   singleSubscription;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const state = useLocation().state;

  const { t } = useTranslation();

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const editSubscriptionSchema = yup.object({
    title: yup.string().required(t("title is required")),
    status: yup.string().required(t("status is required")),
    description: yup.string().required(t("description is required")),
    price: yup.string().required(t("price is required")),
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
    getValues,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    shouldFocusError: true,
    reValidateMode: "onChange",
    mode: "onChange",
    resolver: yupResolver(editSubscriptionSchema),
    defaultValues: {
      title: singleSubscription?.title,
      price: singleSubscription?.price,
      status: singleSubscription?.status,
      description: singleSubscription?.description,
      image: singleSubscription?.image,
      magazineTitle: singleSubscription?.magazineTitle,
    },
  });

  const onSubmit = (data) => {
    const { title, price, description, status, magazineTitle } = data;
    if (!isDirty) {
      return true;
    }
    const response = dispatch(
      handleEditSubscription({
        title,
        price,
        status,
        description,
        image: subscriptionImage,
        magazineTitle,
        id: state?._id,
        token,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success(` ${title} ${t("subscription edited Successfully")}.`, {
            duration: 2000,
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
    setSubscriptionImage(file);
  };

  const handleDeletesubscription = (id, name) => {
    if (window.confirm(t("Are you sure?"))) {
      dispatch(handleChangeDeleteID(id));

      const response = dispatch(
        handleDeletesUBSCRIPTION({ id, token, signal: AbortControllerRef })
      );
      if (response) {
        response.then((res) => {
          if (res?.payload?.status === "success") {
            dispatch(handleDeleteSubscription(id));
            toast.success(`${name} ${t("subscription Deleted Successfully")}.`);
            navigate("/subscriptions");
          } else if (res?.payload?.status === "error") {
            toast.error(res?.payload?.message);
          }
        });
      }
    }
  };

  const handleFetchSingleSubscription = () => {
    if (singleSubscription !== null) return;
    const response = dispatch(
      handleGetSubscriptionById({
        id: state?._id,
        token,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status !== "success") {
          navigate(`/prospects`);
        } else {
          const subscriptionDetails = res?.payload?.subscription;
          for (const key in res?.payload?.subscription) {
            if (Object.keys(getValues()).includes(key)) {
              setValue(key, subscriptionDetails[key]);
            }
          }
        }
      });
    }
  };

  const handleOnClickCancel = () => {
    dispatch(handleChangeSingleSubscription());
    navigate("/subscriptions");
  };

  useEffect(() => {
    if (state === null) {
      navigate("/subscriptions");
    }
    handleFetchSingleSubscription();
    return () => {
      abortApiCall();
    };
  }, []);

  return (
    <>
      {singleSubscriptionLoading ? (
        <div className="data_not_found_And_Loading">{t("Loading")}...</div>
      ) : (
        <div className="w-full flex items-start lg:gap-3 flex-row h-auto">
          <Sidebar />
          <section
            className={`h-full space-y-5 bg-[#FBFBFB] min-h-screen ${isSidebarOpen ? "xl:w-10/12 lg:w-4/5 w-full" : "lg:w-[90%] w-full"
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
                  {t("Subscriptions details")}{" "}
                </p>
                <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
                  <button
                    className={`gray_button ${(editSubscriptionLoading || deleteSubscriptionLoading) &&
                      "cursor-not-allowed"
                      } `}
                    disabled={
                      deleteSubscriptionLoading || editSubscriptionLoading
                    }
                    type="button"
                    onClick={() => handleOnClickCancel()}
                  >
                    {t("Cancel")}
                  </button>
                  <button
                    className={`green_button ${(editSubscriptionLoading || deleteSubscriptionLoading) &&
                      "cursor-not-allowed"
                      } `}
                    disabled={
                      deleteSubscriptionLoading || editSubscriptionLoading
                    }
                    type="submit"
                  >
                    {editSubscriptionLoading
                      ? t("Saving").concat("...")
                      : t("Save")}
                  </button>
                  {role === "admin" && (
                    <button
                      className={`red_button ${(editSubscriptionLoading ||
                        deleteSubscriptionLoading) &&
                        "cursor-not-allowed"
                        } `}
                      disabled={
                        deleteSubscriptionLoading || editSubscriptionLoading
                      }
                      type="button"
                      onClick={() =>
                        handleDeletesubscription(state?._id, state?.title)
                      }
                    >
                      {deleteSubscriptionLoading ? t("Deleting") : t("Delete")}
                    </button>
                  )}
                </div>
              </div>
              {/* main div */}
              <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
                <div className="relative md:w-24 w-20 block">
                  {prevImage === null ? (
                    <img
                      src={BaseUrl.concat(state?.image)}
                      alt=""
                      className="rounded-full md:h-24 md:w-24 w-20 h-20 border"
                    />
                  ) : (
                    <img
                      src={prevImage}
                      alt=""
                      className="rounded-full md:h-24 md:w-24 w-20 h-20 border"
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

                <p className="font-bold text-black md:text-xl">
                  Subscription details
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
                  {/* price */}
                  <div className="w-full space-y-2">
                    <label htmlFor="price" className="Label">
                      {t("price")}
                    </label>
                    <input
                      type="number"
                      placeholder="Type here..."
                      className="input_field"
                      {...register("price")}
                    />
                    <span className="error">{errors?.price?.message}</span>
                  </div>

                  {/* descriptions */}
                  <div className="w-full col-span-full space-y-2">
                    <label htmlFor="descriptions" className="Label">
                      {t("descriptions")}
                    </label>
                    <textarea
                      placeholder="Type here..."
                      className="input_field"
                      {...register("description")}
                    />
                    <span className="error">
                      {errors?.description?.message}
                    </span>
                  </div>
                </div>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
};

export default EditDetailsSubscription;
