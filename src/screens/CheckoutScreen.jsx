import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const { cartItems, getSubtotal, getVAT, getTotal, clearCart } = useCart();

  // Form states
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'UAE',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod'); // cod, card
  const [notes, setNotes] = useState('');

  // Format price with commas
  const formatPrice = (amount) => {
    return amount.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  // Validate form
  const validateForm = () => {
    if (!customerInfo.firstName.trim()) {
      Alert.alert('Required', 'Please enter your first name');
      return false;
    }
    if (!customerInfo.lastName.trim()) {
      Alert.alert('Required', 'Please enter your last name');
      return false;
    }
    if (!customerInfo.email.trim()) {
      Alert.alert('Required', 'Please enter your email');
      return false;
    }
    if (!customerInfo.phone.trim()) {
      Alert.alert('Required', 'Please enter your phone number');
      return false;
    }
    if (!shippingAddress.address.trim()) {
      Alert.alert('Required', 'Please enter your address');
      return false;
    }
    if (!shippingAddress.city.trim()) {
      Alert.alert('Required', 'Please enter your city');
      return false;
    }
    if (!shippingAddress.zipCode.trim()) {
      Alert.alert('Required', 'Please enter your ZIP code');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return false;
    }

    // Validate phone format (basic)
    if (customerInfo.phone.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number');
      return false;
    }

    return true;
  };

  // Handle order placement
  const handlePlaceOrder = () => {
    if (!validateForm()) return;

    Alert.alert(
      'Confirm Order',
      `Place order for ${formatPrice(getTotal())} AED?\n\nPayment: ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Payment'}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            // Here you would integrate with Shopify Checkout API
            // For now, we'll show success message
            Alert.alert(
              'Order Placed! 🎉',
              'Your order has been placed successfully. You will receive a confirmation email shortly.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    clearCart();
                    navigation.navigate('Home'); // Navigate to home or order success screen
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

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
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Customer Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Information</Text>
            
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>First Name *</Text>
                <TextInput
                  style={styles.input}
                  value={customerInfo.firstName}
                  onChangeText={(text) =>
                    setCustomerInfo({ ...customerInfo, firstName: text })
                  }
                  placeholder="John"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.halfInput}>
                <Text style={styles.label}>Last Name *</Text>
                <TextInput
                  style={styles.input}
                  value={customerInfo.lastName}
                  onChangeText={(text) =>
                    setCustomerInfo({ ...customerInfo, lastName: text })
                  }
                  placeholder="Doe"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={customerInfo.email}
                onChangeText={(text) =>
                  setCustomerInfo({ ...customerInfo, email: text })
                }
                placeholder="john.doe@example.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                value={customerInfo.phone}
                onChangeText={(text) =>
                  setCustomerInfo({ ...customerInfo, phone: text })
                }
                placeholder="+971 50 123 4567"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Shipping Address */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shipping Address</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Address *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={shippingAddress.address}
                onChangeText={(text) =>
                  setShippingAddress({ ...shippingAddress, address: text })
                }
                placeholder="Street address, apartment, suite, etc."
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>City *</Text>
                <TextInput
                  style={styles.input}
                  value={shippingAddress.city}
                  onChangeText={(text) =>
                    setShippingAddress({ ...shippingAddress, city: text })
                  }
                  placeholder="Dubai"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.halfInput}>
                <Text style={styles.label}>State/Emirate</Text>
                <TextInput
                  style={styles.input}
                  value={shippingAddress.state}
                  onChangeText={(text) =>
                    setShippingAddress({ ...shippingAddress, state: text })
                  }
                  placeholder="Dubai"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>ZIP Code *</Text>
                <TextInput
                  style={styles.input}
                  value={shippingAddress.zipCode}
                  onChangeText={(text) =>
                    setShippingAddress({ ...shippingAddress, zipCode: text })
                  }
                  placeholder="12345"
                  placeholderTextColor="#999"
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.halfInput}>
                <Text style={styles.label}>Country</Text>
                <TextInput
                  style={styles.input}
                  value={shippingAddress.country}
                  onChangeText={(text) =>
                    setShippingAddress({ ...shippingAddress, country: text })
                  }
                  placeholder="UAE"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === 'cod' && styles.paymentOptionSelected
              ]}
              onPress={() => setPaymentMethod('cod')}
            >
              <View style={styles.radio}>
                {paymentMethod === 'cod' && <View style={styles.radioInner} />}
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>Cash on Delivery</Text>
                <Text style={styles.paymentDesc}>Pay when you receive your order</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === 'card' && styles.paymentOptionSelected
              ]}
              onPress={() => setPaymentMethod('card')}
            >
              <View style={styles.radio}>
                {paymentMethod === 'card' && <View style={styles.radioInner} />}
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>Credit/Debit Card</Text>
                <Text style={styles.paymentDesc}>Pay securely online</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Order Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any special instructions for your order..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Order Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items ({cartItems.length})</Text>
              <Text style={styles.summaryValue}>{formatPrice(getSubtotal())} AED</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>Free</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>VAT (5%)</Text>
              <Text style={styles.summaryValue}>{formatPrice(getVAT())} AED</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPrice(getTotal())} AED</Text>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
        >
          <Text style={styles.placeOrderText}>
            Place Order • {formatPrice(getTotal())} AED
          </Text>
        </TouchableOpacity>
      </View>
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232F3E',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#232F3E',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    color: '#232F3E',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  halfInput: {
    flex: 1,
    marginBottom: 15,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    marginBottom: 10,
  },
  paymentOptionSelected: {
    borderColor: '#da4925ff',
    backgroundColor: '#FFF5F3',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#da4925ff',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#232F3E',
    marginBottom: 2,
  },
  paymentDesc: {
    fontSize: 13,
    color: '#666',
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
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  placeOrderButton: {
    backgroundColor: '#da4925ff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  placeOrderText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;