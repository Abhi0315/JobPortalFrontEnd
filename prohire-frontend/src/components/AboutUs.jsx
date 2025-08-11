import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../styles/AboutUs.css";

const AboutUs = () => {
  const [aboutData, setAboutData] = useState({
    teamMembers: [],
    mission: {
      title: "Our Mission",
      content:
        "To bridge the gap between exceptional talent and forward-thinking companies.",
    },
    header: {
      title: "The Team Behind ProHire",
      subtitle:
        "We're revolutionizing talent acquisition with cutting-edge technology.",
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch(
          "https://prohires.strangled.net/frontend/fetch_records?slug=home"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch about data");
        }

        const data = await response.json();

        // Process the API response
        const processData = (apiData) => {
          const result = {
            teamMembers: [],
            mission: {
              title: "Our Mission",
              content:
                "To bridge the gap between exceptional talent and forward-thinking companies.",
            },
            header: {
              title: "The Team Behind ProHire",
              subtitle:
                "We're revolutionizing talent acquisition with cutting-edge technology.",
            },
          };

          // Find team section in API response
          const teamSection = apiData.sections?.find(
            (section) => section.section_type === "about_us"
          );

          // Find mission section in API response
          const missionSection = apiData.sections?.find(
            (section) =>
              section.section_type === "about_us" ||
              section.section_type === "hero"
          );

          // Process team members
          if (teamSection && teamSection.contents) {
            result.teamMembers = teamSection.contents.map((content, index) => ({
              name: content.title || `Team Member ${index + 1}`,
              role: content.button_text || "Team Role",
              description: content.description || "Team member description",
              color: getColorByIndex(index),
              icon: content.icon_url
                ? `https://prohires.strangled.net${content.icon_url}`
                : null,
            }));
          }

          // Process mission statement if available
          if (missionSection) {
            result.mission = {
              title: missionSection.heading || "Our Mission",
              content: missionSection.description || result.mission.content,
            };
          }

          // Process header if available
          const headerSection = apiData.sections?.find(
            (section) => section.section_type === "about_header"
          );
          if (headerSection) {
            result.header = {
              title: headerSection.heading || result.header.title,
              subtitle: headerSection.description || result.header.subtitle,
            };
          }

          return result;
        };

        // Helper function to generate consistent colors
        const getColorByIndex = (index) => {
          const colors = [
            "#6366F1",
            "#10B981",
            "#F59E0B",
            "#0bf5ceff",
            "#7300ffff",
          ];
          return colors[index % colors.length];
        };

        setAboutData(processData(data));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching about data:", err);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <section className="about-us" id="about">
        <div className="about-container">
          <div className="loading-spinner">Loading team information...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="about-us" id="about">
        <div className="about-container">
          <div className="error-message">Error loading content: {error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="about-us" id="about">
      <div className="about-container">
        {/* Header Section */}
        <motion.div
          className="about-header"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">{aboutData.header.title}</h2>
          <p className="section-subtitle">{aboutData.header.subtitle}</p>
        </motion.div>

        {/* Team Members Grid */}
        <motion.div
          className="team-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {aboutData.teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="team-card"
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              {member.icon ? (
                <img
                  src={member.icon}
                  alt={member.name}
                  className="member-icon-wrapper circle"
                />
              ) : (
                <div
                  className="member-icon-wrapper fallback-icon"
                  style={{ backgroundColor: member.color }}
                >
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              )}

              <h3 className="team-name">{member.name}</h3>
              <p className="team-role">{member.role}</p>
              <p className="team-desc">{member.description}</p>
              <div
                className="team-card-bg"
                style={{ backgroundColor: `${member.color}10` }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          className="mission-statement"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3>{aboutData.mission.title}</h3>
          <p>{aboutData.mission.content}</p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
