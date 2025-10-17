import React, { useState, useEffect } from 'react';
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
  Alert,
} from 'react-native';
import { customerPasswordChange, customerUpdate } from '../shopifyApi';

const { width, height } = Dimensions.get('window');

const Icon = ({ name, size, color }) => {
  const iconMap = {
    'close': '✕',
    'eye': '👁',
    'eye-off': '🙈',
    'user': '👤',
  };
  return <Text style={{ fontSize: size, color }}>{iconMap[name] || '?'}</Text>;
};

const EditProfileModal = ({ visible, onClose, user, accessToken, onProfileUpdated }) => {
  // Name fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Debug props when modal opens
  useEffect(() => {
    if (visible) {
      console.log('=== EDIT PROFILE MODAL OPENED ===');
      console.log('User:', user);
      console.log('Access Token Type:', typeof accessToken);
      console.log('Access Token exists:', !!accessToken);
      console.log('Access Token length:', accessToken?.length);
      console.log('Access Token value (first 50 chars):', accessToken?.substring(0, 50));
      console.log('==================================');
    }
  }, [visible, accessToken, user]);

  // Load user data when modal opens
  useEffect(() => {
    if (visible && user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
    }
  }, [visible, user]);

  const resetForm = () => {
    setFirstName(user?.firstName || '');
    setLastName(user?.lastName || '');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors([]);
    setSuccessMessage('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    console.log('=== HANDLE SAVE STARTED ===');
    setErrors([]);
    setSuccessMessage('');

    // Detailed token check
    console.log('Access Token check:');
    console.log('- Exists:', !!accessToken);
    console.log('- Type:', typeof accessToken);
    console.log('- Is string:', typeof accessToken === 'string');
    console.log('- Length:', accessToken?.length);
    console.log('- Value (first 50):', accessToken?.substring(0, 50));

    // Check if access token exists and is valid
    if (!accessToken || typeof accessToken !== 'string' || accessToken.trim() === '') {
      console.error('❌ Invalid access token');
      setErrors([{ message: 'Session expired. Please sign in again.' }]);
      
      Alert.alert(
        'Session Expired',
        'Your session has expired. Please sign in again.',
        [
          {
            text: 'OK',
            onPress: () => handleClose()
          }
        ]
      );
      return;
    }

    const nameChanged = firstName !== user?.firstName || lastName !== user?.lastName;
    const passwordFieldsFilled = currentPassword || newPassword || confirmPassword;

    console.log('Changes detected:');
    console.log('- Name changed:', nameChanged);
    console.log('- Password fields filled:', passwordFieldsFilled);

    // Check if user is trying to change anything
    if (!nameChanged && !passwordFieldsFilled) {
      setErrors([{ message: 'No changes to save' }]);
      return;
    }

    // Validate name changes
    if (nameChanged) {
      if (!firstName.trim()) {
        setErrors([{ message: 'First name is required' }]);
        return;
      }
      if (!lastName.trim()) {
        setErrors([{ message: 'Last name is required' }]);
        return;
      }
    }

    // Validate password changes
    if (passwordFieldsFilled) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        setErrors([{ message: 'Please fill in all password fields to change password' }]);
        return;
      }

      if (newPassword.length < 5) {
        setErrors([{ message: 'New password must be at least 5 characters' }]);
        return;
      }

      if (newPassword !== confirmPassword) {
        setErrors([{ message: 'New passwords do not match' }]);
        return;
      }

      if (currentPassword === newPassword) {
        setErrors([{ message: 'New password must be different from current password' }]);
        return;
      }
    }

    setIsLoading(true);

    try {
      let updateSuccess = false;
      let passwordSuccess = false;

      // Update name if changed
      if (nameChanged) {
        console.log('🔄 Updating name...');
        console.log('Calling customerUpdate with:');
        console.log('- Access Token:', accessToken.substring(0, 50) + '...');
        console.log('- First Name:', firstName.trim());
        console.log('- Last Name:', lastName.trim());
        
        const nameResult = await customerUpdate(accessToken, firstName.trim(), lastName.trim());
        
        console.log('Name update result:', nameResult);
        
        if (nameResult.success) {
          updateSuccess = true;
          console.log('✅ Name updated successfully');
          console.log('Updated customer data:', nameResult.customer);
          
          // Call the callback to update user data in AuthContext
          if (onProfileUpdated) {
            console.log('Calling onProfileUpdated callback...');
            onProfileUpdated(nameResult.customer);
          }
        } else {
          console.error('❌ Name update failed');
          console.error('Errors:', nameResult.errors);
          
          // Check for specific error types
          const errorMessage = nameResult.errors?.[0]?.message || 'Failed to update name';
          
          if (errorMessage.toLowerCase().includes('token') || 
              errorMessage.toLowerCase().includes('expired') ||
              errorMessage.toLowerCase().includes('invalid')) {
            setErrors([{ message: 'Your session has expired. Please sign in again.' }]);
            
            Alert.alert(
              'Session Expired',
              'Your session has expired. Please sign in again.',
              [{ text: 'OK', onPress: () => handleClose() }]
            );
          } else {
            setErrors(nameResult.errors || [{ message: 'Failed to update name' }]);
          }
          
          setIsLoading(false);
          return;
        }
      }

      // Update password if fields are filled
      if (passwordFieldsFilled) {
        console.log('🔄 Updating password...');
        console.log('Calling customerPasswordChange...');
        
        const passwordResult = await customerPasswordChange(accessToken, newPassword);
        
        console.log('Password update result:', passwordResult);
        
        if (passwordResult.success) {
          passwordSuccess = true;
          console.log('✅ Password updated successfully');
        } else {
          console.error('❌ Password update failed');
          console.error('Errors:', passwordResult.errors);
          
          const errorMessage = passwordResult.errors?.[0]?.message || 'Failed to update password';
          
          if (errorMessage.toLowerCase().includes('token') || 
              errorMessage.toLowerCase().includes('expired') ||
              errorMessage.toLowerCase().includes('invalid')) {
            setErrors([{ message: 'Your session has expired. Please sign in again.' }]);
            
            Alert.alert(
              'Session Expired',
              'Your session has expired. Please sign in again.',
              [{ text: 'OK', onPress: () => handleClose() }]
            );
          } else {
            setErrors(passwordResult.errors || [{ message: 'Failed to update password' }]);
          }
          
          setIsLoading(false);
          return;
        }
      }

      // Show success message
      if (updateSuccess && passwordSuccess) {
        setSuccessMessage('Profile and password updated successfully!');
      } else if (updateSuccess) {
        setSuccessMessage('Profile updated successfully!');
      } else if (passwordSuccess) {
        setSuccessMessage('Password updated successfully!');
      }

      console.log('✅ Update completed successfully');
      console.log('=== HANDLE SAVE FINISHED ===');

      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (error) {
      console.error('❌ Exception in handleSave:', error);
      console.error('Error stack:', error.stack);
      setErrors([{ message: 'Failed to update profile. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserInitial = () => {
    if (!user) return '?';
    if (user.firstName) return user.firstName.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return '?';
  };

  const getUserDisplayName = () => {
    if (!user) return 'User';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) return user.firstName;
    if (user.email) return user.email.split('@')[0];
    return 'User';
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
                <Text style={styles.headerTitle}>Edit Profile</Text>
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
                {/* User Avatar Section */}
                <View style={styles.avatarSection}>
                  <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{getUserInitial()}</Text>
                    </View>
                    <View style={styles.avatarBadge}>
                      <Icon name="user" size={16} color="#FFFFFF" />
                    </View>
                  </View>
                  <Text style={styles.displayName}>{getUserDisplayName()}</Text>
                </View>

                {/* Success Message */}
                {successMessage && (
                  <View style={styles.successContainer}>
                    <Text style={styles.successText}>✓ {successMessage}</Text>
                  </View>
                )}

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

                {/* Profile Information Section */}
                <View style={styles.sectionDivider}>
                  <Text style={styles.sectionTitle}>Profile Information</Text>
                </View>

                {/* First Name */}
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

                {/* Last Name */}
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

                {/* Email Field (Read-only) */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <View style={[styles.input, styles.inputDisabled]}>
                    <Text style={styles.inputDisabledText}>
                      {user?.email || 'No email'}
                    </Text>
                  </View>
                  <Text style={styles.helperText}>Email cannot be changed</Text>
                </View>

                {/* Divider */}
                <View style={styles.sectionDivider}>
                  <Text style={styles.sectionTitle}>Change Password (Optional)</Text>
                </View>

                {/* Current Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Current Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Enter current password"
                      placeholderTextColor="#999"
                      value={currentPassword}
                      onChangeText={setCurrentPassword}
                      secureTextEntry={!showCurrentPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity
                      onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                      style={styles.eyeButton}
                    >
                      <Icon
                        name={showCurrentPassword ? 'eye' : 'eye-off'}
                        size={20}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* New Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>New Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Enter new password"
                      placeholderTextColor="#999"
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry={!showNewPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity
                      onPress={() => setShowNewPassword(!showNewPassword)}
                      style={styles.eyeButton}
                    >
                      <Icon
                        name={showNewPassword ? 'eye' : 'eye-off'}
                        size={20}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.helperText}>
                    Must be at least 5 characters
                  </Text>
                </View>

                {/* Confirm New Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirm New Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Confirm new password"
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

                {/* Save Button */}
                <TouchableOpacity
                  style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                  onPress={handleSave}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  )}
                </TouchableOpacity>

                {/* Cancel Button */}
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleClose}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ... keep all your existing styles ...

const styles = StyleSheet.create({
  // ... (all your existing styles remain the same)
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
    maxHeight: height * 0.90,
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
    maxHeight: height * 0.70,
  },
  scrollContent: {
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 25,
    paddingVertical: 20,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF9900',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  displayName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#232F3E',
  },
  successContainer: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  successText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '600',
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
  inputDisabled: {
    backgroundColor: '#E8E8E8',
  },
  inputDisabledText: {
    fontSize: 16,
    color: '#666',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
    fontStyle: 'italic',
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
  sectionDivider: {
    marginVertical: 25,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#232F3E',
    textAlign: 'center',
  },
  saveButton: {
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
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#D0D0D0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditProfileModal;