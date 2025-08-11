import React from "react";
import ScrollStack, { ScrollStackItem } from "./ScrollStack";
import "../styles/Testimonials.css";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "John Doe",
      role: "CEO, Company A",
      content:
        "This product completely transformed our workflow. The team is more productive than ever before!",
      color: "#4f46e5",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Design Director, Company B",
      content:
        "The attention to detail and user experience is phenomenal. Our customers love the new interface.",
      color: "#10b981",
    },
    {
      id: 3,
      name: "Michael Johnson",
      role: "CTO, Company C",
      content:
        "The implementation was seamless and the support team was incredibly responsive to our needs.",
      color: "#f59e0b",
    },
    {
      id: 4,
      name: "Sarah Williams",
      role: "Marketing Lead, Company D",
      content:
        "We've seen a 40% increase in engagement since implementing this solution. Highly recommended!",
      color: "#ec4899",
    },
  ];

  return (
    <section className="testimonials-section">
      <div className="testimonials-header">
        <h2 className="testimonials-title">Client Testimonials</h2>
        <p className="testimonials-subtitle">
          Hear what our clients say about their experience
        </p>
      </div>

      <ScrollStack
        className="testimonials-stack"
        itemDistance={60}
        itemScale={0.05}
        itemStackDistance={30}
        baseScale={0.92}
        rotationAmount={0.5}
        blurAmount={1.5}
      >
        {testimonials.map((testimonial) => (
          <ScrollStackItem
            key={testimonial.id}
            itemClassName="testimonial-card"
            style={{ "--card-accent": testimonial.color }}
          >
            <div className="testimonial-content">
              <div className="testimonial-quote-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 17H3V13C3 9.68629 5.68629 7 9 7H11V11H9C8.44772 11 8 11.4477 8 12V13H11V17H7ZM21 17H17V13C17 9.68629 19.6863 7 23 7H25V11H23C22.4477 11 22 11.4477 22 12V13H25V17H21Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <p className="testimonial-text">{testimonial.content}</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  {testimonial.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="author-info">
                  <h3 className="author-name">{testimonial.name}</h3>
                  <p className="author-role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  );
};

export default Testimonials;
