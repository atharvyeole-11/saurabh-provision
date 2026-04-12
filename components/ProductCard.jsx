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
            ${discountedPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              ${product.price.toFixed(2)}
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

export default function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const isOutOfStock = product.stock <= 0;
  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    if (isOutOfStock) {
      toast.error('This product is out of stock');
      return;
    }
    addToCart({
      productId: product._id,
      name: product.name,
      price: discountedPrice,
      quantity: 1,
      image: product.image
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {product.image && !imageError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
            <Package className="w-12 h-12 text-green-600" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-green-600 transition-colors">
            {product.name}
          </h3>
          {product.category && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {product.category}
            </span>
          )}
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-600">
              ${discountedPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
          {product.unit && (
            <span className="text-xs text-gray-500">/{product.unit}</span>
          )}
        </div>

        {/* Stock Info */}
        {!isOutOfStock && (
          <div className="text-xs text-gray-500 mb-3">
            {isLowStock ? (
              <span className="text-orange-600 font-medium">
                Only {product.stock} items left
              </span>
            ) : (
              <span>{product.stock} items available</span>
            )}
          </div>
        )}

        {/* Expiry Date */}
        {product.expiryDate && !isOutOfStock && (
          <div className="text-xs text-gray-500 mb-3 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            Expires: {new Date(product.expiryDate).toLocaleDateString()}
          </div>
        )}

        {/* Action Buttons */}
        {!inCart ? (
          <div className="flex gap-2">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={handleDecreaseQuantity}
                disabled={quantity <= 1}
                className="p-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 text-sm font-medium border-x border-gray-300">
                {quantity}
              </span>
              <button
                onClick={handleIncreaseQuantity}
                disabled={quantity >= product.stock}
                className="p-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-1 ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-green-600 font-medium">
              {currentQuantity} in cart
            </span>
            <div className="flex items-center border border-gray-300 rounded-lg ml-auto">
              <button
                onClick={() => handleUpdateCartQuantity(currentQuantity - 1)}
                className="p-1 text-gray-600 hover:bg-gray-100"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 text-sm font-medium border-x border-gray-300">
                {currentQuantity}
              </span>
              <button
                onClick={() => handleUpdateCartQuantity(currentQuantity + 1)}
                disabled={currentQuantity >= product.stock}
                className="p-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
