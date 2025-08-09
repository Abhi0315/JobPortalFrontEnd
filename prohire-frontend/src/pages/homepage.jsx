import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
// import "../styles/homepage.css";
import "../styles/homepage.css";

const Homepage = () => {
  const [menus, setMenus] = useState([]);
  const [logo, setLogo] = useState("");
  const [sections, setSections] = useState([]);

  const location = useLocation();
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
            <Nav className="mx-auto">
              {menus.map((menu) => (
                <Nav.Link
                  key={menu.id}
                  href={`/?slug=${menu.slug}`} // 🔹 Pass slug here
                  className="px-3"
                >
                  {menu.title}
                </Nav.Link>
              ))}
            </Nav>
            <div className="d-flex">
              <Button variant="outline-secondary" className="rounded-pill mx-2">
                Login
              </Button>
              <Button
                variant="primary"
                className="signup-btn rounded-pill mx-2"
              >
                Sign Up
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Sections */}
      {sections.map((section, index) => {
        if (section.section_type === "hero") {
          return (
            <motion.section
              key={index}
              className="hero-section text-center text-light"
              style={{
                background: section.background_image
                  ? `url(${section.background_image}) center/cover no-repeat`
                  : "#2c1475",
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Container>
                <h1 className="fw-bold">{section.heading}</h1>
                <p className="lead">{section.description}</p>
                {section.logo && (
                  <img
                    src={section.logo}
                    alt={section.logo_alternate_text || "Logo"}
                    className="hero-logo my-3"
                  />
                )}
                <Row className="mt-4">
                  {section.contents?.map((item, i) => (
                    <Col md={6} key={i}>
                      <motion.div
                        className="hero-card p-4"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: i * 0.2 }}
                      >
                        {item.icon_url && (
                          <img
                            src={item.icon_url}
                            alt={item.icon_alternate_text || "icon"}
                            className="icon-img mb-3"
                          />
                        )}
                        <h5>{item.title}</h5>
                        <p>{item.description}</p>
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              </Container>
            </motion.section>
          );
        }

        if (section.section_type === "contact") {
          return (
            <motion.section
              key={index}
              className="contact-section py-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Container>
                <h2 className="text-center fw-bold mb-4">{section.heading}</h2>
                <p className="text-center mb-5">{section.description}</p>
                <Row className="justify-content-center">
                  <Col md={6}>
                    <Card className="p-4 shadow-sm contact-card">
                      <form>
                        <div className="mb-3">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter your name"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Message</label>
                          <textarea
                            className="form-control"
                            rows="4"
                            placeholder="Your message"
                          ></textarea>
                        </div>
                        <Button
                          variant="primary"
                          className="w-100 rounded-pill"
                        >
                          Send Message
                        </Button>
                      </form>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </motion.section>
          );
        }

        return null;
      })}
    </>
  );
};

export default Homepage;
