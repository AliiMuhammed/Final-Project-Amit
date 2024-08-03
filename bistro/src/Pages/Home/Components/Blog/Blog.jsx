import React from "react";
import "./style/blog.css";
import MainHeader from "../../../../Shared/MainHeader";
import { Link } from "react-router-dom";
import BlogCard from "./components/BlogCard";
import blog_1 from "../../../../Assets/Home/blog_1.jpg";
import blog_2 from "../../../../Assets/Home/blog_2.jpg";
import blog_3 from "../../../../Assets/Home/blog_3.jpg";
import blog_4 from "../../../../Assets/Home/blog_4.jpg";
import blog_5 from "../../../../Assets/Home/blog_5.jpg";
const Blog = () => {
  return (
    <section className="blog-section">
      <div className="container">
        <div className="section-header">
          <MainHeader header={"Our Blog & Articles"} />
          <Link to={"/blog"} className="main-btn">
            read all articles
          </Link>
        </div>
        <div className="blog">
          <div className="left">
            <BlogCard
              img={blog_1}
              date={"January 3, 2023"}
              title={
                "The secret tips & tricks to prepare a perfect burger & pizza for our customers"
              }
              description={
                "The secret tips & tricks to prepare a perfect burger & pizza for our customers"
              }
            />
          </div>
          <div className="right">
            <BlogCard
              img={blog_2}
              date={"January 3, 2023"}
              title={"How to prepare the perfect french fries in an air fryer"}
            />
            <BlogCard
              img={blog_3}
              date={"January 3, 2023"}
              title={"How to prepare delicious chicken tenders"}
            />
            <BlogCard
              img={blog_4}
              date={"January 3, 2023"}
              title={"7 delicious cheesecake recipes you can prepare"}
            />
            <BlogCard
              img={blog_5}
              date={"January 3, 2023"}
              title={"5 great pizza restaurants you should visit this city"}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
