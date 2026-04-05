'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ShoppingBag, Star } from 'lucide-react';

export default function FestivalBanner({ data }) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  // Auto-slide through products
  useEffect(() => {
    if (!data?.products?.length || data.products.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentProductIndex((prev) => (prev + 1) % data.products.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [data?.products]);

  // Check if banner was dismissed in this session
  useEffect(() => {
    const dismissed = sessionStorage.getItem('bannerDismissed');
    if (dismissed) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('bannerDismissed', 'true');
  };

  if (!isVisible || !data) return null;

  const getFestivalEmoji = (festival) => {
    const emojis = {
      'Navratri': '🪔',
      'Diwali': '🎆',
      'Holi': '🎨',
      'Eid': '🌙',
      'Christmas': '🎄',
      'New Year': '🎉',
      'Custom': '✨'
    };
    return emojis[festival] || '✨';
  };

  const getFestivalGradient = (festival, bgColor) => {
    if (bgColor && bgColor !== '#16a34a') {
      return `linear-gradient(135deg, ${bgColor}, ${bgColor}dd)`;
    }
    
    const gradients = {
      'Navratri': 'linear-gradient(135deg, #ea580c, #f97316)',
      'Diwali': 'linear-gradient(135deg, #fbbf24, #f59e0b)',
      'Holi': 'linear-gradient(135deg, #ec4899, #8b5cf6, #3b82f6)',
      'Eid': 'linear-gradient(135deg, #10b981, #fbbf24)',
      'Christmas': 'linear-gradient(135deg, #dc2626, #16a34a)',
      'New Year': 'linear-gradient(135deg, #1f2937, #fbbf24)',
      'Custom': `linear-gradient(135deg, ${bgColor}, ${bgColor}dd)`
    };
    return gradients[festival] || gradients['Custom'];
  };

  const currentProduct = data.products?.[currentProductIndex];

  return (
    <div 
      className="relative w-full overflow-hidden"
      style={{
        background: getFestivalGradient(data.festival, data.bgColor)
      }}
    >
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 z-20 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Content */}
          <div className="text-white">
            {/* Festival badge with pulse animation */}
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full mb-4">
              <span className="text-2xl">{getFestivalEmoji(data.festival)}</span>
              <span className="text-sm font-medium">{data.festival} Special</span>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              {data.title}
            </h1>
            
            {data.subtitle && (
              <p className="text-lg md:text-xl mb-6 text-white/90">
                {data.subtitle}
              </p>
            )}

            {/* Product chips */}
            {data.products && data.products.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {data.products.slice(0, 3).map((product, index) => (
                    <div
                      key={index}
                      className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm"
                    >
                      {product.name}
                    </div>
                  ))}
                  {data.products.length > 3 && (
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      +{data.products.length - 3} more
                    </div>
                  )}
                </div>

                {/* Current product display */}
                {currentProduct && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-3">
                      {currentProduct.image && (
                        <img
                          src={currentProduct.image}
                          alt={currentProduct.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <div className="font-medium">{currentProduct.name}</div>
                        <div className="text-sm text-white/80">{currentProduct.price}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CTA Button */}
            <Link
              href={data.buttonLink}
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              <ShoppingBag className="w-5 h-5" />
              {data.buttonText}
            </Link>
          </div>

          {/* Right side - Image or Emoji */}
          <div className="hidden lg:flex justify-center items-center">
            {data.image ? (
              <img
                src={data.image}
                alt={data.title}
                className="w-full max-w-md h-auto rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="text-8xl md:text-9xl animate-bounce">
                {getFestivalEmoji(data.festival)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile responsive - Show emoji on mobile */}
      <div className="lg:hidden flex justify-center mt-4">
        {!data.image && (
          <div className="text-6xl animate-bounce">
            {getFestivalEmoji(data.festival)}
          </div>
        )}
      </div>
    </div>
  );
}
