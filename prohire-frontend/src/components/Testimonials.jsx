import React, { useEffect, useRef, useState } from "react";
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

const SCROLL_SPEED = 80;
const MOBILE_BREAKPOINT = 768;
const SCROLL_AMOUNT = 400;

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollBoxRef = useRef(null);
  const animationFrameRef = useRef(null);
  const scrollPosRef = useRef(0);
  const isPausedRef = useRef(false);

  // Fetch testimonials
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
        if (testimonialSection?.contents) {
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

  // Update scroll button states
  const updateButtonStates = () => {
    if (!scrollBoxRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollBoxRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  // Auto-scroll effect
  useEffect(() => {
    if (!testimonials.length || typeof window === "undefined") return;
    if (window.innerWidth <= MOBILE_BREAKPOINT) return;

    const scrollContainer = scrollBoxRef.current;
    if (!scrollContainer) return;

    let lastTimestamp = 0;

    const animateScroll = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (!isPausedRef.current) {
        scrollPosRef.current += (SCROLL_SPEED * deltaTime) / 1000;

        // Stop at the end instead of looping
        const maxScroll =
          scrollContainer.scrollWidth - scrollContainer.clientWidth;
        scrollPosRef.current = Math.min(scrollPosRef.current, maxScroll);

        scrollContainer.scrollLeft = scrollPosRef.current;
        updateButtonStates();

        // Stop animation when reaching the end
        if (scrollPosRef.current >= maxScroll) {
          cancelAnimationFrame(animationFrameRef.current);
          return;
        }
      }

      animationFrameRef.current = requestAnimationFrame(animateScroll);
    };

    animationFrameRef.current = requestAnimationFrame(animateScroll);

    // Event listeners
    const handleMouseEnter = () => (isPausedRef.current = true);
    const handleMouseLeave = () => {
      isPausedRef.current = false;
      lastTimestamp = performance.now();
    };

    scrollContainer.addEventListener("scroll", updateButtonStates);
    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      scrollContainer.removeEventListener("scroll", updateButtonStates);
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [testimonials]);

  // Navigation functions
  const scrollLeft = () => {
    if (scrollBoxRef.current) {
      isPausedRef.current = true;
      scrollBoxRef.current.scrollBy({
        left: -SCROLL_AMOUNT,
        behavior: "smooth",
      });
      setTimeout(() => {
        isPausedRef.current = false;
        updateButtonStates();
      }, 1000);
    }
  };

  const scrollRight = () => {
    if (scrollBoxRef.current) {
      isPausedRef.current = true;
      scrollBoxRef.current.scrollBy({
        left: SCROLL_AMOUNT,
        behavior: "smooth",
      });
      setTimeout(() => {
        isPausedRef.current = false;
        updateButtonStates();
      }, 1000);
    }
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <header className="testimonials-header">
          <span className="section-tag">Testimonials</span>
          <h2 className="section-title">Hear from our Clients</h2>
          <p className="section-subtitle">Real feedback. Real experiences.</p>
        </header>

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
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && testimonials.length > 0 && (
          <div className="testimonials-scroll-wrapper">
            <button
              className={`scroll-button left ${
                !canScrollLeft ? "disabled" : ""
              }`}
              onClick={scrollLeft}
              aria-label="Scroll testimonials left"
              disabled={!canScrollLeft}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>

            <div
              className="testimonials-scroll-box"
              ref={scrollBoxRef}
              tabIndex={0}
              aria-label="Testimonials carousel"
            >
              {testimonials.map((testimonial, idx) => (
                <div
                  key={idx}
                  className="testimonial-slide"
                  style={{ background: testimonial.color }}
                >
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
                          aria-label={`More about ${testimonial.title}`}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" />
                          </svg>
                        </a>
                      )}
                  </div>
                </div>
              ))}
            </div>

            <button
              className={`scroll-button right ${
                !canScrollRight ? "disabled" : ""
              }`}
              onClick={scrollRight}
              aria-label="Scroll testimonials right"
              disabled={!canScrollRight}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>
        )}

        {!loading && !error && testimonials.length === 0 && (
          <div className="testimonials-empty">
            <p>No testimonials available yet</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
