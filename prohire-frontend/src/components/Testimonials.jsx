import React, { useEffect, useState } from "react";
import ScrollStack, { ScrollStackItem } from "./ScrollStack";
import "../styles/Testimonials.css";

const API_SLUG = "home";

const cardColors = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
  "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
  "linear-gradient(135deg, #a6c0fe 0%, #f68084 100%)",
  "linear-gradient(135deg, #ffc3a0 0%, #ffafbd 100%)",
  "linear-gradient(135deg, #ffafbd 0%, #ffc3a0 100%)",
];

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(
          `https://prohires.strangled.net/frontend/fetch_records?slug=${API_SLUG}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch testimonials.");
        }
        const data = await response.json();

        const testimonialSection = data.sections.find(
          (section) => section.section_type === "testimonial"
        );

        if (testimonialSection && testimonialSection.contents) {
          const loadedTestimonials = testimonialSection.contents.map(
            (item, i) => ({
              title: item.title || "Anonymous",
              description: item.description || "Client",
              text: item.button_text || "No feedback provided.",
              button_url: item.button_url || "#",
              color: cardColors[i % cardColors.length],
            })
          );

          setTestimonials(loadedTestimonials);
        } else {
          setTestimonials([]);
        }
      } catch (err) {
        setError(err.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <span className="section-tag">Testimonials</span>
          <h2 className="section-title">Voices of Satisfaction</h2>
          <p className="section-subtitle">
            Discover what our clients say about their experience working with us
          </p>
        </div>

        {loading && (
          <div className="testimonials-loading">
            <div className="loading-dots">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}

        {error && (
          <div className="testimonials-error">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && testimonials.length > 0 && (
          <ScrollStack
            className="testimonials-stack"
            itemDistance={40}
            itemScale={0.05}
            itemStackDistance={20}
            baseScale={0.92}
            rotationAmount={0.5}
            blurAmount={1.5}
          >
            {testimonials.map((testimonial, idx) => (
              <ScrollStackItem
                key={idx}
                itemClassName="testimonial-card"
                style={{ "--card-gradient": testimonial.color }}
              >
                <div className="testimonial-content">
                  <div className="testimonial-quote">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M7 17H3V13C3 9.7 5.7 7 9 7H11V11H9C8.4 11 8 11.4 8 12V13H11V17H7ZM21 17H17V13C17 9.7 19.7 7 23 7H25V11H23C22.4 11 22 11.4 22 12V13H25V17H21Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <p className="testimonial-text">{testimonial.text}</p>
                  <div className="testimonial-author">
                    <div className="author-info">
                      <h4 className="author-name">{testimonial.title}</h4>
                      <span className="author-role">
                        {testimonial.description}
                      </span>
                    </div>
                    {testimonial.button_url &&
                      testimonial.button_url !== "#" && (
                        <a
                          href={testimonial.button_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="author-link"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              d="M5 12H19M19 12L12 5M19 12L12 19"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </a>
                      )}
                  </div>
                </div>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        )}

        {!loading && !error && testimonials.length === 0 && (
          <div className="testimonials-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M12 8V12M12 16H12.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <p>No testimonials available yet</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
