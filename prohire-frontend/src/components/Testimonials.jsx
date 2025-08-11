import React, { useEffect, useState } from "react";
import ScrollStack, { ScrollStackItem } from "./ScrollStack";
import "../styles/Testimonials.css";

const API_SLUG = "home";

const cardColors = [
  "#4f46e5",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#6366f1",
  "#14b8a6",
  "#eab308",
  "#f43f5e",
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

        // Filter for the "testimonial" section
        const testimonialSection = data.sections.find(
          (section) => section.section_type === "testimonial"
        );

        if (testimonialSection && testimonialSection.contents) {
          const loadedTestimonials = testimonialSection.contents.map(
            (item, i) => ({
              title: item.title || "Untitled",
              description: item.description || "No description provided.",
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
      <div className="testimonials-header">
        <h2 className="testimonials-title">Client Testimonials</h2>
        <p className="testimonials-subtitle">
          Hear what our clients say about their experience
        </p>
      </div>

      {loading && <div className="testimonials-loading">Loading...</div>}
      {error && <div className="testimonials-error">{error}</div>}

      {!loading && !error && testimonials.length > 0 && (
        <ScrollStack
          className="testimonials-stack"
          itemDistance={60}
          itemScale={0.05}
          itemStackDistance={30}
          baseScale={0.92}
          rotationAmount={0.5}
          blurAmount={1.5}
        >
          {testimonials.map((testimonial, idx) => (
            <ScrollStackItem
              key={idx}
              itemClassName="testimonial-card"
              style={{ "--card-accent": testimonial.color }}
            >
              <div className="testimonial-content">
                {/* Quote Icon */}
                <div className="testimonial-quote-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 17H3V13C3 9.7 5.7 7 9 7H11V11H9C8.4 11 8 11.4 8 12V13H11V17H7ZM21 17H17V13C17 9.7 19.7 7 23 7H25V11H23C22.4 11 22 11.4 22 12V13H25V17H21Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>

                <h3 className="testimonial-title">{testimonial.title}</h3>
                <p className="testimonial-subtitle">
                  {testimonial.description}
                </p>
                <p className="testimonial-text">{testimonial.text}</p>

                {/* Optional: hide button if no URL */}
                {testimonial.button_url && testimonial.button_url !== "#" && (
                  <div className="testimonial-button">
                    <a
                      href={testimonial.button_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        backgroundColor: testimonial.color,
                        color: "#fff",
                        padding: "0.6rem 1.2rem",
                        borderRadius: "30px",
                        textDecoration: "none",
                        fontWeight: "500",
                        display: "inline-block",
                        marginTop: "10px",
                      }}
                    >
                      {testimonial.button_text || "Learn More"}
                    </a>
                  </div>
                )}
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      )}

      {!loading && !error && testimonials.length === 0 && (
        <div className="testimonials-empty">No testimonials available.</div>
      )}
    </section>
  );
};

export default Testimonials;
