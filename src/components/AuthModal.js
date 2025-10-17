import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const Icon = ({ name, size, color }) => {
  const iconMap = {
    'close': '✕',
    'eye': '👁',
    'eye-off': '🙈',
  };
  return <Text style={{ fontSize: size, color }}>{iconMap[name] || '?'}</Text>;
};

const AuthModal = ({ visible, onClose, onSignIn, onSignUp }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setConfirmPassword('');
    setErrors([]);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
  setErrors([]);

  // Validation
  if (!email || !password) {
    setErrors([{ message: 'Please fill in all required fields' }]);
    return;
  }

  if (!validateEmail(email)) {
    setErrors([{ message: 'Please enter a valid email address' }]);
    return;
  }

  if (!isSignIn) {
    if (!firstName || !lastName) {
      setErrors([{ message: 'Please fill in all required fields' }]);
      return;
    }

    if (password.length < 5) {
      setErrors([{ message: 'Password must be at least 5 characters' }]);
      return;
    }

    if (password !== confirmPassword) {
      setErrors([{ message: 'Passwords do not match' }]);
      return;
    }
  }

  setIsLoading(true);

  try {
    let result;
    
    if (isSignIn) {
      console.log('Attempting sign in with:', email);
      result = await onSignIn(email, password);
      console.log('Sign in result:', result);
    } else {
      console.log('Attempting sign up with:', email);
      result = await onSignUp(email, password, firstName, lastName);
      console.log('Sign up result:', result);
    }

    if (result.success) {
      console.log('Authentication successful');
      resetForm();
      onClose();
    } else {
      console.error('Authentication failed:', result.errors);
      
      // Format error messages for better display
      const errorMessages = result.errors.map(error => {
        // Handle specific error codes
        if (error.code === 'UNIDENTIFIED_CUSTOMER') {
          return { 
            message: isSignIn 
              ? 'Invalid email or password. Please check your credentials.' 
              : 'This account already exists. Please sign in instead.'
          };
        }
        if (error.code === 'CUSTOMER_DISABLED') {
          return { message: 'This account has been disabled. Please contact support.' };
        }
        if (error.code === 'TAKEN') {
          return { message: 'This email is already registered. Please sign in instead.' };
        }
        if (error.code === 'TOO_SHORT') {
          return { message: 'Password is too short. Please use at least 5 characters.' };
        }
        
       
        return { message: error.message || 'An error occurred' };
      });
      
      setErrors(errorMessages);
    }
  } catch (error) {
    console.error('Exception during authentication:', error);
    setErrors([{ message: 'An unexpected error occurred. Please try again.' }]);
  } finally {
    setIsLoading(false);
  }
};

  const toggleMode = () => {
    setIsSignIn(!isSignIn);
    setErrors([]);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={handleClose}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>
                  {isSignIn ? 'Sign In' : 'Create Account'}
                </Text>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <Icon name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {/* Error Messages */}
                {errors.length > 0 && (
                  <View style={styles.errorContainer}>
                    {errors.map((error, index) => (
                      <Text key={index} style={styles.errorText}>
                        {error.message}
                      </Text>
                    ))}
                  </View>
                )}

                {/* Sign Up Fields */}
                {!isSignIn && (
                  <>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>First Name *</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your first name"
                        placeholderTextColor="#999"
                        value={firstName}
                        onChangeText={setFirstName}
                        autoCapitalize="words"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Last Name *</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your last name"
                        placeholderTextColor="#999"
                        value={lastName}
                        onChangeText={setLastName}
                        autoCapitalize="words"
                      />
                    </View>
                  </>
                )}

                {/* Email */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {/* Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password *</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Enter your password"
                      placeholderTextColor="#999"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                    >
                      <Icon
                        name={showPassword ? 'eye' : 'eye-off'}
                        size={20}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Confirm Password (Sign Up only) */}
                {!isSignIn && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Confirm Password *</Text>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        style={styles.passwordInput}
                        placeholder="Confirm your password"
                        placeholderTextColor="#999"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <TouchableOpacity
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={styles.eyeButton}
                      >
                        <Icon
                          name={showConfirmPassword ? 'eye' : 'eye-off'}
                          size={20}
                          color="#666"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Submit Button */}
                <TouchableOpacity
                  style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.submitButtonText}>
                      {isSignIn ? 'Sign In' : 'Create Account'}
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Toggle Mode */}
                <View style={styles.toggleContainer}>
                  <Text style={styles.toggleText}>
                    {isSignIn ? "Don't have an account? " : 'Already have an account? '}
                  </Text>
                  <TouchableOpacity onPress={toggleMode}>
                    <Text style={styles.toggleLink}>
                      {isSignIn ? 'Sign Up' : 'Sign In'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 450,
    maxHeight: height * 0.85,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#F8F8F8',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#232F3E',
  },
  closeButton: {
    padding: 5,
  },
  scrollView: {
    maxHeight: height * 0.65,
  },
  scrollContent: {
    padding: 20,
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF0000',
  },
  errorText: {
    color: '#CC0000',
    fontSize: 14,
    marginBottom: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#F8F8F8',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  eyeButton: {
    padding: 10,
  },
  submitButton: {
    backgroundColor: '#FF9900',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  toggleText: {
    fontSize: 14,
    color: '#666',
  },
  toggleLink: {
    fontSize: 14,
    color: '#FF9900',
    fontWeight: 'bold',
  },
  
});

export default AuthModal;