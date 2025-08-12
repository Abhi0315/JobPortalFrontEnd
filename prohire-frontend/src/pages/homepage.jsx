import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Card, Form, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import "../styles/homepage.css";

import ProHireNavbar from "../components/Navbar";
import AboutUs from "../components/AboutUs";
import Testimonials from "../components/Testimonials";

const Homepage = () => {
  const [menus, setMenus] = useState([]);
  const [logo, setLogo] = useState("");
  const [sections, setSections] = useState([]);
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Separate states for hero and features
  const [heroContent, setHeroContent] = useState({
    title: "",
    subtitle: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    heroImage: "",
  });

  const [featuresContent, setFeaturesContent] = useState({
    title: "",
    description: "",
    contents: [],
    backgroundImage: "",
  });

  const [contactContent, setContactContent] = useState({
    title: "",
    description: "",
    image_url: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const slug = queryParams.get("slug") || "home";

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
    fetch(`https://prohires.strangled.net/frontend/fetch_records?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setSections(data.sections || []);

        // Find hero section
        const hero =
          data.sections?.find((s) => s.section_type === "hero") || {};
        setHeroContent({
          title: hero.heading || "ProHire",
          subtitle: hero.slogan || "Where talent meets opportunity.",
          description: hero.description || "Search for jobs, internships...",
          buttonText: hero.button_text || "Get Started",
          buttonLink: hero.button_url || "/register",
          heroImage: hero.image_url
            ? `https://prohires.strangled.net${hero.image_url}`
            : null,
          contents: hero.contents || [],
        });

        // Find features/other section
        const features =
          data.sections?.find((s) => s.section_type === "other") || {};
        setFeaturesContent({
          title: features.heading || "",
          description: features.description || "",
          contents: features.contents || [],
          backgroundImage: features.background_image
            ? `https://prohires.strangled.net${features.background_image}`
            : "",
        });

        // Find contact section (assuming it's another section type)
        const contact =
          data.sections?.find((s) => s.section_type === "contact_us") || {};
        setContactContent({
          title: contact.heading || "Contact Us",
          description:
            contact.description ||
            "Have questions? Get in touch with our team.",
          image_url: contact.image_url
            ? `https://prohires.strangled.net${contact.image_url}`
            : "",
        });
      })
      .catch((err) => console.error("Error fetching homepage data:", err));
  }, [slug]);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.3, duration: 0.8 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Here you would typically send the form data to your backend
      console.log("Form submitted:", formData);
      // Reset form after submission
      setFormData({
        name: "",
        email: "",
        message: "",
      });
      // Show success message or redirect
      alert("Thank you for your message! We'll get back to you soon.");
    }
  };

  return (
    <>
      <ProHireNavbar />
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <div className="row align-items-center">
            <div className="col-lg-6 hero-image-col">
              <div className="hero-image-wrapper">
                {heroContent.heroImage ? (
                  <img
                    src={heroContent.heroImage}
                    alt={heroContent.title}
                    className="hero-image"
                  />
                ) : (
                  <div
                  // style={{
                  //   height: 300,
                  //   backgroundColor: "#ccc",
                  //   borderRadius: 16,
                  // }}
                  ></div>
                )}
              </div>
            </div>

            <div className="col-lg-6 hero-content">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h1 className="hero-title" variants={itemVariants}>
                  {heroContent.title}{" "}
                  <span className="hero-subtitle">{heroContent.subtitle}</span>
                </motion.h1>
                <motion.p className="hero-text" variants={itemVariants}>
                  {heroContent.description}
                </motion.p>

                {/* Additional content below description */}
                <motion.div className="hero-highlights" variants={itemVariants}>
                  {heroContent.contents && heroContent.contents.length > 0 && (
                    <ul className="hero-features-list">
                      {heroContent.contents.map((item, index) => (
                        <li key={index}>{item.title}</li>
                      ))}
                    </ul>
                  )}
                </motion.div>

                {/* Button group */}
                <motion.div className="hero-btn-group" variants={itemVariants}>
                  {heroContent.buttonText && (
                    <Button
                      variant="primary"
                      className="hero-btn rounded-pill me-3"
                      onClick={() => navigate(heroContent.buttonLink)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {heroContent.buttonText}
                    </Button>
                  )}
                  <Button
                    variant="outline-primary"
                    className="hero-demo-btn rounded-pill"
                    onClick={() => navigate("/demo")}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Live Demo
                  </Button>
                </motion.div>

                {/* Trust indicators */}
                <motion.div
                  className="trust-indicators"
                  variants={itemVariants}
                >
                  <div className="trusted-by">Trusted by:</div>
                  <div className="trust-logos">
                    <span>Abhiram</span>
                    <span>Devanand</span>
                    <span>Abhijeet</span>
                    <span>Dipak</span>
                    <span>Amol</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>
      {/* Features / Contents Section */}
      {featuresContent.contents.length > 0 && (
        <section
          className="features-section py-5"
          style={
            featuresContent.backgroundImage
              ? {
                  backgroundImage: `url(${featuresContent.backgroundImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {}
          }
        >
          <Container>
            {featuresContent.title && (
              <h2 className="mb-3">{featuresContent.title}</h2>
            )}
            {featuresContent.description && (
              <p className="mb-4">{featuresContent.description}</p>
            )}
            <div className="features-scroll-container">
              <div className="features-scroll-track">
                {[...featuresContent.contents, ...featuresContent.contents].map(
                  (content, idx) => (
                    <div key={idx} className="feature-card-wrapper">
                      <Card className="h-100 shadow-sm border-0">
                        {content.icon_url && (
                          <Card.Img
                            variant="top"
                            src={`https://prohires.strangled.net${content.icon_url}`}
                            alt={content.icon_alternate_text || content.title}
                            style={{
                              maxHeight: 150,
                              objectFit: "contain",
                              padding: "15px",
                            }}
                          />
                        )}
                        <Card.Body>
                          <Card.Title>{content.title}</Card.Title>
                          <Card.Text>{content.description}</Card.Text>
                        </Card.Body>
                      </Card>
                    </div>
                  )
                )}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Contact Us Section */}
      <section className="contact-section py-5" id="contact">
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Row className="align-items-center">
              <Col lg={6} className="mb-4 mb-lg-0">
                <h2 className="contact-title mb-4">{contactContent.title}</h2>
                <p className="contact-description mb-4">
                  {contactContent.description}
                </p>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Your Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      isInvalid={!!formErrors.name}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email Address *</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      isInvalid={!!formErrors.email}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formMessage">
                    <Form.Label>Your Message *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Enter your message"
                      isInvalid={!!formErrors.message}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="contact-submit-btn rounded-pill"
                  >
                    Send Message
                  </Button>
                </Form>
              </Col>

              <Col lg={6}>
                {contactContent.image_url ? (
                  <div className="contact-image-wrapper">
                    <img
                      src={contactContent.image_url}
                      alt="Contact Us"
                      className="contact-image img-fluid rounded"
                    />
                  </div>
                ) : (
                  <div className="contact-image-placeholder">
                    <div className="placeholder-content">
                      <i className="bi bi-envelope-open"></i>
                      <p>Get in touch with us</p>
                    </div>
                  </div>
                )}
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>
      <section id="about">
        <AboutUs />
      </section>
      <Testimonials />
    </>
  );
};

export default Homepage;
