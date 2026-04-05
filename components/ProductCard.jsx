'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Plus, Minus, Star } from 'lucide-react';

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

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <Link href={`/products/${product._id}`}>
        <div className="relative h-48 w-full">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          {product.featured && (
            <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Featured
            </div>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Low Stock
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product._id}`}>
          <h3 className="font-semibold text-gray-800 hover:text-green-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center mt-1">
          <div className="flex text-yellow-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${star <= 4 ? 'fill-current' : ''}`}
              />
            ))}
          </div>
          <span className="text-gray-500 text-sm ml-1">(4.0)</span>
        </div>

        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-green-600">
              ₹{product.price}
            </span>
            <span className="text-gray-500 text-sm ml-1">/{product.unit}</span>
          </div>
          <div className="text-sm text-gray-500">
            Stock: {product.stock}
          </div>
        </div>

        <div className="mt-4">
          {inCart ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleUpdateCartQuantity(currentQuantity - 1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-lg transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-semibold text-gray-700 min-w-[3rem] text-center">
                {currentQuantity}
              </span>
              <button
                onClick={() => handleUpdateCartQuantity(currentQuantity + 1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
              <div className="flex-1 text-right">
                <span className="text-sm text-gray-500">Total: </span>
                <span className="font-semibold text-green-600">
                  ₹{product.price * currentQuantity}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={handleDecreaseQuantity}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-l-lg transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-semibold text-gray-700 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={handleIncreaseQuantity}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-r-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
