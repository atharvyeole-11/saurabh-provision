'use client'
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import CameraModal from '@/components/CameraModal';
import { Camera, Scan, Sparkles, Package, Trash2, Edit, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

const CATEGORIES = [
  'Grocery', 'Dairy', 'Snacks', 'Beverages', 'Fasting Items', 
  'Stationery', 'Household Items', 'Personal Care', 'Daily Essentials'
];

const emptyForm = {
  name: '', brand: '', mrp: '', price: '', discount: 0, category: 'Grocery',
  description: '', image: '', expiryDate: '', stockQuantity: 10, inStock: true
};

export default function AdminProducts() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState('product'); // 'product' or 'bill'
  const [scanResult, setScanResult] = useState(null);
  const [billResults, setBillResults] = useState(null);

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'admin' && user.role !== 'manager'))) {
      router.push('/login');
    } else if (user?.role === 'admin' || user?.role === 'manager') {
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

  const openCamera = (mode) => {
    setCameraMode(mode);
    setIsCameraOpen(true);
  };

  // onCapture now receives (file, base64, uploadUrl) from CameraModal
  const handleCapture = async (file, base64, uploadUrl) => {
    if (cameraMode === 'bill') {
      handleBillScan(file, base64);
      return;
    }
    
    setScanning(true);
    setShowForm(true);
    setScanResult(null);
    const formData = new FormData();
    formData.append('image', file);
    // Also send base64 so the API can forward it to vision models without re-encoding
    if (base64) formData.append('base64', base64);
    
    try {
      const res = await fetch('/api/admin/scan-product', {
        method: 'POST',
        body: formData
      });
      const result = await res.json();
      
      if (res.ok) {
        setForm(prev => ({ ...prev, ...result.data }));
        setScanResult(result);
        
        if (result.existingProduct) {
          setEditing(result.existingProduct._id);
          toast('Product already exists! Editing mode enabled.', { icon: '⚠️', duration: 5000 });
        } else {
          toast.success(result.message || 'New product detected!', { icon: '✨', duration: 5000 });
        }
      } else {
        toast.error(result.error || 'Scan failed');
      }
    } catch (err) {
      toast.error('Network error while scanning');
    } finally {
      setScanning(false);
    }
  };

  const handleBillScan = async (file, base64) => {
    setScanning(true);
    setBillResults(null);
    const formData = new FormData();
    formData.append('image', file);
    if (base64) formData.append('base64', base64);
    
    try {
      const res = await fetch('/api/admin/scan-bill', {
        method: 'POST',
        body: formData
      });
      const result = await res.json();
      
      if (res.ok) {
        setBillResults(result);
        toast.success(result.summary?.message || 'Bill scanned!', { icon: '📋', duration: 5000 });
        fetchProducts(); // Refresh product list
      } else {
        toast.error(result.error || 'Bill scan failed');
      }
    } catch (err) {
      toast.error('Network error while scanning bill');
    } finally {
      setScanning(false);
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
        toast.success(editing ? 'Product updated!' : 'Product added to inventory!');
        setForm(emptyForm);
        setEditing(null);
        setShowForm(false);
        setScanResult(null);
        fetchProducts();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Save failed');
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
    setScanResult(null);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product permanently?')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Deleted!'); fetchProducts(); }
  };

  const toggleStock = async (product) => {
    const res = await fetch(`/api/products/${product._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inStock: !product.inStock })
    });
    if (res.ok) { toast.success('Visibility updated!'); fetchProducts(); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <CameraModal 
        isOpen={isCameraOpen} 
        onClose={() => setIsCameraOpen(false)} 
        onCapture={handleCapture}
        title={cameraMode === 'bill' ? 'Scan Supplier Bill' : 'Scan Product'}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Package className="w-10 h-10 text-green-600" />
            Smart Inventory
          </h1>
          <p className="text-gray-500 font-medium">AI-powered product management</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button 
            onClick={() => openCamera('product')}
            className="flex-1 md:flex-none bg-blue-600 text-white px-5 py-3 rounded-2xl font-bold hover:bg-blue-700 transition shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2"
          >
            <Scan className="w-5 h-5" />
            Scan Product
          </button>
          <button 
            onClick={() => openCamera('bill')}
            className="flex-1 md:flex-none bg-purple-600 text-white px-5 py-3 rounded-2xl font-bold hover:bg-purple-700 transition shadow-xl shadow-purple-900/20 flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5" />
            Scan Bill
          </button>
          <button onClick={() => { setForm(emptyForm); setEditing(null); setScanResult(null); setShowForm(!showForm); }}
            className="flex-1 md:flex-none bg-green-600 text-white px-5 py-3 rounded-2xl font-bold hover:bg-green-700 transition shadow-xl shadow-green-900/20 flex items-center justify-center gap-2">
            {showForm ? 'Cancel' : <><span className="text-xl">+</span> Manual</>}
          </button>
        </div>
      </div>

      {/* Bill Scan Results */}
      {billResults && (
        <div className="mb-10 bg-purple-50 border-2 border-purple-200 rounded-3xl p-8 animate-in slide-in-from-top duration-500">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-purple-900 flex items-center gap-2">
              <FileText className="w-6 h-6" /> Bill Scan Results
            </h3>
            <button onClick={() => setBillResults(null)} className="text-purple-400 hover:text-purple-600 font-bold text-sm">Dismiss</button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-4 text-center">
              <p className="text-3xl font-black text-purple-700">{billResults.summary?.totalItems || 0}</p>
              <p className="text-xs font-bold text-gray-400 uppercase">Items Found</p>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center">
              <p className="text-3xl font-black text-green-600">{billResults.summary?.matched || 0}</p>
              <p className="text-xs font-bold text-gray-400 uppercase">Stock Updated</p>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center">
              <p className="text-3xl font-black text-orange-600">{billResults.summary?.unmatched || 0}</p>
              <p className="text-xs font-bold text-gray-400 uppercase">Need Review</p>
            </div>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {billResults.updates?.map((u, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${
                u.matched ? 'bg-green-50 border border-green-100' : 'bg-orange-50 border border-orange-100'
              }`}>
                <div className="flex items-center gap-3">
                  {u.matched ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertTriangle className="w-5 h-5 text-orange-600" />}
                  <span className="font-bold text-sm">{u.name}</span>
                </div>
                <span className="text-xs font-bold text-gray-500">
                  {u.matched ? `${u.oldStock} → ${u.newStock} units` : `${u.quantity} units (new)`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scan Result Banner */}
      {scanResult && showForm && (
        <div className={`mb-6 p-4 rounded-2xl border-2 flex items-center gap-3 ${
          scanResult.isNew 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          {scanResult.isNew 
            ? <CheckCircle className="w-6 h-6 flex-shrink-0" />
            : <AlertTriangle className="w-6 h-6 flex-shrink-0" />
          }
          <p className="font-bold text-sm">{scanResult.message}</p>
        </div>
      )}

      {/* Product Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border-2 border-green-100 rounded-[2.5rem] p-8 md:p-10 mb-10 shadow-2xl animate-in slide-in-from-top duration-500 relative overflow-hidden">
          {scanning && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
              <div className="flex flex-col items-center">
                <p className="text-xl font-black text-gray-900">AI is Analyzing...</p>
                <p className="text-gray-500 font-medium">Extracting product details</p>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              {editing ? 'Update Product' : 'New Product'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Product Name *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl p-4 focus:bg-white focus:border-green-500 outline-none transition font-bold" required placeholder="e.g. Basmati Rice 5kg" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Brand</label>
              <input value={form.brand} onChange={e => setForm({...form, brand: e.target.value})}
                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl p-4 focus:bg-white focus:border-green-500 outline-none transition font-bold" placeholder="e.g. Tata" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl p-4 focus:bg-white focus:border-green-500 outline-none transition font-bold appearance-none">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">MRP (₹) *</label>
              <input type="number" value={form.mrp} onChange={e => setForm({...form, mrp: e.target.value})}
                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl p-4 focus:bg-white focus:border-green-500 outline-none transition font-bold text-lg" required min="0" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Selling Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl p-4 focus:bg-white focus:border-green-500 outline-none transition font-bold text-lg text-green-700" required min="0" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Stock Qty</label>
              <input type="number" value={form.stockQuantity} onChange={e => setForm({...form, stockQuantity: e.target.value})}
                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl p-4 focus:bg-white focus:border-green-500 outline-none transition font-bold" min="0" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Expiry Date</label>
              <input type="date" value={form.expiryDate} onChange={e => setForm({...form, expiryDate: e.target.value})}
                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl p-4 focus:bg-white focus:border-green-500 outline-none transition font-bold" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Image URL</label>
              <input value={form.image} onChange={e => setForm({...form, image: e.target.value})}
                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl p-4 focus:bg-white focus:border-green-500 outline-none transition font-bold" placeholder="https://..." />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl p-4 focus:bg-white focus:border-green-500 outline-none transition font-bold" rows={2} />
            </div>
          </div>
          <div className="mt-8 flex gap-4">
            <button type="submit" disabled={saving}
              className="flex-1 bg-green-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-green-700 disabled:opacity-50 transition shadow-xl shadow-green-900/20">
              {saving ? 'Saving...' : editing ? 'Update Product' : 'Add to Inventory'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setScanResult(null); }}
              className="bg-gray-100 text-gray-600 px-8 py-5 rounded-2xl font-black hover:bg-gray-200 transition">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Products Table */}
      <div className="bg-white border-2 border-gray-50 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr className="text-gray-400 font-black uppercase text-[10px] tracking-[0.15em]">
                <th className="text-left p-5">Product</th>
                <th className="text-left p-5">Category</th>
                <th className="text-left p-5">Price</th>
                <th className="text-left p-5">Stock</th>
                <th className="text-right p-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(product => (
                <tr key={product._id} className="hover:bg-green-50/20 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-[8px] font-black uppercase">IMG</div>
                        )}
                      </div>
                      <div>
                        <p className="font-black text-gray-900">{product.name}</p>
                        <p className="text-xs font-bold text-gray-400">{product.brand || 'Generic'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-5">
                    <div>
                      <span className="text-gray-300 line-through text-xs">₹{product.mrp || 0}</span>
                      <span className="block font-black text-green-700 text-lg">₹{product.price}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${product.stockQuantity < 10 ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`} />
                        <span className="font-black text-gray-900 text-sm">{product.stockQuantity}</span>
                      </div>
                      <button onClick={() => toggleStock(product)}
                        className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-md w-fit ${
                          product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {product.inStock ? 'Live' : 'Hidden'}
                      </button>
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(product)}
                        className="bg-gray-50 text-gray-600 p-2.5 rounded-xl hover:bg-green-50 hover:text-green-600 transition">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(product._id)}
                        className="bg-gray-50 text-gray-600 p-2.5 rounded-xl hover:bg-red-50 hover:text-red-600 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-16 text-center">
                    <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold">No products yet</p>
                    <p className="text-gray-300 text-sm">Scan a product or add manually to get started</p>
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
