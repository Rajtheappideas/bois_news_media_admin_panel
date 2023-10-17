import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useAbortApiCall from "../../hooks/useAbortApiCall";
import toast from "react-hot-toast";
import {
  handleChangeOrderStatus,
  handleFindSingleOrder,
  handleUpdateOrderStatus,
} from "../../redux/OrderSlice";
import { BsEye } from "react-icons/bs";

const SingleOrderList = ({ order, setshowOrderDetails }) => {
  const [orderStatus, setOrderStatus] = useState("On Hold");

  const { updateLoading } = useSelector((state) => state.root.orders);

  const { token, role } = useSelector((state) => state.root.auth);

  const { AbortControllerRef } = useAbortApiCall();
  const dispatch = useDispatch();

  const hanldeChangeOrderStatus = (id, status) => {
    if (role !== "admin") return;
    if (updateLoading) return;
    toast.loading("Updating Status...");
    const response = dispatch(
      handleUpdateOrderStatus({ status, id, token, signal: AbortControllerRef })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.remove();
          toast.success("status updated.");
          setOrderStatus(status);
          dispatch(handleChangeOrderStatus({ id, status }));
        }
      });
    }
  };

  useEffect(() => {
    setOrderStatus(order?.status);
  }, []);

  return (
    <tr className="border-b last:border-none border-gray-200 w-full text-left">
      <td className="p-4 whitespace-nowrap">{order?.orderId}</td>

      <td className="text-left p-4 whitespace-nowrap">
        {moment(order?.date).format("lll")}
      </td>
      <td className="text-left p-4 whitespace-nowrap">
        {order?.subscriber?.fname} {order?.subscriber?.lname}
      </td>
      <td className="text-left p-4 whitespace-nowrap">Cash</td>
      <td className="text-left p-4 whitespace-nowrap">€ {parseFloat(order?.total).toFixed(2)}</td>
      {role === "viewer" ? (
        <td className="text-left p-4">{orderStatus}</td>
      ) : (
        <td className="text-left p-4">
          <select
            name="status"
            className="border border-gray-200 rounded-md p-1 font-medium"
            value={orderStatus}
            onChange={(e) => {
              hanldeChangeOrderStatus(order?._id, e.target.value);
              setOrderStatus(e.target.value);
            }}
          >
            <option value="On Hold">On hold</option>
            <option value="Order Received">Order received</option>
            <option value="Order Accepted">Order accepted</option>
            <option value="Delivered">Delivered</option>
          </select>
        </td>
      )}

      <td className="flex items-center justify-start p-4">
        {/* <button
            type="button"
            className="hover:bg-gray-200 p-1 rounded-full h-10 w-10"
          >
            <BiPrinter
              color="gray"
              size={30}
              className="inline-block mr-1"
            />
          </button> */}
        <button
          onClick={() => {
            dispatch(handleFindSingleOrder(order?._id));
            setshowOrderDetails(true);
          }}
          type="button"
          className="hover:bg-gray-200 p-1 rounded-full h-10 w-10"
        >
          <BsEye color="gray" size={30} className="inline-block" />
        </button>
      </td>
    </tr>
  );
};

export default SingleOrderList;
