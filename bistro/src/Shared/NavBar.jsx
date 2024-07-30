import React, { useState } from "react";
import { FiPhone, FiMail } from "react-icons/fi";
import { FaTwitter, FaFacebookF, FaInstagram, FaGithub } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import logo from "../Assets/logo.png";
import "../Style/navbar.css";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";

const NavBar = () => {
  const [show, setShow] = useState(false);

  return (
    <header className="main-header">
      <div className="top-header">
        <div className="container">
          <div className="contact-info">
            <div>
              <FiPhone />
              (414) 857 - 0107
            </div>
            <div>
              <FiMail />
              yummy@bistrobliss
            </div>
          </div>
          <div className="social-icons">
            <Link to={"/"}>
              <FaTwitter />
            </Link>
            <Link to={"/"}>
              <FaFacebookF />
            </Link>
            <Link to={"/"}>
              <FaInstagram />
            </Link>
            <Link to={"/"}>
              <FaGithub />
            </Link>
          </div>
        </div>
      </div>
      <nav>
        <div className="container">
          <div className="site-logo">
            <Link to={"/"}>
              <img src={logo} loading="lazy" alt="logo" />
            </Link>
          </div>
          <div className={`navgations ${show ? "active" : ""}`}>
            <ul>
              <li>
                <NavLink to={"/"}>Home</NavLink>
              </li>
              <li>
                <NavLink to={"/about"}>About</NavLink>
              </li>
              <li>
                <NavLink to={"/menu"}>Menu</NavLink>
              </li>
              <li>
                <NavLink to={"/pages"}>Pages</NavLink>
              </li>
              <li>
                <NavLink to={"/contact"}>Contact</NavLink>
              </li>
              <li>
                <button className="main-outline-btn">Book A Table</button>
              </li>
            </ul>
          </div>
          <button
            className={`dropdown-btn ${show ? "active" : ""}`}
            onClick={() => setShow(!show)}
          >
            {show ? <IoCloseOutline /> : <RxHamburgerMenu />}
          </button>
          <button className="main-outline-btn">Book A Table</button>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
