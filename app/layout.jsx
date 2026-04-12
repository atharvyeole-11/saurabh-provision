import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Saurabh Provision - Grocery Store in Malegaon',
  description: 'Order groceries and stationary online in Malegaon. Pickup ready at your selected time. Fresh products, best prices, and quick service.',
  keywords: 'grocery store Malegaon, stationary shop Malegaon, online grocery Malegaon, Saurabh Provision, Malegaon Maharashtra, grocery delivery Malegaon, stationary items Malegaon, daily needs Malegaon',
  authors: [{ name: 'Vilas Yeole' }],
  creator: 'Saurabh Provision',
  publisher: 'Saurabh Provision',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://saurabhprovision.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Saurabh Provision - Best Grocery Store in Malegaon',
    description: 'Order groceries and stationary online in Malegaon. Pickup ready at your selected time. Fresh products, best prices, and quick service.',
    url: 'https://saurabhprovision.com',
    siteName: 'Saurabh Provision',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Saurabh Provision Store in Malegaon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saurabh Provision - Grocery Store in Malegaon',
    description: 'Order groceries and stationary online in Malegaon. Pickup ready at your selected time.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  geo: {
    region: 'MH',
    placename: 'Malegaon',
    position: '19.9783,73.9999',
    icbm: '19.9783,73.9999',
  },
  business: {
    name: 'Saurabh Provision',
    address: 'Malegaon, Maharashtra 423203',
    phone: '+919766689821',
    openingHours: 'Mo-Su 07:00-23:00',
    priceRange: '$',
    servesCuisine: 'Groceries, Stationary, Daily Needs',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://saurabhprovision.com" />
        <meta name="geo.region" content="IN-MH" />
        <meta name="geo.placename" content="Malegaon" />
        <meta name="geo.position" content="19.9783;73.9999" />
        <meta name="ICBM" content="19.9783,73.9999" />
        <meta name="locality" content="Malegaon" />
        <meta name="region" content="Maharashtra" />
        <meta name="country" content="India" />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Saurabh Provision",
              "description": "Best grocery store in Malegaon offering fresh groceries, stationary items, and daily essentials with online ordering and pickup service.",
              "url": "https://saurabhprovision.com",
              "telephone": "+919766689821",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Main Market",
                "addressLocality": "Malegaon",
                "addressRegion": "Maharashtra",
                "postalCode": "423203",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 19.9783,
                "longitude": 73.9999
              },
              "openingHours": "Mo-Su 07:00-23:00",
              "priceRange": "$",
              "servesCuisine": ["Groceries", "Stationary", "Daily Needs"],
              "areaServed": "Malegaon",
              "founder": {
                "@type": "Person",
                "name": "Vilas Yeole"
              },
              "sameAs": [
                "https://wa.me/919766689821"
              ]
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster position="top-right" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
