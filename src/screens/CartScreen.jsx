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
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
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
  
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Format price with commas
  const formatPrice = (amount) => {
    return amount.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  // Remove item with confirmation
  const handleRemoveItem = (itemId) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFromCart(itemId)
        }
      ]
    );
  };

  // Clear cart with confirmation
  const handleClearCart = () => {
    clearCart();
    setShowClearConfirm(false);
  };

  // Proceed to checkout - UPDATED FOR WEBVIEW
  const handleCheckout = async () => {
  if (cartItems.length === 0) {
    Alert.alert('Cart Empty', 'Please add items to cart before checkout');
    return;
  }

  // Validate that all items have variantId
  const invalidItems = cartItems.filter(item => !item.variantId);
  if (invalidItems.length > 0) {
    console.error('Items missing variantId:', invalidItems);
    Alert.alert(
      'Error',
      'Some items are missing product information. Please remove and re-add them.'
    );
    return;
  }

  setCheckoutLoading(true);

  try {
    // Prepare line items for Shopify
    const lineItems = cartItems.map(item => ({
      variantId: item.variantId,
      quantity: item.quantity,
    }));

    console.log('Creating checkout with items:', lineItems.length);

    // Create checkout and get URL
    const checkout = await createCheckout(lineItems);

    if (checkout && checkout.webUrl) {
      // IMPORTANT: Stop loading BEFORE navigation
      setCheckoutLoading(false);
      
      console.log('Checkout created successfully');
      
      navigation.navigate('Checkout', {
        checkoutUrl: checkout.webUrl
      });
    } else {
      // Stop loading if checkout failed
      setCheckoutLoading(false);
      
      Alert.alert(
        'Checkout Error',
        'Unable to create checkout. Please try again.'
      );
    }
  } catch (error) {
    console.error('Checkout error:', error);
    
    // Stop loading on error
    setCheckoutLoading(false);
    
    Alert.alert(
      'Error',
      'Something went wrong. Please try again.'
    );
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
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
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
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.shopButtonText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart ({cartItems.length})</Text>
        {cartItems.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setShowClearConfirm(true)}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
        {cartItems.length === 0 && <View style={styles.headerRight} />}
      </View>

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

            {/* Checkout Button - UPDATED */}
            <TouchableOpacity
              style={[styles.checkoutButton, checkoutLoading && styles.checkoutButtonDisabled]}
              onPress={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.checkoutButtonText}>
                  Proceed to Checkout
                </Text>
              )}
            </TouchableOpacity>

            {/* Continue Shopping */}
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => navigation.goBack()}
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
          <View style={styles.modalContent}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#232F3E',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232F3E',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  clearButton: {
    paddingHorizontal: 10,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#da4925ff',
    fontWeight: '600',
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
});

export default CartScreen;