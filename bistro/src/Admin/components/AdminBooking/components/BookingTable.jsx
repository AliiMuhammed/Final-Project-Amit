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
import http from "../../../../Helper/http";
import { triggerRefresh } from "../../../../Redux/Slices/refreshSlice";
import { useDispatch } from "react-redux";
import { openToast } from "../../../../Redux/Slices/toastSlice";
import Spinner from "../../../../Shared/Spinner";
import { FaCheck } from "react-icons/fa";
import { RiCloseLargeLine } from "react-icons/ri";

import "./style/mainTable.css";

const BookingTable = ({ headers, data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loadingRows, setLoadingRows] = useState({}); // Track loading for each row and button
  const dispatch = useDispatch();

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Memoize paginated data to avoid recalculating on every render
  const paginatedData = useMemo(
    () => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [data, page, rowsPerPage]
  );

  const convertToReadableDate = (isoDate) => {
    const dateObj = new Date(isoDate);

    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }

    return dateObj.toLocaleString();
  };

  const handleReject = (id) => {
    setLoadingRows((prev) => ({ ...prev, [id]: { ...prev[id], rejectLoading: true } }));

    http
      .PATCH(`bookings/${id}`, {
        status: "rejected",
      })
      .then((res) => {
        setLoadingRows((prev) => ({ ...prev, [id]: { ...prev[id], rejectLoading: false } }));
        dispatch(triggerRefresh());
        dispatch(
          openToast({ msg: "Booking Rejected successfully", type: "success" })
        );
      })
      .catch((err) => {
        setLoadingRows((prev) => ({ ...prev, [id]: { ...prev[id], rejectLoading: false } }));
        dispatch(
          openToast({ msg: "Failed to Reject this booking", type: "error" })
        );
      });
  };

  const handleApprove = (id) => {
    setLoadingRows((prev) => ({ ...prev, [id]: { ...prev[id], acceptLoading: true } }));

    http
      .PATCH(`bookings/${id}`, {
        status: "accepted",
      })
      .then((res) => {
        setLoadingRows((prev) => ({ ...prev, [id]: { ...prev[id], acceptLoading: false } }));
        dispatch(triggerRefresh());
        dispatch(
          openToast({ msg: "Booking Approved successfully", type: "success" })
        );
      })
      .catch((err) => {
        setLoadingRows((prev) => ({ ...prev, [id]: { ...prev[id], acceptLoading: false } }));
        dispatch(
          openToast({ msg: "Failed to Approve this booking", type: "error" })
        );
      });
  };

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
            {paginatedData.map((item, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell>
                  <div className="table-img">
                    <img
                      alt={item.name}
                      src={item.user.fileUrl}
                      loading="lazy"
                      crossOrigin="anonymous"
                      className="img-placeholder"
                    />
                  </div>
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.phone}</TableCell>
                <TableCell>{item.numOfPersons}</TableCell>
                <TableCell>{convertToReadableDate(item.date)}</TableCell>
                <TableCell>{item.time}</TableCell>
                <TableCell>
                  <span className={item.status}>{item.status}</span>
                </TableCell>
                {item.status === "In-progress" ? (
                  <TableCell>
                    <div className="table-btns">
                      <button
                        className="delete-btn"
                        onClick={() => handleReject(item._id)}
                        disabled={loadingRows[item._id]?.rejectLoading}
                      >
                        {loadingRows[item._id]?.rejectLoading ? (
                          <Spinner className={"spinner-w"} />
                        ) : (
                          <RiCloseLargeLine />
                        )}
                      </button>
                      <button
                        className="edit-btn"
                        onClick={() => handleApprove(item._id)}
                        disabled={loadingRows[item._id]?.acceptLoading}
                      >
                        {loadingRows[item._id]?.acceptLoading ? (
                          <Spinner className={"spinner-w"} />
                        ) : (
                          <FaCheck />
                        )}
                      </button>
                    </div>
                  </TableCell>
                ) : (
                  <TableCell></TableCell>
                )}
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
    </>
  );
};

export default BookingTable;
