import React, { useState, useEffect } from "react";
import visionImage from "../assests/vision.jpg";
import missionImage from "../assests/mission.jpg";
import valuesImage from "../assests/values.jpg";
import "../styles/aboutus.css";
//import Navbar from '../components/Navbar';
import Footer from "../components/Footer";

const AboutUs = () => {
  const [selectedContent, setSelectedContent] = useState("vision");
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (event) => {
    setSelectedContent(event.target.value);
  };

  const slides = [
    { image: visionImage, alt: "Vision Slide" },
    { image: missionImage, alt: "Mission Slide" },
    { image: valuesImage, alt: "Values Slide" },
  ];

  const content = {
    vision: {
      title: "Our Vision",
      text: "To be the leading provider of high-quality spare parts for Rosa and Coaster buses, ensuring reliability and safety for our customers worldwide.",
      image: visionImage,
    },
    mission: {
      title: "Our Mission",
      text: "Our mission is to supply top-tier spare parts for Rosa and Coaster bus models, sourced from trusted manufacturers in Taiwan, Singapore, and Malaysia. We are committed to delivering exceptional customer service, ensuring that every part we offer meets the highest standards of quality and performance. Through our dedication, we aim to support the longevity and efficiency of our customers' vehicles, contributing to their operational success.",
      image: missionImage,
    },
    values: {
      title: "Our Values",
      text: [
        {
          title: "Quality Assurance",
          description:
            "We guarantee that all our products meet rigorous quality standards, providing our customers with parts they can trust.",
        },
        {
          title: "Customer Satisfaction",
          description:
            "Our customers are at the heart of our business. We strive to understand their needs and exceed their expectations with our products and services.",
        },
        {
          title: "Integrity and Transparency",
          description:
            "We conduct our business with honesty and transparency, ensuring that our customers have complete confidence in our products and services.",
        },
        {
          title: "Innovation and Improvement",
          description:
            "We continuously seek ways to improve our offerings and processes, embracing new technologies and practices to better serve our customers.",
        },
        {
          title: "Global Sourcing",
          description:
            "By importing parts from leading manufacturers in Taiwan, Singapore, and Malaysia, we ensure a diverse and reliable supply chain that meets global standards.",
        },
        {
          title: "Commitment to Excellence",
          description:
            "Our team is dedicated to maintaining excellence in every aspect of our business, from product selection to customer support.",
        },
      ],
      image: valuesImage,
    },
  };

  return (
    <div>
      <div className="banner">Welcome to V & M</div>
      <div className="slideshow-container">
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide.image}
            alt={slide.alt}
            className={`slide ${slideIndex === index ? "active" : ""}`}
          />
        ))}
        <div className="dot-container">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${slideIndex === index ? "active" : ""}`}
              onClick={() => setSlideIndex(index)}
            ></span>
          ))}
        </div>
      </div>
      <div className="about-us">
        <div className="content-container">
          <div className="left-side">
            <img
              src={content[selectedContent].image}
              alt={content[selectedContent].title}
              className="about-us-image"
            />
          </div>
          <div className="right-side">
            <h2>{content[selectedContent].title}</h2>
            {selectedContent === "values" ? (
              <div className="values-content">
                {content.values.text.map((item, index) => (
                  <div key={index} className="value-item">
                    <b>{item.title}:</b> <span>{item.description}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: "justify" }}>
                {content[selectedContent].text}
              </p>
            )}
            <div className="radio-buttons">
              <label>
                <input
                  type="radio"
                  value="vision"
                  checked={selectedContent === "vision"}
                  onChange={handleChange}
                />
                Vision
              </label>
              <label>
                <input
                  type="radio"
                  value="mission"
                  checked={selectedContent === "mission"}
                  onChange={handleChange}
                />
                Mission
              </label>
              <label>
                <input
                  type="radio"
                  value="values"
                  checked={selectedContent === "values"}
                  onChange={handleChange}
                />
                Values
              </label>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
