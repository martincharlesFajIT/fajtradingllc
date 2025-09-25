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
  Linking, // Import Linking for opening URLs
} from 'react-native';

// Adjust path if necessary. Now importing fetchMenuByHandle
import { fetchMenuByHandle } from '../shopifyApi';

const { width } = Dimensions.get('window');

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]); // This will now hold actual menu links
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setIsLoading(true);
        const shopifyMenuLinks = await fetchMenuByHandle('all');

        if (shopifyMenuLinks) {
          setMenuItems(shopifyMenuLinks);
        } else {
          setMenuItems([]); // Ensure it's an empty array if null is returned
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemPress = (item) => {
    if (item.url) {
      // You'll need more advanced logic here if you want to navigate
      // within your app for certain URLs (e.g., /products, /collections)
      // For now, it will open external links or do nothing for internal ones.
      if (item.url.startsWith('http://') || item.url.startsWith('https://')) {
        Linking.openURL(item.url);
      } else {
        // Handle internal app navigation if needed, e.g.,
        // navigate('ProductScreen', { productId: item.url.split('/').pop() });
        console.log("Internal link pressed:", item.url);
      }
    }
    toggleMenu(); // Close menu after item is pressed
  };

  return (
    <View style={styles.container}>
      {/* Top section with menu button, logo and cart */}
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

      {/* Toggle Menu */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isMenuOpen}
        onRequestClose={toggleMenu}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPressOut={toggleMenu}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity onPress={toggleMenu} style={styles.closeMenuButton}>
              <Text style={styles.closeMenuIcon}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.menuTitle}>Menu</Text> {/* Changed title from "All Products" */}
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
                    onPress={() => handleMenuItemPress(item)} // Handle press
                  >
                    <Text style={styles.menuItemText}>{item.title}</Text> {/* Display item.title */}
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text style={styles.menuNoItemsText}>No items found in the 'All' menu.</Text>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// Styles remain the same, no changes needed for styles.
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menuContainer: {
    width: width * 0.75,
    height: '100%',
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeMenuButton: {
    alignSelf: 'flex-end',
    padding: 10,
    marginBottom: 20,
  },
  closeMenuIcon: {
    fontSize: 24,
    color: '#333',
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    fontSize: 18,
    color: '#333',
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