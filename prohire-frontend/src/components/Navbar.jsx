import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import "../styles/Navbar.css";

const ProHireNavbar = () => {
  const [menus, setMenus] = useState([]);
  const [logo, setLogo] = useState("");
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

  return (
    <Navbar expand="lg" className="prohire-navbar shadow-sm">
      <Container fluid>
        <Navbar.Brand href="/" className="prohire-logo">
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
          <Nav className="me-auto">
            {menus.map((menu) => (
              <Nav.Link key={menu.id} href={menu.url} className="px-3">
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
              onClick={() => navigate("/registrationform")}
            >
              Sign Up
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default ProHireNavbar;
