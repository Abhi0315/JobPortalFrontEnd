import { useState, useEffect } from "react";
import { Container, Row, Col, Accordion } from "react-bootstrap";
import { motion } from "framer-motion";
import "../styles/FAQ.css";

const FAQ = () => {
  const [faqData, setFaqData] = useState(null);
  const [activeKey, setActiveKey] = useState(null);

  useEffect(() => {
    fetch("https://prohires.strangled.net/frontend/faq_list/")
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data); // Check the actual structure
        setFaqData(data);
      })
      .catch((err) => console.error("Error fetching FAQs:", err));
  }, []);

  if (!faqData) return <div className="text-center py-5">Loading FAQs...</div>;

  // Transform the API data to match our expected structure
  const transformData = (data) => {
    const transformed = {
      section_title: "Frequently Asked Questions",
      categories: {},
    };

    data?.sections?.forEach((section) => {
      const categoryKey = section.title.toLowerCase().replace(" ", "_");
      transformed.categories[categoryKey] = {
        title: section.categories[0]?.title || section.title,
        questions: section.categories[0]?.questions || [],
      };
    });

    return transformed;
  };

  const transformedData = transformData(faqData);

  // Safely access nested properties with fallbacks
  const sectionTitle = transformedData.section_title;
  const categories = transformedData.categories || {};

  // Get category data with empty array fallbacks
  const generalQuestions = categories.general?.questions || [];
  const jobSeekerQuestions = categories.job_seekers?.questions || [];
  const employerQuestions = categories.employers?.questions || [];

  return (
    <section className="faq-section py-5" id="faq">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-center mb-5 faq-title">{sectionTitle}</h2>

          <Row>
            {/* General Questions */}
            {generalQuestions.length > 0 && (
              <Col lg={4} className="mb-4 mb-lg-0">
                <h3 className="faq-category-title">
                  {categories.general?.title || "General Questions"}
                </h3>
                <Accordion
                  activeKey={activeKey}
                  onSelect={(key) => setActiveKey(key)}
                >
                  {generalQuestions.map((item, index) => (
                    <Accordion.Item
                      key={`general-${index}`}
                      eventKey={`general-${index}`}
                      className="mb-3 shadow-sm"
                    >
                      <Accordion.Header className="faq-question">
                        {item.question}
                      </Accordion.Header>
                      <Accordion.Body className="faq-answer">
                        {item.answer}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Col>
            )}

            {/* Job Seeker Questions */}
            {jobSeekerQuestions.length > 0 && (
              <Col lg={4}>
                <h3 className="faq-category-title">
                  {categories.job_seekers?.title || "For Job Seekers"}
                </h3>
                <Accordion
                  activeKey={activeKey}
                  onSelect={(key) => setActiveKey(key)}
                >
                  {jobSeekerQuestions.map((item, index) => (
                    <Accordion.Item
                      key={`jobseeker-${index}`}
                      eventKey={`jobseeker-${index}`}
                      className="mb-3 shadow-sm"
                    >
                      <Accordion.Header className="faq-question">
                        {item.question}
                      </Accordion.Header>
                      <Accordion.Body className="faq-answer">
                        {item.answer}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Col>
            )}

            {/* Employer Questions */}
            {employerQuestions.length > 0 && (
              <Col lg={4}>
                <h3 className="faq-category-title">
                  {categories.employers?.title || "For Employers"}
                </h3>
                <Accordion
                  activeKey={activeKey}
                  onSelect={(key) => setActiveKey(key)}
                >
                  {employerQuestions.map((item, index) => (
                    <Accordion.Item
                      key={`employer-${index}`}
                      eventKey={`employer-${index}`}
                      className="mb-3 shadow-sm"
                    >
                      <Accordion.Header className="faq-question">
                        {item.question}
                      </Accordion.Header>
                      <Accordion.Body className="faq-answer">
                        {item.answer}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Col>
            )}
          </Row>
        </motion.div>
      </Container>
    </section>
  );
};

export default FAQ;
