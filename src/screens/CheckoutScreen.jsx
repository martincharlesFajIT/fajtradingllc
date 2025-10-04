import React, { useState } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCart } from '../context/CartContext';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { checkoutUrl } = route.params;
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);

  const handleNavigationChange = (navState) => {
    const { url } = navState;
    
    // Check if checkout is complete
    if (url.includes('/thank_you') || url.includes('/orders/')) {
      // Clear cart and go to success
      clearCart();
      navigation.replace('OrderSuccess');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            Alert.alert(
              'Cancel Checkout?',
              'Are you sure you want to cancel?',
              [
                { text: 'Continue Shopping', style: 'cancel' },
                {
                  text: 'Cancel Checkout',
                  style: 'destructive',
                  onPress: () => navigation.goBack()
                }
              ]
            );
          }}
        >
          <Text style={styles.backButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Secure Checkout</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#da4925ff" />
          <Text style={styles.loadingText}>Loading checkout...</Text>
        </View>
      )}

      {/* WebView */}
      <WebView
        source={{ uri: checkoutUrl }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={handleNavigationChange}
        style={styles.webview}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    fontSize: 20,
    color: '#232F3E',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#232F3E',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  webview: {
    flex: 1,
  },
});

export default CheckoutScreen;