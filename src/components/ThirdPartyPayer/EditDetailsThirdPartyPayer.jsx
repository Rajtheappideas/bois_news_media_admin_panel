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
  handleDeletePAYER,
  handleDeletePayer,
  handleEditPayer,
  handleFindPayer,
} from "../../redux/ThirdPartyPayerSlice";
import { useTranslation } from "react-i18next";

const EditDetailsThirdPartyPayer = ({ setShowEditDetailsPayer }) => {
  const { deletePayerLoading, editPayerLoading, singlePayer } = useSelector(
    (state) => state.root.thirdPartyPayers
  );
  const { token, role } = useSelector((state) => state.root.auth);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const {
    _id,
    status,
    accountName,
    email,
    mobile,
    accountNumber,
    billingAddress: { companyAddress, city, country, zipCode },
  } = singlePayer;

  const editPayerSchema = yup.object({
    accountName: yup
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
    companyAddress: yup
      .string()
      .max(200, t("Maximum character limit reached"))
      .required(t("address is required"))
      .trim(""),
    zipCode: yup
      .string()
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
        t("city can only contain Latin letters.")
      )
      .required(t("city is required"))
      .trim(""),
    country: yup
      .string()
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        t("country can only contain Latin letters.")
      )
      .required(t("country is required"))
      .trim(""),
    accountNumber: yup
      .string()
      .required(t("office Number is required"))
      .max(15, t("maximum 15 numbers!!!")),
    mobile: yup.string().required(t("mobile is required")),
    email: yup.string().email().required(t("email is required.")).trim(),
    status: yup.string().required(t("status is required.")).trim(),
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
    reValidateMode: "onChange",
    mode: "onChange",
    resolver: yupResolver(editPayerSchema),
    defaultValues: {
      status,
      accountName,
      email,
      mobile,
      accountNumber,
      companyAddress,
      city,
      country,
      zipCode,
    },
  });

  const onSubmit = (data) => {
    const {
      accountName,
      email,
      mobile,
      accountNumber,
      companyAddress,
      city,
      country,
      status,
      zipCode,
    } = data;
    if (!isDirty) {
      setShowEditDetailsPayer(false);
      return true;
    } else if (!isPossiblePhoneNumber(mobile) || !isValidPhoneNumber(mobile)) {
      toast.remove();
      toast.error(t("mobile phone is invalid"));
      return true;
    }
    const response = dispatch(
      handleEditPayer({
        status,
        accountName,
        email,
        mobile,
        accountNumber,
        companyAddress,
        city,
        country,
        zipCode,
        id: _id,
        token,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success(`${accountName} ${t("payer edited Successfully")}.`, {
            duration: 2000,
          });
          setShowEditDetailsPayer(false);
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

  const handleDeletepayer = (id, name) => {
    if (window.confirm(t("Are you sure?"))) {
      dispatch(handleChangeDeleteID(id));

      const response = dispatch(
        handleDeletePAYER({ id, token, signal: AbortControllerRef })
      );
      if (response) {
        response.then((res) => {
          if (res?.payload?.status === "success") {
            dispatch(handleDeletePayer(id));
            toast.success(`${name} ${t("payer Deleted Successfully")}.`);
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
          {t("Third-party payer details")}
        </p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            className={`gray_button ${
              (editPayerLoading || deletePayerLoading) && "cursor-not-allowed"
            } `}
            onClick={() => {
              setShowEditDetailsPayer(false);
              dispatch(handleFindPayer(""));
            }}
            disabled={editPayerLoading || deletePayerLoading}
            type="button"
          >
            {t("Cancel")}
          </button>
          <button
            className={`green_button ${
              (editPayerLoading || deletePayerLoading) && "cursor-not-allowed"
            }`}
            disabled={editPayerLoading || deletePayerLoading}
            type="submit"
          >
            {editPayerLoading ? t("Saving").concat("...") : t("Save")}
          </button>
          {role === "admin" && (
            <button
              className={`red_button
          ${(editPayerLoading || deletePayerLoading) && "cursor-not-allowed"}
          `}
              onClick={() => handleDeletepayer()}
              disabled={editPayerLoading || deletePayerLoading}
              type="button"
            >
              {deletePayerLoading ? t("Deleting").concat("...") : t("Delete")}
            </button>
          )}
        </div>
      </div>
      {/* main div */}
      <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
        <p className="font-bold text-black md:text-xl">
          {t("Personal details")}
        </p>
        {/* personal details */}
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
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
          {/*account name */}
          <div className="w-full space-y-2">
            <label htmlFor="account_name" className="Label">
              {t("Account name")}
            </label>
            <input
              type="text"
              placeholder={t("Type here...")}
              className="input_field"
              {...register("accountName")}
            />
            <span className="error">{errors?.accountName?.message}</span>
          </div>
          {/* account number */}
          <div className="w-full space-y-2">
            <label htmlFor="account_number" className="Label">
              {t("account number")}
            </label>
            <input
              type="number"
              placeholder={t("Type here...")}
              className="input_field"
              {...register("accountNumber")}
            />
            <span className="error">{errors?.accountNumber?.message}</span>
          </div>
          {/*email */}
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
        </div>
        <hr className="my-1" />

        <hr className="my-1" />
        {/* billing address */}
        <p className="font-bold text-black md:text-xl">
          {t("Billing Address")}
        </p>
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/* company  address  */}
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

export default EditDetailsThirdPartyPayer;
