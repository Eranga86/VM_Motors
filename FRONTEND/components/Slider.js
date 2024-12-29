
import React, { useState, useEffect } from 'react';
import '../styles/slider.css'; // Import your CSS file for styling
import img1 from '../assests/ship1.jpg'; // Importing img1 from assets folder
import banner from '../assests/shop2.jpg'; // Importing banner from assets folder
import img2 from '../assests/shop3.jpg'; // Importing img2 from assets folder

const Slider = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const images = [img1, banner, img2]; // Array of imported image variables

  const nextSlide = () => {
    setSlideIndex((slideIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setSlideIndex((slideIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [slideIndex]);

  return (
    <div className="carousel">
      <div className="carousel-images" style={{ transform: `translateX(-${slideIndex * 100}%)` }}>
        {images.map((image, index) => (
          <img key={index} className="carousel-img" src={image} alt={`Image ${index + 1}`} />
        ))}
      </div>
      <button className="carousel-btn prev-btn" onClick={prevSlide}>Prev</button>
      <button className="carousel-btn next-btn" onClick={nextSlide}>Next</button>
    </div>
  );
};

export default Slider;
