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
  handleAddNewMagazine,
  handleChangeDeleteID,
  handleDeleteMAGAZINE,
  handleDeleteMagazine,
  handleEditMagazine,
} from "../../redux/MagazineSlice";
import BaseUrl from "../../BaseUrl";

const EditMagazineDetails = ({ setshowEditMagazine }) => {
  const [prevImage, setPrevImage] = useState(null);
  const [magazineImage, setmagazineImage] = useState(null);

  const { singleMagazine, editMagazineLoading, deleteMagazineLoading } =
    useSelector((state) => state.root.magazines);
  const { token } = useSelector((state) => state.root.auth);

  const dispatch = useDispatch();

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const { title, description, stock, price, status, _id, image } =
    singleMagazine;

  const editMagazineSchema = yup.object({
    title: yup.string().required("title is required").trim(),
    status: yup.string().required("status is required").trim(),
    description: yup.string().required("description is required").trim(""),
    stock: yup
      .string()
      .required("stock is required")
      .max(5, "maximum 5 numbers")
      .min(1, "minimum 1 numbers")
      .typeError("stock is required"),
    price: yup
      .string()
      .required("price is required")
      .max(4, "maximum 4 numbers")
      .min(2, "minmum 2 numbers")
      .trim(""),
    image: yup
      .mixed()
      .required("Image is required.")
      .test(magazineImage !== null, "Image is required", () => {
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
    resolver: yupResolver(editMagazineSchema),
    defaultValues: {
      title,
      price,
      status,
      description,
      image,
      stock,
    },
  });

  const onSubmit = (data) => {
    const { title, price, stock, description, status } = data;
    if (!isDirty) {
      setshowEditMagazine(false);
      return true;
    }
    const response = dispatch(
      handleEditMagazine({
        title,
        price,
        stock,
        status,
        description,
        image: magazineImage,
        id: _id,
        token,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success(` ${title} magazine edited Successfully.`, {
            duration: 2000,
          });
          setshowEditMagazine(false);
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

  useEffect(() => {
    return () => {
      abortApiCall();
    };
  }, []);

  const handleDeletemagazine = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(handleChangeDeleteID(id));

      const response = dispatch(
        handleDeleteMAGAZINE({ id, token, signal: AbortControllerRef })
      );
      if (response) {
        response.then((res) => {
          if (res?.payload?.status === "success") {
            dispatch(handleDeleteMagazine(id));
            toast.success(`${title} magazine Deleted Successfully.`);
            setshowEditMagazine(false);
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
          Magazine details
        </p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            className="text-green-500 border border-green-400 font-medium text-center md:w-32 w-24 h-10 rounded-lg p-2 hover:bg-green-200 active:scale-95 transition"
            onClick={() => setshowEditMagazine(false)}
          >
            Download
          </button>
          <button
            className={`gray_button ${
              (editMagazineLoading || deleteMagazineLoading) &&
              "cursor-not-allowed"
            } `}
            onClick={() => setshowEditMagazine(false)}
            type="button"
            disabled={editMagazineLoading || deleteMagazineLoading}
          >
            Cancel
          </button>
          <button
            className={`green_button ${
              (editMagazineLoading || deleteMagazineLoading) &&
              "cursor-not-allowed"
            } `}
            type="submit"
            disabled={editMagazineLoading || deleteMagazineLoading}
          >
            {editMagazineLoading ? "Saving..." : "Save"}
          </button>
          <button
            className={`red_button ${
              (editMagazineLoading || deleteMagazineLoading) &&
              "cursor-not-allowed"
            } `}
            type="button"
            disabled={editMagazineLoading || deleteMagazineLoading}
            onClick={() => handleDeletemagazine(_id)}
          >
            {deleteMagazineLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
      {/* main div */}
      <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
        <div className="relative md:w-24 w-20 h-24 block">
          {prevImage === null ? (
            <img
              src={BaseUrl.concat(image)}
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

        <p className="font-bold text-black md:text-xl">Magazine details</p>
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
          {/* stock */}
          <div className="w-full space-y-2">
            <label htmlFor="stock" className="Label">
              stock
            </label>
            <input
              type="number"
              placeholder="Type here..."
              className="input_field"
              {...register("stock")}
            />
            <span className="error">{errors?.stock?.message}</span>
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
          {/* summary */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="summary" className="Label">
              summary
            </label>
            <textarea
              placeholder="Type here..."
              {...register("description")}
              className="input_field"
            />
            <span className="error">{errors?.description?.message}</span>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditMagazineDetails;
