import React from "react";
import "../Style/footer.css";
import logo from "../Assets/Footer/Logo.png";
import { Link } from "react-router-dom";
import { FaTwitter, FaFacebookF, FaInstagram, FaGithub } from "react-icons/fa";
import footer_1 from "../Assets/Footer/footer_1.jpg";
import footer_2 from "../Assets/Footer/footer_2.jpg";
import footer_3 from "../Assets/Footer/footer_3.jpg";
import footer_4 from "../Assets/Footer/footer_4.jpg";

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="top">
          <div className="logo-details">
            <div className="logo">
              <img src={logo} loading="lazy" alt="site logo" />
            </div>
            <p className="details">
              In the new era of technology we look a in the future with
              certainty and pride to for our company and.
            </p>
            <div className="social-media">
              <ul>
                <li>
                  <Link to={"/"}>
                    <FaTwitter />
                  </Link>
                </li>
                <li>
                  <Link to={"/"}>
                    <FaFacebookF />
                  </Link>
                </li>
                <li>
                  <Link to={"/"}>
                    <FaInstagram />
                  </Link>
                </li>
                <li>
                  <Link to={"/"}>
                    <FaGithub />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pages">
            <h2 className="title">Pages</h2>
            <ul className="page-links">
              <li>
                <Link to={"/"}>Home</Link>
              </li>
              <li>
                <Link to={"/about"}>About</Link>
              </li>
              <li>
                <Link to={"/menu"}>Menu</Link>
              </li>
              <li>
                <Link to={"/blog"}>Blog</Link>
              </li>
              <li>
                <Link to={"/contact"}>Contact</Link>
              </li>
            </ul>
          </div>
          <div className="utility-pages">
            <h2 className="title">Utility Pages</h2>
            <ul className="page-links">
              <li>
                <Link to={"/"}>Start Here</Link>
              </li>
              <li>
                <Link to={"/"}>Styleguide</Link>
              </li>
              <li>
                <Link to={"/"}>404 Not Found</Link>
              </li>
              <li>
                <Link to={"/"}>Licenses</Link>
              </li>
              <li>
                <Link to={"/"}>View More</Link>
              </li>
            </ul>
          </div>
          <div className="footer-images">
            <h2 className="title">Follow Us On Instagram</h2>
            <div className="images">
              <img src={footer_1} loading="lazy" alt="instagram " />
              <img src={footer_2} loading="lazy" alt="instagram " />
              <img src={footer_3} loading="lazy" alt="instagram " />
              <img src={footer_4} loading="lazy" alt="instagram " />
            </div>
          </div>
        </div>
        <div className="bottom">
          <div className="footer-rights">
            Copyright © 2023 Hashtag Developer. All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
