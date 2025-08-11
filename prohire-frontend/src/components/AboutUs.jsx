import React from "react";
import { motion } from "framer-motion";
import "../styles/AboutUs.css";

const teamMembers = [
  {
    name: "Abhiram Varier",
    role: "Frontend Developer/CMO",
    description:
      "Specializes in creating intuitive, responsive, and high-performance user interfaces for ProHire.",
    color: "#6366F1", // indigo
  },
  {
    name: "Dipak Gaikwad",
    role: "Backend Developer/CEO",
    description:
      "Ensures robust and scalable backend solutions to support ProHire's growing user base.",
    color: "#10B981", // emerald
  },
  {
    name: "Devanand Farkade",
    role: "Frontend Developer/CTO",
    description:
      "Designs engaging and user-friendly experiences to make ProHire easy and enjoyable to use.",
    color: "#F59E0B", // amber
  },
  {
    name: "Abhijit Revgade",
    role: "Frontend Dev/CFO",
    description:
      "Designs engaging and user-friendly experiences to make ProHire easy and enjoyable to use.",
    color: "#0bf5ceff", // amber
  },
  {
    name: "Amol Kadam",
    role: "Frontend Dev/Investor",
    description:
      "The one who trusted in our platform. The Investor himself, Mr. Amol Kadam",
    color: "#7300ffff", // amber
  },
];

const AboutUs = () => {
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

  return (
    <section className="about-us" id="about">
      <div className="about-container">
        <motion.div
          className="about-header"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">The Team Behind ProHire</h2>
          <p className="section-subtitle">
            We're revolutionizing talent acquisition with cutting-edge
            technology and a human-centered approach.
          </p>
        </motion.div>

        <motion.div
          className="team-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="team-card"
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              <div
                className="member-icon"
                style={{ backgroundColor: member.color }}
              >
                {member.name
                  .split(" ")
                  .map((name) => name[0])
                  .join("")}
              </div>
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

        <motion.div
          className="mission-statement"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3>Our Mission</h3>
          <p>
            To bridge the gap between exceptional talent and forward-thinking
            companies through intelligent matching algorithms and a seamless
            hiring experience.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
