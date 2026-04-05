'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Plus, Minus, Star, Tag, Package } from 'lucide-react';

export default function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, removeFromCart, updateQuantity, isInCart, getCartItem } = useCart();
  
  const inCart = isInCart(product._id);
  const cartItem = getCartItem(product._id);
  const currentQuantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  const handleIncreaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleUpdateCartQuantity = (newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(product._id);
    } else {
      updateQuantity(product._id, newQuantity);
    }
  };

  const isOutOfStock = product.stock <= 0;
  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-2 left-2 z-10 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
          <Tag className="w-3 h-3 mr-1" />
          {product.discount}% OFF
        </div>
      )}

      {/* Stock Badge */}
      <div className="absolute top-2 right-2 z-10">
        {isOutOfStock ? (
          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
            <Package className="w-3 h-3 mr-1" />
            OUT OF STOCK
          </span>
        ) : (
          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
            <Package className="w-3 h-3 mr-1" />
            IN STOCK
          </span>
        )}
      </div>

      <Link href={`/products/${product._id}`}>
        <div className="relative h-48 w-full">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product._id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Price and Discount */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {hasDiscount && (
              <span className="text-gray-500 line-through text-sm">
                ₹{product.price}
              </span>
            )}
            <span className="text-lg font-bold text-green-600">
              ₹{discountedPrice.toFixed(2)}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {product.unit}
          </span>
        </div>

        {/* Expiry Date */}
        {product.expiryDate && (
          <div className="text-xs text-gray-500 mb-3">
            Expires: {new Date(product.expiryDate).toLocaleDateString('en-IN')}
          </div>
        )}

        {/* Cart Controls */}
        {inCart ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleUpdateCartQuantity(currentQuantity - 1)}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={currentQuantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="flex-1 text-center font-medium">
              {currentQuantity}
            </span>
            <button
              onClick={() => handleUpdateCartQuantity(currentQuantity + 1)}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={isOutOfStock}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {!isOutOfStock && (
              <>
                <button
                  onClick={handleDecreaseQuantity}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={handleIncreaseQuantity}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                isOutOfStock 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
