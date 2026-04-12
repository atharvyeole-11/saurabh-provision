'use client';
import Link from 'next/link';
import { Phone, Clock, MapPin, Mail, MessageCircle, Store } from 'lucide-react';

export default function Footer() {
  const mapUrl = "https://www.google.com/maps?q=Malegaon,+Maharashtra";

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Store className="w-8 h-8 text-green-400 mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-green-400">
                  Saurabh Provision
                </h3>
                <p className="text-sm text-green-300 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  Serving Malegaon Locally
                </p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Your trusted neighborhood store in Malegaon for fresh groceries and daily essentials. 
              Quality products, competitive prices, and excellent service since 2024.
            </p>
            
            {/* Store Information */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-300">
                <MapPin className="w-5 h-5 mr-3 text-green-400" />
                <span>Malegaon, Maharashtra 423203</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="w-5 h-5 mr-3 text-green-400" />
                <span>9766689821</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Clock className="w-5 h-5 mr-3 text-green-400" />
                <span>7:00 AM - 11:00 PM (Daily)</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Store className="w-5 h-5 mr-3 text-green-400" />
                <span>Pickup Available in Malegaon Only</span>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-green-400 mb-2">Find Us in Malegaon</h4>
              <div className="rounded-lg overflow-hidden border border-gray-700">
                <iframe
                  src="https://www.google.com/maps?q=Malegaon,+Maharashtra&z=14&output=embed"
                  width="100%"
                  height="200"
                  style={{ border: '0' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Saurabh Provision Store Location in Malegaon"
                />
              </div>
              <a 
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors mt-3"
              >
                <MapPin className="w-4 h-4" />
                Get Directions on Google Maps
              </a>
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
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=grocery" className="text-gray-300 hover:text-green-400 transition-colors">
                  Groceries
                </Link>
              </li>
              <li>
                <Link href="/products?category=stationary" className="text-gray-300 hover:text-green-400 transition-colors">
                  Stationary
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
            <h4 className="text-lg font-semibold mb-4 text-green-400">Contact Us</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="tel:9766689821" 
                  className="text-gray-300 hover:text-green-400 transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <div>
                    <div>Call Us</div>
                    <div className="text-xs text-gray-400">Quick response</div>
                  </div>
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
                  <div>
                    <div>WhatsApp</div>
                    <div className="text-xs text-gray-400">Chat support</div>
                  </div>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:info@saurabhprovision.com" 
                  className="text-gray-300 hover:text-green-400 transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <div>
                    <div>Email</div>
                    <div className="text-xs text-gray-400">info@saurabhprovision.com</div>
                  </div>
                </a>
              </li>
            </ul>

            <div className="mt-6 p-3 bg-green-900 rounded-lg">
              <h5 className="text-sm font-semibold text-green-400 mb-2">Store Hours</h5>
              <div className="space-y-1 text-gray-300">
                <p>Monday - Sunday</p>
                <p className="font-semibold text-green-400">7:00 AM - 11:00 PM</p>
                <p className="text-xs text-gray-400">Open 365 days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              <p>&copy; 2024 Saurabh Provision. All rights reserved.</p>
              <p className="mt-1">Owner: Vilas Yeole</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-green-400 font-semibold mb-1">Saurabh Provision</p>
              <p className="text-gray-400 text-sm">Best Grocery Store in Malegaon</p>
              <p className="text-gray-400 text-xs mt-1">Order online, pickup in store</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
