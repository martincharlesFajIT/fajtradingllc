import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  Modal,
  ActivityIndicator,
  Alert,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // Add this import
import { createCheckout } from '../shopifyApi';

const CartScreen = () => {
  const navigation = useNavigation();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getSubtotal,
    getVAT,
    getTotal,
  } = useCart();
  
  // Add auth hook
  const { isSignedIn, user, accessToken } = useAuth();
  
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [errorModal, setErrorModal] = useState({ visible: false, title: '', message: '' });

  // Format price with commas
  const formatPrice = (amount) => {
    return amount.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  // Remove item with confirmation
  const handleRemoveItem = (itemId) => {
    console.log('🗑️ Remove button clicked for item:', itemId);
    setItemToRemove(itemId);
  };

  // Confirm item removal
  const confirmRemoveItem = () => {
    console.log('🔴 ===== confirmRemoveItem START =====');
    console.log('🔴 itemToRemove:', itemToRemove);
    
    if (!itemToRemove) {
      console.log('⚠️ No item to remove!');
      return;
    }
    
    console.log('✅ Removing item:', itemToRemove);
    
    try {
      removeFromCart(itemToRemove);
      console.log('✓ removeFromCart executed');
    } catch (error) {
      console.error('❌ Error in removeFromCart:', error);
    }
    
    setItemToRemove(null);
    console.log('🔴 ===== confirmRemoveItem END =====');
  };

  // Cancel item removal
  const cancelRemoveItem = () => {
    console.log('❌ User cancelled removal');
    setItemToRemove(null);
  };

  // Clear cart with confirmation
  const handleClearCart = () => {
    console.log('Clearing entire cart');
    clearCart();
    setShowClearConfirm(false);
  };

  // Proceed to checkout - UPDATED WITH AUTH
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setErrorModal({
        visible: true,
        title: 'Cart Empty',
        message: 'Please add items to cart before checkout'
      });
      return;
    }

    // Validate that all items have variantId
    const invalidItems = cartItems.filter(item => !item.variantId);
    if (invalidItems.length > 0) {
      console.error('Items missing variantId:', invalidItems);
      setErrorModal({
        visible: true,
        title: 'Error',
        message: 'Some items are missing product information. Please remove and re-add them.'
      });
      return;
    }

    setCheckoutLoading(true);

    try {
      // Prepare line items for Shopify
      const lineItems = cartItems.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
      }));

      console.log('🛒 Creating checkout...');
      console.log('📦 Items count:', lineItems.length);
      console.log('👤 User signed in:', isSignedIn);
      console.log('📧 User email:', user?.email);
      console.log('🔑 Has access token:', !!accessToken);

      // Create checkout with customer access token if user is logged in
      const checkout = await createCheckout(
        lineItems,
        user?.email || null,      // Pass user email if available
        accessToken || null        // Pass access token if user is logged in
      );

      if (checkout && checkout.webUrl) {
        setCheckoutLoading(false);
        
        console.log('Checkout created successfully');
        console.log('🔗 Checkout URL:', checkout.webUrl);
        
        if (isSignedIn && user) {
          console.log(`Checkout created for customer: ${user.email}`);
        } else {
          console.log('👤 Guest checkout created');
        }
        
        // Navigate to checkout screen
        navigation.navigate('Checkout', {
          checkoutUrl: checkout.webUrl
        });
      } else {
        setCheckoutLoading(false);
        
        setErrorModal({
          visible: true,
          title: 'Checkout Error',
          message: 'Unable to create checkout. Please try again.'
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setCheckoutLoading(false);
      
      setErrorModal({
        visible: true,
        title: 'Error',
        message: 'Something went wrong. Please try again.'
      });
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
        {item.variant && (
          <Text style={styles.itemVariant}>Variant: {item.variant}</Text>
        )}
        <Text style={styles.itemPrice}>
          {formatPrice(item.price)} {item.currency}
        </Text>
        
        {/* Quantity Controls */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => {
              console.log('Decreasing quantity for:', item.id);
              updateQuantity(item.id, item.quantity - 1);
            }}
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => {
              console.log('Increasing quantity for:', item.id);
              updateQuantity(item.id, item.quantity + 1);
            }}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.itemRight}>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.id)}
        >
          <Text style={styles.removeButtonText}>✕</Text>
        </TouchableOpacity>
        
        <Text style={styles.itemTotal}>
          {formatPrice(item.price * item.quantity)} {item.currency}
        </Text>
      </View>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🛒</Text>
      <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
      <Text style={styles.emptySubtitle}>
        Add items to your cart to see them here
      </Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.shopButtonText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#232F3E" />

      <View style={styles.cartHeader}>
        <Text style={styles.cartHeaderTitle}>Shopping Cart ({cartItems.length})</Text>
        {cartItems.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setShowClearConfirm(true)}
          >
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* User Info Banner - NEW */}
      {isSignedIn && user && cartItems.length > 0 && (
        <View style={styles.userInfoBanner}>
          <View style={styles.userInfoContent}>
            <Text style={styles.userInfoIcon}>✓</Text>
            <View style={styles.userInfoTextContainer}>
              <Text style={styles.userInfoText}>
                Signed in as {user.firstName || user.email}
              </Text>
              <Text style={styles.userInfoSubtext}>
                Order will be linked to your account
              </Text>
            </View>
          </View>
        </View>
      )}

      {cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          {/* Cart Items List */}
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />

          {/* Summary Section */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                {formatPrice(getSubtotal())} AED
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>VAT (5%)</Text>
              <Text style={styles.summaryValue}>
                {formatPrice(getVAT())} AED
              </Text>
            </View>
            
            <View style={styles.summaryDivider} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {formatPrice(getTotal())} AED
              </Text>
            </View>

            {/* Checkout Button */}
            <TouchableOpacity
              style={[styles.checkoutButton, checkoutLoading && styles.checkoutButtonDisabled]}
              onPress={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? (
                <View style={styles.checkoutLoadingContainer}>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text style={styles.checkoutLoadingText}>Creating checkout...</Text>
                </View>
              ) : (
                <Text style={styles.checkoutButtonText}>
                  Proceed to Checkout
                </Text>
              )}
            </TouchableOpacity>

            {/* Continue Shopping */}
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.continueButtonText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Clear Cart Confirmation Modal */}
      <Modal
        visible={showClearConfirm}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowClearConfirm(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowClearConfirm(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Clear Cart?</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to remove all items from your cart?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowClearConfirm(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleClearCart}
              >
                <Text style={styles.modalConfirmText}>Clear Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Remove Item Confirmation - Overlay Dialog */}
      {itemToRemove !== null && (
        <View style={styles.modalBackdrop} pointerEvents="box-none">
          <Pressable 
            style={StyleSheet.absoluteFill}
            onPress={() => {
              console.log('🌫️ Backdrop pressed - closing');
              setItemToRemove(null);
            }}
          />
          <View style={styles.modalBox} pointerEvents="box-none">
            <Text style={styles.modalTitle}>Remove Item?</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to remove this item from your cart?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  console.log('❌ CANCEL PRESSED');
                  setItemToRemove(null);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={() => {
                  console.log('✅ REMOVE PRESSED');
                  const idToRemove = itemToRemove;
                  setItemToRemove(null);
                  removeFromCart(idToRemove);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.modalConfirmText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Error Modal */}
      <Modal
        visible={errorModal.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setErrorModal({ visible: false, title: '', message: '' })}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setErrorModal({ visible: false, title: '', message: '' })}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>{errorModal.title}</Text>
            <Text style={styles.modalMessage}>{errorModal.message}</Text>
            <TouchableOpacity
              style={[styles.modalConfirmButton, { width: '100%' }]}
              onPress={() => setErrorModal({ visible: false, title: '', message: '' })}
            >
              <Text style={styles.modalConfirmText}>OK</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  cartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  cartHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#232F3E',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFEBEE',
    borderRadius: 6,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#da4925ff',
    fontWeight: '600',
  },
  // User Info Banner Styles - NEW
  userInfoBanner: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
  },
  userInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoIcon: {
    fontSize: 20,
    color: '#4CAF50',
    marginRight: 10,
  },
  userInfoTextContainer: {
    flex: 1,
  },
  userInfoText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '600',
  },
  userInfoSubtext: {
    color: '#558B2F',
    fontSize: 12,
    marginTop: 2,
  },
  listContainer: {
    padding: 15,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#232F3E',
    marginBottom: 4,
  },
  itemVariant: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#da4925ff',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#232F3E',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#232F3E',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  itemRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 16,
    color: '#C62828',
    fontWeight: 'bold',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#232F3E',
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#666',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#232F3E',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232F3E',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#da4925ff',
  },
  checkoutButton: {
    backgroundColor: '#da4925ff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  checkoutButtonDisabled: {
    backgroundColor: '#CCC',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkoutLoadingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#da4925ff',
  },
  continueButtonText: {
    color: '#da4925ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#232F3E',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  shopButton: {
    backgroundColor: '#da4925ff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 25,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#232F3E',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: '#da4925ff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
    elevation: 99999,
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 25,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 100000,
  },
});

export default CartScreen;