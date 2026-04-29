'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { Plus, Trash2, Edit, Eye, EyeOff, ArrowLeft, Image as ImageIcon, Upload, X } from 'lucide-react';
import { getCurrentFestival } from '@/lib/utils';

export default function Promotions() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    bgColor: '#16a34a',
    products: [],
    festival: 'Custom',
    buttonText: 'Order Now',
    buttonLink: '/products',
    isActive: false,
    displayOrder: 0
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/login');
      return;
    }
    if (user?.role === 'admin') {
      fetchBanners();
    }
  }, [user, authLoading, router]);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/admin/banner');
      if (response.ok) {
        const data = await response.json();
        setBanners(data.banners || []);
      }
    } catch (error) {
      console.error('Failed to fetch banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingBanner 
        ? `/api/admin/banner/${editingBanner._id}`
        : '/api/admin/banner';
      
      const response = await fetch(url, {
        method: editingBanner ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchBanners();
        resetForm();
      } else {
        alert('Failed to save banner');
      }
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('Failed to save banner');
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      image: banner.image,
      bgColor: banner.bgColor || '#16a34a',
      products: banner.products || [],
      festival: banner.festival || 'Custom',
      buttonText: banner.buttonText || 'Order Now',
      buttonLink: banner.buttonLink || '/products',
      isActive: banner.isActive,
      displayOrder: banner.displayOrder || 0
    });
    setShowAddForm(true);
    setPreviewMode(false);
  };

  const handleDelete = async (bannerId) => {
    if (!confirm('Are you sure you want to delete this banner?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/banner/${bannerId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchBanners();
      } else {
        alert('Failed to delete banner');
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert('Failed to delete banner');
    }
  };

  const toggleBannerStatus = async (bannerId) => {
    try {
      const banner = banners.find(b => b._id === bannerId);
      const response = await fetch(`/api/admin/banner/${bannerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !banner.isActive }),
      });

      if (response.ok) {
        await fetchBanners();
      } else {
        alert('Failed to update banner status');
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      alert('Failed to update banner status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      image: '',
      bgColor: '#16a34a',
      products: [],
      festival: 'Custom',
      buttonText: 'Order Now',
      buttonLink: '/products',
      isActive: false,
      displayOrder: 0
    });
    setEditingBanner(null);
    setShowAddForm(false);
    setPreviewMode(false);
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { name: '', image: '', price: '' }]
    });
  };

  const updateProduct = (index, field, value) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index][field] = value;
    setFormData({ ...formData, products: updatedProducts });
  };

  const removeProduct = (index) => {
    setFormData({
      ...formData,
      products: formData.products.filter((_, i) => i !== index)
    });
  };

  const createSampleBanner = () => {
    const sampleBanner = {
      title: "🪔 Navratri Special Offers!",
      subtitle: "Fasting items available – Order now, pick up at your time!",
      festival: "Navratri",
      bgColor: "#ea580c",
      products: [
        { name: "Rajgira Ladoo", price: "₹120" },
        { name: "Sabudana Chips", price: "₹40" },
        { name: "Sheera Mix", price: "₹80" },
        { name: "Fasting Chips", price: "₹35" }
      ],
      buttonText: "Order Fasting Items",
      buttonLink: "/products?category=fasting",
      isActive: true
    };
    setFormData(sampleBanner);
  };

  const currentFestival = getCurrentFestival();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/admin" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Festival Banner Management</h1>
              {currentFestival && (
                <p className="text-sm text-orange-600 mt-1">
                  Current festival detected: <strong>{currentFestival}</strong>
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {previewMode ? 'Edit Mode' : 'Preview Mode'}
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Banner
              </button>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                </h2>
                <div className="flex gap-2">
                    <button
                      onClick={createSampleBanner}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Load Navratri Sample
                    </button>
                    <button
                      onClick={() => {
                        setFormData({
                          title: "☀️ Summer Coolers Sale!",
                          subtitle: "Beat the heat with our fresh juices and cold drinks!",
                          festival: "Summer Sale",
                          bgColor: "#0ea5e9",
                          products: [
                            { name: "Cold Drinks", price: "Starting ₹20" },
                            { name: "Fresh Juice", price: "₹30" },
                            { name: "Ice Creams", price: "20% OFF" }
                          ],
                          buttonText: "Shop Summer Essentials",
                          buttonLink: "/products?category=Beverages",
                          isActive: true
                        });
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Load Summer Sample
                    </button>
                  <button
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Festival</label>
                    <select
                      value={formData.festival}
                      onChange={(e) => setFormData({ ...formData, festival: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Custom">Custom</option>
                      <option value="Navratri">Navratri</option>
                      <option value="Diwali">Diwali</option>
                      <option value="Holi">Holi</option>
                      <option value="Eid">Eid</option>
                      <option value="Christmas">Christmas</option>
                      <option value="New Year">New Year</option>
                      <option value="Summer Sale">Summer Sale</option>
                      <option value="Winter Sale">Winter Sale</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                    <input
                      type="color"
                      value={formData.bgColor}
                      onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                      className="w-full h-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                    <input
                      type="text"
                      value={formData.buttonText}
                      onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                    <input
                      type="text"
                      value={formData.buttonLink}
                      onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Products Section */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Featured Products</label>
                    <button
                      type="button"
                      onClick={addProduct}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add Product
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.products.map((product, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Product name"
                          value={product.name}
                          onChange={(e) => updateProduct(index, 'name', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <input
                          type="text"
                          placeholder="Price"
                          value={product.price}
                          onChange={(e) => updateProduct(index, 'price', e.target.value)}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <input
                          type="url"
                          placeholder="Image URL"
                          value={product.image}
                          onChange={(e) => updateProduct(index, 'image', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeProduct(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Active (Only 1 banner can be active at a time)
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    {editingBanner ? 'Update Banner' : 'Add Banner'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Preview Mode */}
        {previewMode && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
              <FestivalBanner data={formData} />
            </div>
          </div>
        )}

        {/* Banners List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">All Banners</h2>
            <p className="text-sm text-gray-500 mt-1">Only 1 banner can be active at a time</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Banner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Festival
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {banners.map((banner) => (
                  <tr key={banner._id} className={banner.isActive ? 'bg-green-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {banner.image ? (
                          <img
                            src={banner.image}
                            alt={banner.title}
                            className="w-16 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{banner.title}</div>
                          {banner.subtitle && (
                            <div className="text-sm text-gray-500">{banner.subtitle}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {banner.festival}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        banner.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {banner.displayOrder || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(banner)}
                          className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleBannerStatus(banner._id)}
                          className={`p-2 transition-colors ${
                            banner.isActive
                              ? 'text-orange-600 hover:text-orange-800'
                              : 'text-green-600 hover:text-green-800'
                          }`}
                        >
                          {banner.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(banner._id)}
                          className="p-2 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
