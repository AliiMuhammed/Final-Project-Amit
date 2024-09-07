/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./style/users.css";
import http from "./../../../Helper/http";
import UsersTable from "./components/UsersTable/UsersTable";
import Spinner from "./../../../Shared/Spinner";
import CustomAlert from "../../../Shared/CustomAlert";
const Users = () => {
  const [users, setUsers] = useState({
    loading: false,
    data: [],
    errMsg: "",
  });
  useEffect(() => {
    setUsers({ ...users, loading: true });
    http
      .GET("users")
      .then((response) => {
        setUsers({ ...users, loading: false, data: response.data.data });
      })
      .catch((err) => {
        setUsers({
          ...users,
          loading: false,
          errMsg: err.response?.data?.message,
        });
      });
  }, []);
  return (
    <section className="users-section">
      <div className="container">
        {users.data.length === 0 && !users.loading && (
          <CustomAlert msg={"No users found"} type={"info"} />
        )}
        {users.data.length === 0 && users.loading && (
          <Spinner className={"spinner-r"} size={"large"} />
        )}

        {users.data.length > 0 && !users.loading && (
          <UsersTable
            data={users.data}
            headers={["Image", "Name", "Email", "Role", "Action"]}
          />
        )}
      </div>
    </section>
  );
};

export default Users;
