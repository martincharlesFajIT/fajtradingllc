import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { customerSignIn, customerSignOut, createCustomer, getCustomerData } from '../shopifyApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from storage on app start
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('customerAccessToken');
      const userData = await AsyncStorage.getItem('userData');
      
      if (token && userData) {
        setAccessToken(token);
        setUser(JSON.parse(userData));
        setIsSignedIn(true);
        console.log('✅ User data loaded from storage');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = useCallback(async (email, password) => {
    try {
      console.log('🔐 Attempting sign in...');
      const result = await customerSignIn(email, password);
      
      if (result.success) {
        // Save to AsyncStorage
        await AsyncStorage.setItem('customerAccessToken', result.accessToken);
        await AsyncStorage.setItem('userData', JSON.stringify(result.customer));
        
        setAccessToken(result.accessToken);
        setUser(result.customer);
        setIsSignedIn(true);
        
        console.log('✅ Sign in successful');
        return { success: true };
      } else {
        console.log('❌ Sign in failed:', result.errors);
        return { success: false, errors: result.errors };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, errors: [{ message: 'An error occurred during sign in' }] };
    }
  }, []);

  const signUp = useCallback(async (email, password, firstName, lastName) => {
    try {
      console.log('📝 Attempting sign up...');
      const result = await createCustomer(email, password, firstName, lastName);
      
      if (result.success) {
        console.log('✅ Account created, signing in...');
        // After successful signup, automatically sign in
        return await signIn(email, password);
      } else {
        console.log('❌ Sign up failed:', result.errors);
        return { success: false, errors: result.errors };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, errors: [{ message: 'An error occurred during sign up' }] };
    }
  }, [signIn]);

  const signOut = useCallback(async () => {
    try {
      console.log('🔴 Starting sign out process...');
      
      if (accessToken) {
        await customerSignOut(accessToken);
        console.log('✅ Signed out from Shopify API');
      }
      
      // Clear AsyncStorage
      await AsyncStorage.removeItem('customerAccessToken');
      await AsyncStorage.removeItem('userData');
      console.log('✅ Cleared AsyncStorage');
      
      setAccessToken(null);
      setUser(null);
      setIsSignedIn(false);
      
      console.log('✅ Sign out complete');
      
      return { success: true };
    } catch (error) {
      console.error('❌ Sign out error:', error);
      return { success: false };
    }
  }, [accessToken]);

  const refreshUserData = useCallback(async () => {
    if (accessToken) {
      console.log('🔄 Refreshing user data...');
      const userData = await getCustomerData(accessToken);
      if (userData) {
        setUser(userData);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        console.log('✅ User data refreshed');
      }
    }
  }, [accessToken]);

  const updateUserData = useCallback(async (updatedCustomer) => {
    try {
      console.log('📝 Updating user data in context...');
      console.log('Updated customer:', updatedCustomer);
      
      setUser(updatedCustomer);
      await AsyncStorage.setItem('userData', JSON.stringify(updatedCustomer));
      
      console.log('✅ User data updated successfully');
    } catch (error) {
      console.error('❌ Error updating user data:', error);
    }
  }, []);

  const value = {
    isSignedIn,
    user,
    accessToken,
    isLoading,
    signIn,
    signUp,
    signOut,
    refreshUserData,
    updateUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;