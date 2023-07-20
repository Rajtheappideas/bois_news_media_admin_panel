import { useRef } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const useAbortApiCall = () => {
  const { loading } = useSelector((state) => state.root.auth);

  const AbortControllerRef = useRef(null);
  const abortApiCall = () => {
    toast.remove();
    AbortControllerRef.current !== null && AbortControllerRef.current.abort();
    if (loading) return toast.error("Request Cancelled!!!");
  };
  return {
    AbortControllerRef,
    abortApiCall,
  };
};

export default useAbortApiCall;