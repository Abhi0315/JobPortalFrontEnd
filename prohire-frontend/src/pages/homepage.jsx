// src/pages/homepage.jsx
import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="homepage-wrapper">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3 sticky-top">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            <span className="text-gradient">ProHire</span>
          </Link>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <NavItem to="/" text="Home" />
              <NavItem to="/jobs" text="Jobs" />
              <NavItem to="/internships" text="Internships" />
              <NavItem to="/contact" text="Contact" />
              <NavItem to="/about" text="About" />
            </ul>

            <div className="d-flex gap-2">
              <Link
                to="/login"
                className="btn btn-outline-primary px-4 rounded-pill fw-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn btn-primary px-4 rounded-pill fw-medium shadow-sm"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section py-5 py-lg-7">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 mb-3">
                Trusted by 10,000+ companies
              </span>
              <h1 className="display-4 fw-bold mb-4">
                Find Your <span className="text-gradient">Dream Team</span>{" "}
                Today
              </h1>
              <p className="lead text-muted mb-5">
                Connect with top talent or discover your perfect career
                opportunity through our intelligent matching platform.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link
                  to="/jobs"
                  className="btn btn-primary btn-lg px-4 rounded-pill shadow-sm"
                >
                  Browse Jobs
                </Link>
                <Link
                  to="/register"
                  className="btn btn-outline-primary btn-lg px-4 rounded-pill"
                >
                  Post a Job
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="features-card p-4 p-lg-5 rounded-4 shadow-sm">
                <div className="feature-item d-flex mb-4">
                  <div className="icon-box bg-primary bg-opacity-10 text-primary rounded-circle p-3 me-3">
                    <svg
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Verified Candidates</h5>
                    <p className="text-muted mb-0">
                      Pre-screened professionals ready to hire
                    </p>
                  </div>
                </div>
                <div className="feature-item d-flex mb-4">
                  <div className="icon-box bg-primary bg-opacity-10 text-primary rounded-circle p-3 me-3">
                    <svg
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Fast Matching</h5>
                    <p className="text-muted mb-0">
                      AI-powered job matching in minutes
                    </p>
                  </div>
                </div>
                <div className="feature-item d-flex">
                  <div className="icon-box bg-primary bg-opacity-10 text-primary rounded-circle p-3 me-3">
                    <svg
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 15l8-8H4l8 8zm0-12L4 5l8 8 8-8-8-8z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Transparent Process</h5>
                    <p className="text-muted mb-0">
                      No hidden fees or surprises
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5 bg-light">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-6 col-md-3">
              <div className="p-3 rounded-3">
                <h3 className="display-5 fw-bold text-primary mb-2">50K+</h3>
                <p className="text-muted mb-0">Jobs Posted</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 rounded-3">
                <h3 className="display-5 fw-bold text-primary mb-2">10K+</h3>
                <p className="text-muted mb-0">Hiring Companies</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 rounded-3">
                <h3 className="display-5 fw-bold text-primary mb-2">95%</h3>
                <p className="text-muted mb-0">Success Rate</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 rounded-3">
                <h3 className="display-5 fw-bold text-primary mb-2">24h</h3>
                <p className="text-muted mb-0">Avg. Response Time</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CSS Styles */}
      <style jsx global>{`
        .text-gradient {
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-link {
          position: relative;
          margin: 0 0.5rem;
        }
        .nav-link::after {
          content: "";
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 0;
          background-color: #3b82f6;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }

        .hero-section {
          padding-top: 6rem;
          padding-bottom: 6rem;
          background-color: #f8fafc;
        }

        .features-card {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .icon-box {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stats-section .col {
          transition: transform 0.3s ease;
        }

        .stats-section .col:hover {
          transform: translateY(-5px);
        }

        @media (max-width: 992px) {
          .hero-section {
            padding-top: 4rem;
            padding-bottom: 4rem;
          }

          .display-4 {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
};

// Reusable NavItem component
const NavItem = ({ to, text }) => (
  <li className="nav-item">
    <Link className="nav-link px-3 position-relative" to={to}>
      {text}
    </Link>
  </li>
);

export default HomePage;
