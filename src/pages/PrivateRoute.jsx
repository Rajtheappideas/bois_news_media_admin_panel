import React from "react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.root.user);

  const navigate = useNavigate();
  useEffect(() => {
    if (user === null) {
      navigate("/sign-in");
      toast.error("Please sign-in first!!!");
    }
  }, []);
  return <>{children}</>;
};

export default PrivateRoute;
