import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Card, Form, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import "../styles/homepage.css";

import ProHireNavbar from "../components/Navbar";
import AboutUs from "../components/AboutUs";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import SkeletonLoading from "../components/SkeletonLoading";
import FAQ from "../components/FAQ";

const Homepage = () => {
  const [menus, setMenus] = useState([]);
  const [logo, setLogo] = useState("");
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
    document.title = "ProHire | Home";

    fetch("https://prohires.strangled.net/headerfooter/header-footer")
      .then((res) => res.json())
      .then((data) => {
        setMenus(data.menus || []);
        setLogo(data.company_logo || "");
      })
      .catch((err) => console.error("Error fetching header data:", err))
      .finally(() => {
        if (!isLoading) return;
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetch(`https://prohires.strangled.net/frontend/fetch_records?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setSections(data.sections || []);

        // Find hero section
        const hero =
          data.sections?.find((s) => s.section_type === "hero") || {};
        setHeroContent({
          title: hero.heading || "ProHire",
          subtitle: hero.slogan || "",
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

        // Find contact section
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
      .catch((err) => console.error("Error fetching homepage data:", err))
      .finally(() => setIsLoading(false));
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

  // Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        "https://prohires.strangled.net/frontend/contact_us/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Success:", result);
      alert("Thank you for your message! We'll get back to you soon.");

      // Reset form
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error submitting your message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update the submit button to show loading state
  <Button
    variant="primary"
    type="submit"
    className="contact-submit-btn rounded-pill"
    disabled={isLoading}
  >
    {isLoading ? "Sending..." : "Send Message"}
  </Button>;

  const SkeletonLoading = () => {
    return (
      <div className="skeleton-loading">
        {/* Hero Section Skeleton */}
        <section className="hero-section-skeleton">
          <Container>
            <Row className="align-items-center">
              <Col lg={6} className="order-lg-1">
                <div className="skeleton-image"></div>
              </Col>
              <Col lg={6} className="order-lg-2">
                <div className="skeleton-title"></div>
                <div className="skeleton-subtitle"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text" style={{ width: "80%" }}></div>
                <div className="skeleton-feature-list">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="skeleton-feature-item"></div>
                  ))}
                </div>
                <div className="skeleton-button-group">
                  <div className="skeleton-button"></div>
                  <div className="skeleton-button"></div>
                </div>
                <div className="skeleton-trust">
                  <div className="skeleton-trust-text"></div>
                  <div className="skeleton-trust-logos">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div key={item} className="skeleton-trust-logo"></div>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Features Section Skeleton */}
        <section className="features-section-skeleton py-5">
          <Container>
            <div className="skeleton-features-title"></div>
            <div className="skeleton-features-description"></div>
            <div className="skeleton-features-scroll">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="skeleton-feature-card"></div>
              ))}
            </div>
          </Container>
        </section>

        {/* Contact Section Skeleton */}
        <section className="contact-section-skeleton py-5">
          <Container>
            <Row>
              <Col lg={6}>
                <div className="skeleton-contact-title"></div>
                <div className="skeleton-contact-description"></div>
                <div className="skeleton-form">
                  <div className="skeleton-form-field"></div>
                  <div className="skeleton-form-field"></div>
                  <div
                    className="skeleton-form-field"
                    style={{ height: "120px" }}
                  ></div>
                  <div className="skeleton-form-button"></div>
                </div>
              </Col>
              <Col lg={6}>
                <div className="skeleton-contact-image"></div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    );
  };

  return (
    <>
      <ProHireNavbar />
      {isLoading ? (
        <SkeletonLoading />
      ) : (
        <>
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
                      <div></div>
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
                      <span className="hero-subtitle">
                        {heroContent.subtitle}
                      </span>
                    </motion.h1>
                    <motion.p className="hero-text" variants={itemVariants}>
                      {heroContent.description}
                    </motion.p>

                    <motion.div
                      className="hero-highlights"
                      variants={itemVariants}
                    >
                      {heroContent.contents &&
                        heroContent.contents.length > 0 && (
                          <ul className="hero-features-list">
                            {heroContent.contents.map((item, index) => (
                              <li key={index}>{item.title}</li>
                            ))}
                          </ul>
                        )}
                    </motion.div>

                    <motion.div
                      className="hero-btn-group"
                      variants={itemVariants}
                    >
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
                    {[
                      ...featuresContent.contents,
                      ...featuresContent.contents,
                    ].map((content, idx) => (
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
                    ))}
                  </div>
                </div>
              </Container>
            </section>
          )}
          <section id="about">
            <AboutUs />
          </section>
          <Testimonials />
          {/* Contact Us Section */}
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
                    <h2 className="contact-title mb-4">
                      {contactContent.title}
                    </h2>
                    <p className="contact-description mb-4">
                      {contactContent.description}
                    </p>

                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>
                          Your Name{" "}
                          <span className="required-field-span">*</span>
                        </Form.Label>
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
                        <Form.Label>
                          Email Address{" "}
                          <span className="required-field-span">*</span>
                        </Form.Label>
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
                        <Form.Label>
                          Your Message{" "}
                          <span className="required-field-span">*</span>
                        </Form.Label>
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
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Sending...
                          </>
                        ) : (
                          "Send Message"
                        )}
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
          </section>{" "}
          <FAQ />
          <Footer />
        </>
      )}
    </>
  );
};

export default Homepage;
