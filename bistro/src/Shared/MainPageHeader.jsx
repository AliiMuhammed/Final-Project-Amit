import React from "react";
import "../Style/main-page-header.css";
const MainPageHeader = ({ header, paragraph ,body }) => {
  return (
    <section className="main-page-header">
      <div className="container">
        <h1 className="main-header">{header}</h1>
        <p>{paragraph}</p>
        {body}
      </div>
    </section>
  );
};

export default MainPageHeader;
