import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineClose } from "react-icons/ai";
import ReactModal from "react-modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import { toast } from "react-hot-toast";
import {
  handleClearSingleSubscription,
  handleCreateSubsciption,
  handleEditSubsciption,
} from "../../redux/SubscriberSlice";
import moment from "moment";
import ReactDatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

const AddMagazineSubscription = ({
  handleClosePopup,
  showMagazineDistrutionPopup,
  selectedSubscriberId,
  setSelectedSubscriberId,
}) => {
  const popupRef = useRef(null);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { token } = useSelector((state) => state.root.auth);
  const { subscriptions } = useSelector((state) => state.root.subscriptions);
  const { singleSubscription } = useSelector((state) => state.root.subscribers);

  const { loading } = useSelector((state) => state.root.subscribers);

  const { AbortControllerRef, abortApiCall } = useAbortApiCall();

  const createSubscribptionSchema = yup.object({
    subscription: yup.string().required(t("subscription is required")).trim(),
    subState: yup.string().required(t("substate is required")).trim(),
    prospectState: yup
      .string()
      .required(t("prospect state is required"))
      .trim(),
    renewDate: yup.string().required(t("renew date is required")).trim(),
    startDate: yup.string().required(t("start date is required")).trim(),
  });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
    resolver: yupResolver(createSubscribptionSchema),
    defaultValues: {
      prospectState: singleSubscription?.prospectState ?? "",
      renewDate: singleSubscription?.renewDate.split("T")[0] ?? "",
      startDate: singleSubscription?.startDate.split("T")[0] ?? "",
      subscription: singleSubscription?.subscription?._id ?? "",
      subState: singleSubscription?.subState ?? "",
    },
  });

  const onSubmit = (data) => {
    const { subscription, subState, prospectState, startDate, renewDate } =
      data;
    if (selectedSubscriberId === null) {
      const response = dispatch(
        handleEditSubsciption({
          subState,
          prospectState,
          startDate,
          renewDate,
          subscription,
          id: singleSubscription?._id,
          token,
          signal: AbortControllerRef,
        })
      );
      if (response) {
        response.then((res) => {
          if (res?.payload?.status === "success") {
            toast.success(t("Magazine Subscription edited Successfully."), {
              duration: 2000,
            });
            handleClosePopup();
            dispatch(handleClearSingleSubscription());
          } else if (res?.payload?.status === "error") {
            toast.error(res?.payload?.message);
          }
        });
      }
    } else {
      const response = dispatch(
        handleCreateSubsciption({
          subscriber: selectedSubscriberId,
          subscription,
          subState,
          prospectState,
          startDate,
          renewDate,
          token,
          signal: AbortControllerRef,
        })
      );
      if (response) {
        response.then((res) => {
          if (res?.payload?.status === "success") {
            toast.success(t("Magazine Subscription added Successfully."), {
              duration: 2000,
            });
            handleClosePopup();
            setSelectedSubscriberId(null);
          } else if (res?.payload?.status === "error") {
            toast.error(res?.payload?.message);
          }
        });
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event?.target)) {
        handleClosePopup();
      }
      document.addEventListener("click", handleClickOutside, true);
      return () => {
        document.removeEventListener("click", handleClickOutside, true);
        document.removeEventListener("resize", () => {});
      };
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    handleClosePopup();
  }

  return (
    <>
      <ReactModal
        className={`overflow-hidden scrollbar bg-black/20 z-50 w-full min-h-screen max-h-screen inset-0 backdrop-blur-sm`}
        appElement={document.getElementById("root")}
        isOpen={showMagazineDistrutionPopup}
        onRequestClose={() => {
          handleClosePopup();
          dispatch(handleClearSingleSubscription());
        }}
        shouldCloseOnEsc={true}
        style={{ content: { zIndex: 999 } }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          ref={popupRef}
          className={`bg-white overflow-y-scroll scrollbar max-h-[80%] select-none p-4 xl:w-2/5 md:w-1/2 w-11/12 rounded-md absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 md:space-y-3 space-y-1`}
        >
          {/* title + button */}
          <div className="flex items-center justify-between w-full">
            <p className="font-semibold text-lg select-none">
              {t("Add magazine distribution")}
            </p>
            <button
              onClick={() => {
                handleClosePopup();
                dispatch(handleClearSingleSubscription());
              }}
            >
              <AiOutlineClose size={30} />
            </button>
          </div>
          {/* subscription */}
          <label htmlFor="subscription" className="Label">
            {t("Subcscription")}
          </label>
          <select
            name="subscription"
            className="input_field"
            {...register("subscription")}
          >
            <option label="Choose subscription"></option>
            {subscriptions.length > 0 &&
              subscriptions.map((subscription) => (
                <option value={subscription?._id} key={subscription?._id}>
                  {subscription?.title}
                </option>
              ))}
          </select>
          <span className="error">{errors?.subscription?.message}</span>
          {/* sub / prospect state */}
          <div className="w-full flex md:flex-row flex-col items-center justify-start gap-3">
            <div className="md:space-y-2 space-y-1 md:w-1/2 w-full">
              <label htmlFor="sub_state" className="Label">
                {t("Sub state")}
              </label>
              <select {...register("subState")} className="input_field">
                <option label="Choose sub state"></option>
                <option value="paper">paper</option>
                <option value="digital">digital</option>
                <option value="cancelled">cancelled</option>
              </select>
              <span className="error">{errors?.subState?.message}</span>
            </div>
            <div className="md:space-y-2 space-y-1 md:w-1/2 w-full">
              <label htmlFor="prospect_state" className="Label">
                {t("Prospect state")}
              </label>
              <select className="input_field" {...register("prospectState")}>
                <option label="Choose prospect state"></option>
                <option value="paper">paper</option>
                <option value="digital">digital</option>
                <option value="cancelled">cancelled</option>
              </select>
              <span className="error">{errors?.prospectState?.message}</span>
            </div>
          </div>
          {/* start / renewal date */}
          <div className="w-full flex md:flex-row flex-col items-center justify-start gap-3">
            <div className="md:space-y-2 space-y-1 md:w-1/2 w-full">
              <label htmlFor="start_date" className="Label">
                {t("Start state")}
              </label>
              <input
                type="date"
                placeholder="DD/MM/YYYY"
                className="input_field"
                {...register("startDate")}
                min={new Date().toISOString().split("T")[0]}
              />
              <span className="error">{errors?.startDate?.message}</span>
            </div>
            <div className="md:space-y-2 space-y-1 md:w-1/2 w-full">
              <label htmlFor="renewal_date" className="Label">
                {t("Renewal state")}
              </label>
              {/* <ReactDatePicker
                selected={getValues().renewDate}
                {...register("renewDate")}
                minDate={moment().format("L")}
                dateFormat="mm/dd/yyyy"
                className="input_field"
              /> */}
              <input
                type="date"
                placeholder="DD/MM/YYYY"
                className="input_field"
                {...register("renewDate")}
                min={moment().format("L")}
              />
              <span className="error">{errors?.renewDate?.message}</span>
            </div>
          </div>
          {/* button */}
          <button
            type="submit"
            className="bg-primaryBlue text-white font-medium text-center md:h-12 h-10 rounded-lg p-2 hover:bg-primaryBlue/80 active:scale-95 transition w-full"
            disabled={loading}
          >
            {loading ? t("Saving").concat("...") : t("Save")}
          </button>
        </form>
      </ReactModal>
    </>
  );
};

export default AddMagazineSubscription;
