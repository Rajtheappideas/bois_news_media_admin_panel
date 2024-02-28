import React, { useEffect, useState } from "react";
import { HiPencil } from "react-icons/hi";
import { PublicS3Url } from "../../BaseUrl";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import { FaUserCircle } from "react-icons/fa";
import {
  handleChangeDeleteID,
  handleChangeSingleUser,
  handleDeleteUSER,
  handleDeleteUser,
  handleEditUser,
  handleFindUser,
  handleGetUserbyId,
} from "../../redux/UserSlice";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

const EditUserDetails = () => {
  const {
    singleUser,
    EditUserLoading,
    deleteUserLoading,
    singleUserGetLoading,
  } = useSelector((state) => state.root.users);
  const { token, role: userRole } = useSelector((state) => state.root.auth);
  const { isSidebarOpen } = useSelector((state) => state.root.globalStates);

  const [prevImage, setPrevImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();
  const state = useLocation().state;

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const editUserSchema = yup.object({
    name: yup
      .string()
      .required(t("Name is required"))
      .trim()
      .max(60, t("Max character limit reached"))
      .min(1, t("minimum three character required"))
      .typeError(t("Only characters allowed"))
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        t("Name can only contain Latin letters.")
      ),
    address: yup
      .string()
      .max(200, t("Maximum character limit reached"))
      .required(t("address is required")),
    zipCode: yup.string().required(t("zipcode is required")),
    city: yup
      .string()
      .max(40, t("Maximum character limit reached"))
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        t("city can only contain Latin letters.")
      )
      .required(t("city is required")),
    country: yup
      .string()
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        t("country can only contain Latin letters.")
      )
      .required(t("country is required")),
    phone: yup.string().required(t("phone is required")),
    role: yup.string().required(t("role is required.")),
    profile: yup
      .mixed()
      .required(t("Image is required."))
      .test(profileImage !== null, t("Image is required"), () => {
        return true;
      }),
    company: yup.string().required(t("Company is required.")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    getValues,
    control,
  } = useForm({
    shouldFocusError: true,
    resolver: yupResolver(editUserSchema),
    reValidateMode: "onChange",
    defaultValues: {
      name: singleUser?.name,
      email: singleUser?.email,
      address: singleUser?.address,
      phone: singleUser?.phone,
      city: singleUser?.city,
      country: singleUser?.country,
      zipCode: singleUser?.zipCode,
      profile: singleUser?.profile || profileImage,
      company: singleUser?.company,
      role: singleUser?.role,
    },
  });

  const onSubmit = (data) => {
    const { name, phone, company, address, city, country, zipCode, role } =
      data;
    if (!isDirty) {
      return true;
    } else if (!isPossiblePhoneNumber(phone) || !isValidPhoneNumber(phone)) {
      toast.error(t("Phone is invalid"));
      return true;
    }
    const response = dispatch(
      handleEditUser({
        role,
        name,
        profile: profileImage ?? singleUser?.profile,
        phone,
        company,
        address,
        city,
        zipCode,
        country,
        id: singleUser?._id,
        token,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success(t(`${name} ${t("user edited successfully.")}`), {
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
    setProfileImage(file);
  };

  const handleDeleteruser = (id, name) => {
    if (window.confirm(t("Are you sure?"))) {
      dispatch(handleChangeDeleteID(id));
      const response = dispatch(
        handleDeleteUSER({ id, token, signal: AbortControllerRef })
      );
      if (response) {
        response.then((res) => {
          if (res?.payload?.status === "success") {
            dispatch(handleDeleteUser(id));
            toast.success(t(` ${name} user deleted successfully.`));
            navigate("/users");
          } else if (res?.payload?.status === "error") {
            toast.error(res?.payload?.message);
          }
        });
      }
    }
  };

  const handleFetchSingleUser = () => {
    if (singleUser !== null) return;
    const response = dispatch(
      handleGetUserbyId({ id: state?._id, token, signal: AbortControllerRef })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status !== "success") {
          navigate(`/users`);
        } else {
          const userDetails = res?.payload?.user;
          for (const key in res?.payload?.user) {
            if (Object.keys(getValues()).includes(key)) {
              setValue(key, userDetails[key]);
            }
          }
        }
      });
    }
  };

  const handleOnClickCancel = () => {
    dispatch(handleChangeSingleUser());
    navigate("/users");
  };

  // fetch user
  useEffect(() => {
    handleFetchSingleUser();
    if (state === null) {
      navigate("/users");
    }
    return () => {
      abortApiCall();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {singleUserGetLoading ? (
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
                  {t("Edit User")}
                </p>
                <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
                  <button
                    className={`gray_button  ${deleteUserLoading ||
                      (EditUserLoading && "cursor-not-allowed")
                      }`}
                    type="button"
                    onClick={() => {
                      handleOnClickCancel();
                    }}
                    disabled={deleteUserLoading || EditUserLoading}
                  >
                    {t("Cancel")}
                  </button>
                  <button
                    disabled={deleteUserLoading || EditUserLoading}
                    className={`green_button  ${EditUserLoading && "cursor-not-allowed"
                      }`}
                    type="submit"
                  >
                    {EditUserLoading ? t("Saving").concat("...") : t("Save")}
                  </button>
                  {userRole === "admin" && (
                    <button
                      className={`red_button  ${deleteUserLoading && "cursor-not-allowed"
                        }`}
                      type="button"
                      onClick={() =>
                        handleDeleteruser(
                          singleUser?.state?._id,
                          singleUser?.name
                        )
                      }
                      disabled={deleteUserLoading || EditUserLoading}
                    >
                      {deleteUserLoading
                        ? t("Deleting").concat("...")
                        : t("Delete")}
                    </button>
                  )}
                </div>
              </div>
              {/* main div */}
              <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
                <div className="relative md:w-24 w-20 block">
                  {prevImage !== null ? (
                    <img
                      src={prevImage}
                      alt={singleUser?.name}
                      className="rounded-full border object-contain object-center bg-cover bg-center inline-block md:h-24 md:w-24 w-20 h-20"
                    />
                  ) : singleUser?.profile !== null &&
                    singleUser?.profile !== undefined ? (
                    <img
                      src={PublicS3Url.concat(singleUser?.profile)}
                      alt={singleUser?.name}
                      className="rounded-full border object-contain object-center bg-cover bg-center inline-block md:h-24 md:w-24 w-20 h-20"
                    />
                  ) : (
                    <FaUserCircle
                      size={30}
                      color="lightgray"
                      className="h-full w-full"
                    />
                  )}
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
                <span className="error">
                  {profileImage === null && errors?.profile?.message}
                </span>
                <p className="font-bold text-black md:text-xl">
                  {t("personal details")}
                </p>
                {/* personal details */}
                <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
                  {/* name */}
                  <div className="w-full space-y-2">
                    <label htmlFor="name" className="Label">
                      {t("User name")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("Type here...")}
                      className="input_field"
                      {...register("name")}
                    />
                    <span role="alert" className="error">
                      {errors?.name?.message}
                    </span>
                  </div>
                  {/* role */}
                  <div className="w-full space-y-2">
                    <label htmlFor="role" className="Label">
                      {t("Role")}
                    </label>
                    <select {...register("role")} className="input_field">
                      <option value="editor">{t("Editor")}</option>
                      <option value="admin">{t("Admin")}</option>
                      <option value="viewer">{t("Viewer")}</option>
                    </select>
                    <span role="alert" className="error">
                      {errors?.role?.message}
                    </span>
                  </div>
                  {/* company */}
                  <div className="w-full space-y-2">
                    <label htmlFor="company" className="Label">
                      {t("company")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("Type here...")}
                      className="input_field"
                      {...register("company")}
                    />
                    <span role="alert" className="error">
                      {errors?.company?.message}
                    </span>
                  </div>
                  {/* email */}
                  <div className="w-full space-y-2">
                    <label htmlFor="email" className="Label">
                      {t("email")}
                    </label>
                    <input
                      type="email"
                      disabled
                      placeholder={t("Type here...")}
                      className="input_field cursor-not-allowed"
                      {...register("email")}
                    />
                    <span role="alert" className="error">
                      {errors?.email?.message}
                    </span>
                  </div>
                  {/* phone */}
                  <div className="w-full space-y-2">
                    <label htmlFor="phone" className="Label">
                      {t("phone")}
                    </label>
                    <Controller
                      name="phone"
                      control={control}
                      rules={{
                        validate: (value) => isValidPhoneNumber(value),
                      }}
                      render={({ field: { onChange, value } }) => (
                        <PhoneInput
                          country={"fr"}
                          onChange={(value) => {
                            onChange((e) => {
                              setValue("phone", "+".concat(value));
                            });
                          }}
                          autocompleteSearch={true}
                          value={getValues("phone")}
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
                    <span role="alert" className="error">
                      {errors?.phone?.message}
                    </span>
                  </div>
                </div>
                <hr className="my-1" />
                {/* address */}
                <p className="font-bold text-black md:text-xl">
                  {t("Address")}
                </p>
                <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
                  {/*company address */}
                  <div className="w-full col-span-full space-y-2">
                    <label htmlFor="company_address" className="Label">
                      {t("Company address")}
                    </label>
                    <textarea
                      type="text"
                      placeholder={t("Type here...")}
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
                      {t("city")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("Type here...")}
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
                      {t("country")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("Type here...")}
                      className="input_field"
                      {...register("country")}
                    />{" "}
                    <span role="alert" className="error">
                      {errors?.country?.message}
                    </span>
                  </div>
                  {/* zipcode */}
                  <div className="w-full space-y-2">
                    <label htmlFor="zipCode" className="Label">
                      {t("zipcode")}
                    </label>
                    <input
                      type="number"
                      placeholder={t("Type here...")}
                      className="input_field"
                      maxLength={6}
                      minLength={6}
                      {...register("zipCode")}
                    />
                    <span role="alert" className="error">
                      {errors?.zipCode?.message}
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

export default EditUserDetails;
