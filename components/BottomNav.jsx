'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Home, Grid3x3, ShoppingCart, Receipt, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  const { getCartCount } = useCart();
  const { user } = useAuth();

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
    },
    {
      href: '/products',
      label: 'Categories',
      icon: Grid3x3,
    },
    {
      href: '/cart',
      label: 'Cart',
      icon: ShoppingCart,
      badge: getCartCount(),
    },
    {
      href: '/orders',
      label: 'Orders',
      icon: Receipt,
    },
    {
      href: user ? '/profile' : '/login',
      label: user ? 'Profile' : 'Login',
      icon: User,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[60px] py-1 px-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-green-600'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
