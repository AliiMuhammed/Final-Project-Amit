import React, { useState } from "react";
import { FiPhone, FiMail } from "react-icons/fi";
import { FaTwitter, FaFacebookF, FaInstagram, FaGithub } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../Assets/logo.png";
import "../Style/navbar.css";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";
import { getAuthUser, removeAuthUser } from "../Helper/Storage";
import { HiOutlineLogout } from "react-icons/hi";

const NavBar = () => {
  const [show, setShow] = useState(false);
  const user = getAuthUser()?.data?.user;
  const navigate = useNavigate();

  const handleLogout = () => {
    removeAuthUser();
    navigate("/");
  };

  const closeNav = () => setShow(false);

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
              <li className="nav-link">
                <NavLink to={"/"} onClick={closeNav}>Home</NavLink>
              </li>
              <li className="nav-link">
                <NavLink to={"/about"} onClick={closeNav}>About</NavLink>
              </li>
              <li className="nav-link">
                <NavLink to={"/menu"} onClick={closeNav}>Menu</NavLink>
              </li>
              <li className="nav-link">
                <NavLink to={"/pages"} onClick={closeNav}>Pages</NavLink>
              </li>
              <li className="nav-link">
                <NavLink to={"/contact"} onClick={closeNav}>Contact</NavLink>
              </li>
              <li className="nav-link book-table">
                <NavLink to={"/book-table"} onClick={closeNav}>Book A Table</NavLink>
              </li>
              <li className="nav-buttons-small">
                {user ? (
                  <>
                    <Link to={"/profile"} className="user-profile" onClick={closeNav}>
                      <img crossOrigin="anonymous" src={user?.fileUrl} alt="" />
                    </Link>
                    <button onClick={() => { handleLogout(); closeNav(); }} className="logout-btn">
                      <HiOutlineLogout />
                    </button>
                  </>
                ) : (
                  <Link to={"/login"} className="main-btn" onClick={closeNav}>
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </div>
          <button
            className={`dropdown-btn ${show ? "active" : ""}`}
            onClick={() => setShow(!show)}
          >
            {show ? <IoCloseOutline /> : <RxHamburgerMenu />}
          </button>
          <div className="nav-buttons-large">
            <button className="main-outline-btn" onClick={closeNav}>Book A Table</button>
            {user ? (
              <>
                <Link to={"/profile"} className="user-profile" onClick={closeNav}>
                  <img crossOrigin="anonymous" src={user?.fileUrl} alt="" />
                </Link>
                <button onClick={() => { handleLogout(); closeNav(); }} className="logout-btn">
                  <HiOutlineLogout />
                </button>
              </>
            ) : (
              <Link to={"/login"} className="main-btn" onClick={closeNav}>
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
