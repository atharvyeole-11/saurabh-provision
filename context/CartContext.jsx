'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCart = (cartData) => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartData));
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  };

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product._id);
      
      let newCart;
      if (existingItem) {
        newCart = prevCart.map(item =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [...prevCart, {
          productId: product._id,
          name: product.name,
          price: product.price,
          unit: product.unit,
          image: product.images?.[0] || '',
          quantity
        }];
      }
      
      saveCart(newCart);
      return newCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.productId !== productId);
      saveCart(newCart);
      return newCart;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const newCart = prevCart.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      );
      saveCart(newCart);
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (productId) => {
    return cart.some(item => item.productId === productId);
  };

  const getCartItem = (productId) => {
    return cart.find(item => item.productId === productId);
  };

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isInCart,
    getCartItem,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
