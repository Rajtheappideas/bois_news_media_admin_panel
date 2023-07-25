import React, { useEffect, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import ReactModal from "react-modal";

const AddMagazineDistribution = ({
  handleClosePopup,
  showMagazineDistrutionPopup,
}) => {
  const popupRef = useRef(null);

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
    console.log(":Asdsad");
    handleClosePopup();
  }

  return (
    <>
      <ReactModal
        className={`overflow-hidden scrollbar bg-black/20 z-50 w-full min-h-screen max-h-screen inset-0 backdrop-blur-sm`}
        appElement={document.getElementById("root")}
        isOpen={showMagazineDistrutionPopup}
        onRequestClose={() => handleClosePopup()}
        shouldCloseOnEsc={true}
        style={{ content: { zIndex: 999 } }}
      >
        <div
          ref={popupRef}
          className={`bg-white select-none p-4 xl:w-2/5 md:w-1/2 w-11/12 rounded-md absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 md:space-y-3 space-y-1`}
        >
          {/* title + button */}
          <div className="flex items-center justify-between w-full">
            <p className="font-semibold text-lg select-none">
              Add magazine distribution
            </p>
            <button onClick={handleClosePopup}>
              <AiOutlineClose size={30} />
            </button>
          </div>
          {/* subscription */}
          <label htmlFor="subscription" className="Label">
            Subcscription
          </label>
          <select
            name="subcscription"
            className="input_field"
            id="subcscription"
          >
            <option value="option1">option 1</option>
            <option value="option2">option 2</option>
            <option value="option3">option 3</option>
            <option value="option4">option 4</option>
          </select>
          {/* sub / prospect state */}
          <div className="w-full flex md:flex-row flex-col items-center justify-start gap-3">
            <div className="md:space-y-2 space-y-1 md:w-1/2 w-full">
              <label htmlFor="sub_state" className="Label">
                Sub state
              </label>
              <select name="sub_state" className="input_field" id="sub_state">
                <option value="option1">option 1</option>
                <option value="option2">option 2</option>
                <option value="option3">option 3</option>
                <option value="option4">option 4</option>
              </select>
            </div>
            <div className="md:space-y-2 space-y-1 md:w-1/2 w-full">
              <label htmlFor="prospect_state" className="Label">
                prospect state
              </label>
              <select
                name="prospect_state"
                className="input_field"
                id="prospect_state"
              >
                <option value="option1">option 1</option>
                <option value="option2">option 2</option>
                <option value="option3">option 3</option>
                <option value="option4">option 4</option>
              </select>
            </div>
          </div>
          {/* start / renewal date */}
          <div className="w-full flex md:flex-row flex-col items-center justify-start gap-3">
            <div className="md:space-y-2 space-y-1 md:w-1/2 w-full">
              <label htmlFor="start_date" className="Label">
                Start state
              </label>
              <input
                type="date"
                placeholder="DD/MM/YYYY"
                className="input_field"
              />
            </div>
            <div className="md:space-y-2 space-y-1 md:w-1/2 w-full">
              <label htmlFor="renewal_date" className="Label">
                Renewal state
              </label>
              <input
                type="date"
                placeholder="DD/MM/YYYY"
                className="input_field"
              />
            </div>
          </div>
          {/* button */}
          <button className="bg-primaryBlue text-white font-medium text-center md:h-12 h-10 rounded-lg p-2 hover:bg-primaryBlue/80 active:scale-95 transition w-full">
            Save
          </button>
        </div>
      </ReactModal>
    </>
  );
};

export default AddMagazineDistribution;
