import React, { useState, useEffect } from "react";
import "./style/menu.css";
import { useSelector } from "react-redux";
import Spinner from "./../../../Shared/Spinner";
import CustomAlert from "../../../Shared/CustomAlert";
import http from "./../../../Helper/http";
import MenuTable from "./components/MenuTable/MenuTable";
import AddMenu from "./components/MenuDialogs/AddMenu";

const Menu = () => {
  const refreshCount = useSelector((state) => state.refresh);
  const [openAddItem, setOpenAddItem] = useState(false);
  const [menu, setMenu] = useState({
    loading: false,
    data: [],
    errMsg: "",
  });

  useEffect(() => {
    setMenu({ ...menu, loading: true });
    http
      .GET("menu")
      .then((response) => {
        setMenu({ ...menu, loading: false, data: response.data.data });
      })
      .catch((err) => {
        setMenu({
          ...menu,
          loading: false,
          errMsg: err.response?.data?.message,
        });
      });
  }, [refreshCount]);

  return (
    <section className="menu-section">
      <div className="container">
        {menu.loading && <Spinner className={"spinner-r"} size={"large"} />}
        {menu.errMsg && <CustomAlert msg={menu.errMsg} type={"error"} />}
        {menu.data.length === 0 && !menu.loading && (
          <>
            <div className="add-header">
              <h2>Menu Items</h2>
              <button className="main-btn" onClick={() => setOpenAddItem(true)}>
                Add Item
              </button>
            </div>
            <CustomAlert msg={"No items found"} type={"info"} />
          </>
        )}
        {menu.data.length > 0 && (
          <>
            <div className="add-header">
              <h2>Menu Items</h2>
              <button className="main-btn" onClick={() => setOpenAddItem(true)}>
                Add Item
              </button>
            </div>
            <MenuTable
              data={menu.data}
              headers={[
                "Image",
                "Name",
                "Description",
                "Price",
                "Category",
                "Actions",
              ]}
            />
          </>
        )}
      </div>
      <AddMenu open={openAddItem} setOpen={setOpenAddItem} />
    </section>
  );
};

export default Menu;
