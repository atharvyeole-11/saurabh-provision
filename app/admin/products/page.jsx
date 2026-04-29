'use client'
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Grocery', 'Dairy', 'Snacks', 'Beverages', 'Fasting Items', 
  'Stationery', 'Household Items', 'Personal Care', 'Daily Essentials'
];

const emptyForm = {
  name: '', mrp: '', price: '', discount: 0, category: 'Grocery',
  description: '', image: '', expiryDate: '', stockQuantity: 0, inStock: true
};

export default function AdminProducts() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    } else if (user?.role === 'admin') {
      fetchProducts();
    }
  }, [user, loading, router]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data.products) ? data.products : (Array.isArray(data) ? data : []));
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editing ? `/api/products/${editing}` : '/api/products';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...form, 
          mrp: Number(form.mrp),
          price: Number(form.price), 
          discount: Number(form.discount),
          stockQuantity: Number(form.stockQuantity)
        })
      });
      if (res.ok) {
        toast.success(editing ? 'Product updated!' : 'Product added!');
        setForm(emptyForm);
        setEditing(null);
        setShowForm(false);
        fetchProducts();
      }
    } catch (err) {
      toast.error('Failed to save product');
    }
    setSaving(false);
  };

  const handleEdit = (product) => {
    setForm({ ...product });
    setEditing(product._id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Deleted!'); fetchProducts(); }
  };

  const toggleStock = async (product) => {
    const res = await fetch(`/api/products/${product._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inStock: !product.inStock })
    });
    if (res.ok) { toast.success('Stock updated!'); fetchProducts(); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Inventory Management</h1>
          <p className="text-gray-500">Add and manage store products</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(!showForm); }}
          className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg flex items-center gap-2">
          {showForm ? 'Cancel' : (
            <>
              <span className="text-lg">+</span> Add Product
            </>
          )}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border-2 border-green-100 rounded-[2rem] p-8 mb-10 shadow-xl animate-in slide-in-from-top duration-300">
          <h2 className="text-xl font-bold mb-6 text-green-800">{editing ? 'Edit Product Details' : 'Create New Product'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Product Name *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-green-500 outline-none transition" required placeholder="e.g. Basmati Rice 5kg" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-green-500 outline-none transition">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">MRP (₹) *</label>
              <input type="number" value={form.mrp} onChange={e => setForm({...form, mrp: e.target.value})}
                className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-green-500 outline-none transition" required min="0" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Selling Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-green-500 outline-none transition" required min="0" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Discount (%)</label>
              <input type="number" value={form.discount} onChange={e => setForm({...form, discount: e.target.value})}
                className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-green-500 outline-none transition" min="0" max="100" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stock Quantity</label>
              <input type="number" value={form.stockQuantity} onChange={e => setForm({...form, stockQuantity: e.target.value})}
                className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-green-500 outline-none transition" min="0" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Expiry Date</label>
              <input type="text" value={form.expiryDate} onChange={e => setForm({...form, expiryDate: e.target.value})}
                className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-green-500 outline-none transition" placeholder="e.g. Dec 2024" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Image URL</label>
              <input value={form.image} onChange={e => setForm({...form, image: e.target.value})}
                className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-green-500 outline-none transition" placeholder="https://..." />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-green-500 outline-none transition" rows={2} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="inStock" checked={form.inStock}
                onChange={e => setForm({...form, inStock: e.target.checked})} 
                className="w-5 h-5 accent-green-600" />
              <label htmlFor="inStock" className="text-sm font-bold text-gray-700">Display in Store</label>
            </div>
          </div>
          <div className="mt-8 flex gap-4">
            <button type="submit" disabled={saving}
              className="bg-green-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 transition shadow-lg">
              {saving ? 'Processing...' : editing ? 'Update Product' : 'Save Product'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border rounded-[1.5rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">
                <th className="text-left p-4">Product Info</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">MRP</th>
                <th className="text-left p-4">Sale Price</th>
                <th className="text-left p-4">Stock</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id} className="border-t hover:bg-green-50/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {product.image && (
                        <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-lg" />
                      )}
                      <div>
                        <p className="font-bold text-gray-900">{product.name}</p>
                        <p className="text-[10px] text-gray-400">Exp: {product.expiryDate || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-bold">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 line-through font-medium">₹{product.mrp || 0}</td>
                  <td className="p-4 font-bold text-green-700 text-lg">₹{product.price}</td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className={`font-bold ${product.stockQuantity < 10 ? 'text-orange-600' : 'text-gray-900'}`}>
                        {product.stockQuantity} units
                      </span>
                      <button onClick={() => toggleStock(product)}
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full inline-block w-fit ${
                          product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {product.inStock ? 'Visible' : 'Hidden'}
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(product)}
                        className="bg-white border border-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition shadow-sm">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(product._id)}
                        className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition shadow-sm">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-400 font-medium">
                    No products found. Start by adding one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
