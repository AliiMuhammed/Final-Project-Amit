import React, { useState } from "react";
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
import "./style/mainTable.css"; // Ensure this path is correct

const UsersTable = ({ data, headers }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
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
              {/* Image */}
              <TableCell>
                <div className="table-img">
                  <img
                    alt={`${user.firstName} ${user.lastName}`}
                    src={user.fileUrl}
                    loading="lazy"
                    crossOrigin="anonymous"
                  />
                </div>
              </TableCell>

              {/* Name */}
              <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>

              {/* Email */}
              <TableCell>{user.email}</TableCell>

              {/* Role */}
              <TableCell>{user.role}</TableCell>

              {/* Action */}
              <TableCell>
                <div className="table-btns">
                  <button className="delete-btn">Delete</button>
                  <button className="edit-btn">Edit</button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
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
  );
};

export default UsersTable;
