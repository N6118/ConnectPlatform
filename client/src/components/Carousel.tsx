import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Placeholder images - we'll need to add these to the assets folder
const carouselData = [
  { title: 'Connect with Peers', description: 'Collaborate on real-world projects.' },
  { title: 'Mentorship', description: 'Get guidance from experienced faculty.' },
  { title: 'Join Communities', description: 'Engage in forums and discussions.' },
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((current + 1) % carouselData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [current]);

  const handleNext = () => {
    setCurrent((current + 1) % carouselData.length);
  };

  const handlePrev = () => {
    setCurrent((current - 1 + carouselData.length) % carouselData.length);
  };

  return (
    <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
      <div className="absolute inset-0 transition-opacity duration-700 ease-in-out">
        {carouselData.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex h-full">
              <div className="flex-grow flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 bg-opacity-50">
                <div className="p-4 md:p-6 text-center z-10 text-white">
                  <h2 className="text-xl md:text-3xl font-bold">{item.title}</h2>
                  <p className="mt-2 text-sm md:text-lg">{item.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-blue-600 p-2 rounded-full shadow-md transition-all duration-300"
      >
        &#10094;
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-blue-600 p-2 rounded-full shadow-md transition-all duration-300"
      >
        &#10095;
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {carouselData.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === current ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
