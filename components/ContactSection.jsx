'use client';
import { Phone, Clock, MapPin, Store, CheckCircle, Star, Shield, Truck } from 'lucide-react';

export default function ContactSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Serving Malegaon with Pride
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your trusted local store for fresh groceries and daily essentials. 
            Quality products, competitive prices, and excellent service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-green-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Store className="w-7 h-7 text-green-600 mr-3" />
              Store Information
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Location</h4>
                  <p className="text-gray-600">Malegaon, Maharashtra 423203</p>
                  <p className="text-sm text-green-600 mt-1">Serving Malegaon locally</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Phone Number</h4>
                  <a 
                    href="tel:9766689821" 
                    className="text-green-600 hover:text-green-700 font-medium text-lg transition-colors"
                  >
                    9766689821
                  </a>
                  <p className="text-sm text-gray-600 mt-1">Click to call - Quick response</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Store Hours</h4>
                  <p className="text-gray-600">Monday - Sunday</p>
                  <p className="text-green-600 font-semibold">7:00 AM - 11:00 PM</p>
                  <p className="text-sm text-gray-600 mt-1">Open 365 days a year</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Service Area</h4>
                  <p className="text-gray-600">Pickup available in Malegaon only</p>
                  <p className="text-sm text-green-600 mt-1">Orders prepared within selected time slot</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              <a 
                href="tel:9766689821" 
                className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call Store Now
              </a>
              <a 
                href="https://wa.me/919766689821" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-100 hover:bg-green-200 text-green-700 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Store className="w-5 h-5" />
                WhatsApp Support
              </a>
            </div>
          </div>

          {/* Trust Badges & Features */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Us?</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Fresh Products Daily</h4>
                  <p className="text-gray-600">We source fresh groceries and quality stationary items for our customers in Malegaon.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Best Prices in Town</h4>
                  <p className="text-gray-600">Competitive pricing on all products with regular discounts and special offers.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Quick Pickup Service</h4>
                  <p className="text-gray-600">Order online and pickup at your convenience. No waiting in queues.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Trusted by Locals</h4>
                  <p className="text-gray-600">Serving the Malegaon community with dedication and trust since 2024.</p>
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-gray-900 mb-2">Store Owner</h4>
              <p className="text-gray-600">Vilas Yeole</p>
              <p className="text-sm text-green-600 mt-1">Proudly serving Malegaon community</p>
            </div>
          </div>
        </div>

        {/* Service Area Notice */}
        <div className="mt-12 bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Service Area Notice</h4>
              <p className="text-gray-600 mb-2">
                <strong>Pickup available in Malegaon only.</strong> We currently serve customers within Malegaon city limits.
              </p>
              <p className="text-sm text-gray-600">
                Orders are prepared and ready for pickup within your selected time slot. 
                Please arrive at the store during your chosen pickup time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
