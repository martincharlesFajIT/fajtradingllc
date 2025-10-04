import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  FlatList,
  Dimensions,
  Linking,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { fetchMenuByHandle } from '../shopifyApi';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const Header = () => {
  const navigation = useNavigation();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slideAnim] = useState(new Animated.Value(-width * 0.75));
  const [location, setLocation] = useState('Loading...');
  
  // State for submenu
  const [expandedItems, setExpandedItems] = useState({}); // Track which items are expanded
  const [currentView, setCurrentView] = useState('main'); // 'main' or 'submenu'
  const [currentSubmenu, setCurrentSubmenu] = useState(null);

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setIsLoading(true);
        const shopifyMenuLinks = await fetchMenuByHandle('all');

        if (shopifyMenuLinks) {
          setMenuItems(shopifyMenuLinks);
        } else {
          setMenuItems([]);
          setError("No menu found with handle 'all' or no items in it.");
        }
      } catch (err) {
        console.error("Failed to load menu items:", err);
        setError("Failed to load menu items.");
      } finally {
        setIsLoading(false);
      }
    };

    loadMenuItems();
  }, []); 

  useEffect(() => {
    const detectLocation = async () => {
      try {
        const response = await fetch('http://ip-api.com/json/');
        const data = await response.json();
        
        if (data.status === 'success') {
          if (data.city && data.country) {
            setLocation(`${data.city}, ${data.country}`);
          } else if (data.country) {
            setLocation(data.country);
          } else {
            setLocation('Location unavailable');
          }
        } else {
          setLocation('Pakistan');
        }
      } catch (error) {
        console.error('Error detecting location:', error);
        setLocation('Pakistan');
      }
    };

    detectLocation();
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width * 0.75,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isMenuOpen, slideAnim]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Reset menu state when closing
    if (isMenuOpen) {
      setCurrentView('main');
      setCurrentSubmenu(null);
      setExpandedItems({});
    }
  };

  const handleMenuItemPress = (item) => {
    // If item has children, show submenu
    if (item.hasChildren && item.children.length > 0) {
      setCurrentView('submenu');
      setCurrentSubmenu(item);
    } else {
      // No children, handle URL or navigation
      handleUrlNavigation(item);
    }
  };

  const handleUrlNavigation = (item) => {
    if (item.url) {
      // Check if it's a collection URL
      if (item.url.includes('/collections/')) {
        // Extract collection handle from URL
        const parts = item.url.split('/collections/');
        if (parts.length > 1) {
          const collectionHandle = parts[1].split('/')[0].split('?')[0];
          console.log('Navigating to collection:', collectionHandle);
          
          // Navigate to your collection screen
          // navigation.navigate('Collection', { handle: collectionHandle });
          
          // For now, just log it
          console.log('Collection handle:', collectionHandle);
        }
        toggleMenu();
      } else if (item.url.startsWith('http://') || item.url.startsWith('https://')) {
        // External URL - open in browser
        Linking.openURL(item.url);
        toggleMenu();
      } else {
        // Internal URL - handle as needed
        console.log("Internal link pressed:", item.url);
        toggleMenu();
      }
    }
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setCurrentSubmenu(null);
  };

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => handleMenuItemPress(item)}
    >
      <Text style={styles.menuItemText}>{item.title}</Text>
      {item.hasChildren ? (
        <Icon name="chevron-forward" size={20} color="#999" />
      ) : (
        <Icon name="chevron-forward" size={20} color="#ccc" />
      )}
    </TouchableOpacity>
  );

  const renderSubmenuItem = ({ item }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => handleUrlNavigation(item)}
    >
      <Text style={styles.menuItemText}>{item.title}</Text>
      <Icon name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
          <Icon name="menu" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.logo}>FAJ TRADING LLC</Text>
        
        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.iconButton} onPress={handleCartPress}>
            <Icon name="cart-outline" size={28} color="#FFFFFF" />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products"
            placeholderTextColor="#666"
          />
          <TouchableOpacity style={styles.micButton}>
            <Icon name="mic-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.locationSection}>
        <Icon name="location-sharp" size={16} color="#FFFFFF" style={styles.locationIcon} />
        <Text style={styles.locationText}>Deliver to {location}</Text>
        <Icon name="chevron-down" size={14} color="#FFFFFF" />
      </View>

      {/* Side Menu Modal */}
      <Modal
        animationType="none"
        transparent={true}
        visible={isMenuOpen}
        onRequestClose={toggleMenu}
      >
        <View style={styles.menuOverlay}>
          <TouchableOpacity
            style={styles.overlayBackground}
            activeOpacity={1}
            onPress={toggleMenu}
          />
          
          <Animated.View
            style={[
              styles.menuContainer,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <View style={styles.menuHeader}>
              {currentView === 'submenu' && (
                <TouchableOpacity onPress={handleBackToMain} style={styles.backButton}>
                  <Icon name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
              )}
              <Text style={styles.menuTitle}>
                {currentView === 'submenu' && currentSubmenu 
                  ? currentSubmenu.title 
                  : 'Menu'}
              </Text>
              <TouchableOpacity onPress={toggleMenu} style={styles.closeMenuButton}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.menuContent}>
              {isLoading ? (
                <Text style={styles.menuLoadingText}>Loading menu links...</Text>
              ) : error ? (
                <Text style={styles.menuErrorText}>{error}</Text>
              ) : currentView === 'main' ? (
                // Main menu
                menuItems.length > 0 ? (
                  <FlatList
                    data={menuItems}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMenuItem}
                    showsVerticalScrollIndicator={false}
                  />
                ) : (
                  <Text style={styles.menuNoItemsText}>No items found in menu.</Text>
                )
              ) : (
                // Submenu
                currentSubmenu && currentSubmenu.children.length > 0 ? (
                  <FlatList
                    data={currentSubmenu.children}
                    keyExtractor={(item) => item.id}
                    renderItem={renderSubmenuItem}
                    showsVerticalScrollIndicator={false}
                  />
                ) : (
                  <Text style={styles.menuNoItemsText}>No items in this category.</Text>
                )
              )}
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#232F3E',
    paddingTop: Platform.OS === 'ios' ? 0 : 10,
    paddingBottom: 10,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  menuButton: {
    padding: 5,
    marginRight: 10,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff0000ff',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    position: 'relative',
    padding: 5,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF9900',
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
  },
  searchSection: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 45,
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
  micButton: {
    padding: 5,
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
  
  menuOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.75,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 15,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  closeMenuButton: {
    padding: 10,
  },
  menuContent: {
    flex: 1,
    paddingHorizontal: 15,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  menuLoadingText: {
    fontSize: 16,
    color: '#666',
    paddingVertical: 20,
    textAlign: 'center',
  },
  menuErrorText: {
    fontSize: 16,
    color: 'red',
    paddingVertical: 20,
    textAlign: 'center',
  },
  menuNoItemsText: {
    fontSize: 16,
    color: '#666',
    paddingVertical: 20,
    textAlign: 'center',
  },
});

export default Header;