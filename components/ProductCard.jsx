'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Plus, Minus, Star, Tag, Package, Clock } from 'lucide-react';

export default function ProductCard({ product, onAddToCart }) {
  const [imageError, setImageError] = useState(false);
  const { addToCart, removeFromCart, updateQuantity, isInCart, getCartItem } = useCart();
  
  const inCart = isInCart(product._id);
  const cartItem = getCartItem(product._id);
  const currentQuantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    if (product.stockQuantity <= 0) return;
    addToCart(product, 1);
    onAddToCart?.();
  };

  const handleUpdateCartQuantity = (newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(product._id);
    } else if (newQuantity <= product.stockQuantity) {
      updateQuantity(product._id, newQuantity);
    }
  };

  const isOutOfStock = product.stockQuantity <= 0;
  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = product.price; // We updated the model to store discounted price in 'price'
  const mrp = product.mrp || product.price / (1 - (product.discount || 0) / 100);

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col h-full">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
            <Package className="w-8 h-8 opacity-20" />
            <span className="text-xs font-medium">No Image</span>
          </div>
        ) : (
          <Image
            src={product.image || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        )}
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1 animate-in fade-in zoom-in duration-300">
            <Tag className="w-3 h-3" />
            {product.discount}% OFF
          </div>
        )}

        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-green-600 p-1.5 rounded-full shadow-md">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
        )}
        
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="bg-gray-900 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-xl">
              Currently Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          {/* Category */}
          <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1.5">
            {product.category}
          </p>

          {/* Product Name */}
          <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight group-hover:text-green-600 transition-colors">
            {product.name}
          </h3>

          {/* Expiry & Stock Info */}
          <div className="flex items-center justify-between mb-3">
            {product.expiryDate && (
              <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">
                <Clock className="w-3 h-3" />
                Exp: {product.expiryDate}
              </div>
            )}
            {product.stockQuantity > 0 && product.stockQuantity <= 10 && (
              <span className="text-[10px] font-bold text-orange-600">
                Only {product.stockQuantity} left
              </span>
            )}
          </div>
        </div>

        {/* Price Section */}
        <div className="mt-auto">
          <div className="flex items-end gap-2 mb-4">
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-gray-900 leading-none">
                ₹{discountedPrice.toFixed(0)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through mt-0.5">
                  MRP: ₹{mrp.toFixed(0)}
                </span>
              )}
            </div>
            {hasDiscount && (
              <span className="text-[10px] text-green-600 font-bold mb-0.5">
                Save ₹{(mrp - discountedPrice).toFixed(0)}
              </span>
            )}
          </div>

          {/* Add to Cart / Quantity Stepper */}
          <div className="flex items-center justify-between">
            {inCart ? (
              <div className="flex items-center justify-between w-full bg-green-50 rounded-xl p-1 border border-green-100">
                <button
                  onClick={() => handleUpdateCartQuantity(currentQuantity - 1)}
                  className="w-8 h-8 rounded-lg bg-white text-green-600 flex items-center justify-center shadow-sm hover:bg-green-600 hover:text-white transition-all active:scale-90"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold text-green-700">
                  {currentQuantity}
                </span>
                <button
                  onClick={() => handleUpdateCartQuantity(currentQuantity + 1)}
                  disabled={currentQuantity >= product.stockQuantity}
                  className="w-8 h-8 rounded-lg bg-white text-green-600 flex items-center justify-center shadow-sm hover:bg-green-600 hover:text-white transition-all active:scale-90 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl py-3 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/10 active:scale-95 transform"
              >
                <Plus className="w-4 h-4" />
                ADD TO CART
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
