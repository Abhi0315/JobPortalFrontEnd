import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const ProHireNavbar = () => {
  const [menus, setMenus] = useState([]);
  const [logo, setLogo] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://prohires.strangled.net/headerfooter/header-footer")
      .then((res) => res.json())
      .then((data) => {
        setMenus(data.menus || []);
        setLogo(data.company_logo || "");
      })
      .catch((err) => console.error("Error fetching header data:", err));
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <nav className="prohire-navbar-new">
      <div className="navbar-container">
        {/* Left-aligned group (logo + nav items) */}
        <div className="nav-left-group">
          <a href="/" className="logo">
            {logo ? (
              <img src={logo} alt="ProHire Logo" className="logo-img" />
            ) : (
              <span>ProHire</span>
            )}
          </a>

          <ul className="desktop-menu">
            {menus.map((menu) => (
              <li key={menu.id}>
                <a href={menu.url}>
                  <span className="nav-link-text">{menu.title}</span>
                  <span className="underline"></span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right-aligned group (auth buttons + hamburger) */}
        <div className="nav-right-group">
          <div className="auth-buttons">
            <button
              className="nav-btn login"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="nav-btn signup"
              onClick={() => navigate("/registrationform")}
            >
              Sign Up
            </button>
          </div>

          <button
            className={`hamburger ${mobileMenuOpen ? "open" : ""}`}
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? "show" : ""}`}>
        <ul>
          {menus.map((menu, idx) => (
            <React.Fragment key={menu.id}>
              <li onClick={() => setMobileMenuOpen(false)}>
                <a href={menu.url}>{menu.title}</a>
              </li>
              {idx < menus.length - 1 && (
                <div className="mobile-menu-divider" />
              )}
            </React.Fragment>
          ))}
        </ul>
        <div className="mobile-actions">
          <button
            className="nav-btn login"
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/login");
            }}
          >
            Login
          </button>
          <button
            className="nav-btn signup"
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/registrationform");
            }}
          >
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
};

export default ProHireNavbar;
