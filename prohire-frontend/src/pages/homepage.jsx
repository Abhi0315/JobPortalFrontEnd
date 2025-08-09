import { useEffect, useState } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { motion } from "framer-motion";
import "../styles/homepage.css";

const Homepage = () => {
  const [menus, setMenus] = useState([]);
  const [logo, setLogo] = useState("");
  const [sections, setSections] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const slug = queryParams.get("slug") || "home"; // Default slug if not provided

  // Fetch navbar data
  useEffect(() => {
    fetch("https://prohires.strangled.net/headerfooter/header-footer")
      .then((res) => res.json())
      .then((data) => {
        setMenus(data.menus || []);
        setLogo(data.company_logo || "");
      })
      .catch((err) => console.error("Error fetching header data:", err));
  }, []);

  // Fetch homepage content with slug
  useEffect(() => {
    fetch(`https://prohires.strangled.net/frontend/fetch_records?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setSections(data.sections || []);
      })
      .catch((err) => console.error("Error fetching homepage data:", err));
  }, [slug]);

  return (
    <>
      {/* Navbar */}
      <Navbar expand="lg" className="prohire-navbar shadow-sm">
        <Container fluid>
          <Navbar.Brand as={NavLink} to="/" className="prohire-logo">
            {logo ? (
              <img
                src={logo}
                alt="ProHire Logo"
                style={{ height: "40px", objectFit: "contain" }}
              />
            ) : (
              "ProHire"
            )}
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto">
              {menus.map((menu) => (
                <Nav.Link
                  key={menu.id}
                  as={NavLink}
                  to={`/?slug=${menu.slug}`}
                  className="px-3"
                >
                  {menu.title}
                </Nav.Link>
              ))}
            </Nav>
            <div className="d-flex">
              <Button
                variant="outline-secondary"
                className="rounded-pill mx-2"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                variant="primary"
                className="signup-btn rounded-pill mx-2"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Homepage;
