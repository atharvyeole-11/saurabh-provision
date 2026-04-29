'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import BottomNav from '@/components/BottomNav';
import ChatButton from '@/components/ChatButton';
import FestivalBanner from '@/components/FestivalBanner';
import StoreStatus from '@/components/StoreStatus';
import ContactSection from '@/components/ContactSection';
import { Search, MapPin, Clock, Sparkles, TrendingUp, ShoppingCart, Phone, Package, ArrowRight, Star } from 'lucide-react';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, bannerRes] = await Promise.all([
        fetch('/api/products?featured=true&limit=8'),
        fetch('/api/categories'),
        fetch('/api/banner')
      ]);

      if (productsRes.ok) {
        const data = await productsRes.json();
        setFeaturedProducts(data.products || []);
      }

      if (categoriesRes.ok) {
        const data = await categoriesRes.json();
        setCategories(data.categories || []);
      }

      if (bannerRes.ok) {
        const data = await bannerRes.json();
        setBanner(data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Festival Banner */}
      {banner?.isActive && <FestivalBanner data={banner} />}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="mb-6 flex justify-center lg:justify-start">
                <StoreStatus />
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
                Saurabh Provision
                <span className="block text-orange-400 text-2xl md:text-4xl mt-2 font-semibold">Ready Before You Arrive</span>
              </h1>
              <p className="text-lg md:text-xl mb-10 text-green-50 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Order groceries & stationery online, choose your pickup time, and skip the waiting. Your neighborhood store is now at your fingertips.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  href="/products" 
                  className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-orange-900/20 flex items-center justify-center transform hover:scale-105 active:scale-95"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Order for Pickup
                </Link>
                <Link 
                  href="tel:9766689821" 
                  className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all flex items-center justify-center"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  9766689821
                </Link>
              </div>

              <div className="mt-10 flex items-center justify-center lg:justify-start gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-green-700 bg-gray-200 overflow-hidden shadow-md">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1 text-orange-400">
                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-green-100 font-medium">500+ Happy Customers in Malegaon</p>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="absolute -inset-4 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/20 shadow-2xl">
                <div className="space-y-8">
                  <div className="flex items-center gap-6 group">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transform group-hover:rotate-12 transition-transform">
                      <Search className="w-7 h-7 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">Browse & Select</h3>
                      <p className="text-green-100/80">Choose from fresh groceries & stationery</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 group">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transform group-hover:rotate-12 transition-transform">
                      <Clock className="w-7 h-7 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">Choose Pickup Slot</h3>
                      <p className="text-green-100/80">Tell us when you'll be at the store</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 group">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transform group-hover:rotate-12 transition-transform">
                      <Package className="w-7 h-7 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">Quick Collection</h3>
                      <p className="text-green-100/80">Grab your bag and go. No waiting!</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 pt-8 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-green-200 text-xs uppercase tracking-wider font-bold mb-1">Owner</p>
                    <p className="font-bold text-lg">Vilas Yeole</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-200 text-xs uppercase tracking-wider font-bold mb-1">Store Timing</p>
                    <p className="font-bold text-lg">7 AM - 11 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 text-sm text-gray-600 font-medium">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-600" />
            Serving Malegaon
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-green-600" />
            7 AM - 11 PM
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-green-600" />
            Best Value Daily
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      {categories.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Shop by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/products?category=${cat.slug || cat._id}`}
                  className="group flex flex-col items-center p-4 bg-gray-50 rounded-2xl hover:bg-green-50 transition-all border border-transparent hover:border-green-200"
                >
                  <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform">
                    {cat.icon || '📦'}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 text-center">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-600">Popular items in Malegaon right now</p>
            </div>
            <Link 
              href="/products" 
              className="text-green-600 hover:text-green-700 font-bold flex items-center gap-1 group"
            >
              View all
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
                  <div className="bg-gray-100 aspect-square rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-green-600 rounded-[2rem] p-8 md:p-12 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to skip the queue?</h2>
              <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
                Order your daily needs online and pick them up at your convenience. 
                Quality products, great prices, and zero waiting time.
              </p>
              <Link 
                href="/products" 
                className="inline-block bg-white text-green-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl"
              >
                Shop Now
              </Link>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-green-500 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-green-500 rounded-full blur-3xl opacity-50"></div>
          </div>
        </div>
      </section>

      <ContactSection />
      <Footer />
      <BottomNav />
      <ChatButton />
    </div>
  );
}

                
