import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import "../styles/SkeletonLoading.css";

const SkeletonLoading = () => {
  return (
    <div className="skeleton-loading">
      <section className="hero-section-skeleton">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="hero-skeleton-content-col">
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
            <Col lg={6} className="hero-skeleton-image-col">
              <div className="skeleton-image"></div>
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

export default SkeletonLoading;
