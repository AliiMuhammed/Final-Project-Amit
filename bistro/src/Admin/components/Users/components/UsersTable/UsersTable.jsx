import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import "./style/mainTable.css";
import EditUser from "../UserDialogs/EditUser";
import DeleteUser from "../UserDialogs/DeleteUser";

const UsersTable = ({ data, headers }) => {
  const [openEditUser, setOpenEditUser] = useState(false);
  const [openDeleteUser, setOpenDeleteUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setOpenEditUser(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setOpenDeleteUser(true);
  };

  // Memoize paginated data to prevent unnecessary recalculations
  const paginatedData = useMemo(
    () => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [data, page, rowsPerPage]
  );

  return (
    <>
      <TableContainer component={Paper} className="main-table">
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableCell key={index}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((user, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell>
                  <div className="table-img">
                    <img
                      alt={`${user.firstName} ${user.lastName}`}
                      src={user?.fileUrl}
                      loading="lazy"
                      crossOrigin="anonymous"
                      className="img-placeholder"
                    />
                  </div>
                </TableCell>

                <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.role}</TableCell>

                <TableCell>
                  <div className="table-btns">
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteClick(user)}
                      aria-label="Delete user"
                    >
                      Delete
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => handleEditClick(user)}
                      aria-label="Edit user"
                    >
                      Edit
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          className="pagination"
        />
      </TableContainer>

      <EditUser
        open={openEditUser}
        setOpen={setOpenEditUser}
        user={selectedUser}
      />
      <DeleteUser
        open={openDeleteUser}
        setOpen={setOpenDeleteUser}
        user={selectedUser}
      />
    </>
  );
};

export default UsersTable;
