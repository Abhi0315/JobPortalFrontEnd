import { useState, useEffect } from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaArrowUp,
  FaArrowUp,
} from "react-icons/fa";
import "../styles/Footer.css";

const Footer = () => {
  const [showScroll, setShowScroll] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [footerData, setFooterData] = useState({
    logo: "",
    companyName: "ProHire",
    menus: [],
    contactInfo: {
      email: "",
      phone: "",
      address: "",
    },
    socialLinks: [],
    legalText: "",
    links: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const slug = queryParams.get("slug") || "home";

  // Check scroll position
  const checkScrollTop = () => {
    setShowScroll(window.pageYOffset > 400);
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, []);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://prohires.strangled.net/headerfooter/footer_detail/`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const apiData = await response.json();
        console.log("API data received:", apiData);

        let footerSection = null;

        // Case 1: Old format with sections array
        if (apiData.sections && Array.isArray(apiData.sections)) {
          footerSection = apiData.sections.find(
            (s) => s.section_type === "footer"
          );
        }

        // Case 2: New flat format
        if (!footerSection && apiData.company_name) {
          footerSection = {
            logo: apiData.logo || "",
            companyName: apiData.company_name || "ProHire",
            menus: apiData.menus || [],
            contactInfo: {
              email: apiData.contact_info?.email || "",
              phone: apiData.contact_info?.phone || "",
              address: apiData.contact_info?.address || "",
            },
            socialLinks: (apiData.social_links || []).map((social) => ({
              name: social.name,
              icon: getIconComponent(social.icon),
              link: social.link || "#",
            })),
            legalText: apiData.legal_text || "",
            links: apiData.legal_links || [],
          };
        }

        if (!footerSection) {
          throw new Error("No footer section found in API response");
        }

        setFooterData(footerSection);
      } catch (err) {
        console.error("Error fetching footer data:", err);
        setError(err.message);
        setFooterData(getDefaultFooterData());
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, [slug]);

  // Helper function to get default data
  const getDefaultFooterData = () => ({
    logo: "",
    companyName: "ProHire",
    menus: [
      {
        title: "Product",
        items: [
          { name: "AI Job Matching", link: "/ai-matching" },
          { name: "Company Verification", link: "/verified-employers" },
          { name: "Career Guidance", link: "/career-guidance" },
        ],
      },
      {
        title: "Company",
        items: [
          { name: "About Us", link: "/about" },
          { name: "Team", link: "/team" },
          { name: "Careers", link: "/careers" },
        ],
      },
      {
        title: "Resources",
        items: [
          { name: "Blog", link: "/blog" },
          { name: "Help Center", link: "/help" },
          { name: "Webinars", link: "/webinars" },
        ],
      },
    ],
    contactInfo: {
      email: "contact@prohire.com",
      phone: "+1 (555) 123-4567",
      address: "123 Career Street, Hiring City, HC 12345",
    },
    socialLinks: [
      { name: "Facebook", icon: <FaFacebook />, link: "#" },
      { name: "Twitter", icon: <FaTwitter />, link: "#" },
      { name: "LinkedIn", icon: <FaLinkedin />, link: "#" },
      { name: "Instagram", icon: <FaInstagram />, link: "#" },
    ],
    legalText: "© 2023 ProHire. All rights reserved.",
    links: [
      { name: "Privacy Policy", link: "/privacy" },
      { name: "Terms of Service", link: "/terms" },
      { name: "Cookie Policy", link: "/cookies" },
    ],
  });

  // Helper function to map icon names to components
  const getIconComponent = (iconName) => {
    switch (iconName?.toLowerCase()) {
      case "facebook":
        return <FaFacebook />;
      case "twitter":
        return <FaTwitter />;
      case "linkedin":
        return <FaLinkedin />;
      case "instagram":
        return <FaInstagram />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="footer-loading">Loading footer...</div>;
  }

  if (error) {
    console.error("Footer Error:", error);
    // Continue rendering with fallback data
  }

  return (
    <>
      <footer
        className="footer"
        style={{ backgroundColor: "#cfd6ea", color: "#2c1475" }}
      >
        <Container>
          <Row className="py-5">
            {/* Logo and Company Info */}
            <Col lg={4} className="mb-4 mb-lg-0">
              <div className="footer-brand">
                {footerData.logo ? (
                  <img
                    src={`https://prohires.strangled.net${footerData.logo}`}
                    alt={footerData.companyName}
                    className="footer-logo mb-3"
                    style={{ maxHeight: "50px" }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <h3 className="mb-3" style={{ color: "#2c1475" }}>
                    {footerData.companyName}
                  </h3>
                )}
                <p className="footer-description">
                  Connecting talent with opportunity through innovative hiring
                  solutions.
                </p>

                <div className="contact-info mt-4">
                  {footerData.contactInfo.email && (
                    <div className="d-flex align-items-center mb-2">
                      <FaEnvelope className="me-2" />
                      <span>{footerData.contactInfo.email}</span>
                    </div>
                  )}
                  {footerData.contactInfo.phone && (
                    <div className="d-flex align-items-center mb-2">
                      <FaPhone className="me-2" />
                      <span>{footerData.contactInfo.phone}</span>
                    </div>
                  )}
                  {footerData.contactInfo.address && (
                    <p className="mb-0">{footerData.contactInfo.address}</p>
                  )}
                </div>
              </div>
            </Col>

            {/* Footer Menus */}
            {footerData.menus.map((menu, index) => (
              <Col key={`menu-${index}`} md={4} lg={2} className="mb-4 mb-md-0">
                {menu.title && (
                  <h5 className="footer-menu-title mb-3">{menu.title}</h5>
                )}
                {menu.items && menu.items.length > 0 && (
                  <ul className="footer-menu-list list-unstyled">
                    {menu.items.map((item, itemIndex) => (
                      <li
                        key={`menu-item-${index}-${itemIndex}`}
                        className="mb-2"
                      >
                        <a
                          href={item.link || "#"}
                          className="footer-menu-link"
                          style={{ color: "#2c1475" }}
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </Col>
            ))}

            {/* Social Media */}
            <Col md={4} lg={2} className="mb-4 mb-md-0">
              <h5 className="footer-menu-title mb-3">Connect With Us</h5>
              {footerData.socialLinks.length > 0 && (
                <div className="social-icons d-flex gap-3">
                  {footerData.socialLinks.map((social, index) => (
                    <a
                      key={`social-${index}`}
                      href={social.link}
                      className="social-icon"
                      aria-label={social.name}
                      style={{ color: "#2c1475", fontSize: "1.5rem" }}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              )}

              <h5 className="footer-menu-title mt-4 mb-3">Newsletter</h5>
              <div className="newsletter-form">
                <input
                  type="email"
                  placeholder="Your email"
                  className="form-control mb-2"
                  style={{ borderColor: "#2c1475" }}
                />
                <button
                  className="btn btn-primary w-100"
                  style={{ backgroundColor: "#2c1475", borderColor: "#2c1475" }}
                >
                  Subscribe
                </button>
              </div>
            </Col>
          </Row>
              <h5 className="footer-menu-title mt-4 mb-3">Newsletter</h5>
              <div className="newsletter-form">
                <input
                  type="email"
                  placeholder="Your email"
                  className="form-control mb-2"
                  style={{ borderColor: "#2c1475" }}
                />
                <button
                  className="btn btn-primary w-100"
                  style={{ backgroundColor: "#2c1475", borderColor: "#2c1475" }}
                >
                  Subscribe
                </button>
              </div>
            </Col>
          </Row>

          {/* Copyright and Legal */}
          <Row
            className="py-3 border-top"
            style={{ borderColor: "rgba(44, 20, 117, 0.1)" }}
          >
            <Col md={6} className="mb-3 mb-md-0">
              {footerData.legalText && (
                <p className="mb-0" style={{ color: "#2c1475" }}>
                  {footerData.legalText}
                </p>
              )}
            </Col>
            <Col md={6} className="text-md-end">
              {footerData.links.length > 0 && (
                <ul className="list-inline mb-0">
                  {footerData.links.map((link, index) => (
                    <li
                      key={`legal-link-${index}`}
                      className="list-inline-item"
                    >
                      <a
                        href={link.link || "#"}
                        className="footer-legal-link"
                        style={{ color: "#2c1475" }}
                      >
                        {link.name}
                      </a>
                      {index < footerData.links.length - 1 && (
                        <span className="mx-2" style={{ color: "#2c1475" }}>
                          ·
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Col>
          </Row>
        </Container>
      </footer>

      {/* Back to top button */}
      {showScroll && (
        <button
          className="back-to-top"
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <FaArrowUp />
        </button>
      )}
    </>
  );
};

export default Footer;
