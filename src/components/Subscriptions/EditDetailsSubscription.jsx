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
  handleDeleteSubscription,
  handleDeletesUBSCRIPTION,
  handleEditSubscription,
} from "../../redux/SubscriptionSlice";
import BaseUrl from "../../BaseUrl";

const EditDetailsSubscription = ({ setShowEditSubscription }) => {
  const [prevImage, setPrevImage] = useState(null);
  const [subscriptionImage, setSubscriptionImage] = useState(null);

  const {
    deleteSubscriptionLoading,
    editSubscriptionLoading,
    singleSubscription,
  } = useSelector((state) => state.root.subscriptions);
  const { token, role } = useSelector((state) => state.root.auth);

  const { title, price, status, description, image, _id } = singleSubscription;

  const dispatch = useDispatch();

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const editSubscriptionSchema = yup.object({
    title: yup.string().required("title is required").trim(),
    status: yup.string().required("status is required").trim(),
    description: yup.string().required("description is required").trim(""),
    price: yup
      .string()
      .required("price is required")
      .max(4, "maximum 4 numbers")
      .min(2, "minmum 2 numbers")
      .trim(""),
    image: yup
      .mixed()
      .required("Image is required.")
      .test(subscriptionImage !== null, "Image is required", () => {
        return true;
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    getValues,
    control,
  } = useForm({
    shouldFocusError: true,
    reValidateMode: "onChange",
    mode: "onChange",
    resolver: yupResolver(editSubscriptionSchema),
    defaultValues: {
      title,
      price,
      status,
      description,
      image,
    },
  });

  const onSubmit = (data) => {
    const { title, price, description, status } = data;
    if (!isDirty) {
      setShowEditSubscription(false);
      return true;
    }
    const response = dispatch(
      handleEditSubscription({
        title,
        price,
        status,
        description,
        image: subscriptionImage,
        id: _id,
        token,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success(` ${title} subscription added Successfully.`, {
            duration: 2000,
          });
          setShowEditSubscription(false);
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

  const handleDeletesubscription = (id, name) => {
    if (window.confirm("Are you sure?")) {
      dispatch(handleChangeDeleteID(id));

      const response = dispatch(
        handleDeletesUBSCRIPTION({ id, token, signal: AbortControllerRef })
      );
      if (response) {
        response.then((res) => {
          if (res?.payload?.status === "success") {
            dispatch(handleDeleteSubscription(id));
            toast.success(`${name} subscription Deleted Successfully.`);
            setShowEditSubscription(false);
          } else if (res?.payload?.status === "error") {
            toast.error(res?.payload?.message);
          }
        });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full lg:space-y-5 space-y-3 "
    >
      {/* title + buttons */}
      <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
        <p className="font-semibold text-left lg:text-xl text-lg">
          Subscriptions details{" "}
        </p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            className={`gray_button ${
              (editSubscriptionLoading || deleteSubscriptionLoading) &&
              "cursor-not-allowed"
            } `}
            disabled={deleteSubscriptionLoading || editSubscriptionLoading}
            type="button"
            onClick={() => setShowEditSubscription(false)}
          >
            Cancel
          </button>
          <button
            className={`green_button ${
              (editSubscriptionLoading || deleteSubscriptionLoading) &&
              "cursor-not-allowed"
            } `}
            disabled={deleteSubscriptionLoading || editSubscriptionLoading}
            type="submit"
          >
            {editSubscriptionLoading ? "Saving..." : "Save"}
          </button>
          {role === "admin" && (
            <button
              className={`red_button ${
                (editSubscriptionLoading || deleteSubscriptionLoading) &&
                "cursor-not-allowed"
              } `}
              disabled={deleteSubscriptionLoading || editSubscriptionLoading}
              type="button"
              onClick={() => handleDeletesubscription(_id, title)}
            >
              {deleteSubscriptionLoading ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>
      </div>
      {/* main div */}
      <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
        <div className="relative md:w-24 w-20 block">
          {prevImage === null ? (
            <img
              src={BaseUrl.concat(image)}
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
        <p className="font-bold text-black md:text-xl">Subscription details</p>
        {/* personal details */}
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/* title */}
          <div className="w-full space-y-2">
            <label htmlFor="title" className="Label">
              title
            </label>
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
              {...register("title")}
            />
            <span className="error">{errors?.title?.message}</span>
          </div>
          {/* price */}
          <div className="w-full space-y-2">
            <label htmlFor="price" className="Label">
              price
            </label>
            <input
              type="number"
              placeholder="Type here..."
              className="input_field"
              {...register("price")}
            />
            <span className="error">{errors?.price?.message}</span>
          </div>
          {/* status */}
          <div className="w-full space-y-2">
            <label htmlFor="status" className="Label">
              status
            </label>
            <select {...register("status")} className="input_field">
              <option label="choose status"></option>
              <option value="active">active</option>
              <option value="deactive">deactive</option>
            </select>
            <span className="error">{errors?.status?.message}</span>
          </div>
          {/* discriptions */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="discriptions" className="Label">
              discriptions
            </label>
            <textarea
              placeholder="Type here..."
              className="input_field"
              {...register("description")}
            />
            <span className="error">{errors?.description?.message}</span>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditDetailsSubscription;
