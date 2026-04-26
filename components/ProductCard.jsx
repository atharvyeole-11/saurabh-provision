'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Plus, Minus, Star, Tag } from 'lucide-react';

export default function ProductCard({ product, onAddToCart }) {
  const [imageError, setImageError] = useState(false);
  const { addToCart, removeFromCart, updateQuantity, isInCart, getCartItem } = useCart();
  
  const inCart = isInCart(product._id);
  const cartItem = getCartItem(product._id);
  const currentQuantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    addToCart(product, 1);
    onAddToCart?.();
  };

  const handleUpdateCartQuantity = (newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(product._id);
    } else if (newQuantity <= product.stock) {
      updateQuantity(product._id, newQuantity);
    }
  };

  const isOutOfStock = product.stock <= 0;
  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
      {/* Product Image */}
      <div className="relative aspect-square">
        {imageError ? (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-gray-400 text-4xl">No Image</div>
          </div>
        ) : (
          <Image
            src={product.image || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            onError={() => setImageError(true)}
          />
        )}
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {product.discount}% OFF
          </div>
        )}
        
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        {/* Product Name */}
        <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2 leading-tight">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">(4.0)</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            ₹{discountedPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              ₹{product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart / Quantity Stepper */}
        <div className="flex items-center justify-between">
          {inCart ? (
            <div className="flex items-center gap-2 bg-green-50 rounded-lg px-2 py-1">
              <button
                onClick={() => handleUpdateCartQuantity(currentQuantity - 1)}
                className="w-6 h-6 rounded-full bg-white text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-sm font-semibold text-gray-900 w-6 text-center">
                {currentQuantity}
              </span>
              <button
                onClick={() => handleUpdateCartQuantity(currentQuantity + 1)}
                disabled={currentQuantity >= product.stock}
                className="w-6 h-6 rounded-full bg-white text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg py-2 text-sm font-semibold transition-colors flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          )}
        </div>

        {/* Stock Warning */}
        {product.stock > 0 && product.stock <= 5 && (
          <p className="text-xs text-orange-600 mt-2">
            Only {product.stock} left
          </p>
        )}
      </div>
    </div>
  );
}
