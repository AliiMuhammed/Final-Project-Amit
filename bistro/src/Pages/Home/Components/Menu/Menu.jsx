import React from "react";
import "./Style/menu.css";
import MainHeader from "../../../../Shared/MainHeader";
import MenuCard from "./Components/MenuCard";
import { BsCupHot } from "react-icons/bs";
import { LuPopcorn } from "react-icons/lu";
import { RiCake3Line } from "react-icons/ri";
import { RiDrinksLine } from "react-icons/ri";

const Menu = () => {
  return (
    <section className="menu-section">
      <div className="container">
        <MainHeader header={"Browse our Menu"} />
        <div className="menu-cards">
          <MenuCard
            icon={<BsCupHot />}
            title={"Breakfast"}
            description={
              "In the new era of technology we look in the future with certainty and pride for our life."
            }
          />
          <MenuCard
            icon={<LuPopcorn />}
            title={"Main Dishes"}
            description={
              "In the new era of technology we look in the future with certainty and pride for our life."
            }
          />
          <MenuCard
            icon={<RiDrinksLine />}
            title={"Drinks"}
            description={
              "In the new era of technology we look in the future with certainty and pride for our life."
            }
          />
          <MenuCard
            icon={<RiCake3Line />}
            title={"Desserts"}
            description={
              "In the new era of technology we look in the future with certainty and pride for our life."
            }
          />
        </div>
      </div>
    </section>
  );
};

export default Menu;
