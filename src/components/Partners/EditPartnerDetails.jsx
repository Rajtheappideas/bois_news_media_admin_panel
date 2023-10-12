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
  handleDeletePARTNER,
  handleDeletePartner,
  handleEditPartner,
} from "../../redux/PartnerSlice";
import { useTranslation } from "react-i18next";

const EditPartnerDetails = ({ setShowEditDetailsPartner }) => {
  const { editPartnerLoading, deletePartnerLoading, singlePartner } =
    useSelector((state) => state.root.partners);
  const { token, role } = useSelector((state) => state.root.auth);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const { _id, name, industry, website, email, mobile, officeNumber, address } =
    singlePartner;

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
          t("Name can only contain Latin letters."),
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
          t("Name can only contain Latin letters."),
        ),
      companyAddress: yup
        .string()
        .max(200, t("Maximum character limit reached"))
        .required(t("address is required"))
        .trim(""),
      zipCode: yup
        .string()
        .max(6, t("max 6 number allowed"))
        .min(5, t("min 5 number required"))
        .required(t("zipcode is required"))
        .trim(""),
      city: yup
        .string()
        .max(40, t("Maximum character limit reached"))
        .matches(
          /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
          t("city can only contain Latin letters."),
        )
        .required(t("city is required"))
        .trim(""),
      country: yup
        .string()
        .matches(
          /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
          t("country can only contain Latin letters."),
        )
        .required(t("country is required"))
        .trim(""),
      officeNumber: yup
        .string()
        .required(t("office Number is required"))
        .max(15, t("maximum 15 numbers!!!")),
      mobile: yup.string().required(t("mobile phone is required")),
      phone: yup.string().required(t("phone is required")),
      email: yup.string().email().required(t("email is required.")).trim(),
      aemail: yup.string().email().required(t("email is required.")).trim(),
      contactName: yup.string().required(t("contact name is required.")),
      industry: yup.string().required(t("industry is required.")),
      website: yup.string(),
    },
    [["website", "website"]],
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
      name,
      industry,
      website,
      email,
      mobile,
      officeNumber,
      contactName: address?.contactName,
      aemail: address?.email,
      phone: address?.phone,
      companyAddress: address?.companyAddress,
      city: address?.city,
      country: address?.country,
      zipCode: address?.zipCode,
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
      contactName,
      aemail,
      phone,
      companyAddress,
      city,
      country,
      zipCode,
    } = data;
    if (!isDirty) {
      setShowEditDetailsPartner(false);
      return true;
    } else if (!isPossiblePhoneNumber(mobile) || !isValidPhoneNumber(mobile)) {
      toast.remove();
      toast.error(t("mobile phone is invalid"));
      return true;
    } else if (!isPossiblePhoneNumber(phone) || !isValidPhoneNumber(phone)) {
      toast.remove();
      toast.error(t("Phone is invalid"));
      return true;
    } else if (
      website !== "" &&
      !/^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_-]+=[a-zA-Z0-9-%-_]+&?)?$/.test(
        website,
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
        contactName,
        aemail,
        phone,
        companyAddress,
        city,
        country,
        zipCode,
        id: _id,
        token,
        signal: AbortControllerRef,
      }),
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success(`${name} ${t("partner edited Successfully.")}`, {
            duration: 2000,
          });
          setShowEditDetailsPartner(false);
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

  const handleDeletepartner = (id) => {
    if (window.confirm(t("Are you sure?"))) {
      dispatch(handleChangeDeleteID(id));

      const response = dispatch(
        handleDeletePARTNER({ id, token, signal: AbortControllerRef }),
      );
      if (response) {
        response.then((res) => {
          if (res?.payload?.status === "success") {
            dispatch(handleDeletePartner(id));
            toast.success(t("Partner Deleted Successfully."));
            setShowEditDetailsPartner(false);
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
      className="w-full lg:space-y-5 space-y-3"
    >
      {/* title + buttons */}
      <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
        <p className="font-semibold text-left lg:text-xl text-lg">
          {t("Partner details")}
        </p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            className={`gray_button ${
              (editPartnerLoading || deletePartnerLoading) &&
              "cursor-not-allowed"
            } `}
            onClick={() => setShowEditDetailsPartner(false)}
            disabled={editPartnerLoading || deletePartnerLoading}
            type="button"
          >
            {t("Cancel")}
          </button>
          <button
            className={`green_button ${
              (editPartnerLoading || deletePartnerLoading) &&
              "cursor-not-allowed"
            }`}
            type="submit"
            disabled={editPartnerLoading || deletePartnerLoading}
          >
            {editPartnerLoading ? t("Saving").concat("...") : t("Save")}
          </button>
          {role === "admin" && (
            <button
              className={`red_button ${
                (editPartnerLoading || deletePartnerLoading) &&
                "cursor-not-allowed"
              }`}
              onClick={() => handleDeletepartner(_id)}
              disabled={deletePartnerLoading || editPartnerLoading}
            >
              {deletePartnerLoading ? t("Deleting").concat("...") : t("Delete")}
            </button>
          )}
        </div>
      </div>
      {/* main div */}
      <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
        <p className="font-bold text-black md:text-xl">{t("Basic Info")}</p>
        {/* personal details */}
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/* name */}
          <div className="w-full flex items-center gap-2">
            <div className="w-1/2">
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
            <div className="w-1/2">
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
        </div>
        <hr className="my-1" />
        {/* contact info */}
        <p className="font-bold text-black md:text-xl">{t("Contact Info")}</p>
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
                  value={getValues().mobile}
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
            <span className="error">{errors?.mobile?.message}</span>
          </div>
          {/* office number */}
          <div className="w-full space-y-2">
            <label htmlFor="office_number" className="Label">
              {t("office number")}
            </label>
            <input
              type="number"
              placeholder={t("Type here...")}
              className="input_field"
              {...register("officeNumber")}
            />
            <span className="error">{errors?.officeNumber?.message}</span>
          </div>
        </div>
        <hr className="my-1" />
        {/*address */}
        <p className="font-bold text-black md:text-xl">{t("Address")}</p>
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/*contact name */}
          <div className="w-full space-y-2">
            <label htmlFor="contact_name" className="Label">
              {t("Contact Name")}
            </label>
            <input
              type="text"
              placeholder={t("Type here...")}
              className="input_field"
              {...register("contactName")}
            />
            <span className="error">{errors?.contactName?.message}</span>
          </div>
          {/* email */}
          <div className="w-full space-y-2">
            <label htmlFor="email" className="Label">
              {t("email")}
            </label>
            <input
              type="email"
              placeholder={t("Type here...")}
              className="input_field"
              {...register("aemail")}
            />
            <span className="error">{errors?.aemail?.message}</span>
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
                  country={"us"}
                  onChange={(value) => {
                    onChange((e) => {
                      setValue("phone", "+".concat(value));
                    });
                  }}
                  value={getValues().phone}
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
            <span className="error">{errors?.bphone?.message}</span>
          </div>
          {/* company address */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="company_address" className="Label">
              {t("company address")}
            </label>
            <textarea
              placeholder={t("Type here...")}
              className="input_field min-h-[5rem] max-h-[15rem]"
              {...register("companyAddress")}
            />
            <span className="error">{errors?.companyAddress?.message}</span>
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
  );
};

export default EditPartnerDetails;
