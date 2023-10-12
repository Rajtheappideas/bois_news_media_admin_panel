import React from "react";
import { BiPencil } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
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
import { Controller, useForm } from "react-hook-form";
import {
  handleChangeDeleteID,
  handleChangeDeleteSubscriptionID,
  handleDeleteSUBSCRIBER,
  handleDeleteSubsciption,
  handleDeleteSubscriber,
  handleEditSubscriber,
  handleFindSubscriber,
  handleDeleteSubscription,
  handleDeleteSUBSCRIPTION,
  handleFindSubscription,
} from "../../redux/SubscriberSlice";
import { useTranslation } from "react-i18next";
import moment from "moment";

const EditSubscriberDetails = ({
  setShowEditSubscriberDetails,
  setShowMagazineDistrutionPopup,
  setSelectedSubscriberId,
}) => {
  const {
    editLoading,
    deleteLoading,
    singleSucriber,
    loading,
    deleteSubscriptionID,
    subscribers,
  } = useSelector((state) => state.root.subscribers);
  const { token, role } = useSelector((state) => state.root.auth);
  const { payers } = useSelector((state) => state.root.thirdPartyPayers);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { AbortControllerRef } = useAbortApiCall();

  const {
    fname,
    lname,
    company,
    phone,
    mobile,
    thirdPartyPayer,
    title,
    email,
    subscriptions,
    civility,
    shippingAddress: {
      address1,
      address2,
      address3,
      city,
      country,
      province,
      zipCode,
    },
    billingAddress,
    billingSupplement,
    _id,
  } = singleSucriber;

  const EditSubscirberSchema = yup.object({
    fname: yup
      .string()
      .required(t("FirstName is required"))
      .trim()
      .max(60, t("Max character limit reached"))
      .min(1, t("minimum three character required"))
      .typeError(t("Only characters allowed"))
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        t("FirstName can only contain Latin letters.")
      ),
    lname: yup
      .string()
      .required(t("LastName is required"))
      .trim()
      .max(60, t("Max character limit reached"))
      .min(1, t("minimum three character required"))
      .typeError(t("Only characters allowed"))
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        t("LastName can only contain Latin letters.")
      ),
    civility: yup
      .string()
      .required(t("Civility is required"))
      .trim()
      .max(60, t("Max character limit reached"))
      .min(3, t("minimum three character required"))
      .typeError(t("Only characters allowed"))
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        t("Civility can only contain Latin letters.")
      ),
    title: yup.string().trim().max(60, t("Max character limit reached")),
    email: yup.string().email().required(t("email is required.")).trim(),
    phone: yup.string().required(t("phone is required")),
    mobile: yup.string(),
    company: yup.string().max(60, t("Max character limit reached")),
    address1: yup
      .string()
      .max(200, t("Maximum character limit reached"))
      .required(t("address1 is required")),
    address2: yup.string().max(200, t("Maximum character limit reached")),
    address3: yup.string().max(200, t("Maximum character limit reached")),
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
        t("city can only contain Latin letters.")
      )
      .required(t("city is required")),
    province: yup
      .string()
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        t("province can only contain Latin letters.")
      ),
    country: yup
      .string()
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        t("country can only contain Latin letters.")
      )
      .required(t("country is required")),
    baddress1: yup.string().max(200, t("Maximum character limit reached")),
    baddress2: yup.string().max(200, t("Maximum character limit reached")),
    baddress3: yup.string().max(200, t("Maximum character limit reached")),
    bzipCode: yup.string().max(6, t("max 6 number allowed")).trim(""),
    bcity: yup
      .string()
      .max(40, t("Maximum character limit reached"))
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        t("city can only contain Latin letters.")
      ),
    bprovince: yup
      .string()
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        t("province can only contain Latin letters.")
      ),
    bcountry: yup
      .string()
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        t("country can only contain Latin letters.")
      ),
    sameAsAbove: yup.boolean(),
    thirdPartyPayer: yup.string(""),
    accountingContact: yup
      .string("")
      .max(60, t("Max character limit reached"))
      .typeError(t("Only characters allowed"))
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        t("accountContactName can only contain Latin letters.")
      ),
    accountingEmail: yup.string().email(),
    accountingPhone: yup.string(),
    VATnumber: yup.string().max(30, t("max 30 numbers")),
    VATcode: yup.string(),
    clientCode: yup.string(),
    companyRegNum: yup.string(),
    companyWebsite: yup.string(),
    activityDomain: yup.string(),
    contactOrigin: yup.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    getValues,
    control,
    watch,
  } = useForm({
    shouldFocusError: true,
    reValidateMode: "onChange",
    mode: "onChange",
    resolver: yupResolver(EditSubscirberSchema),
    defaultValues: {
      sameAsAbove: false,
      fname,
      lname,
      company,
      phone,
      mobile,
      thirdPartyPayer,
      title,
      email,
      civility,
      address1,
      address2,
      address3,
      city,
      country,
      province,
      zipCode,
      baddress1: billingAddress?.address1,
      baddress2: billingAddress?.address2,
      baddress3: billingAddress?.address3,
      bcity: billingAddress?.city,
      bcountry: billingAddress?.country,
      bprovince: billingAddress?.province,
      bzipCode: billingAddress?.zipCode,
      VATcode: billingSupplement?.VATcode,
      VATnumber: billingSupplement?.VATnumber,
      accountingContact: billingSupplement?.accountingContact,
      accountingEmail: billingSupplement?.accountingEmail,
      accountingPhone: billingSupplement?.accountingPhone,
      activityDomain: billingSupplement?.activityDomain,
      clientCode: billingSupplement?.clientCode,
      companyRegNum: billingSupplement?.companyRegNum,
      companyWebsite: billingSupplement?.companyWebsite,
      contactOrigin: billingSupplement?.contactOrigin,
    },
  });

  const onSubmit = (data) => {
    const {
      fname,
      lname,
      email,
      phone,
      company,
      address1,
      address2,
      address3,
      baddress1,
      baddress2,
      baddress3,
      city,
      bcity,
      zipCode,
      bzipCode,
      province,
      country,
      bcountry,
      bprovince,
      civility,
      mobile,
      title,
      thirdPartyPayer,
      accountingContact,
      accountingEmail,
      accountingPhone,
      VATcode,
      VATnumber,
      companyRegNum,
      companyWebsite,
      activityDomain,
      contactOrigin,
      clientCode,
    } = data;
    if (!isDirty) {
      setShowEditSubscriberDetails(false);
      return true;
    } else if (!isPossiblePhoneNumber(phone) || !isValidPhoneNumber(phone)) {
      toast.remove();
      toast.error("Phone is invalid");
      return true;
    } else if (
      (getValues("mobile") !== "" && !isPossiblePhoneNumber(phone)) ||
      !isValidPhoneNumber(phone)
    ) {
      toast.remove();
      toast.error("Phone is invalid");
      return true;
    }
    const response = dispatch(
      handleEditSubscriber({
        fname,
        lname,
        email,
        title,
        company,
        civility,
        phone,
        mobile,
        address1,
        address2,
        address3,
        zipCode,
        city,
        province,
        country,
        baddress1,
        baddress2,
        baddress3,
        bzipCode,
        bcity,
        bprovince,
        bcountry,
        thirdPartyPayer,
        accountingContact,
        accountingEmail,
        accountingPhone,
        VATcode,
        VATnumber,
        companyRegNum,
        companyWebsite,
        activityDomain,
        contactOrigin,
        clientCode,
        id: _id,
        token,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success(
            ` ${fname.concat(lname)} ${t("subscriber edited successfully.")}`,
            { duration: 2000 }
          );
          setShowEditSubscriberDetails(false);
        } else if (res?.payload?.status === "error") {
          toast.error(res?.payload?.message);
        }
      });
    }
  };

  const handleDeletesubscriber = (id, name) => {
    if (window.confirm(t("Are you sure?"))) {
      dispatch(handleChangeDeleteID(id));
      const response = dispatch(
        handleDeleteSUBSCRIBER({ id, token, signal: AbortControllerRef })
      );
      if (response) {
        response.then((res) => {
          if (res?.payload?.status === "success") {
            dispatch(handleDeleteSubscriber(id));
            toast.success(` ${name} ${t("subscriber Deleted Successfully.")}`);
            setShowEditSubscriberDetails(false);
          } else if (res?.payload?.status === "error") {
            toast.error(res?.payload?.message);
          }
        });
      }
    }
  };

  const handleDeletesubscription = (id, name) => {
    dispatch(handleChangeDeleteSubscriptionID(id));

    const response = dispatch(
      handleDeleteSUBSCRIPTION({ id, token, signal: AbortControllerRef })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          dispatch(handleDeleteSubscription({ id, subscriberId: _id }));
          toast.success(` ${name} ${t("subscription Deleted Successfully.")}`);
        } else if (res?.payload?.status === "error") {
          toast.error(res?.payload?.message);
        }
      });
    }
  };

  const handleShowMagazinePopupForEditSubscription = (
    subscriberId,
    subscriptionId
  ) => {
    setShowMagazineDistrutionPopup(true);
    dispatch(handleFindSubscription({ subscriberId, subscriptionId }));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full lg:space-y-5 space-y-3"
    >
      {/* title + buttons */}
      <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
        <p className="font-semibold text-left lg:text-xl text-lg">
          {t("Subscriber Detail")}
        </p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            className={`gray_button ${
              (editLoading || deleteLoading) && "cursor-not-allowed"
            }`}
            onClick={() => {
              setShowEditSubscriberDetails(false);
              dispatch(handleFindSubscriber(""));
            }}
            disabled={deleteLoading || editLoading}
          >
            {t("Cancel")}
          </button>
          <button
            className={`green_button ${
              (editLoading || deleteLoading) && "cursor-not-allowed"
            } `}
            disabled={deleteLoading || editLoading}
            type="submit"
          >
            {editLoading ? t("Saving").concat("...") : t("Save")}
          </button>
          {role === "admin" && (
            <button
              className={`red_button ${
                (editLoading || deleteLoading) && "cursor-not-allowed"
              }`}
              disabled={deleteLoading || editLoading}
              onClick={() => handleDeletesubscriber(_id, fname.concat(lname))}
            >
              {deleteLoading ? t("Deleting").concat("...") : t("Delete")}
            </button>
          )}
        </div>
      </div>
      {/* main div */}
      <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
        <p className="font-bold text-black md:text-xl">
          {t("personal details")}
        </p>
        {/* personal details */}
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/* first name */}
          <div className="w-full space-y-2">
            <label htmlFor="fname" className="Label">
              {t("first name")}
            </label>
            <input
              type="text"
              placeholder={t("Type here...")}
              className="input_field"
              {...register("fname")}
            />
            <span className="error">{errors?.fname?.message}</span>
          </div>
          {/* last  name */}
          <div className="w-full space-y-2">
            <label htmlFor="lastname" className="Label">
              {t("last name")}
            </label>
            <input
              type="text"
              placeholder={t("Type here...")}
              className="input_field"
              {...register("lname")}
            />
            <span className="error">{errors?.lname?.message}</span>
          </div>
          {/* title */}
          <div className="w-full space-y-2">
            <label htmlFor="title" className="Label">
              {t("title")}
            </label>
            <input
              type="text"
              placeholder={t("Type here...")}
              className="input_field"
              {...register("title")}
            />
            <span className="error">{errors?.title?.message}</span>
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
            <span className="error">{errors?.company?.message}</span>
          </div>
          {/* civility */}
          <div className="w-full space-y-2">
            <label htmlFor="civility" className="Label">
              {t("civility")}
            </label>
            <input
              type="text"
              placeholder={t("Type here...")}
              className="input_field"
              {...register("civility")}
            />
            <span className="error">{errors?.civility?.message}</span>
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
              {...register("email")}
            />
            <span className="error">{errors?.email?.message}</span>
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
                  value={phone}
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
          {/*mobile phone */}
          <div className="w-full space-y-2">
            <label htmlFor="mobile" className="Label">
              {t("mobile phone")}
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
        {/*shipping  address */}
        <p className="font-bold text-black md:text-xl">
          {t("Shipping Address")}
        </p>
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/*address 1 */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="address1" className="Label">
              {t("address")} 1
            </label>
            <textarea
              type="text"
              placeholder={t("Type here...")}
              className="input_field min-h-[5rem] max-h-[15rem]"
              {...register("address1")}
            />
            <span className="error">{errors?.address1?.message}</span>
          </div>
          {/*address 2 */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="address2" className="Label">
              {t("address")} 2
            </label>
            <textarea
              type="text"
              placeholder={t("Type here...")}
              className="input_field min-h-[5rem] max-h-[15rem]"
              {...register("address2")}
            />
            <span className="error">{errors?.address2?.message}</span>
          </div>
          {/*address 3 */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="address3" className="Label">
              {t("address")} 3
            </label>
            <textarea
              type="text"
              placeholder={t("Type here...")}
              className="input_field min-h-[5rem] max-h-[15rem]"
              {...register("address3")}
            />
            <span className="error">{errors?.address3?.message}</span>
          </div>
          {/* postal code */}
          <div className="w-full space-y-2">
            <label htmlFor="postalcode" className="Label">
              {t("Postal code")}
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
        </div>
        <hr className="my-1" />
        {/*billing address */}
        <p className="font-bold text-black md:text-xl">
          {t("Billing Address")}
        </p>
        {/* billing addrss */}
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/*address 1 */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="address1" className="Label">
              {t("address")} 1
            </label>
            <textarea
              type="text"
              placeholder={t("Type here...")}
              className="input_field min-h-[5rem] max-h-[15rem]"
              {...register("baddress1")}
              disabled={getValues("sameAsAbove")}
            />
          </div>
          {/*address 2 */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="address2" className="Label">
              {t("address")} 2
            </label>
            <textarea
              type="text"
              placeholder={t("Type here...")}
              className="input_field min-h-[5rem] max-h-[15rem]"
              {...register("baddress2")}
              disabled={getValues("sameAsAbove")}
            />
          </div>
          {/*address 3 */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="address3" className="Label">
              {t("address")} 3
            </label>
            <textarea
              type="text"
              placeholder={t("Type here...")}
              className="input_field min-h-[5rem] max-h-[15rem]"
              {...register("baddress3")}
              disabled={getValues("sameAsAbove")}
            />
          </div>
          {/* postal code */}
          <div className="w-full space-y-2">
            <label htmlFor="postalcode" className="Label">
              {t("Postal code")}
            </label>
            <input
              type="number"
              placeholder={t("Type here...")}
              className="input_field"
              maxLength={6}
              minLength={6}
              {...register("bzipCode")}
              disabled={getValues("sameAsAbove")}
            />
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
              disabled={getValues("sameAsAbove")}
            />
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
              {...register("bprovince")}
              disabled={getValues("sameAsAbove")}
            />
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
              disabled={getValues("sameAsAbove")}
            />
          </div>
        </div>
        <hr className="my-1" />
        {/* third payyer */}
        <p className="font-bold text-black md:text-xl">Third-Party Payer</p>
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          <div className="w-full space-y-2">
            <label htmlFor="thirdPartyPayer" className="Label">
              {t("select third-Party Payer")}
            </label>
            <select {...register("thirdPartyPayer")} className="input_field">
              <option label="Choose Third party payer"></option>
              {payers !== undefined &&
                payers.length > 0 &&
                payers.map((payer) => (
                  <option key={payer?._id} value={payer?.accountName}>
                    {payer?.accountName}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <hr className="my-1" />
        {/* billing supplement */}
        <p className="font-bold text-black md:text-xl">
          {t("Billing supplement")}
        </p>
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/* Accounting contact (name) */}
          <div className="w-full space-y-2">
            <label htmlFor="account_contact_name" className="Label">
              {t("Accounting contactname")}
            </label>
            <input
              type="text"
              placeholder={t("Type here...")}
              className="input_field"
              {...register("accountingContact")}
            />
            <span className="error">{errors?.accountingContact?.message}</span>
          </div>
          {/* Accounting email*/}
          <div className="w-full space-y-2">
            <label htmlFor="accounting_email" className="Label">
              {t("Accounting email")}
            </label>
            <input
              type="email"
              placeholder={t("Type here...")}
              className="input_field"
              {...register("accountingEmail")}
            />
            <span className="error">{errors?.accountingEmail?.message}</span>
          </div>
          {/* Accounting phone */}
          <div className="w-full space-y-2">
            <label htmlFor="accounting_phone" className="Label">
              {t("Accounting phone")}{" "}
            </label>
            <Controller
              name="accountingPhone"
              control={control}
              rules={{
                validate: (value) => isValidPhoneNumber(value),
              }}
              render={({ field: { onChange, value } }) => (
                <PhoneInput
                  country={"us"}
                  onChange={(value) => {
                    onChange((e) => {
                      setValue("accountingPhone", "+".concat(value));
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
          </div>
          {/* VAT Number */}
          <div className="w-full space-y-2">
            <label htmlFor="VAT_number" className="Label">
              {t("VAT Number")}{" "}
            </label>
            <input
              type="number"
              placeholder={t("Type here...")}
              className="input_field"
              {...register("VATnumber")}
            />
          </div>
          {/* VAT Code */}
          <div className="w-full space-y-2">
            <label htmlFor="VATcode" className="Label">
              {t("VAT Code")}
            </label>
            <select
              {...register("VATcode")}
              name="VATcode"
              className="input_field"
            >
              <option value="0">Invoice VAT amount</option>
              <option value="1">Metropolitan France</option>
              <option value="2">
                Tax-free invoicing - Reverse charge, Intra-Community delivery
                Article 262 Ter of the CGI
              </option>
              <option value="3">
                EU without VAT number. EU private individual Client code Code
                Client Optionnal{" "}
              </option>
            </select>
          </div>
          {/* Client code */}
          <div className="w-full space-y-2">
            <label htmlFor="client_code" className="Label">
              {t("Client code")}
            </label>
            <input
              type="text"
              placeholder={t("Type here...")}
              className="input_field"
              {...register("clientCode")}
            />
            <span className="error">{errors?.clientCode?.message}</span>
          </div>
          {/* Company registration number */}
          <div className="w-full space-y-2">
            <label htmlFor="company_registration_number" className="Label">
              {t("Company registration number")}
            </label>
            <input
              type="number"
              placeholder={t("Type here...")}
              className="input_field"
              {...register("companyRegNum")}
            />
            <span className="error">{errors?.companyRegNum?.message}</span>
          </div>
          {/*Company website */}
          <div className="w-full space-y-2">
            <label htmlFor="company_website" className="Label">
              {t("Company website")}
            </label>
            <input
              type="text"
              placeholder={t("Type here...")}
              className="input_field"
              {...register("companyWebsite")}
            />
            <span className="error">{errors?.companyWebsite?.message}</span>
          </div>
          {/* Activity domain */}
          <div className="w-full space-y-2">
            <label htmlFor="activity_domain" className="Label">
              {t("Activity domain")}{" "}
            </label>
            <input
              type="text"
              placeholder={t("Type here...")}
              className="input_field"
              {...register("activityDomain")}
            />
            <span className="error">{errors?.activityDomain?.message}</span>
          </div>
          {/* Contact origin */}
          <div className="w-full space-y-2">
            <label htmlFor="contact_origin" className="Label">
              {t("Contact origin")}{" "}
            </label>
            <input
              type="text"
              placeholder={t("Type here...")}
              className="input_field"
              {...register("contactOrigin")}
            />
            <span className="error">{errors?.contactOrigin?.message}</span>
          </div>
        </div>
        <hr className="my-1" />
        {/* Magazine distribution */}
        <div className="font-bold text-black md:text-xl flex flex-wrap w-full flex-row items-center justify-between gap-2">
          <p>{t("Magazine distribution")}</p>
          <button
            onClick={() => {
              setShowMagazineDistrutionPopup(true);
              setSelectedSubscriberId(_id);
            }}
            type="button"
            className="border text-base text-textColor border-textColor rounded-md p-1 hover:bg-textColor/30 transition hover:text-black"
          >
            + {t("Add new")}
          </button>
        </div>

        <div className="shadow-md outline-none rounded-2xl md:mt-5 mt-3 py-3 px-4 bg-white overflow-x-scroll scrollbar">
          <table className="border-none outline-none w-full overflow-scroll">
            <thead className="w-full border-b border-gray-100 text-left">
              <tr>
                <th className="p-4 whitespace-nowrap">
                  <span>{t("Magazine")}</span>
                </th>
                <th className="p-4">{t("Sub state")}</th>
                <th className="p-4">{t("Prospect state")}</th>
                <th className="p-4">{t("Start date")}</th>
                <th className="p-4">{t("Renewal date")}</th>
                <th className="p-4">{t("Action")}</th>
              </tr>
            </thead>
            <tbody className="w-full">
              {subscriptions !== undefined && subscriptions.length > 0 ? (
                subscriptions.map((subscription) => (
                  <tr
                    key={subscription?._id}
                    className="border-b border-gray-200 w-full text-left"
                  >
                    <td className="p-4 whitespace-nowrap">
                      {subscription?.subscription?.title}
                    </td>
                    <td className="text-left p-4 whitespace-nowrap">
                      {subscription?.subState}
                    </td>
                    <td className="text-left p-4 whitespace-nowrap">
                      {subscription?.prospectState}{" "}
                    </td>
                    <td className="text-left p-4 whitespace-nowrap">
                      {moment(subscription?.startDate).format("LL")}{" "}
                    </td>
                    <td className="text-left p-4 whitespace-nowrap">
                      {moment(subscription?.renewDate).format("LL")}
                    </td>
                    <td className="flex items-center justify-start p-4">
                      <button
                        onClick={() =>
                          handleShowMagazinePopupForEditSubscription(
                            _id,
                            subscription?._id
                          )
                        }
                        type="button"
                        className="hover:bg-gray-200 p-1 rounded-full h-10 w-10"
                        disabled={deleteLoading}
                      >
                        <BiPencil
                          color="gray"
                          size={30}
                          className="inline-block mr-1"
                        />
                      </button>
                      <button
                        type="button"
                        className="hover:bg-red-200 p-1 rounded-full h-10 w-10"
                        disabled={deleteLoading}
                        onClick={() =>
                          handleDeletesubscription(
                            subscription?._id,
                            subscription?.subscription?.title
                          )
                        }
                      >
                        {deleteLoading &&
                        subscription?._id === deleteSubscriptionID ? (
                          "..."
                        ) : (
                          <RiDeleteBin6Line
                            color="red"
                            size={30}
                            className="inline-block"
                          />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="data_not_found_And_Loading">
                  <td colSpan="7">{t("No Subscriptions here")}.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </form>
  );
};

export default EditSubscriberDetails;
