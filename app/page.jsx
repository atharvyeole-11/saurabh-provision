'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import BannerCarousel from '@/components/BannerCarousel';
import StoreStatus from '@/components/StoreStatus';
import ChatButton from '@/components/ChatButton';
import { ShoppingCart, Star, Clock, Phone, ArrowRight } from 'lucide-react';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, bannersRes, categoriesRes] = await Promise.all([
        fetch('/api/products?featured=true&limit=8'),
        fetch('/api/banners'),
        fetch('/api/categories')
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
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main>
        {banners.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <BannerCarousel banners={banners} />
          </section>
        )}

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welcome to <span className="text-green-600">Saurabh Provision</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your trusted neighborhood store for fresh groceries and daily essentials. 
              Quality products, competitive prices, and excellent service.
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <StoreStatus />
              <div className="flex items-center text-gray-600">
                <Phone className="w-5 h-5 mr-2" />
                <span>9766689821</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">7AM - 11PM Daily</h3>
                <p className="text-gray-600">Open early and close late for your convenience</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fresh Products</h3>
                <p className="text-gray-600">Quality groceries and daily essentials</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quick Delivery</h3>
                <p className="text-gray-600">Fast and reliable delivery service</p>
              </div>
            </div>
          </div>
        </section>

        {categories.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
              <Link
                href="/products"
                className="text-green-600 hover:text-green-700 font-medium flex items-center"
              >
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category._id}
                  href={`/products?category=${category._id}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 text-center group"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={64}
                        height={64}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Img</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        {featuredProducts.length > 0 && (
          <section className="bg-gray-100 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
                <Link
                  href="/products"
                  className="text-green-600 hover:text-green-700 font-medium flex items-center"
                >
                  View All Products <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Need Help? We're Here for You!
            </h2>
            <p className="text-xl mb-8 text-green-100">
              Contact us for orders, inquiries, or any assistance
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex items-center space-x-3">
                <Phone className="w-6 h-6" />
                <span className="text-lg">9766689821</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6" />
                <span className="text-lg">7AM - 11PM Daily</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-lg">Owner: Vilas Yeole</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ChatButton />
    </div>
  );
}
