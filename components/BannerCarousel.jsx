'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BannerCarousel({ banners }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay || banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, banners.length]);

  const goToPrevious = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setIsAutoPlay(false);
    setCurrentIndex(index);
  };

  if (!banners || banners.length === 0) {
    return (
      <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No banners available</p>
        </div>
      </div>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden group">
      <div className="relative h-full">
        <Image
          src={currentBanner.image}
          alt={currentBanner.title}
          fill
          className="object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {currentBanner.title}
          </h1>
          {currentBanner.subtitle && (
            <p className="text-lg md:text-xl mb-6 max-w-2xl">
              {currentBanner.subtitle}
            </p>
          )}
          {currentBanner.link && (
            <a
              href={currentBanner.link}
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Shop Now
            </a>
          )}
        </div>
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex
                    ? 'bg-white'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
