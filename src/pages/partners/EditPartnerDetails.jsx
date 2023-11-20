import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import { toast } from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
} from "react-phone-number-input";
import {
  handleChangeDeleteID,
  handleChangeSinglePartner,
  handleDeletePARTNER,
  handleDeletePartner,
  handleEditPartner,
  handleGetPartnerById,
} from "../../redux/PartnerSlice";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

const EditPartnerDetails = () => {
  const {
    editPartnerLoading,
    deletePartnerLoading,
    singlePartner,
    singlePartnerLoading,
  } = useSelector((state) => state.root.partners);
  const { token, role } = useSelector((state) => state.root.auth);
  const { isSidebarOpen } = useSelector((state) => state.root.globalStates);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const state = useLocation().state;

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const addNewPartnerSchema = yup.object(
    {
      fname: yup
        .string()
        .required(t("first Name is required"))
        .trim()
        .max(60, t("Max character limit reached"))
        .min(1, t("minimum three character required"))
        .typeError(t("Only characters allowed"))
        .matches(
          /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
          t("Name can only contain Latin letters.")
        ),
      lname: yup
        .string()
        .required(t("last Name is required"))
        .trim()
        .max(60, t("Max character limit reached"))
        .min(1, t("minimum three character required"))
        .typeError(t("Only characters allowed"))
        .matches(
          /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
          t("Name can only contain Latin letters.")
        ),
      company: yup
        .string()
        .max(200, t("Maximum character limit reached"))
        .required(t("company is required")),
      civility: yup.string().required(t("civility is required")),
      address1: yup
        .string()
        .max(200, t("Maximum character limit reached"))
        .required(t("address is required")),
      address2: yup.string().max(200, t("Maximum character limit reached")),
      address3: yup.string().max(200, t("Maximum character limit reached")),
      zipCode: yup.string().required(t("zipcode is required")).trim(""),
      city: yup
        .string()
        .max(40, t("Maximum character limit reached"))
        .matches(
          /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
          t("city can only contain Latin letters.")
        )
        .required(t("city is required")),
      province: yup
        .string()
        .max(40, t("Maximum character limit reached"))
        .matches(
          /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
          t("province can only contain Latin letters.")
        )
        .required(t("province is required")),
      country: yup
        .string()
        .matches(
          /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
          t("country can only contain Latin letters.")
        )
        .required(t("country is required")),
      officeNumber: yup
        .string()
        .required(t("office Number is required"))
        .max(15, t("maximum 15 numbers!!!")),
      mobile: yup.string().required(t("mobile is required")),
      email: yup.string().email().required(t("email is required.")).trim(),
      industry: yup.string().required(t("industry is required.")),
      website: yup.string(),
    },
    [["website", "website"]]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    getValues,
    control,
  } = useForm({
    shouldFocusError: true,
    reValidateMode: "onChange",
    mode: "onChange",
    resolver: yupResolver(addNewPartnerSchema),
    defaultValues: {
      fname: singlePartner?.fname,
      lname: singlePartner?.lname,
      industry: singlePartner?.industry,
      website: singlePartner?.website,
      email: singlePartner?.email,
      mobile: singlePartner?.mobile,
      company: singlePartner?.company,
      civility: singlePartner?.civility,
      officeNumber: singlePartner?.officeNumber,
      address1: singlePartner?.shippingAddress?.address1,
      address2: singlePartner?.shippingAddress?.address2,
      address3: singlePartner?.shippingAddress?.address3,
      city: singlePartner?.shippingAddress?.city,
      country: singlePartner?.shippingAddress?.country,
      zipCode: singlePartner?.shippingAddress?.zipCode,
      province: singlePartner?.shippingAddress?.province,
    },
  });

  const onSubmit = (data) => {
    const {
      fname,
      lname,
      industry,
      website,
      email,
      mobile,
      officeNumber,
      city,
      country,
      company,
      civility,
      province,
      zipCode,
      address1,
      address2,
      address3,
    } = data;
    if (!isDirty) {
      return true;
    } else if (!isPossiblePhoneNumber(mobile) || !isValidPhoneNumber(mobile)) {
      toast.remove();
      toast.error(t("mobile phone is invalid"));
      return true;
    } else if (
      website !== "" &&
      !/^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_-]+=[a-zA-Z0-9-%-_]+&?)?$/.test(
        website
      )
    ) {
      toast.remove();
      toast.error(t("Enter Valid URL!!!"));
      return true;
    }
    const response = dispatch(
      handleEditPartner({
        fname,
        lname,
        industry,
        website,
        email,
        mobile,
        officeNumber,
        city,
        country,
        company,
        civility,
        province,
        zipCode,
        address1,
        address2,
        address3,
        id: state?._id,
        token,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success(
            `${fname} ${lname} ${t("partner edited Successfully.")}`,
            {
              duration: 2000,
            }
          );
        } else if (res?.payload?.status === "error") {
          toast.error(res?.payload?.message);
        }
      });
    }
  };

  const handleDeletepartner = (id) => {
    if (window.confirm(t("Are you sure?"))) {
      dispatch(handleChangeDeleteID(id));

      const response = dispatch(
        handleDeletePARTNER({ id, token, signal: AbortControllerRef })
      );
      if (response) {
        response.then((res) => {
          if (res?.payload?.status === "success") {
            dispatch(handleDeletePartner(id));
            toast.success(t("Partner Deleted Successfully."));
            navigate("/partners");
          } else if (res?.payload?.status === "error") {
            toast.error(res?.payload?.message);
          }
        });
      }
    }
  };

  const handleFetchSinglePartner = () => {
    if (singlePartner !== null) return;
    const response = dispatch(
      handleGetPartnerById({
        id: state?._id,
        token,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status !== "success") {
          navigate(`/partners`);
        } else {
          const prospectDetails = res?.payload?.partner;
          for (const key in res?.payload?.partner) {
            if (Object.keys(getValues()).includes(key)) {
              setValue(key, prospectDetails[key]);
            }
          }
        }
      });
    }
  };

  const handleOnClickCancel = () => {
    dispatch(handleChangeSinglePartner());
    navigate("/partners");
  };

  useEffect(() => {
    handleFetchSinglePartner();
    if (state === null) {
      navigate("/partners");
    }
    return () => {
      abortApiCall();
    };
  }, []);

  return (
    <>
      {singlePartnerLoading ? (
        <div className="data_not_found_And_Loading">{t("Loading")}...</div>
      ) : (
        <div className="w-full flex items-start lg:gap-3 flex-row h-auto">
          <Sidebar />
          <section
            className={`h-full space-y-5 bg-[#FBFBFB] min-h-screen ${
              isSidebarOpen ? "xl:w-10/12 lg:w-4/5 w-full" : "lg:w-[90%] w-full"
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
                  {t("partner details")}
                </p>
                <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
                  <button
                    className="gray_button"
                    onClick={() => handleOnClickCancel()}
                    disabled={editPartnerLoading}
                  >
                    {t("Cancel")}
                  </button>
                  <button
                    type="submit"
                    className="green_button"
                    disabled={editPartnerLoading}
                  >
                    {editPartnerLoading ? t("Saving").concat("...") : t("Save")}
                  </button>
                  {role === "admin" && (
                    <button
                      className={`red_button ${
                        (editPartnerLoading || deletePartnerLoading) &&
                        "cursor-not-allowed"
                      }`}
                      disabled={deletePartnerLoading || editPartnerLoading}
                      onClick={() => handleDeletepartner(state?._id)}
                    >
                      {deletePartnerLoading
                        ? t("Deleting").concat("...")
                        : t("Delete")}
                    </button>
                  )}
                </div>
              </div>
              {/* main div */}
              <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
                <p className="font-bold text-black md:text-xl">
                  {t("Prospect Info")}
                </p>
                {/* personal details */}
                <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
                  {/* name */}
                  <div className="w-full space-y-2">
                    <label htmlFor="fname" className="Label">
                      {t("first Name")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("Type here...")}
                      className="input_field"
                      {...register("fname")}
                    />
                    <span className="error">{errors?.fname?.message}</span>
                  </div>
                  <div className="w-full space-y-2">
                    <label htmlFor="lname" className="Label">
                      {t("last Name")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("Type here...")}
                      className="input_field"
                      {...register("lname")}
                    />
                    <span className="error">{errors?.lname?.message}</span>
                  </div>
                  {/* industry */}
                  <div className="w-full space-y-2">
                    <label htmlFor="industry" className="Label">
                      {t("industry")}
                    </label>
                    <select
                      itemRef={register("industry", { required: true })}
                      {...register("industry", { required: true })}
                      className="input_field"
                    >
                      <option label="select industry"></option>
                      <option value="option1">option1</option>
                      <option value="option2">option2</option>
                      <option value="option3">option3</option>
                    </select>
                    <span className="error">{errors?.industry?.message}</span>
                  </div>
                  {/* website */}
                  <div className="w-full space-y-2">
                    <label htmlFor="website" className="Label">
                      {t("website")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("Type here...")}
                      className="input_field"
                      {...register("website")}
                    />
                    <span className="error">{errors?.website?.message}</span>
                  </div>
                  {/* company name */}
                  <div className="w-full space-y-2">
                    <label htmlFor="company_name" className="Label">
                      {t("company name")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("Type here...")}
                      className="input_field"
                      {...register("company")}
                    />
                    <span className="error">{errors?.company?.message}</span>
                  </div>
                  {/* civilty */}
                  <div className="w-full space-y-2">
                    <label htmlFor="civility" className="Label">
                      {t("civility")}
                    </label>
                    <select
                      {...register("civility")}
                      name="civility"
                      className="input_field"
                    >
                      <option label="Choose civility"></option>
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Ms.">Ms.</option>
                    </select>
                    {/* <input
              type="text"
              placeholder={t("Type here...")}
              className="input_field"
              {...register("civility")}
            /> */}
                    <span className="error">{errors?.civility?.message}</span>
                  </div>
                </div>
                <hr className="my-1" />
                {/* contact info */}
                <p className="font-bold text-black md:text-xl">
                  {t("Contact Info")}
                </p>
                <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
                  {/* email */}
                  <div className="w-full space-y-2">
                    <label htmlFor="email" className="Label">
                      {t("email")}
                    </label>
                    <input
                      type="email"
                      placeholder={t("Type here...")}
                      className="input_field"
                      {...register("email")}
                    />
                    <span className="error">{errors?.email?.message}</span>
                  </div>
                  {/* mobile number */}
                  <div className="w-full space-y-2">
                    <label htmlFor="mobile_number" className="Label">
                      {t("mobile number")}
                    </label>
                    <Controller
                      name="mobile"
                      control={control}
                      rules={{
                        validate: (value) => isValidPhoneNumber(value),
                      }}
                      render={({ field: { onChange, value } }) => (
                        <PhoneInput
                          country={"us"}
                          onChange={(value) => {
                            onChange((e) => {
                              setValue("mobile", "+".concat(value));
                            });
                          }}
                          autocompleteSearch={true}
                          countryCodeEditable={false}
                          enableSearch={true}
                          value={singlePartner?.mobile}
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
                    <span className="error">{errors?.mobile?.message}</span>
                  </div>
                  {/* office number */}
                  <div className="w-full space-y-2">
                    <label htmlFor="office_number" className="Label">
                      {t("office number")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("Type here...")}
                      className="input_field"
                      {...register("officeNumber")}
                    />
                    <span className="error">
                      {errors?.officeNumber?.message}
                    </span>
                  </div>
                </div>
                <hr className="my-1" />
                {/*Shipping address */}
                <p className="font-bold text-black md:text-xl">
                  {t("Shipping Address")}
                </p>
                <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
                  {/*  address 1*/}
                  <div className="w-full col-span-full space-y-2">
                    <label htmlFor="address1" className="Label">
                      {t("address 1")}
                    </label>
                    <textarea
                      placeholder={t("Type here...")}
                      className="input_field min-h-[5rem] max-h-[15rem]"
                      {...register("address1")}
                    />
                    <span className="error">{errors?.address1?.message}</span>
                  </div>
                  {/*  address 2*/}
                  <div className="w-full col-span-full space-y-2">
                    <label htmlFor="address2" className="Label">
                      {t("address 2")}
                    </label>
                    <textarea
                      placeholder={t("Type here...")}
                      className="input_field min-h-[5rem] max-h-[15rem]"
                      {...register("address2")}
                    />
                    <span className="error">{errors?.address2?.message}</span>
                  </div>
                  {/*  address 3*/}
                  <div className="w-full col-span-full space-y-2">
                    <label htmlFor="address3" className="Label">
                      {t("address 3")}
                    </label>
                    <textarea
                      placeholder={t("Type here...")}
                      className="input_field min-h-[5rem] max-h-[15rem]"
                      {...register("address3")}
                    />
                    <span className="error">{errors?.address3?.message}</span>
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
                    <span className="error">{errors?.city?.message}</span>
                  </div>
                  {/* province */}
                  <div className="w-full space-y-2">
                    <label htmlFor="province" className="Label">
                      {t("province")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("Type here...")}
                      className="input_field"
                      {...register("province")}
                    />
                    <span className="error">{errors?.province?.message}</span>
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
                    />
                    <span className="error">{errors?.country?.message}</span>
                  </div>
                  {/* zipcode */}
                  <div className="w-full space-y-2">
                    <label htmlFor="zipcode" className="Label">
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
                    <span className="error">{errors?.zipCode?.message}</span>
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

export default EditPartnerDetails;
