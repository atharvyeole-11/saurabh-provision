'use client';
import Link from 'next/link';
import { Phone, Clock, MapPin, Mail, MessageCircle } from 'lucide-react';

export default function Footer() {
  const mapUrl = "https://www.google.com/maps?q=20.548194047496573,74.52510759792922";

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-green-400 mb-4">
              Saurabh Provision
            </h3>
            <p className="text-gray-300 mb-4">
              Your trusted neighborhood store for fresh groceries and daily essentials. 
              Quality products, competitive prices, and excellent service.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-gray-300">
                <Phone className="w-5 h-5 mr-3 text-green-400" />
                <span>9766689821</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Clock className="w-5 h-5 mr-3 text-green-400" />
                <span>7:00 AM - 11:00 PM (Daily)</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-5 h-5 mr-3 text-green-400" />
                <span>Saurabh Provision Store, Pune, Maharashtra</span>
              </div>
              <div className="mt-3">
                <a 
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  Get Directions
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-400">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-green-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-green-400 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-gray-300 hover:text-green-400 transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-300 hover:text-green-400 transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-400">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="tel:9766689821" 
                  className="text-gray-300 hover:text-green-400 transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Call Us
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/919766689821" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-green-400 transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a 
                  href="mailto:info@saurabhprovision.com" 
                  className="text-gray-300 hover:text-green-400 transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-400">Store Hours</h4>
            <div className="space-y-1 text-gray-300">
              <p>Monday - Sunday</p>
              <p className="font-semibold text-green-400">7:00 AM - 11:00 PM</p>
              <p className="text-sm text-gray-400 mt-2">Open all days</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; 2024 Saurabh Provision. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm">
              Owner: Vilas Yeole
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
