'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import BannerCarousel from '@/components/BannerCarousel';
import FestivalBanner from '@/components/FestivalBanner';
import StoreStatus from '@/components/StoreStatus';
import ChatButton from '@/components/ChatButton';
import { ShoppingCart, Calendar, ArrowRight } from 'lucide-react';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPickupTimeModal, setShowPickupTimeModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, bannersRes, categoriesRes, bannerRes] = await Promise.all([
        fetch('/api/products?featured=true&limit=8'),
        fetch('/api/banners'),
        fetch('/api/categories'),
        fetch('/api/banner') // Fetch single active banner
      ]);
      
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setFeaturedProducts(productsData.products || []);
      }
      
      if (bannersRes.ok) {
        const bannersData = await bannersRes.json();
        setBanners(bannersData.banners || []);
      }
      
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.categories || []);
      }

      if (bannerRes.ok) {
        const bannerData = await bannerRes.json();
        setBanner(bannerData);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const pickupTimeSlots = [
    '7:00AM-8:00AM', '8:00AM-9:00AM', '9:00AM-10:00AM', '10:00AM-11:00AM',
    '11:00AM-12:00PM', '12:00PM-1:00PM', '1:00PM-2:00PM', '2:00PM-3:00PM',
    '3:00PM-4:00PM', '4:00PM-5:00PM', '5:00PM-6:00PM', '6:00PM-7:00PM',
    '7:00PM-8:00PM', '8:00PM-9:00PM', '9:00PM-10:00PM', '10:00PM-11:00PM'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Festival Banner - First after navbar */}
      {banner?.isActive && <FestivalBanner data={banner} />}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Welcome to Saurabh Provision
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Order before you go – your items will be ready for pickup!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/products" 
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Start Ordering
              </Link>
              <button
                onClick={() => setShowPickupTimeModal(true)}
                className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Select Pickup Time
              </button>
            </div>
            <div className="mt-6">
              <StoreStatus />
            </div>
          </div>
        </div>
      </section>

      {/* Banner Carousel */}
      {banners.length > 0 && (
        <section className="py-8">
          <BannerCarousel banners={banners} />
        </section>
      )}

      {/* Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Shop by Category</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/products?category=${category._id}`}
                className="px-6 py-3 bg-white border-2 border-green-600 text-green-600 rounded-full font-medium hover:bg-green-600 hover:text-white transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <Link 
              href="/products" 
              className="text-green-600 hover:text-green-700 font-medium flex items-center"
            >
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No featured products available</p>
            </div>
          )}
        </div>
      </section>

      {/* Festival/Trending Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-orange-600">
            Navratri Specials
          </h2>
          <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🍯</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Rajgira Ladoo</h3>
                <p className="text-gray-600">Traditional fasting sweets</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🥔</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Fasting Chips</h3>
                <p className="text-gray-600">Crispy and healthy snacks</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🍯</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Sheera</h3>
                <p className="text-gray-600">Sweet semolina dessert</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Find Us Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Us</h2>
            <p className="text-lg text-gray-600">Visit our store for the best deals and fresh products!</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map */}
            <div className="order-2 lg:order-1">
              <div className="bg-white border-2 border-green-200 rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps?q=20.548194047496573,74.52510759792922&z=17&output=embed"
                  width="100%"
                  height="350"
                  style={{ border: '0', borderRadius: '16px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Saurabh Provision Store Location"
                />
              </div>
            </div>

            {/* Store Information */}
            <div className="order-1 lg:order-2">
              <div className="bg-white border-2 border-green-200 rounded-lg p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Store Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-600 text-sm">📍</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Address</h4>
                      <p className="text-gray-600">Saurabh Provision Store</p>
                      <p className="text-gray-600">Pune, Maharashtra</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-600 text-sm">📞</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Phone</h4>
                      <a 
                        href="tel:9766689821" 
                        className="text-green-600 hover:text-green-700 font-medium transition-colors"
                      >
                        9766689821
                      </a>
                      <p className="text-sm text-gray-500">Click to call</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-600 text-sm">💬</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">WhatsApp</h4>
                      <a 
                        href="https://wa.me/919766689821" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 font-medium transition-colors inline-flex items-center gap-2"
                      >
                        Chat with us
                      </a>
                      <p className="text-sm text-gray-500">Quick responses</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-600 text-sm">🕐</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Store Hours</h4>
                      <p className="text-gray-600">7:00 AM - 11:00 PM</p>
                      <p className="text-sm text-gray-500">Every Day</p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <a 
                      href="https://www.google.com/maps?q=20.548194047496573,74.52510759792922" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="text-lg">📍</span>
                      Get Directions
                    </a>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Opens in Google Maps app on mobile
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ChatButton />

      {/* Pickup Time Modal */}
      {showPickupTimeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Select Pickup Time</h3>
            <div className="space-y-2">
              {pickupTimeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => {
                    localStorage.setItem('selectedPickupTime', slot);
                    setShowPickupTimeModal(false);
                  }}
                  className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-500 transition-colors"
                >
                  {slot}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowPickupTimeModal(false)}
              className="mt-4 w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
