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
  X,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2
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
    todayOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    recentOrders: [],
    lowStockProducts: [],
    topProducts: []
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
      const [
        ordersRes,
        productsRes,
        usersRes,
        recentOrdersRes,
        lowStockRes
      ] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products'),
        fetch('/api/users'),
        fetch('/api/orders?limit=5'),
        fetch('/api/products?lowStock=true&limit=5')
      ]);

      const ordersData = ordersRes.ok ? await ordersRes.json() : { orders: [] };
      const productsData = productsRes.ok ? await productsRes.json() : { products: [] };
      const usersData = usersRes.ok ? await usersRes.json() : { users: [] };
      const recentOrdersData = recentOrdersRes.ok ? await recentOrdersRes.json() : { orders: [] };
      const lowStockData = lowStockRes.ok ? await lowStockRes.json() : { products: [] };

      const orders = ordersData.orders || [];
      const products = productsData.products || [];
      const users = usersData.users || [];
      const recentOrders = recentOrdersData.orders || [];
      const lowStockProducts = lowStockData.products || [];

      const today = new Date().toDateString();
      const todayOrders = orders.filter(order => 
        new Date(order.createdAt).toDateString() === today
      );

      const pendingOrders = orders.filter(order => order.status === 'pending');
      const completedOrders = orders.filter(order => order.status === 'completed');

      const totalRevenue = orders
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);

      // Calculate top products
      const productSales = {};
      orders.forEach(order => {
        order.items?.forEach(item => {
          const productId = item.productId || item.product;
          productSales[productId] = (productSales[productId] || 0) + (item.quantity || 1);
        });
      });

      const topProducts = Object.entries(productSales)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([productId, sales]) => {
          const product = products.find(p => p._id === productId);
          return {
            name: product?.name || 'Unknown Product',
            sales,
            stock: product?.stockQuantity || 0
          };
        });

      setStats({
        totalOrders: orders.length,
        totalProducts: products.length,
        totalUsers: users.length,
        totalRevenue,
        todayOrders: todayOrders.length,
        pendingOrders: pendingOrders.length,
        completedOrders: completedOrders.length,
        recentOrders,
        lowStockProducts,
        topProducts
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      change: stats.todayOrders,
      changeLabel: 'today',
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'bg-blue-50 text-blue-600',
      borderColor: 'border-blue-100'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      change: stats.lowStockProducts.length,
      changeLabel: 'low stock',
      icon: <Package className="w-6 h-6" />,
      color: 'bg-green-50 text-green-600',
      borderColor: 'border-green-100'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      change: '+12%',
      changeLabel: 'growth',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-purple-50 text-purple-600',
      borderColor: 'border-purple-100'
    },
    {
      title: 'Revenue',
      value: `₹${stats.totalRevenue.toFixed(0)}`,
      change: '+8%',
      changeLabel: 'this month',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-orange-50 text-orange-600',
      borderColor: 'border-orange-100'
    }
  ];

  const orderStatusCards = [
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: <Clock className="w-5 h-5" />,
      color: 'yellow',
      href: '/admin/orders?status=pending'
    },
    {
      title: 'Ready for Pickup',
      value: stats.totalOrders - stats.pendingOrders - stats.completedOrders,
      icon: <Package className="w-5 h-5" />,
      color: 'blue',
      href: '/admin/orders?status=ready'
    },
    {
      title: 'Completed',
      value: stats.completedOrders,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'green',
      href: '/admin/orders?status=completed'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center gap-3 p-6 border-b border-gray-50">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-black">SP</div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Saurabh<span className="text-green-600">Admin</span></h2>
        </div>
        
        <nav className="p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 p-3 rounded-xl bg-green-600 text-white font-bold shadow-lg shadow-green-900/20 transition-all">
            <BarChart3 className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-green-50 hover:text-green-600 font-bold transition-all">
            <Package className="w-5 h-5" />
            Products
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-green-50 hover:text-green-600 font-bold transition-all">
            <ShoppingCart className="w-5 h-5" />
            Orders
          </Link>
          <Link href="/admin/promotions" className="flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-green-50 hover:text-green-600 font-bold transition-all">
            <TrendingUp className="w-5 h-5" />
            Promotions
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-green-50 hover:text-green-600 font-bold transition-all">
            <Users className="w-5 h-5" />
            Users
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 overflow-auto">
        <div className="p-6 lg:p-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-black text-gray-900">Store Overview</h1>
              <p className="text-gray-500 font-medium">Hello Vilas Yeole, here's what's happening today.</p>
            </div>
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-3 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statCards.map((card, index) => (
              <div key={index} className={`bg-white rounded-3xl border ${card.borderColor} p-6 shadow-sm hover:shadow-md transition-all`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${card.color}`}>
                    {card.icon}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{card.changeLabel}</p>
                    <p className="text-sm font-black text-green-600">{card.change}</p>
                  </div>
                </div>
                <h3 className="text-3xl font-black text-gray-900">{card.value}</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{card.title}</p>
              </div>
            ))}
          </div>

            {/* Order Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {orderStatusCards.map((card, index) => (
                <Link key={index} href={card.href} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-${card.color}-100 text-${card.color}-600`}>
                      {card.icon}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Recent Orders & Low Stock */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                  <Link href="/admin/orders" className="text-green-600 hover:text-green-700 text-sm">
                    View all
                  </Link>
                </div>
                <div className="space-y-3">
                  {stats.recentOrders.slice(0, 5).map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">#{order.orderId || order._id?.slice(-6)}</p>
                        <p className="text-sm text-gray-500">{order.customerDetails?.name || 'Unknown'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">₹{order.totalAmount || 0}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'ready' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status || 'pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Alert */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    Low Stock Alert
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                  </h3>
                  <Link href="/admin/products" className="text-green-600 hover:text-green-700 text-sm">
                    Manage
                  </Link>
                </div>
                <div className="space-y-3">
                  {stats.lowStockProducts.slice(0, 5).map((product) => (
                    <div key={product._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-orange-600">{product.stockQuantity} left</p>
                        <p className="text-sm text-gray-500">₹{product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
              <div className="space-y-3">
                {stats.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.stock} in stock</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{product.sales} sold</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
