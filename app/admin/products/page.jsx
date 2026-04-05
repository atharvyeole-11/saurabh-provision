'use client'
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const CATEGORIES = ['Grocery','Stationary','Fasting Items','Snacks','Daily Needs','Beverages'];

const emptyForm = {
  name: '', price: '', discount: 0, category: 'Grocery',
  description: '', image: '', expiryDate: '', inStock: true
};

export default function AdminProducts() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) router.push('/login');
    if (isAdmin) fetchProducts();
  }, [isAdmin, loading]);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
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
        body: JSON.stringify({ ...form, price: Number(form.price), discount: Number(form.discount) })
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
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <button onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(!showForm); }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">{editing ? 'Edit Product' : 'Add New Product'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full border rounded-lg p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                className="w-full border rounded-lg p-2" required min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount (%)</label>
              <input type="number" value={form.discount} onChange={e => setForm({...form, discount: e.target.value})}
                className="w-full border rounded-lg p-2" min="0" max="100" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                className="w-full border rounded-lg p-2">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input value={form.image} onChange={e => setForm({...form, image: e.target.value})}
                className="w-full border rounded-lg p-2" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expiry Date</label>
              <input type="date" value={form.expiryDate} onChange={e => setForm({...form, expiryDate: e.target.value})}
                className="w-full border rounded-lg p-2" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                className="w-full border rounded-lg p-2" rows={2} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="inStock" checked={form.inStock}
                onChange={e => setForm({...form, inStock: e.target.checked})} />
              <label htmlFor="inStock" className="text-sm font-medium">In Stock</label>
            </div>
          </div>
          <button type="submit" disabled={saving}
            className="mt-4 bg-green-600 text-white px-8 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">
            {saving ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      )}

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Product</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Discount</th>
                <th className="text-left p-3">Stock</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{product.name}</td>
                  <td className="p-3 text-gray-500">{product.category}</td>
                  <td className="p-3 font-bold text-green-700">₹{product.price}</td>
                  <td className="p-3">{product.discount}%</td>
                  <td className="p-3">
                    <button onClick={() => toggleStock(product)}
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {product.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
                    </button>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(product)}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs hover:bg-blue-200">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(product._id)}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs hover:bg-red-200">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
