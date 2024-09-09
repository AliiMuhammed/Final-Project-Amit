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
import EditMenu from "../MenuDialogs/EditMenu";
import DeleteMenu from "../MenuDialogs/DeleteMenu";
import "./style/mainTable.css";

const MenuTable = ({ headers, data }) => {
  const [openEditItem, setOpenEditItem] = useState(false);
  const [openDeleteItem, setOpenDeleteItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setOpenEditItem(true);
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setOpenDeleteItem(true);
  };

  // Memoize paginated data to avoid recalculating on every render
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
            {paginatedData.map((item, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell>
                  <div className="table-img">
                    <img
                      alt={item.name}
                      src={item.fileUrl}
                      loading="lazy"
                      crossOrigin="anonymous"
                      className="img-placeholder"
                    />
                  </div>
                </TableCell>

                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{`$ ${item.price}`}</TableCell>
                <TableCell>{item.category}</TableCell>

                <TableCell>
                  <div className="table-btns">
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteClick(item)}
                      aria-label="Delete item"
                    >
                      Delete
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => handleEditClick(item)}
                      aria-label="Edit item"
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

      <EditMenu
        open={openEditItem}
        setOpen={setOpenEditItem}
        item={selectedItem}
      />
      <DeleteMenu
        open={openDeleteItem}
        setOpen={setOpenDeleteItem}
        item={selectedItem}
      />
    </>
  );
};

export default MenuTable;
