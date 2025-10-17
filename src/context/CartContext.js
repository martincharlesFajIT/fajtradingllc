// src/context/CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from storage on app start
  useEffect(() => {
    loadCart();
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    if (cartItems.length >= 0) { // Only save if initialized
      saveCart();
    }
  }, [cartItems]);

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('shopping_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        console.log('📦 Loaded cart from storage:', parsed.length, 'items');
        setCartItems(parsed);
      } else {
        console.log('📦 No saved cart found');
      }
    } catch (error) {
      console.error('❌ Error loading cart:', error);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem('shopping_cart', JSON.stringify(cartItems));
      console.log('💾 Cart saved to storage:', cartItems.length, 'items');
    } catch (error) {
      console.error('❌ Error saving cart:', error);
    }
  };

  // Add item to cart
  const addToCart = (product, quantity, selectedVariant) => {
    console.log('➕ Adding to cart:', product.title);
    
    const variant = product.variants[selectedVariant];
    
    // Create unique ID for cart item (product + variant)
    const cartItemId = `${product.id}_${variant.id}`;
    
    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(item => item.id === cartItemId);
    
    if (existingItemIndex > -1) {
      // Item exists, update quantity
      console.log('📝 Item exists, updating quantity');
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += quantity;
      setCartItems(updatedCart);
    } else {
      // New item, add to cart
      console.log('🆕 Adding new item to cart');
      const newItem = {
        id: cartItemId,
        productId: product.id,
        variantId: variant.id,
        name: product.title,
        image: product.images[0]?.url || 'https://via.placeholder.com/150',
        price: parseFloat(variant.price.amount),
        currency: variant.price.currencyCode,
        quantity: quantity,
        variant: variant.title !== 'Default Title' ? variant.title : null,
        inStock: variant.availableForSale,
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    console.log('🗑️ RemoveFromCart called with ID:', itemId);
    console.log('📋 Current cart items:', cartItems.map(item => item.id));
    
    const filtered = cartItems.filter(item => item.id !== itemId);
    console.log('📋 Filtered cart items:', filtered.map(item => item.id));
    console.log('✂️ Items before:', cartItems.length, '→ Items after:', filtered.length);
    
    setCartItems(filtered);
    console.log('✅ RemoveFromCart completed');
  };

  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    console.log('🔢 Updating quantity for:', itemId, 'to:', newQuantity);
    
    if (newQuantity < 1) {
      console.log('⚠️ Quantity less than 1, ignoring');
      return;
    }
    
    const updated = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updated);
    console.log('✅ Quantity updated');
  };

  // Clear entire cart
  const clearCart = () => {
    console.log('🧹 Clearing entire cart');
    setCartItems([]);
    console.log('✅ Cart cleared');
  };

  // Get cart item count
  const getCartCount = () => {
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    return count;
  };

  // Calculate subtotal
  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Calculate VAT (5%)
  const getVAT = () => {
    return getSubtotal() * 0.05;
  };

  // Calculate total
  const getTotal = () => {
    return getSubtotal() + getVAT();
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getSubtotal,
    getVAT,
    getTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};