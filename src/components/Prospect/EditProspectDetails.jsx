import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
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
  handleDeletePROSPECT,
  handleDeleteProspect,
  handleEditProspect,
  handleFindProspect,
} from "../../redux/ProspectSlice";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const EditProspectDetails = ({ setShowEditdetailsProspect }) => {
  const { deleteProspectLoading, singleProspect, EditProspectLoading } =
    useSelector((state) => state.root.prospects);
  const { token, role } = useSelector((state) => state.root.auth);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const {
    _id,
    name,
    industry,
    website,
    email,
    mobile,
    officeNumber,
    billingAddress,
  } = singleProspect;

  const EditProspectSchema = yup.object(
    {
      name: yup
        .string()
        .required(t("Name is required"))
        .trim()
        .max(60, t("Max character limit reached"))
        .min(3, t("minimum three character required"))
        .typeError(t("Only characters allowed"))
        .matches(
          /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
          t("Name can only contain Latin letters.")
        ),
      baddress: yup
        .string()
        .max(200, t("Maximum character limit reached"))
        .required(t("address is required"))
        .trim(""),
      bzipCode: yup
        .string()
        .max(6, t("max 6 number allowed"))
        .min(5, t("min 5 number required"))
        .required(t("zipcode is required"))
        .trim(""),
      bcity: yup
        .string()
        .max(40, t("Maximum character limit reached"))
        .matches(
          /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
          t("city can only contain Latin letters.")
        )
        .required(t("city is required"))
        .trim(""),
      bcountry: yup
        .string()
        .matches(
          /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
          t("country can only contain Latin letters.")
        )
        .required(t("country is required"))
        .trim(""),
      officeNumber: yup
        .string()
        .required(t("office Number is required"))
        .max(15, t("maximum 15 numbers!!!")),
      mobile: yup.string().required(t("mobile is required")),
      bphone: yup.string().required(t("phone is required")),
      email: yup.string().email().required(t("email is required.")).trim(),
      bemail: yup.string().email().required(t("email is required.")).trim(),
      contactName: yup.string().required(t("contact name is required.")),
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
    resolver: yupResolver(EditProspectSchema),
    defaultValues: {
      name,
      industry,
      website,
      email,
      mobile,
      officeNumber,
      contactName: billingAddress?.contactName,
      bemail: billingAddress?.email,
      bphone: billingAddress?.phone,
      baddress: billingAddress?.address,
      bcity: billingAddress?.city,
      bcountry: billingAddress?.country,
      bzipCode: billingAddress?.zipCode,
    },
  });

  const onSubmit = (data) => {
    const {
      name,
      industry,
      website,
      email,
      mobile,
      officeNumber,
      contactName,
      bemail,
      bphone,
      baddress,
      bcity,
      bcountry,
      bzipCode,
    } = data;
    if (!isDirty) {
      setShowEditdetailsProspect(false);
      return true;
    } else if (!isPossiblePhoneNumber(bphone) || !isValidPhoneNumber(bphone)) {
      toast.remove();
      toast.error(t("Phone is invalid"));
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
      toast.error(t("Enter Valid URL!!!"));
      return true;
    }
    const response = dispatch(
      handleEditProspect({
        name,
        industry,
        website,
        email,
        mobile,
        officeNumber,
        contactName,
        bemail,
        bphone,
        baddress,
        bcity,
        bcountry,
        bzipCode,
        id: _id,
        token,
        signal: AbortControllerRef,
      })
    );

    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success(`${name} ${t("prospect edited Successfully")}.`, {
            duration: 2000,
          });
          setShowEditdetailsProspect(false);
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

  const handleDeleteprospect = (id, name) => {
    if (window.confirm(t("Are you sure?"))) {
      dispatch(handleChangeDeleteID(id));

      const response = dispatch(
        handleDeletePROSPECT({ id, token, signal: AbortControllerRef })
      );
      if (response) {
        response.then((res) => {
          if (res?.payload?.status === "success") {
            dispatch(handleDeleteProspect(id));
            toast.success(` ${name} ${t("prospect Deleted Successfully")}.`);
            setShowEditdetailsProspect(false);
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
          Prospect details
        </p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            className={`gray_button  
            ${
              (EditProspectLoading || deleteProspectLoading) &&
              "cursor-not-allowed"
            }`}
            type="button"
            onClick={() => {
              setShowEditdetailsProspect(false);
              dispatch(handleFindProspect(""));
            }}
          >
            {t("Cancel")}
          </button>
          <button
            className={`green_button  ${
              (EditProspectLoading || deleteProspectLoading) &&
              "cursor-not-allowed"
            }`}
            type="submit"
            disabled={EditProspectLoading || deleteProspectLoading}
          >
            {EditProspectLoading ? t("Saving").concat("...") : t("Save")}
          </button>
          {role === "admin" && (
            <button
              className={`red_button  ${
                (EditProspectLoading || deleteProspectLoading) &&
                "cursor-not-allowed"
              } `}
              onClick={() => handleDeleteprospect(_id, name)}
              type="button"
            >
              {deleteProspectLoading
                ? t("Deleting").concat("...")
                : t("Delete")}
            </button>
          )}
        </div>
      </div>
      {/* main div */}
      <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
        <p className="font-bold text-black md:text-xl">{t("Prospect Info")}</p>
        {/* personal details */}
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/* name */}
          <div className="w-full space-y-2">
            <label htmlFor="name" className="Label">
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
        {/*billing address */}
        <p className="font-bold text-black md:text-xl">
          {t("Billing Address")}
        </p>
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
              {...register("bemail")}
            />
            <span className="error">{errors?.bemail?.message}</span>
          </div>
          {/* phone */}
          <div className="w-full space-y-2">
            <label htmlFor="phone" className="Label">
              {t("phone")}
            </label>
            <Controller
              name="bphone"
              control={control}
              rules={{
                validate: (value) => isValidPhoneNumber(value),
              }}
              render={({ field: { onChange, value } }) => (
                <PhoneInput
                  country={"us"}
                  onChange={(value) => {
                    onChange((e) => {
                      setValue("bphone", "+".concat(value));
                    });
                  }}
                  value={getValues().bphone}
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
              {...register("baddress")}
            />
            <span className="error">{errors?.baddress?.message}</span>
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
              {...register("bcity")}
            />
            <span className="error">{errors?.bcity?.message}</span>
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
              {...register("bcountry")}
            />
            <span className="error">{errors?.bcountry?.message}</span>
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
              {...register("bzipCode")}
            />
            <span className="error">{errors?.bzipCode?.message}</span>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditProspectDetails;
