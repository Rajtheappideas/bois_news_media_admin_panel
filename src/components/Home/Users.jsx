import React, { useState } from "react";
import Search from "../Search";
import ReactPaginate from "react-paginate";
import { BiChevronsLeft, BiChevronsRight, BiPencil } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import AddNewUser from "../Users/AddNewUser";
import EditUserDetails from "../Users/EditUserDetails";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  handleDeleteUser,
  handleFindUser,
  handlerFilterUsers,
} from "../../redux/UserSlice";

const Users = () => {
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showAddNewUser, setShowAddNewUser] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [editUserId, setEditUserId] = useState(null);

  const { users, loading } = useSelector((state) => state.root.users);

  const dispatch = useDispatch();

  // pagination logic
  const usersPerPage = 8;
  const pageVisited = pageNumber * usersPerPage;
  let displayUsers = [];
  if (!loading) {
    displayUsers =
      users.length > 0 && users.slice(pageVisited, usersPerPage + pageVisited);
  }
  const pageCount = Math.ceil(users.length / usersPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <>
      {showUserDetail && !showAddNewUser && (
        <EditUserDetails
          setEditUserId={setEditUserId}
          editUserId={editUserId}
          setShowUserDetail={setShowUserDetail}
        />
      )}
      {!showUserDetail && showAddNewUser && (
        <AddNewUser setShowAddNewUser={setShowAddNewUser} />
      )}
      {!showUserDetail && !showAddNewUser && (
        <div className="lg:space-y-5 space-y-3 w-full">
          {/* search + buttons */}
          <div className="w-full flex items-center justify-between md:flex-row flex-col gap-4">
            <div className="lg:w-1/3 md:w-1/2 w-full">
              <Search />
            </div>
            <div>
              <select
                name="filter"
                onChange={(e) => {
                  dispatch(handlerFilterUsers(e.target.value));
                }}
                id="filter"
                className="filter_dropdown outline-none"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
              <button
                className="gray_button"
                onClick={() => setShowAddNewUser(true)}
              >
                + Add new
              </button>
            </div>
          </div>
          {/* table */}
          <div className="shadow-sm outline-none rounded-2xl md:mt-5 mt-3 py-3 px-4 bg-white overflow-x-scroll scrollbar">
            <table className="border-none outline-none w-full overflow-scroll">
              <thead className="w-full border-b border-gray-100 text-center select-none">
                <tr>
                  <th className="p-4 whitespace-nowrap text-center">
                    <input
                      type="checkbox"
                      className="rounded-lg inline-block mr-2 h-4 w-4"
                      id="id"
                    />
                    <label htmlFor="id" className=" cursor-pointer">
                      <span>ID</span>
                    </label>
                  </th>
                  <th className="p-4">Joining Date</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="w-full">
                {loading ? (
                  <tr className="data_not_found_And_Loading">
                    <td colSpan="7">Loading....</td>
                  </tr>
                ) : users.length !== 0 && users !== undefined ? (
                  displayUsers.map((user) => (
                    <tr
                      key={user?._id}
                      className="border-b border-gray-200 w-full text-center"
                    >
                      <td className="p-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          id={user?._id}
                          name="userId"
                          className="rounded-lg inline-block mr-2 w-4 h-4"
                        />
                        <label htmlFor={user?._id}>
                          <span className="font-bold text-center cursor-pointer">
                            {/* #{user?._id} */}
                            #324
                          </span>
                        </label>
                      </td>
                      <td className="text-center p-4 whitespace-nowrap">
                        {moment(user?.date).format("LL")}
                      </td>
                      <td className="text-center p-4 whitespace-nowrap">
                        {user?.name ?? "-"}
                      </td>
                      <td className="text-center p-4 whitespace-nowrap">
                        {user?.email ?? "-"}
                      </td>
                      <td className="text-center p-4 whitespace-nowrap">
                        {user?.phone ?? "-"}
                      </td>
                      <td className="text-center p-4">{user?.role ?? "-"}</td>
                      <td className="flex items-center justify-start p-4">
                        <button
                          onClick={() => {
                            setShowUserDetail(true);
                            dispatch(handleFindUser(user?._id));
                          }}
                          type="button"
                          className="hover:bg-gray-200 p-1 rounded-full h-10 w-10"
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
                          onClick={() => dispatch(handleDeleteUser(user?._id))}
                        >
                          <RiDeleteBin6Line
                            color="red"
                            size={30}
                            className="inline-block"
                          />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="data_not_found_And_Loading">
                    <td colSpan="7">No users here.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* pagination */}
          <div className="flex items-center justify-between py-5">
            <p className="font-medium md:text-base text-sm text-textBlack">
              Showing{" "}
              {(pageNumber + 1) * usersPerPage > users.length
                ? users.length
                : (pageNumber + 1) * usersPerPage}{" "}
              from {users.length} users
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
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
