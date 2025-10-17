import React, { useState, useRef } from 'react';
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
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { checkoutUrl } = route.params;
  const { clearCart, cartItems } = useCart();
  const { isSignedIn, user, signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);

  const handleNavigationChange = (navState) => {
    const { url } = navState;
    
    console.log('📍 Checkout URL changed:', url);
    
    // Check if user is trying to sign in
    if (url.includes('/account/login') || url.includes('/account/register')) {
      console.log('🔐 User trying to sign in at checkout');
      
      // Show our custom auth modal instead
      setIsAuthModalVisible(true);
      
      // Go back to prevent Shopify login page
      navigation.goBack();
      return;
    }
    
    // Check if checkout is complete
    if (url.includes('/thank_you') || url.includes('/orders/')) {
      console.log('✅ Order completed successfully!');
      
      if (isSignedIn && user) {
        console.log(`🎉 Order created for customer: ${user.email}`);
      }
      
      clearCart();
      navigation.replace('OrderSuccess');
    }
  };

  const handleSignInSuccess = () => {
    console.log('✅ User signed in successfully');
    setIsAuthModalVisible(false);
    
    Alert.alert(
      'Sign In Successful',
      'Please proceed to checkout again. Your order will now be linked to your account.',
      [
        {
          text: 'Go to Cart',
          onPress: () => {
            navigation.goBack(); // Go back to cart to recreate checkout
          }
        }
      ]
    );
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
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Secure Checkout</Text>
          {isSignedIn && user && (
            <Text style={styles.headerSubtitle}>
              {user.firstName || user.email}
            </Text>
          )}
          {!isSignedIn && (
            <TouchableOpacity
              style={styles.signInPrompt}
              onPress={() => setIsAuthModalVisible(true)}
            >
              <Text style={styles.signInPromptText}>
                Sign in for faster checkout
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9900" />
          <Text style={styles.loadingText}>Loading secure checkout...</Text>
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
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
      />

      {/* Auth Modal */}
      <AuthModal
        visible={isAuthModalVisible}
        onClose={() => setIsAuthModalVisible(false)}
        onSignIn={async (email, password) => {
          const result = await signIn(email, password);
          if (result.success) {
            handleSignInSuccess();
          }
          return result;
        }}
        onSignUp={async (email, password, firstName, lastName) => {
          const result = await signUp(email, password, firstName, lastName);
          if (result.success) {
            handleSignInSuccess();
          }
          return result;
        }}
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
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#232F3E',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  signInPrompt: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#E8F5E9',
    borderRadius: 4,
  },
  signInPromptText: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '600',
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