import React, { useState, useEffect } from "react";
import { HiPencil } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import { toast } from "react-hot-toast";
import { handleAddNewUser } from "../../redux/UserSlice";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
} from "react-phone-number-input";

const AddNewUser = ({ setShowAddNewUser }) => {
  const [prevImage, setPrevImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const { addNewUserLoading } = useSelector((state) => state.root.users);
  const { token } = useSelector((state) => state.root.auth);

  const dispatch = useDispatch();

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const addNewUserSchema = yup.object({
    name: yup
      .string()
      .required("Name is required")
      .trim()
      .max(60, "Max character limit reached")
      .min(3, "minimum three character required")
      .typeError("Only characters allowed")
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        "Name can only contain Latin letters."
      ),
    address: yup
      .string()
      .max(200, "Maximum character limit reached")
      .required("address is required")
      .trim(""),
    zipCode: yup
      .string()
      .max(6, "max 6 number allowed")
      .min(5, "min 5 number required")
      .required("zipcode is required")
      .trim(""),
    city: yup
      .string()
      .max(40, "Maximum character limit reached")
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        "city can only contain Latin letters."
      )
      .required("city is required")
      .trim(""),
    country: yup
      .string()
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        "country can only contain Latin letters."
      )
      .required("country is required")
      .trim(""),
    phone: yup.string().required("phone is required"),
    role: yup.string().required("role is required."),
    email: yup.string().email().required("email is required.").trim(),
    profile: yup
      .mixed()
      .required("Image is required.")
      .test(profileImage !== null, "Image is required", () => {
        return true;
      }),
    password: yup
      .string()
      .required("Password is required!!!")
      .matches(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
        "Minimum 8 characters, at least one special character, at least one digit!!!"
      )
      .trim(),
    company: yup.string().required("Company is required."),
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
    resolver: yupResolver(addNewUserSchema),
    defaultValues: {
      profile: profileImage,
    },
  });

  const onSubmit = (data) => {
    const {
      role,
      name,
      email,
      password,
      phone,
      company,
      address,
      city,
      zipCode,
      country,
    } = data;

    if (!isPossiblePhoneNumber(phone) || !isValidPhoneNumber(phone)) {
      toast.remove();
      toast.error("Phone is invalid");
      return true;
    }
    const response = dispatch(
      handleAddNewUser({
        role,
        name,
        email,
        profile: profileImage,
        password,
        phone,
        company,
        address,
        city,
        zipCode,
        country,
        token,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success(` ${name} user added Successfully.`, {
            duration: 2000,
          });
          setShowAddNewUser(false);
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
    setProfileImage(file);
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
          Add new user
        </p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            className={`gray_button ${
              addNewUserLoading && "cursor-not-allowed"
            }`}
            onClick={() => setShowAddNewUser(false)}
            disabled={addNewUserLoading}
            type="reset"
          >
            Cancel
          </button>
          <button
            className={`green_button ${
              addNewUserLoading && "cursor-not-allowed"
            }`}
            type="submit"
            disabled={addNewUserLoading}
          >
            {addNewUserLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
      {/* main div */}
      <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
        <div className="relative md:w-24 w-20 block">
          {prevImage === null ? (
            <FaUserCircle
              size={30}
              color="lightgray"
              className="h-full w-full"
            />
          ) : (
            <img
              src={prevImage}
              alt="profile"
              className="rounded-full object-contain object-center md:h-24 md:w-24 w-20 h-20 border"
            />
          )}
          <input
            type="file"
            className="text-3xl cursor-pointer opacity-0 z-10 absolute bottom-0 right-0 rounded-full bg-red-600 text-white h-8 w-8 p-1"
            {...register("profile", {
              required: true,
              onChange: (e) => {
                handleImageUpload(e);
              },
            })}
            name="profile"
            id="profile"
            accept="image/*"
          />
          <HiPencil
            role="button"
            className="text-3xl absolute z-0 bottom-0 right-0 rounded-full bg-green-600 text-white h-8 w-8 p-1"
          />
        </div>
        <span className="error">
          {profileImage === null && errors?.profile?.message}
        </span>
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
            <span className="error">{errors?.name?.message}</span>
          </div>
          {/* role */}
          <div className="w-full space-y-2">
            <label htmlFor="role" className="Label">
              Role
            </label>
            <select {...register("role")} className="input_field">
              <option label="Choose role"></option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
            <span className="error">{errors?.role?.message}</span>
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
            <span className="error">{errors?.company?.message}</span>
          </div>
          {/* email */}
          <div className="w-full space-y-2">
            <label htmlFor="email" className="Label">
              email
            </label>
            <input
              type="email"
              placeholder="Type here..."
              className="input_field"
              {...register("email")}
            />
            <span className="error">{errors?.email?.message}</span>
          </div>
          {/* phone */}
          <div className="w-full space-y-2">
            <label htmlFor="phone" className="Label">
              phone
            </label>
            <Controller
              name="phone"
              control={control}
              rules={{
                validate: (value) => isValidPhoneNumber(value),
              }}
              render={({ field: { onChange, value } }) => (
                <PhoneInput
                  country={"us"}
                  onChange={(value) => {
                    onChange((e) => {
                      setValue("phone", "+".concat(value));
                    });
                  }}
                  autocompleteSearch={true}
                  countryCodeEditable={false}
                  enableSearch={true}
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
              )}
            />

            <span className="error">{errors?.phone?.message}</span>
          </div>
          {/* password */}
          <div className="w-full space-y-2">
            <label htmlFor="password" className="Label">
              password
            </label>
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
              {...register("password")}
            />
            <span className="error">{errors?.password?.message}</span>
          </div>
        </div>
        <hr className="my-1" />
        {/* address */}
        <p className="font-bold text-black md:text-xl">Address</p>
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/*company address */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="company_address" className="Label">
              Company address
            </label>
            <textarea
              type="text"
              placeholder="Type here..."
              className="input_field min-h-[5rem] max-h-[15rem]"
              {...register("address")}
            />
            <span className="error">{errors?.address?.message}</span>
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
            <span className="error">{errors?.city?.message}</span>
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
            <span className="error">{errors?.country?.message}</span>
          </div>
          {/* zipcode */}
          <div className="w-full space-y-2">
            <label htmlFor="zipcode" className="Label">
              zipcode
            </label>
            <input
              type="number"
              placeholder="Type here..."
              className="input_field"
              maxLength={6}
              minLength={6}
              {...register("zipCode")}
            />
            <span className="error">{errors?.zipCode?.message}</span>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddNewUser;
