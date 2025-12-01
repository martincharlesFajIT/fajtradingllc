import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  Dimensions,
  Animated,
  FlatList,
  Image,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { predictiveSearch } from '../shopifyApi';
import AuthModal from './AuthModal';
import EditProfileModal from './EditProfileModal';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Icon = ({ name, size, color, style }) => {
  const iconMap = {
    'menu': '☰',

    'search': '🔍',
    'mic-outline': '🎤',
    'location-sharp': '📍',
    'chevron-down': '▼',
    'close': '✕',
    'edit': '✏️',
  };
  return <Text style={[{ fontSize: size, color }, style]}>{iconMap[name] || '?'}</Text>;
};

const { width, height } = Dimensions.get('window');

const Header = () => {
  const navigation = useNavigation();
  const { getCartCount } = useCart();
  const { isSignedIn, user, accessToken, signIn, signUp, signOut, updateUserData } = useAuth();

  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [isEditProfileModalVisible, setIsEditProfileModalVisible] = useState(false);
  const [slideAnim] = useState(() => new Animated.Value(-width));
  // const [location, setLocation] = useState('Loading...');

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const count = getCartCount();
    setCartCount(count);
  }, [getCartCount]);

  // useEffect(() => {
  //   const detectLocation = async () => {
  //     try {
  //       const response = await fetch('http://ip-api.com/json/');
  //       const data = await response.json();

  //       if (data.status === 'success') {
  //         if (data.city && data.country) {
  //           setLocation(`${data.city}, ${data.country}`);
  //         } else if (data.country) {
  //           setLocation(data.country);
  //         } else {
  //           setLocation('Location unavailable');
  //         }
  //       } else {
  //         setLocation('Pakistan');
  //       }
  //     } catch (error) {
  //       console.error('Error detecting location:', error);
  //       setLocation('Pakistan');
  //     }
  //   };

  //   detectLocation();
  // }, []);

  useEffect(() => {
    if (isMenuOpen) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [isMenuOpen]);

  // Debounced search effect
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        handlePredictiveSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const handlePredictiveSearch = async (query) => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const results = await predictiveSearch(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Predictive search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setIsSearchFocused(false);
    }, 200);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    searchInputRef.current?.blur();
  };

  const handleProductSelect = (product) => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
    Keyboard.dismiss();

    navigation.navigate('ProductDetail', {
      productId: product.id,
      productName: product.name
    });
  };

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleCartPress = useCallback(() => {
    navigation.navigate('Cart');
  }, [navigation]);

  const handleSignInPress = useCallback(() => {
    toggleMenu();
    setTimeout(() => {
      setIsAuthModalVisible(true);
    }, 300);
  }, [toggleMenu]);

  const handleEditProfilePress = useCallback(() => {
    toggleMenu();
    setTimeout(() => {
      setIsEditProfileModalVisible(true);
    }, 300);
  }, [toggleMenu]);

  const handleCloseAuthModal = useCallback(() => {
    setIsAuthModalVisible(false);
  }, []);

  const handleCloseEditProfileModal = useCallback(() => {
    setIsEditProfileModalVisible(false);
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut();
    toggleMenu();
  }, [signOut, toggleMenu]);

  const getUserDisplayName = () => {
    if (!user) return 'Guest User';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) return user.firstName;
    return user.email?.split('@')[0] || 'User';
  };

  const getUserInitial = () => {
    if (!user || !user.firstName) return '👤';
    return user.firstName.charAt(0).toUpperCase();
  };

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity
      style={styles.searchResultItem}
      onPress={() => handleProductSelect(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.searchResultImage}
        resizeMode="cover"
      />
      <View style={styles.searchResultInfo}>
        <Text style={styles.searchResultName} numberOfLines={2}>
          {item.name}
        </Text>
        {item.vendor && (
          <Text style={styles.searchResultVendor} numberOfLines={1}>
            {item.vendor}
          </Text>
        )}
        <Text style={styles.searchResultPrice}>{item.price}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <TouchableOpacity
          onPress={toggleMenu}
          style={styles.menuButton}
          activeOpacity={0.7}
        >
          <Icon name="menu" size={28} color="#030303ff" />
        </TouchableOpacity>

        <Image
          source={require('../assets/images/redlogo.webp')}
          style={styles.logoImage}
          resizeMode="contain"
        />

        <View style={styles.rightSection}>
          <TouchableOpacity
      style={styles.iconButton}
      onPress={handleCartPress}
      activeOpacity={0.7}
    >
      <Image
        source={require('../assets/images/cart.png')}
        style={styles.cartIcon}
        resizeMode="contain"
      />
      {cartCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{cartCount}</Text>
        </View>
      )}
    </TouchableOpacity>
        </View>
      </View>

      {/* Search Section with Autocomplete */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={handleClearSearch}
              style={styles.clearButton}
            >
              <Icon name="close" size={18} color="#666" />
            </TouchableOpacity>
          )}
          {isSearching && (
            <ActivityIndicator size="small" color="#000000" style={styles.searchLoader} />
          )}
        </View>

        {/* Search Results Dropdown */}
        {isSearchFocused && searchQuery.length >= 2 && (
          <View style={styles.searchDropdown}>
            {isSearching ? (
              <View style={styles.searchLoadingContainer}>
                <ActivityIndicator size="small" color="#000000" />
                <Text style={styles.searchLoadingText}>Searching...</Text>
              </View>
            ) : searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                renderItem={renderSearchResult}
                keyExtractor={(item) => item.id}
                style={styles.searchResultsList}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>No products found</Text>
                <Text style={styles.noResultsSubtext}>Try different keywords</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Side Menu Modal */}
      <Modal
        visible={isMenuOpen}
        transparent={true}
        animationType="none"
        onRequestClose={toggleMenu}
        statusBarTranslucent={true}
        hardwareAccelerated={true}
      >
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={toggleMenu}
          >
            <View style={styles.overlay} />
          </TouchableOpacity>

          <Animated.View
            style={[
              styles.sideMenu,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
            pointerEvents="box-none"
          >
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Account</Text>
              <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
                <Icon name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.menuContent}>
              <View style={styles.userSection}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>
                    {getUserInitial()}
                  </Text>
                </View>
                <View style={styles.userInfo}>
                  <View style={styles.userNameRow}>
                    <Text style={styles.userName}>{getUserDisplayName()}</Text>
                    {isSignedIn && (
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={handleEditProfilePress}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="pencil-outline" size={16} color="#000000" />
                        <Text style={styles.editButtonText}>Edit</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  {!isSignedIn && (
                    <Text style={styles.userEmail}>Sign in to your account</Text>
                  )}
                  {isSignedIn && user?.email && (
                    <Text style={styles.userEmail}>{user.email}</Text>
                  )}
                </View>
              </View>

              {!isSignedIn ? (
                <TouchableOpacity
                  style={styles.signInButton}
                  onPress={handleSignInPress}
                  activeOpacity={0.7}
                >
                  <Text style={styles.signInButtonText}>Sign In / Sign Up</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.signOutButton}
                  onPress={handleSignOut}
                  activeOpacity={0.7}
                >
                  <Text style={styles.signOutButtonText}>Sign Out</Text>
                </TouchableOpacity>
              )}

              {/* Static Menu Pages */}
              <View style={styles.menuPagesSection}>
                <Text style={styles.menuPagesTitle}>Information</Text>

                <TouchableOpacity
                  style={styles.menuPageItem}
                  onPress={() => {
                    toggleMenu();
                    setTimeout(() => {
                      navigation.navigate('StaticPage', {
                        title: 'Privacy Policy',
                        content: 'privacy'
                      });
                    }, 300);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="lock-closed-outline" size={20} color="#000000" style={styles.menuPageIcon} />
                  <Text style={styles.menuPageText}>Privacy Policy</Text>
                  <Text style={styles.menuPageArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuPageItem}
                  onPress={() => {
                    toggleMenu();
                    setTimeout(() => {
                      navigation.navigate('StaticPage', {
                        title: 'Return and Refund Policy',
                        content: 'return'
                      });
                    }, 300);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="git-compare-outline" size={20} color="#000000" style={styles.menuPageIcon} />
                  <Text style={styles.menuPageText}>Return and Refund Policy</Text>
                  <Text style={styles.menuPageArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuPageItem}
                  onPress={() => {
                    toggleMenu();
                    setTimeout(() => {
                      navigation.navigate('StaticPage', {
                        title: 'Terms & Conditions',
                        content: 'terms'
                      });
                    }, 300);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="document-text-outline" size={20} color="#000000" style={styles.menuPageIcon} />
                  <Text style={styles.menuPageText}>Terms & Conditions</Text>
                  <Text style={styles.menuPageArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuPageItem}
                  onPress={() => {
                    toggleMenu();
                    setTimeout(() => {
                      navigation.navigate('StaticPage', {
                        title: 'Bulk Orders Inquiries',
                        content: 'bulk'
                      });
                    }, 300);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="logo-dropbox" size={20} color="#000000" style={styles.menuPageIcon} />
                  <Text style={styles.menuPageText}>Bulk Orders Inquiries</Text>
                  <Text style={styles.menuPageArrow}>›</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Auth Modal */}
      <AuthModal
        visible={isAuthModalVisible}
        onClose={handleCloseAuthModal}
        onSignIn={signIn}
        onSignUp={signUp}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={isEditProfileModalVisible}
        onClose={handleCloseEditProfileModal}
        user={user}
        accessToken={accessToken}
        onProfileUpdated={updateUserData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffffff',
    paddingTop: Platform.OS === 'ios' ? 50 : 10,
    paddingBottom: 10,
     borderBottomWidth: 1,
    borderBottomColor: '#474747ff',
  },
 topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    height: 100,
  },
  menuButton: {
    padding: 8,
    width: 44,
  },
  logoImage: {
    width: 220, 
    height: 70,
    position: 'absolute',
    left: '50%',
    marginLeft: -100,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 44,
  },
  iconButton: {
    position: 'relative',
    padding: 8,
  },
  cartIcon: {
  width: 28,
  height: 28,
  tintColor: '#000000',
},
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FF0000',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 4,
  },
  searchSection: {
    paddingHorizontal: 15,
    paddingBottom: 10,
    paddingTop: 5,
    position: 'relative',
    zIndex: 1000,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 45,
    borderWidth: 2,
    borderColor: '#000000',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  searchLoader: {
    marginLeft: 8,
  },
  searchDropdown: {
    position: 'absolute',
    top: 55,
    left: 15,
    right: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    maxHeight: height * 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1001,
  },
  searchResultsList: {
    maxHeight: height * 0.5,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchResultImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: '#F0F0F0',
    marginRight: 12,
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#232F3E',
    marginBottom: 4,
  },
  searchResultVendor: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  searchResultPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  searchLoadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  searchLoadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  noResultsContainer: {
    padding: 30,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#232F3E',
    marginBottom: 5,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#999',
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 5,
  },
  locationIcon: {
    marginRight: 5,
  },
  locationText: {
    color: '#FFFFFF',
    fontSize: 14,
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sideMenu: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.80,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  menuContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F8F8',
  },
  userAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#c7c7c7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userAvatarText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#232F3E',
    flex: 1,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe5e0ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 10,
  },
  editButtonText: {
    fontSize: 13,
    color: '#FF9900',
    fontWeight: '600',
    marginLeft: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  signInButton: {
    backgroundColor: '#000000',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signOutButton: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  signOutButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuPagesSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  menuPagesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#232F3E',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  menuPageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  menuPageIcon: {
    marginRight: 15,
  },
  menuPageText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  menuPageArrow: {
    fontSize: 20,
    color: '#999',
  },
});

export default Header;