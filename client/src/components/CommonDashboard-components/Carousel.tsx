import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

// Carousel data (Replace these image URLs with actual image paths in your project)
const carouselData = [
  {
    title: 'Connect with Peers',
    description: 'Collaborate on real-world projects.',
    image: 'https://s7d9.scene7.com/is/image/roberthalfintl/the-value-of-teamwork-in-the-workplace-blog-RH-05-23-24.jpg:Large-1x?fmt=webp-alpha',
  },
  {
    title: 'Mentorship',
    description: 'Get guidance from experienced faculty.',
    image: 'https://res.cloudinary.com/emg-prod/image/upload/f_auto,q_auto/v1/HtmlPages/HtmlPage22311/mentor_web-1.jpg',
  },
  {
    title: 'Join Communities',
    description: 'Engage with peers and make new friends.',
    image: 'https://images.unsplash.com/photo-1525026198548-4baa812f1183?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNvbW11bml0eXxlbnwwfHwwfHx8MA%3D%3D',
  },
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);

  // Function to handle next slide
  const handleNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % carouselData.length);
  }, []);

  // Function to handle previous slide
  const handlePrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + carouselData.length) % carouselData.length);
  }, []);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Swipe gesture support
  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div
      {...handlers}
      className="relative w-full h-[200px] md:h-[300px] lg:h-[400px] rounded-lg overflow-hidden shadow-lg bg-gray-900"
    >
      {/* Slides */}
      <AnimatePresence>
        {carouselData.map((item, index) =>
          index === current ? (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 w-full h-full flex items-center justify-center"
            >
              {/* Background Image */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50"></div>
              {/* Content */}
              <div className="relative text-center text-white p-4 md:p-6">
                <h2 className="text-lg md:text-3xl font-bold">{item.title}</h2>
                <p className="mt-2 text-sm md:text-lg">{item.description}</p>
              </div>
            </motion.div>
          ) : null
        )}
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 md:p-4 rounded-full shadow-md transition-all duration-300"
      >
        &#10094;
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 md:p-4 rounded-full shadow-md transition-all duration-300"
      >
        &#10095;
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {carouselData.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
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
