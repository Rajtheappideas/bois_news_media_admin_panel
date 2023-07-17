import React from "react";
import { HiPencil } from "react-icons/hi";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { handleEditProfile } from "../../redux/AuthSlice";
import { toast } from "react-hot-toast";
import { useState } from "react";
import Baseurl from "../../BaseUrl";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";

const EditProfile = ({ setShowProfileEdit }) => {
  const [prevImage, setPrevImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const { loading, user, error, token } = useSelector(
    (state) => state.root.user
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const {
    name,
    email,
    phone,
    company,
    address,
    city,
    country,
    zipCode,
    profile,
  } = user;

  const profileSchema = yup.object({
    name: yup
      .string()
      .required("Name is required!!!")
      .trim()
      .max(60, "Max character limit reached")
      .min(3, "minimum three character required")
      .typeError("Only characters allowed")
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        "Name can only contain Latin letters."
      ),
    phone: yup.string().required("phone is required!!!").trim(),
    address: yup.string().max(200, "Maximum character limit reached"),
    city: yup.string().max(40, "Maximum character limit reached").trim(),
    zipCode: yup
      .string()
      .max(6, "max 6 number allowed")
      .min(5, "min 5 number required!!!"),
    city: yup
      .string()
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        "city can only contain Latin letters."
      ),
    country: yup
      .string()
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        "country can only contain Latin letters."
      ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    shouldFocusError: true,
    resolver: yupResolver(profileSchema),
    reValidateMode: "onChange",
    defaultValues: {
      name: name || "",
      email: email || "",
      address: address || "",
      phone: phone || "",
      city: city || "",
      country: country || "",
      zipCode: zipCode || "",
      profile: profile || "",
      company: company || "",
    },
  });

  const onSubmit = (data) => {
    const { name, phone, company, address, city, country, zipCode } = data;
    if (!isPossiblePhoneNumber(phone) && !isValidPhoneNumber(phone)) {
      toast.error("Phone is invalid");
      return true;
    }
    const response = dispatch(
      handleEditProfile({
        name,
        phone,
        company,
        address,
        city,
        country,
        zipCode,
        profile: profileImage ?? profile,
        token,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response
        .then((res) => {
          if (res?.payload?.status === "success") {
            toast.success("Profile upadated.", { duration: 2000 });
            setShowProfileEdit(false);
          } else if (res?.payload?.status === "error") {
            toast.error(res?.payload?.message);
          }
        })
        .catch((err) => {
          console.log(err.payload);
        });
    }
  };

  // image upload
  const handleImageUpload = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setPrevImage(URL.createObjectURL(file));
    setProfileImage(file);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full lg:space-y-5 space-y-3"
    >
      {/* title + buttons */}
      <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
        <p className="font-semibold text-left lg:text-xl text-lg">
          Edit profile
        </p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            type="button"
            disabled={loading}
            className={`gray_button  ${loading && "cursor-not-allowed"} `}
            onClick={() => setShowProfileEdit(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`green_button  ${loading && "cursor-not-allowed"} `}
            // onClick={() => setShowProfileEdit(false)}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
      {/* main div */}
      <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
        <div className="relative md:w-24 w-20 block">
          <img
            src={
              prevImage ??
              Baseurl.concat(profile) ??
              require("../../assets/images/profile.png")
            }
            alt="profile"
            className="rounded-full border object-contain object-center md:h-24 md:w-24 w-20 h-20"
          />
          <input
            type="file"
            className="text-3xl cursor-pointer opacity-0 z-10 absolute bottom-0 right-0 rounded-full bg-red-600 text-white h-8 w-8 p-1"
            {...register("profile", {
              onChange: (e) => handleImageUpload(e),
            })}
            accept="image/*"
          />
          <HiPencil
            role="button"
            className="text-3xl absolute z-0 bottom-0 right-0 rounded-full bg-green-600 text-white h-8 w-8 p-1"
          />
        </div>
        <p className="font-bold text-black md:text-xl">Personal Details</p>
        {/* personal details */}
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/* name */}
          <div className="w-full space-y-2">
            <label htmlFor="name" className="Label">
              User name
            </label>
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
              {...register("name")}
            />
            <span role="alert" className="error">
              {errors?.name?.message}
            </span>
          </div>

          {/* company */}
          <div className="w-full space-y-2">
            <label htmlFor="company" className="Label">
              company
            </label>
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
              {...register("company")}
            />
          </div>
          {/* email */}
          <div className="w-full space-y-2">
            <label htmlFor="email" className="Label">
              email
            </label>
            <input
              type="email"
              placeholder="Type here..."
              className="input_field cursor-not-allowed"
              disabled={true}
              {...register("email")}
            />
          </div>
          {/* phone */}
          <div className="w-full space-y-2">
            <label htmlFor="phone" className="Label">
              phone
            </label>
            <PhoneInput
              country={"fr"}
              // {...register("phone")}
              onChange={(value) => {
                setValue("phone", "+".concat(value));
              }}
              value={getValues("phone")}
              countryCodeEditable={false}
              enableSearch={true}
              inputProps={{
                name: "phone",
              }}
              inputStyle={{
                width: "100%",
                background: "#FFFFFF",
                padding: "22px 0 22px 50px",
                borderRadius: "5px",
                fontSize: "1rem",
              }}
              dropdownStyle={{
                background: "white",
                color: "#13216e",
                fontWeight: "600",
                padding: "0px 0px 0px 10px",
              }}
            />

            <span role="alert" className="error">
              {errors?.phone?.message}
            </span>
          </div>
        </div>
        <hr className="my-1" />
        {/* address */}
        <p className="font-bold text-black md:text-xl">Address</p>
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/*company address */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="address" className="Label">
              address
            </label>
            <textarea
              type="text"
              placeholder="Type here..."
              className="input_field min-h-[5rem] max-h-[15rem]"
              {...register("address")}
            />
            <span role="alert" className="error">
              {errors?.address?.message}
            </span>
          </div>
          {/* city */}
          <div className="w-full space-y-2">
            <label htmlFor="city" className="Label">
              city
            </label>
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
              {...register("city")}
            />
            <span role="alert" className="error">
              {errors?.city?.message}
            </span>
          </div>
          {/* country */}
          <div className="w-full space-y-2">
            <label htmlFor="country" className="Label">
              country
            </label>
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
              {...register("country")}
            />
            <span role="alert" className="error">
              {errors?.country?.message}
            </span>
          </div>
          {/* zipcode */}
          <div className="w-full space-y-2">
            <label htmlFor="zipcode" className="Label">
              zipcode
            </label>
            <input
              type="number"
              placeholder="Type here..."
              {...register("zipCode")}
              className="input_field"
            />
            <span role="alert" className="error">
              {errors?.zipCode?.message}
            </span>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditProfile;
