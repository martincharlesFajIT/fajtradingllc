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

// Adjust path if necessary. Now importing fetchMenuByHandle
import { fetchMenuByHandle } from '../shopifyApi';

const { width } = Dimensions.get('window');

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slideAnim] = useState(new Animated.Value(-width * 0.75));

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
        setError("Failed to load menu items. Please check your Shopify API and menu handle.");
      } finally {
        setIsLoading(false);
      }
    };

    loadMenuItems();
  }, []); 

  // Animate menu open/close
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
  };

  const handleMenuItemPress = (item) => {
    if (item.url) {
      if (item.url.startsWith('http://') || item.url.startsWith('https://')) {
        Linking.openURL(item.url);
      } else {
        console.log("Internal link pressed:", item.url);
      }
    }
    toggleMenu();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        {/* Menu Toggle Button */}
        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        <Text style={styles.logo}>FAJ TRADING LLC</Text>
        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.icon}>🛒</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search section */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Amazon"
            placeholderTextColor="#666"
          />
          <TouchableOpacity style={styles.micButton}>
            <Text style={styles.micIcon}>🎤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Location section */}
      <View style={styles.locationSection}>
        <Text style={styles.locationIcon}>📍</Text>
        <Text style={styles.locationText}>Deliver to Pakistan</Text>
        <Text style={styles.dropdownIcon}>▼</Text>
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
          
          {/* Animated Menu Container */}
          <Animated.View
            style={[
              styles.menuContainer,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menu</Text>
              <TouchableOpacity onPress={toggleMenu} style={styles.closeMenuButton}>
                <Text style={styles.closeMenuIcon}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.menuContent}>
              {isLoading ? (
                <Text style={styles.menuLoadingText}>Loading menu links...</Text>
              ) : error ? (
                <Text style={styles.menuErrorText}>{error}</Text>
              ) : menuItems.length > 0 ? (
                <FlatList
                  data={menuItems}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => handleMenuItemPress(item)}
                    >
                      <Text style={styles.menuItemText}>{item.title}</Text>
                      <Text style={styles.menuItemArrow}>›</Text>
                    </TouchableOpacity>
                  )}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <Text style={styles.menuNoItemsText}>No items found in the 'All' menu.</Text>
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
  menuIcon: {
    fontSize: 28,
    color: '#FFFFFF',
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
  icon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF9900',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
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
    paddingHorizontal: 10,
    height: 45,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
    color: '#666',
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
  micIcon: {
    fontSize: 16,
    color: '#666',
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 5,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 5,
    color: '#FFFFFF',
  },
  locationText: {
    color: '#FFFFFF',
    fontSize: 14,
    flex: 1,
  },
  dropdownIcon: {
    color: '#FFFFFF',
    fontSize: 12,
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
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  closeMenuButton: {
    padding: 10,
  },
  closeMenuIcon: {
    fontSize: 20,
    color: '#333',
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
  menuItemArrow: {
    fontSize: 18,
    color: '#999',
    marginLeft: 10,
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