import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import "../styles/homepage.css";

import ProHireNavbar from "../components/Navbar";

const Homepage = () => {
  const [menus, setMenus] = useState([]);
  const [logo, setLogo] = useState("");
  const [sections, setSections] = useState([]);

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
        const hero = data.sections?.find((s) => s.section_type === "hero") || {};
        setHeroContent({
          title: hero.heading || "ProHire",
          subtitle: hero.slogan || "Where talent meets opportunity.",
          description: hero.description || "Search for jobs, internships...",
          buttonText: hero.button_text || "Get Started",
          buttonLink: hero.button_url || "/register",
          heroImage: hero.image_url ? `https://prohires.strangled.net${hero.image_url}` : null,
        });

        // Find features/other section
        const features = data.sections?.find((s) => s.section_type === "other") || {};
        setFeaturesContent({
          title: features.heading || "",
          description: features.description || "",
          contents: features.contents || [],
          backgroundImage: features.background_image
            ? `https://prohires.strangled.net${features.background_image}`
            : "",
        });
      })
      .catch((err) => console.error("Error fetching homepage data:", err));
  }, [slug]);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.3, duration: 0.8 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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
                  <div style={{ height: 300, backgroundColor: "#ccc", borderRadius: 16 }}></div>
                )}
              </div>
            </div>

            <div className="col-lg-6 hero-content">
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <motion.h1 className="hero-title" variants={itemVariants}>
                  {heroContent.title} <span className="hero-subtitle">{heroContent.subtitle}</span>
                </motion.h1>
                <motion.p className="hero-text" variants={itemVariants}>
                  {heroContent.description}
                </motion.p>
                {heroContent.buttonText && (
                  <motion.div variants={itemVariants} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="primary"
                      className="hero-btn rounded-pill"
                      onClick={() => navigate(heroContent.buttonLink)}
                    >
                      {heroContent.buttonText}
                    </Button>
                  </motion.div>
                )}
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
              ? { backgroundImage: `url(${featuresContent.backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }
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
                {[...featuresContent.contents, ...featuresContent.contents].map((content, idx) => (
                  <div key={idx} className="feature-card-wrapper">
                    <Card className="h-100 shadow-sm border-0">
                      {content.icon_url && (
                        <Card.Img
                          variant="top"
                          src={`https://prohires.strangled.net${content.icon_url}`}
                          alt={content.icon_alternate_text || content.title}
                          style={{ maxHeight: 150, objectFit: "contain", padding: "15px" }}
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
    </>
  );
};

export default Homepage;