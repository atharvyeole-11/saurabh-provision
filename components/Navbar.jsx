'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, User, Menu, X, Phone, Clock } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-green-600">
                Saurabh Provision
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-green-600 transition-colors">
              Products
            </Link>
            <Link href="/orders" className="text-gray-700 hover:text-green-600 transition-colors">
              Orders
            </Link>
            {user?.role === 'admin' && (
              <Link href="/admin" className="text-gray-700 hover:text-green-600 transition-colors">
                Admin
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-1" />
              9766689821
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              7AM-11PM
            </div>
            
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-green-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">Hi, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-green-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-green-600 transition-colors mr-2">
              <ShoppingCart className="w-6 h-6" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="block px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/orders"
                className="block px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Orders
              </Link>
              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="block px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              
              <div className="border-t pt-2 mt-2">
                <div className="px-3 py-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    9766689821
                  </div>
                  <div className="flex items-center mt-1">
                    <Clock className="w-4 h-4 mr-2" />
                    7AM-11PM
                  </div>
                </div>
                
                {user ? (
                  <div className="px-3 py-2">
                    <div className="text-gray-700 mb-2">Hi, {user.name}</div>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="px-3 py-2 space-y-2">
                    <Link
                      href="/login"
                      className="block w-full text-center text-gray-700 hover:text-green-600 border border-gray-300 px-4 py-2 rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="block w-full bg-green-600 text-white text-center px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
