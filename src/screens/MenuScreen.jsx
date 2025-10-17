import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchMenuByHandle } from '../shopifyApi';

const MenuScreen = () => {
  const navigation = useNavigation();
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      setIsLoading(true);
      const shopifyMenuLinks = await fetchMenuByHandle('all');

      if (shopifyMenuLinks) {
        console.log('✅ Menu items loaded:', shopifyMenuLinks.length);
        setMenuItems(shopifyMenuLinks);
      } else {
        setMenuItems([]);
        setError("No menu found");
      }
    } catch (err) {
      console.error("❌ Failed to load menu items:", err);
      setError("Failed to load menu items.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleMenuItemPress = (item) => {
    console.log('📋 Menu item pressed:', item.title);
    console.log('URL:', item.url);
    console.log('Has children:', item.hasChildren);

    // If item has children, toggle expansion
    if (item.hasChildren && item.children.length > 0) {
      toggleExpand(item.id);
      return;
    }

    // If item has a URL, navigate to collection
    if (item.url) {
      handleNavigation(item);
    }
  };

  const handleNavigation = (item) => {
    console.log('🔗 Navigating for item:', item.title);
    console.log('URL:', item.url);

    // Check if it's a collection URL
    if (item.url.includes('/collections/')) {
      const parts = item.url.split('/collections/');
      if (parts.length > 1) {
        const collectionHandle = parts[1].split('/')[0].split('?')[0];
        console.log('✅ Navigating to collection:', collectionHandle);
        
        navigation.navigate('CollectionProducts', {
          handle: collectionHandle,
          title: item.title
        });
      }
    } else {
      console.log('⚠️ URL is not a collection:', item.url);
    }
  };

  const renderMenuItem = ({ item, depth = 0 }) => {
    const isExpanded = expandedItems[item.id];
    const hasChildren = item.hasChildren && item.children.length > 0;

    return (
      <View>
        <TouchableOpacity
          style={[
            styles.menuItem,
            { paddingLeft: 20 + (depth * 20) }
          ]}
          onPress={() => handleMenuItemPress(item)}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemContent}>
            <Text style={[
              styles.menuItemText,
              depth > 0 && styles.subMenuItemText
            ]}>
              {item.title}
            </Text>
            {hasChildren && (
              <Text style={styles.chevron}>
                {isExpanded ? '▼' : '›'}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Render children if expanded */}
        {hasChildren && isExpanded && (
          <View>
            {item.children.map((child) => (
              <View key={child.id}>
                {renderMenuItem({ item: child, depth: depth + 1 })}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Categories</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9900" />
          <Text style={styles.loadingText}>Loading menu...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Categories</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadMenuItems}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categories</Text>
      </View>

      {/* Menu List */}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderMenuItem({ item, depth: 0 })}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#232F3E',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF9900',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    paddingTop: 10,
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#232F3E',
    fontWeight: '500',
    flex: 1,
  },
  subMenuItemText: {
    fontSize: 15,
    color: '#555',
    fontWeight: '400',
  },
  chevron: {
    fontSize: 16,
    color: '#999',
    marginLeft: 10,
  },
});

export default MenuScreen;