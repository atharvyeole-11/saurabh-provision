'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CartDrawer from '@/components/CartDrawer';
import BottomNav from '@/components/BottomNav';
import { Search, MapPin, Clock, Sparkles, TrendingUp } from 'lucide-react';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products?featured=true&limit=8'),
        fetch('/api/categories')
      ]);

      if (productsRes.ok) {
        const data = await productsRes.json();
        setFeaturedProducts(data.products || []);
      }

      if (categoriesRes.ok) {
        const data = await categoriesRes.json();
        setCategories(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      
      {/* Hero Section - Blinkit Style */}
      <section className="bg-gradient-to-br from-green-500 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">Malegaon</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
              Order groceries in seconds
            </h1>
            <p className="text-lg sm:text-xl text-green-100 mb-8">
              Pickup ready before you reach
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for groceries, snacks, stationary..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 placeholder-gray-500 text-lg focus:outline-none focus:ring-4 focus:ring-green-300"
                onClick={() => window.location.href = '/products'}
              />
            </div>
            
            {/* Quick Stats */}
            <div className="flex items-center justify-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>7 AM - 11 PM</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                <span>Fresh Products</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>Popular in Malegaon</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Categories */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-6 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/products?category=${category.slug}`}
                className="flex flex-col items-center min-w-fit hover:bg-gray-50 rounded-lg p-3 transition-colors"
              >
                <div className="text-2xl mb-1">{category.icon}</div>
                <span className="text-sm font-medium text-gray-700">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular in Malegaon */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Popular in Malegaon</h2>
            <Link 
              href="/products" 
              className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
            >
              View all
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                  <div className="bg-gray-200 h-32 rounded-lg mb-3"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {featuredProducts.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  onAddToCart={() => setIsCartOpen(true)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Quick Pickup</h3>
              <p className="text-sm text-gray-600">Ready in 30 mins</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Fresh Items</h3>
              <p className="text-sm text-gray-600">Daily fresh stock</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Local Store</h3>
              <p className="text-sm text-gray-600">Malegaon only</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Best Prices</h3>
              <p className="text-sm text-gray-600">Great value daily</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BottomNav />
      
      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Festival Banner - First after navbar */}
      {banner?.isActive && <FestivalBanner data={banner} />}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="mb-6">
                <StoreStatus />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Best Grocery Store
                <span className="block text-green-200">in Malegaon</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-green-100 leading-relaxed">
                Order before you go - pickup ready at your selected time. 
                Fresh groceries and stationary in Malegaon.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link 
                  href="/products" 
                  className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center justify-center"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Order Now
                </Link>
                <Link 
                  href="tel:9766689821" 
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition-all flex items-center justify-center"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Store
                </Link>
              </div>

              {/* Quick Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-200" />
                  <span>7 AM - 11 PM Daily</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-green-200" />
                  <span>Fresh Products</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-200" />
                  <span>Malegaon Only</span>
                </div>
              </div>
            </div>
            
            {/* Hero Image/Illustration */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 transform rotate-3 hover:rotate-6 transition-transform">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center">
                  <div className="w-20 h-20 bg-white/30 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Store className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">3 Simple Steps</h3>
                  <p className="text-green-100 mb-4">Order & Pickup in Malegaon</p>
                  <ol className="text-left mt-4 space-y-2 text-sm">
                    <li>1. Browse products online</li>
                    <li>2. Select pickup time</li>
                    <li>3. Collect at store</li>
                  </ol>
                  <div className="mt-4 p-3 bg-green-800/50 rounded-lg">
                    <p className="text-xs text-green-100">
                      <strong>Note:</strong> Pickup available in Malegaon only
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Badge Section */}
      <section className="py-8 bg-green-50 border-y border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 text-green-700">
            <MapPin className="w-5 h-5" />
            <span className="font-semibold">Serving Malegaon, Maharashtra</span>
            <span className="text-green-500">|</span>
            <span className="text-sm">Pickup available in Malegaon only</span>
            <span className="text-green-500">|</span>
            <span className="text-sm">Orders prepared within selected time slot</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Saurabh Provision?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make grocery shopping convenient with our online ordering system and quality products.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Save Time</h3>
              <p className="text-gray-600">Order online and skip the shopping hassle. Your items ready when you arrive.</p>
            </div>
            
            <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Package className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fresh Products</h3>
              <p className="text-gray-600">Quality groceries and daily essentials sourced from trusted suppliers.</p>
            </div>
            
            <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-gray-600">Competitive prices and regular discounts on your favorite products.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-lg text-gray-600">Handpicked items for your daily needs</p>
            </div>
            <Link 
              href="/products" 
              className="text-green-600 hover:text-green-700 font-medium flex items-center"
            >
              View All Products
              <ArrowRight className="w-4 h-4 ml-1" />
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
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No featured products</h3>
              <p className="text-gray-600 mb-4">Check back soon for our featured items</p>
              <Link 
                href="/products" 
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
              <p className="text-lg text-gray-600">Find what you need quickly</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/products?category=${category._id}`}
                  className="group bg-gray-50 rounded-lg p-4 text-center hover:bg-green-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-green-700 transition-colors">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Order in Malegaon?</h2>
          <p className="text-xl mb-8 text-green-100">
            Join hundreds of satisfied customers who shop with us online
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products" 
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              Start Shopping
            </Link>
            <Link 
              href="tel:9766689821" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors flex items-center justify-center"
            >
              Call Store
            </Link>
          </div>
        </div>
      </section>

      {/* Contact & Trust Section */}
      <ContactSection />

      <Footer />
      <ChatButton />
    </div>
  );

                
