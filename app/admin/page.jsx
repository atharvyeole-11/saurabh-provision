'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Clock,
  DollarSign,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
    lowStockProducts: []
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products'),
        fetch('/api/users')
      ]);

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        const orders = ordersData.orders || [];
        
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const recentOrders = orders.slice(0, 5);

        setStats(prev => ({
          ...prev,
          totalOrders: orders.length,
          totalRevenue,
          recentOrders
        }));
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        const products = productsData.products || [];
        const lowStock = products.filter(p => p.stock <= 5 && p.stock > 0);

        setStats(prev => ({
          ...prev,
          totalProducts: products.length,
          lowStockProducts: lowStock
        }));
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setStats(prev => ({
          ...prev,
          totalUsers: usersData.users?.length || 0
        }));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: BarChart3, active: true },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/users', label: 'Users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'block' : 'hidden'} lg:block w-64 bg-white shadow-sm min-h-screen`}>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Admin Panel</h2>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    item.active
                      ? 'bg-green-50 text-green-600 border-l-4 border-green-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
            </div>
            
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalOrders}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalProducts}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">₹{stats.totalRevenue}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                  <Link
                    href="/admin/orders"
                    className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
                  >
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {stats.recentOrders.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No recent orders</p>
                ) : (
                  <div className="space-y-4">
                    {stats.recentOrders.map((order) => (
                      <div key={order._id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                        <div>
                          <p className="font-medium text-gray-900">#{order._id.slice(-8)}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">₹{order.totalAmount}</p>
                          <p className="text-sm text-gray-600">{order.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Low Stock Alert */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Low Stock Alert</h2>
                  <Link
                    href="/admin/products"
                    className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
                  >
                    Manage <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {stats.lowStockProducts.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">All products in stock</p>
                ) : (
                  <div className="space-y-4">
                    {stats.lowStockProducts.map((product) => (
                      <div key={product._id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-red-600">{product.stock} left</p>
                          <p className="text-sm text-gray-600">{product.unit}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/admin/products?action=add"
                className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <Package className="w-5 h-5 mr-2 text-green-600" />
                <span className="font-medium text-gray-700">Add Product</span>
              </Link>
              
              <Link
                href="/admin/orders?status=pending"
                className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <Clock className="w-5 h-5 mr-2 text-green-600" />
                <span className="font-medium text-gray-700">Pending Orders</span>
              </Link>
              
              <Link
                href="/admin/products?low-stock=true"
                className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                <span className="font-medium text-gray-700">View Analytics</span>
              </Link>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
