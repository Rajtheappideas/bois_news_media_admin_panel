import React, { useState, useEffect } from "react";
import Search from "../components/Search";
import ReactPaginate from "react-paginate";
import { BiChevronsLeft, BiChevronsRight, BiPencil } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsEye } from "react-icons/bs";
import AddNewUser from "../components/Users/AddNewUser";
import EditUserDetails from "../components/Users/EditUserDetails";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  handleDeleteUSER,
  handleChangeDeleteID,
  handleFindUser,
  handlerFilterUsers,
  handleDeleteUser,
  handleGetAllUsers,
  handleGetUserbyId,
} from "../redux/UserSlice";
import useAbortApiCall from "../hooks/useAbortApiCall";
import { toast } from "react-hot-toast";
import ShowUsersDetailsOnly from "../components/Users/ShowUsersDetailsOnly";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { handleLogout } from "../redux/AuthSlice";
import { handleLogoutFromAllTabs } from "../redux/GlobalStates";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showAddNewUser, setShowAddNewUser] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [editUserId, setEditUserId] = useState(null);
  const [showUserDetailsOnly, setShowUserDetailsOnly] = useState(false);

  const {
    users,
    loading,
    addNewUserLoading,
    deleteUserLoading,
    deleteUserID,
    filterType,
  } = useSelector((state) => state.root.users);
  const { token, role } = useSelector((state) => state.root.auth);
  const { fileterdData, isSidebarOpen } = useSelector(
    (state) => state.root.globalStates
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const { AbortControllerRef } = useAbortApiCall();

  // pagination logic
  const usersPerPage = 8;
  const pageVisited = pageNumber * usersPerPage;
  let displayUsers = [];
  if (!loading) {
    displayUsers =
      users?.length > 0 && fileterdData.length === 0
        ? users.slice(pageVisited, usersPerPage + pageVisited)
        : fileterdData.slice(pageVisited, usersPerPage + pageVisited);
  }
  const pageCount =
    fileterdData.length === 0
      ? Math.ceil(users?.length / usersPerPage)
      : Math.ceil(fileterdData?.length / usersPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleDeleteruser = (id, name) => {
    if (window.confirm(t("Are you sure?"))) {
      dispatch(handleChangeDeleteID(id));

      const response = dispatch(
        handleDeleteUSER({ id, token, signal: AbortControllerRef })
      );
      if (response) {
        response.then((res) => {
          if (res?.payload?.status === "success") {
            dispatch(handleDeleteUser(id));
            toast.success(` ${name} ${t("user Deleted Successfully.")}`);
          } else if (res?.payload?.status === "error") {
            toast.error(res?.payload?.message);
          }
        });
      }
    }
  };

  const handleFetchSingleUser = (id,userId) => {
    const response = dispatch(
      handleGetUserbyId({ id, token, signal: AbortControllerRef })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          navigate(`/user/${userId}`);
        }
      });
    }
  };

  useEffect(() => {
    if (fileterdData && fileterdData.length > 0) {
      setPageNumber(0);
    }
  }, [fileterdData]);

  // fetch users
  useEffect(() => {
    const response = dispatch(
      handleGetAllUsers({ token, signal: AbortControllerRef })
    );
    if (response) {
      response.then((res) => {
        if (
          res?.payload?.status === "fail" &&
          (res?.payload?.message === "Please provide authentication token." ||
            res?.payload?.message === "Invalid token.")
        ) {
          dispatch(handleLogout());
          dispatch(handleLogoutFromAllTabs());
          toast.error("Please login again");
        }
      });
    }
  }, []);

  return (
    <>
      <Helmet title="Users | Bois News Media" />
      <div className="w-full flex items-start lg:gap-3 flex-row h-auto">
        <Sidebar />
        <section
          className={`h-full space-y-5 bg-[#FBFBFB] min-h-screen ${
            isSidebarOpen ? "xl:w-10/12 lg:w-4/5 w-full" : "lg:w-[90%] w-full"
          }`}
        >
          <Header />
          <div className="lg:p-5 p-3 ">
            {showUserDetail && !showAddNewUser && !showUserDetailsOnly && (
              <EditUserDetails
                setEditUserId={setEditUserId}
                editUserId={editUserId}
                setShowUserDetail={setShowUserDetail}
              />
            )}
            {!showUserDetail && !showUserDetailsOnly && showAddNewUser && (
              <AddNewUser setShowAddNewUser={setShowAddNewUser} />
            )}

            {!showUserDetail && !showAddNewUser && showUserDetailsOnly && (
              <ShowUsersDetailsOnly
                setShowUserDetailsOnly={setShowUserDetailsOnly}
              />
            )}

            {!showUserDetail && !showAddNewUser && !showUserDetailsOnly && (
              <div className="lg:space-y-5 select-none space-y-3 w-full">
                {/* search + buttons */}
                <div className="w-full flex items-center justify-between md:flex-row flex-col gap-4">
                  <div className="lg:w-1/3 md:w-1/2 w-full">
                    <Search data={users} />
                  </div>
                  <div>
                    <select
                      name="filter"
                      onChange={(e) => {
                        dispatch(handlerFilterUsers(e.target.value));
                      }}
                      value={filterType}
                      id="filter"
                      className="filter_dropdown outline-none"
                    >
                      <option value="newest">{t("newest")}</option>
                      <option value="oldest">{t("oldest")}</option>
                    </select>
                    {role === "admin" && (
                      <button
                        className="gray_button"
                        onClick={() => setShowAddNewUser(true)}
                      >
                        + {t("Add new")}
                      </button>
                    )}
                  </div>
                </div>
                {/* table */}
                <div className="shadow-sm outline-none rounded-2xl md:mt-5 mt-3 py-3 px-4 bg-white overflow-x-scroll scrollbar">
                  <table className="border-none outline-none w-full overflow-scroll">
                    <thead className="w-full border-b border-gray-100 text-center select-none">
                      <tr>
                        <th className="p-4 whitespace-nowrap text-center">
                          {/* <input
                      type="checkbox"
                      className="rounded-lg inline-block mr-2 h-4 w-4"
                      id="id"
                    /> */}
                          <label htmlFor="id">
                            <span>ID</span>
                          </label>
                        </th>
                        <th className="p-4 text-left">{t("Joining Date")}</th>
                        <th className="p-4 text-left">{t("Name")}</th>
                        <th className="p-4 text-left">{t("Email")}</th>
                        <th className="p-4 text-left">{t("Phone")}</th>
                        <th className="p-4 text-left">{t("Role")}</th>
                        <th className="p-4">{t("Action")}</th>
                      </tr>
                    </thead>
                    <tbody className="w-full">
                      {loading ? (
                        <tr className="data_not_found_And_Loading">
                          <td colSpan="7">{t("Loading")}....</td>
                        </tr>
                      ) : users.length !== 0 && users !== undefined ? (
                        displayUsers.map((user) => (
                          <tr
                            key={user?._id}
                            className="border-b last:border-none border-gray-200 w-full text-center"
                          >
                            <td className="p-4 whitespace-nowrap">
                              {/* <input
                          type="checkbox"
                          id={user?.userId}
                          className="rounded-lg inline-block mr-2 w-4 h-4"
                        /> */}
                              <label htmlFor={user?.userId}>
                                <span className="font-bold text-center ">
                                  {user?.userId}
                                </span>
                              </label>
                            </td>
                            <td className="text-left p-4 whitespace-nowrap">
                              {moment(user?.date).format("LL")}
                            </td>
                            <td className="text-left p-4 whitespace-nowrap">
                              {user?.name ?? "-"}
                            </td>
                            <td className="text-left p-4 whitespace-nowrap">
                              {user?.email ?? "-"}
                            </td>
                            <td className="text-left p-4 whitespace-nowrap">
                              {user?.phone ?? "-"}
                            </td>
                            <td className="text-left p-4">
                              {user?.role ?? "-"}
                            </td>
                            <td className="flex items-center justify-center p-4">
                              {role === "admin" || role === "editor" ? (
                                <button
                                  onClick={() => {
                                    // setShowUserDetail(true);
                                    // dispatch(handleFindUser(user?._id));
                                    handleFetchSingleUser(
                                      user?._id,
                                      user?.userId
                                    );
                                  }}
                                  disabled={deleteUserLoading || loading}
                                  type="button"
                                  className="hover:bg-gray-200 p-1 rounded-full h-10 w-10"
                                >
                                  <BiPencil
                                    color="gray"
                                    size={30}
                                    className="inline-block mr-1"
                                  />
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setShowUserDetailsOnly(true);
                                    dispatch(handleFindUser(user?._id));
                                  }}
                                  disabled={deleteUserLoading || loading}
                                  type="button"
                                  className="hover:bg-gray-200 p-1 rounded-full h-10 w-10"
                                >
                                  <BsEye
                                    color="gray"
                                    size={30}
                                    className="inline-block mr-1"
                                  />
                                </button>
                              )}

                              {role === "admin" && (
                                <button
                                  type="button"
                                  className="hover:bg-red-200 p-1 rounded-full h-10 w-10"
                                  onClick={() =>
                                    handleDeleteruser(user?._id, user?.name)
                                  }
                                  disabled={
                                    addNewUserLoading ||
                                    deleteUserLoading ||
                                    loading
                                  }
                                >
                                  {deleteUserLoading &&
                                  user?._id === deleteUserID ? (
                                    "..."
                                  ) : (
                                    <RiDeleteBin6Line
                                      color="red"
                                      size={30}
                                      className="inline-block"
                                    />
                                  )}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="data_not_found_And_Loading">
                          <td colSpan="7">{t("No users here")}.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* pagination */}
                <div className="flex items-center justify-between py-5">
                  <p className="font-medium capitalize md:text-base text-sm text-textBlack">
                    {t("Showing")}{" "}
                    {fileterdData.length === 0
                      ? (pageNumber + 1) * usersPerPage > users?.length
                        ? users?.length
                        : (pageNumber + 1) * usersPerPage
                      : (pageNumber + 1) * usersPerPage > fileterdData?.length
                      ? fileterdData?.length
                      : (pageNumber + 1) * usersPerPage}{" "}
                    {t("from")}{" "}
                    {fileterdData?.length === 0
                      ? users?.length
                      : fileterdData.length}{" "}
                    {t("users")}
                  </p>
                  <ReactPaginate
                    onPageChange={changePage}
                    previousLabel={
                      <BiChevronsLeft
                        className="text-blue-500 text-2xl"
                        role="button"
                      />
                    }
                    nextLabel={
                      <BiChevronsRight
                        className="text-blue-500 text-2xl"
                        role="button"
                      />
                    }
                    pageClassName="px-2"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    pageRangeDisplayed={1}
                    marginPagesDisplayed={1}
                    pageCount={pageCount}
                    containerClassName="pagination"
                    activeClassName="py-2 px-4 bg-primaryBlue cursor-pointer text-white rounded-lg text-center"
                    className="shadow-sm p-2 font-semibold text-textColor rounded-lg flex items-center md:gap-x-2 gap-x-1"
                    forcePage={pageNumber}
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Users;
