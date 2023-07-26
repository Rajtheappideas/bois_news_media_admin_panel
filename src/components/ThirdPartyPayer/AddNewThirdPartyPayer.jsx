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
import { handleAddNewPayer } from "../../redux/ThirdPartyPayerSlice";

const AddNewThirdPartyPayer = ({ setShowAddnewPayer }) => {
  const { addNewPayerLoading } = useSelector((state) => state.root.thirdPartyPayers);
  const { token } = useSelector((state) => state.root.auth);

  const dispatch = useDispatch();

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const addNewPayerSchema = yup.object({
    accountName: yup
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
    companyAddress: yup
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
    accountNumber: yup
      .string()
      .required("office Number is required")
      .max(15, "maximum 15 numbers!!!"),
    mobile: yup.string().required("mobile phone is required"),
    email: yup.string().email().required("email is required.").trim(),
    status: yup.string().required("status is required.").trim(),
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
    resolver: yupResolver(addNewPayerSchema),
    defaultValues: {},
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
    if (!isPossiblePhoneNumber(mobile) || !isValidPhoneNumber(mobile)) {
      toast.remove();
      toast.error("mobile phone is invalid");
      return true;
    }
    const response = dispatch(
      handleAddNewPayer({
        status,
        accountName,
        email,
        mobile,
        accountNumber,
        companyAddress,
        city,
        country,
        zipCode,
        token,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success(`${accountName} payer added Successfully.`, { duration: 2000 });
          setShowAddnewPayer(false);
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full lg:space-y-5 space-y-3"
    >
      {/* title + buttons */}
      <div className="w-full flex justify-between items-center md:flex-row flex-col gap-3">
        <p className="font-semibold text-left lg:text-xl text-lg">
          Add new third-party payer
        </p>
        <div className="flex flex-wrap items-center justify-start md:gap-3 gap-1">
          <button
            className={`gray_button  ${
              addNewPayerLoading && "cursor-not-allowed"
            } `}
            onClick={() => setShowAddnewPayer(false)}
            disabled={addNewPayerLoading}
          >
            Cancel
          </button>
          <button
            className={`green_button ${
              addNewPayerLoading && "cursor-not-allowed"
            } `}
            disabled={addNewPayerLoading}
            type="submit"
          >
            {addNewPayerLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
      {/* main div */}
      <div className="md:p-8 p-4 rounded-md shadow-md bg-white md:space-y-5 space-y-3">
        <p className="font-bold text-black md:text-xl">Personal details</p>
        {/* personal details */}
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
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
          {/*account name */}
          <div className="w-full space-y-2">
            <label htmlFor="account_name" className="Label">
              Account name
            </label>
            <input
              type="text"
              placeholder="Type here..."
              className="input_field"
              {...register("accountName")}
            />
            <span className="error">{errors?.accountName?.message}</span>
          </div>
          {/* account number */}
          <div className="w-full space-y-2">
            <label htmlFor="account_number" className="Label">
              account number
            </label>
            <input
              type="number"
              placeholder="Type here..."
              className="input_field"
              {...register("accountNumber")}
            />
            <span className="error">{errors?.accountNumber?.message}</span>
          </div>
          {/*email */}
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
          {/* mobile number */}
          <div className="w-full space-y-2">
            <label htmlFor="mobile_number" className="Label">
              mobile number
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
        </div>
        <hr className="my-1" />

        <hr className="my-1" />
        {/* billing address */}
        <p className="font-bold text-black md:text-xl">Billing Address</p>
        <div className="w-full grid md:grid-cols-3 place-items-start items-center md:gap-5 gap-2">
          {/* company  address  */}
          <div className="w-full col-span-full space-y-2">
            <label htmlFor="company_address" className="Label">
              company address
            </label>
            <textarea
              placeholder="Type here..."
              className="input_field min-h-[5rem] max-h-[15rem]"
              {...register("companyAddress")}
            />
            <span className="error">{errors?.companyAddress?.message}</span>
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

export default AddNewThirdPartyPayer;
