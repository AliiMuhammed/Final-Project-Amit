import React from "react";
import "../style/blog-card.css";
const BlogCard = ({ img, date, title, description }) => {
  return (
    <div className="blog-card">
      <div className="blog-card-img">
        <img src={img} alt="blog-img" loading="lazy" />
      </div>
      <div className="blog-card-info">
        <div className="blog-card-date">
          <p>{date}</p>
        </div>
        <div className="blog-card-title">
          <h1>{title}</h1>
        </div>
        {description && (
          <div className="blog-card-description">
            <p>{description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCard;
