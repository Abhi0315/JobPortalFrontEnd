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
          {/* Hero Section - Redesigned */}
          <section className="hero-section-redesigned">
            <div className="hero-container">
              <div className="hero-content-wrapper">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="hero-text-content"
                >
                  <div className="hero-badge">
                    <span>
                      {heroContent.subtitle || "Innovative Hiring Solutions"}
                    </span>
                  </div>

                  <h1 className="hero-main-title">
                    {heroContent.title.split(" ").map((word, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        {word}{" "}
                      </motion.span>
                    ))}
                  </h1>

                  <p className="hero-description">
                    {heroContent.description ||
                      "Transform your hiring process with our cutting-edge solutions"}
                  </p>

                  <div className="hero-features-grid">
                    {heroContent.contents?.slice(0, 4).map((item, index) => (
                      <motion.div
                        key={index}
                        className="feature-item"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="feature-icon">
                          <svg viewBox="0 0 24 24" width="24" height="24">
                            <path
                              fill="currentColor"
                              d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                            />
                          </svg>
                        </div>
                        <span>{item.title}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="hero-cta-buttons">
                    <motion.button
                      className="primary-cta"
                      onClick={() =>
                        navigate(heroContent.buttonLink || "/register")
                      }
                      whileHover={{
                        y: -3,
                        boxShadow: "0 10px 20px rgba(44, 20, 117, 0.3)",
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {heroContent.buttonText || "Get Started"}
                    </motion.button>

                    <button
                      className="secondary-cta"
                      onClick={() => navigate("/demo")}
                    >
                      <span>Live Demo</span>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M5 12H19M19 12L12 5M19 12L12 19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </motion.div>

                <div className="hero-image-container">
                  {heroContent.heroImage ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className="image-wrapper"
                    >
                      <img
                        src={heroContent.heroImage}
                        alt={heroContent.title}
                        className="hero-main-image"
                      />

                      {/* Decorative elements */}
                      <div className="decorative-circle circle-1"></div>
                      <div className="decorative-circle circle-2"></div>
                      <div className="decorative-circle circle-3"></div>
                    </motion.div>
                  ) : (
                    <div className="image-placeholder">
                      <svg
                        width="100"
                        height="100"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M4 16L8.586 11.414C8.961 11.039 9.47 10.828 10 10.828C10.53 10.828 11.039 11.039 11.414 11.414L16 16M14 14L15.586 12.414C15.961 12.039 16.47 11.828 17 11.828C17.53 11.828 18.039 12.039 18.414 12.414L20 14M14 8H14.01M6 20H18C19.105 20 20 19.105 20 18V6C20 4.895 19.105 4 18 4H6C4.895 4 4 4.895 4 6V18C4 19.105 4.895 20 6 20Z"
                          stroke="#2C1475"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* <div className="trusted-by-section">
                <span>Trusted by leading companies:</span>
                <div className="company-logos">
                  {["Abhiram", "Devanand", "Abhijeet", "Dipak", "Amol"].map(
                    (name, i) => (
                      <motion.span
                        key={i}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {name}
                      </motion.span>
                    )
                  )}
                </div>
              </div> */}
            </div>

            {/* Wave divider */}
            <div className="wave-divider">
              <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path
                  d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                  opacity=".25"
                  fill="#2C1475"
                ></path>
                <path
                  d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                  opacity=".5"
                  fill="#2C1475"
                ></path>
                <path
                  d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                  fill="#2C1475"
                ></path>
              </svg>
            </div>
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
