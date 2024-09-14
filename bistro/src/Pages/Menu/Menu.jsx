import React, { useEffect, useState } from "react";
import "./style/menu.css";
import http from "./../../Helper/http";
import Spinner from "../../Shared/Spinner";
import CustomAlert from "./../../Shared/CustomAlert";
import img1 from "../../Assets/Menu/1.png";
import img2 from "../../Assets/Menu/2.png";
import img3 from "../../Assets/Menu/3.png";
import img4 from "../../Assets/Menu/4.png";
import img5 from "../../Assets/Menu/5.png";
import img6 from "../../Assets/Menu/6.png";
import img7 from "../../Assets/Menu/7.png";
import img8 from "../../Assets/Menu/8.png";
import img9 from "../../Assets/Menu/9.png";
const Menu = () => {
  const [menu, setMenu] = useState({
    loading: false,
    data: [],
    errMsg: "",
  });

  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    setMenu({ ...menu, loading: true });
    http
      .GET("menu")
      .then((response) => {
        setMenu({ ...menu, loading: false, data: response?.data?.data });
      })
      .catch((err) => {
        setMenu({
          ...menu,
          loading: false,
          errMsg: err.response?.data?.message,
        });
      });
  }, []);

  // Function to handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Filter menu items based on selected category
  const filteredMenuItems = menu.data.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.category === selectedCategory;
  });

  return (
    <>
      <section className="menu-section">
        <div className="container">
          <div className="menu-header">
            <h1>our menu</h1>
            <p>
              We consider all the drivers of change gives you the components you
              need to change to create a truly happens.
            </p>
          </div>

          <div className="menu-tags">
            <button
              className={`main-btn menu-tag ${
                selectedCategory === "all" ? "active" : ""
              }`}
              onClick={() => handleCategoryChange("all")}
            >
              all
            </button>
            <button
              className={`main-btn menu-tag ${
                selectedCategory === "Breakfast" ? "active" : ""
              }`}
              onClick={() => handleCategoryChange("Breakfast")}
            >
              breakfast
            </button>
            <button
              className={`main-btn menu-tag ${
                selectedCategory === "Main Dishes" ? "active" : ""
              }`}
              onClick={() => handleCategoryChange("Main Dishes")}
            >
              Main Dishes
            </button>
            <button
              className={`main-btn menu-tag ${
                selectedCategory === "Drinks" ? "active" : ""
              }`}
              onClick={() => handleCategoryChange("Drinks")}
            >
              Drinks
            </button>
            <button
              className={`main-btn menu-tag ${
                selectedCategory === "Desserts" ? "active" : ""
              }`}
              onClick={() => handleCategoryChange("Desserts")}
            >
              Desserts
            </button>
          </div>
          <div className="menu-items">
            {menu.loading && <Spinner className={"spinner-r"} size={"large"} />}
            {menu.errMsg && <CustomAlert msg={menu.errMsg} type={"error"} />}
            {filteredMenuItems.length > 0 &&
              !menu.loading &&
              filteredMenuItems.map((item) => {
                return (
                  <div className="menu-item" key={item._id}>
                    <div className="menu-item-img">
                      <img
                        src={item.fileUrl}
                        crossOrigin="anonymous"
                        alt="menu-img"
                        loading="lazy"
                      />
                    </div>
                    <div className="menu-item-info">
                      <p className="menu-price">${item.price}</p>
                      <p className="menu-title">{item.name}</p>
                      <p className="menu-desc">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            {filteredMenuItems.length === 0 && !menu.loading && (
              <CustomAlert msg={"No items found"} type={"info"} />
            )}
          </div>
        </div>
      </section>
      <section className="order-section">
        <div className="container">
          <div className="right">
            <h1>You can order through apps</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipiscing elit enim
              bibendum sed et aliquet aliquet risus tempor semper.
            </p>
          </div>
          <div className="left">
            <div className="food-delvery">
              <div className="food-card">
                <img src={img1} alt="food" />
              </div>
              <div className="food-card">
                <img src={img2} alt="food" />
              </div>
              <div className="food-card">
                <img src={img3} alt="food" />
              </div>
              <div className="food-card">
                <img src={img4} alt="food" />
              </div>
              <div className="food-card">
                <img src={img5} alt="food" />
              </div>
              <div className="food-card">
                <img src={img6} alt="food" />
              </div>
              <div className="food-card">
                <img src={img7} alt="food" />
              </div>
              <div className="food-card">
                <img src={img8} alt="food" />
              </div>
              <div className="food-card">
                <img src={img9} alt="food" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Menu;
