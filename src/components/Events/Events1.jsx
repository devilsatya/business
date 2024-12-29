import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import EventC from "./EventC";

const Events1 = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(window.innerWidth < 1024);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const intervalRef = useRef(null); // Reference to the interval

  // Handle next and previous slide
  const nextSlide = () => {
    if (currentIndex < allEvents.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back to the first event
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(allEvents.length - 1); // Loop to the last event
    }
  };

  // Touch start
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  // Touch end
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide(); // Swipe left, go to next slide
      } else {
        prevSlide(); // Swipe right, go to previous slide
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Touch move
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  // Set up automatic slide change every 3 seconds
  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, 3000); // Change slide every 3 seconds

    // Clean up interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentIndex]); // Dependency on `currentIndex` to ensure the state is updated

  // Handle window resize to detect if mobile/tablet
  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      {!isLoading && allEvents?.length > 0 && (
        <div className={`${styles.section} py-8`}>
         

          <div
            className="relative overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform ease-in-out duration-500"
              style={{
                width: `${allEvents.length * 100}%`,
                transform: `translateX(-${currentIndex * (100 / allEvents.length)}%)`,
              }}
            >
              {allEvents.map((event, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0"
                  style={{ width: `${100 / allEvents.length}%` }}
                >
                  <EventC data={event} />
                </div>
              ))}
            </div>

            {/* Navigation Arrows for Desktop */}
            {!isMobileOrTablet && (
              <>
                <button
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-indigo-600 p-4 rounded-full text-white shadow-lg transition-all hover:bg-indigo-700"
                  onClick={prevSlide}
                >
                  &#8592;
                </button>
                <button
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-indigo-600 p-4 rounded-full text-white shadow-lg transition-all hover:bg-indigo-700"
                  onClick={nextSlide}
                >
                  &#8594;
                </button>
              </>
            )}

            {/* Pagination Dots */}
            <div className="flex justify-center mt-4">
              {allEvents.map((_, index) => (
                <span
                  key={index}
                  className={`h-3 w-3 mx-2 rounded-full cursor-pointer ${
                    index === currentIndex ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentIndex(index)} // Click to go to a specific slide
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events1;
