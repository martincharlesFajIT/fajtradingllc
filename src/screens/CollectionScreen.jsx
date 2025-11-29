import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchProductsByCollection, fetchCollectionByHandle, fetchSidebarMenu } from '../shopifyApi';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width } = Dimensions.get('window');

const CollectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { handle, title } = route.params;

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [collectionInfo, setCollectionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [endCursor, setEndCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Filter states
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 1000 },
    selectedBrands: [],
    selectedMenuItems: [],
  });
  const [tempFilters, setTempFilters] = useState(filters);
  
  // Available filter options
  const [availableBrands, setAvailableBrands] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  
  // Price slider state
  const [sliderValues, setSliderValues] = useState({ min: 0, max: 1000 });
  const [activeSlider, setActiveSlider] = useState(null);

  const loadCollectionData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [collectionData, productData, sidebarMenuData] = await Promise.all([
        fetchCollectionByHandle(handle),
        fetchProductsByCollection(handle, 50), // Fetch more products for filtering
        fetchSidebarMenu()
      ]);

      setCollectionInfo(collectionData);
      setProducts(productData.products);
      setFilteredProducts(productData.products);
      setHasNextPage(productData.hasNextPage);
      setEndCursor(productData.endCursor);

      // Set menu items if available
      if (sidebarMenuData && sidebarMenuData.length > 0) {
        console.log('Sidebar Menu Data received:', JSON.stringify(sidebarMenuData, null, 2));
        // Find menu items that match current collection
        const relevantMenuItems = findRelevantMenuItems(sidebarMenuData, handle);
        console.log('Setting menu items:', relevantMenuItems.length);
        setMenuItems(relevantMenuItems);
      } else {
        console.log('No sidebar menu data received');
        setMenuItems([]);
      }

      // Extract unique brands from products
      const brands = [...new Set(productData.products
        .map(p => p.brand)
        .filter(b => b && b.trim() !== '')
      )].sort();
      setAvailableBrands(brands);

      // Calculate price range
      const prices = productData.products.map(p => parseFloat(p.priceAmount));
      const minPrice = Math.floor(Math.min(...prices));
      const maxPrice = Math.ceil(Math.max(...prices));
      setPriceRange({ min: minPrice, max: maxPrice });
      setSliderValues({ min: minPrice, max: maxPrice });
      setFilters(prev => ({
        ...prev,
        priceRange: { min: minPrice, max: maxPrice }
      }));
      setTempFilters(prev => ({
        ...prev,
        priceRange: { min: minPrice, max: maxPrice }
      }));

    } catch (error) {
      console.error('Error loading collection data:', error);
      Alert.alert(
        'Error',
        'Failed to load collection data. Please try again.',
        [
          { text: 'Retry', onPress: () => loadCollectionData() },
          { text: 'Go Back', onPress: () => navigation.goBack() }
        ]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadMoreProducts = async () => {
    if (!hasNextPage || loadingMore) return;

    setLoadingMore(true);
    try {
      const moreData = await fetchProductsByCollection(handle, 50, endCursor);

      const newProducts = [...products, ...moreData.products];
      setProducts(newProducts);
      setHasNextPage(moreData.hasNextPage);
      setEndCursor(moreData.endCursor);

      // Update available brands
      const brands = [...new Set(newProducts
        .map(p => p.brand)
        .filter(b => b && b.trim() !== '')
      )].sort();
      setAvailableBrands(brands);

      // Reapply filters
      applyFilters(filters, newProducts);

    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadCollectionData();
  }, [handle]);

  // Apply filters whenever filters change
  useEffect(() => {
    applyFilters(filters, products);
  }, [filters, products]);

  const applyFilters = (currentFilters, productList = products) => {
    let filtered = [...productList];

    // Price filter
    const minPrice = currentFilters.priceRange.min;
    const maxPrice = currentFilters.priceRange.max;
    
    filtered = filtered.filter(product => {
      const price = parseFloat(product.priceAmount);
      return price >= minPrice && price <= maxPrice;
    });

    // Brand filter
    if (currentFilters.selectedBrands.length > 0) {
      filtered = filtered.filter(product => 
        currentFilters.selectedBrands.includes(product.brand)
      );
    }

    // Menu/Category filter
    if (currentFilters.selectedMenuItems.length > 0) {
      console.log('=== CATEGORY FILTER ===');
      console.log('Selected categories:', currentFilters.selectedMenuItems);
      
      filtered = filtered.filter(product => {
        // Get all collection handles for this product
        const productCollectionHandles = product.collections?.map(c => c.handle) || [];
        const productCollectionTitles = product.collections?.map(c => c.title) || [];
        
        console.log(`Product: ${product.name}`);
        console.log('  Collections:', productCollectionHandles);
        console.log('  Titles:', productCollectionTitles);
        
        // Check if any of the product's collections match selected menu items
        // Match by either title or handle
        const matches = currentFilters.selectedMenuItems.some(selectedItem => {
          // Try to match by title
          const titleMatch = productCollectionTitles.some(title => 
            title.toLowerCase() === selectedItem.toLowerCase()
          );
          
          // Try to match by handle (convert title to handle format)
          const selectedHandle = selectedItem.toLowerCase().replace(/\s+/g, '-');
          const handleMatch = productCollectionHandles.includes(selectedHandle);
          
          return titleMatch || handleMatch;
        });
        
        console.log('  Matches:', matches);
        return matches;
      });
      
      console.log(`Filtered to ${filtered.length} products`);
      console.log('=== END ===');
    }

    setFilteredProducts(filtered);
  };

  const onRefresh = () => {
    loadCollectionData(true);
  };

  const openFilterModal = () => {
    setTempFilters(filters);
    setShowFilterModal(true);
  };

  const applyFilterChanges = () => {
    setFilters(tempFilters);
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    const emptyFilters = {
      priceRange: { min: priceRange.min, max: priceRange.max },
      selectedBrands: [],
      selectedMenuItems: [],
    };
    setTempFilters(emptyFilters);
    setFilters(emptyFilters);
    setSliderValues({ min: priceRange.min, max: priceRange.max });
    setShowFilterModal(false);
  };

  const toggleBrand = (brand) => {
    setTempFilters(prev => ({
      ...prev,
      selectedBrands: prev.selectedBrands.includes(brand)
        ? prev.selectedBrands.filter(b => b !== brand)
        : [...prev.selectedBrands, brand]
    }));
  };

  const toggleMenuItem = (item) => {
    setTempFilters(prev => ({
      ...prev,
      selectedMenuItems: prev.selectedMenuItems.includes(item)
        ? prev.selectedMenuItems.filter(i => i !== item)
        : [...prev.selectedMenuItems, item]
    }));
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.priceRange.min !== priceRange.min || filters.priceRange.max !== priceRange.max) count++;
    if (filters.selectedBrands.length > 0) count += filters.selectedBrands.length;
    if (filters.selectedMenuItems.length > 0) count += filters.selectedMenuItems.length;
    return count;
  };

  // Price slider handlers with better touch handling
  const handleSliderTouch = (event, isMin) => {
    const { locationX } = event.nativeEvent;
    const sliderWidth = width - 80; // Account for padding
    const percentage = Math.max(0, Math.min(1, locationX / sliderWidth));
    const value = Math.round(priceRange.min + (priceRange.max - priceRange.min) * percentage);
    
    if (isMin) {
      if (value <= sliderValues.max) {
        setSliderValues(prev => ({ ...prev, min: value }));
        setTempFilters(prev => ({
          ...prev,
          priceRange: { ...prev.priceRange, min: value }
        }));
      }
    } else {
      if (value >= sliderValues.min) {
        setSliderValues(prev => ({ ...prev, max: value }));
        setTempFilters(prev => ({
          ...prev,
          priceRange: { ...prev.priceRange, max: value }
        }));
      }
    }
  };

  const handleSliderStart = (isMin) => {
    setActiveSlider(isMin ? 'min' : 'max');
  };

  const handleSliderEnd = () => {
    setActiveSlider(null);
  };

  // Helper function to find relevant menu items for current collection
  const findRelevantMenuItems = (menuData, currentHandle) => {
    console.log('=== FINDING MENU ITEMS ===');
    console.log('Current Collection Handle:', currentHandle);
    
    if (!menuData || menuData.length === 0) {
      console.log('No menu data available');
      return [];
    }
    
    let relevantItems = [];
    
    // Recursive search function
    const searchInMenu = (items) => {
      for (const item of items) {
        // Extract handle from URL
        let itemHandle = null;
        if (item.url) {
          const match = item.url.match(/\/collections\/([^/?]+)/);
          if (match) {
            itemHandle = match[1];
          }
        }
        
        // Use handle property if available
        if (!itemHandle && item.handle) {
          itemHandle = item.handle;
        }
        
        console.log(`Menu Item: "${item.title}", Handle: "${itemHandle}", Has Children: ${item.children?.length || 0}`);
        
        // Check if this menu item matches the current collection
        if (itemHandle === currentHandle) {
          console.log(`✅ MATCH FOUND! "${item.title}"`);
          
          // Return all children of this item
          if (item.children && item.children.length > 0) {
            console.log(`Returning ${item.children.length} subcategories:`);
            item.children.forEach(child => {
              console.log(`  - ${child.title}`);
            });
            return item.children;
          } else {
            console.log('⚠️ No children found for this menu item');
            return [];
          }
        }
        
        // If current item has children, search recursively
        if (item.children && item.children.length > 0) {
          const foundInChildren = searchInMenu(item.children);
          if (foundInChildren.length > 0) {
            return foundInChildren;
          }
        }
      }
      
      return [];
    };
    
    relevantItems = searchInMenu(menuData);
    
    console.log(`=== RESULT: ${relevantItems.length} categories found ===`);
    return relevantItems;
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.productItem}
      onPress={() => {
        navigation.navigate('ProductDetail', {
          productId: item.id,
          productName: item.name
        });
      }}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        {item.brand && (
          <Text style={styles.productBrand} numberOfLines={1}>
            {item.brand}
          </Text>
        )}
        <Text style={styles.productPrice}>
          {item.price}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {collectionInfo?.image && (
        <Image 
          source={{ uri: collectionInfo.image }} 
          style={styles.collectionImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.headerTextContainer}>
        <Text style={styles.collectionTitle}>
          {collectionInfo?.title || title}
        </Text>
        <View style={styles.productCountRow}>
          <Text style={styles.productCount}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
            {getActiveFilterCount() > 0 && ` (${getActiveFilterCount()} filters applied)`}
          </Text>
          <TouchableOpacity 
            style={styles.filterButtonInline}
            onPress={openFilterModal}
          >
            <Text style={styles.filterIconInline}>⚙</Text>
            {getActiveFilterCount() > 0 && (
              <View style={styles.filterBadgeInline}>
                <Text style={styles.filterBadgeText}>{getActiveFilterCount()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Products Found</Text>
      <Text style={styles.emptySubtitle}>
        {getActiveFilterCount() > 0 
          ? 'Try adjusting your filters to see more products.'
          : 'This collection doesn\'t have any products yet.'}
      </Text>
      {getActiveFilterCount() > 0 && (
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={clearFilters}
        >
          <Text style={styles.retryButtonText}>Clear Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderFooter = () => {
    if (!hasNextPage) return null;
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        {loadingMore ? (
          <ActivityIndicator size="small" color="#da4925ff" />
        ) : (
          <TouchableOpacity 
            onPress={loadMoreProducts} 
            style={{ backgroundColor: '#da4925ff', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 6 }}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Load More</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterScrollView} showsVerticalScrollIndicator={false}>
            
            {/* Price Range Filter with Slider */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Price Range</Text>
              <View style={styles.priceDisplayContainer}>
                <Text style={styles.priceDisplayText}>${Math.round(sliderValues.min)}</Text>
                <Text style={styles.priceDisplaySeparator}>-</Text>
                <Text style={styles.priceDisplayText}>${Math.round(sliderValues.max)}</Text>
              </View>
              
              {/* Min Price Slider */}
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Min: ${Math.round(sliderValues.min)}</Text>
                <View 
                  style={styles.sliderTrack}
                  onStartShouldSetResponder={() => true}
                  onResponderGrant={(e) => {
                    handleSliderStart(true);
                    handleSliderTouch(e, true);
                  }}
                  onResponderMove={(e) => handleSliderTouch(e, true)}
                  onResponderRelease={handleSliderEnd}
                >
                  <View 
                    style={[
                      styles.sliderFill, 
                      { 
                        width: `${((sliderValues.min - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%` 
                      }
                    ]} 
                  />
                  <View
                    style={[
                      styles.sliderThumb,
                      activeSlider === 'min' && styles.sliderThumbActive,
                      { 
                        left: `${((sliderValues.min - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%` 
                      }
                    ]}
                  />
                </View>
              </View>

              {/* Max Price Slider */}
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Max: ${Math.round(sliderValues.max)}</Text>
                <View 
                  style={styles.sliderTrack}
                  onStartShouldSetResponder={() => true}
                  onResponderGrant={(e) => {
                    handleSliderStart(false);
                    handleSliderTouch(e, false);
                  }}
                  onResponderMove={(e) => handleSliderTouch(e, false)}
                  onResponderRelease={handleSliderEnd}
                >
                  <View 
                    style={[
                      styles.sliderFill, 
                      { 
                        width: `${((sliderValues.max - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%` 
                      }
                    ]} 
                  />
                  <View
                    style={[
                      styles.sliderThumb,
                      activeSlider === 'max' && styles.sliderThumbActive,
                      { 
                        left: `${((sliderValues.max - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%` 
                      }
                    ]}
                  />
                </View>
              </View>
            </View>

            {/* Brand Filter */}
            {availableBrands.length > 0 && (
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Brand</Text>
                {availableBrands.map((brand, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.checkboxItem}
                    onPress={() => toggleBrand(brand)}
                  >
                    <View style={[
                      styles.checkbox,
                      tempFilters.selectedBrands.includes(brand) && styles.checkboxChecked
                    ]}>
                      {tempFilters.selectedBrands.includes(brand) && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                    <Text style={styles.checkboxLabel}>{brand}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Menu/Category Filter - Show only subcategories of current collection */}
            {menuItems.length > 0 && (
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Categories</Text>
                {menuItems.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.checkboxItem}
                    onPress={() => toggleMenuItem(item.title)}
                  >
                    <View style={[
                      styles.checkbox,
                      tempFilters.selectedMenuItems.includes(item.title) && styles.checkboxChecked
                    ]}>
                      {tempFilters.selectedMenuItems.includes(item.title) && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                    <Text style={styles.checkboxLabel}>{item.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={clearFilters}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={applyFilterChanges}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.headerBar}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#da4925ff" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.headerBar}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{collectionInfo?.title || title}</Text>
        <View style={styles.headerRight} />
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={filteredProducts.length > 0 ? styles.row : null}
      />

      {renderFilterModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  headerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 15, paddingVertical: 12, backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#E5E5E5',
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backButtonText: { fontSize: 24, color: '#232F3E', fontWeight: 'bold' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#232F3E', flex: 1, textAlign: 'center' },
  headerRight: { width: 40 },
  filterButton: { 
    width: 40, height: 40, justifyContent: 'center', alignItems: 'center',
    position: 'relative'
  },
  filterIcon: { fontSize: 22, color: '#232F3E' },
  filterBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#da4925ff',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  listContainer: { paddingBottom: 20 },
  headerContainer: { backgroundColor: '#FFFFFF', marginBottom: 10, paddingBottom: 20 },
  collectionImage: { width: '100%', height: 200, backgroundColor: '#F0F0F0' },
  headerTextContainer: { paddingHorizontal: 15, paddingTop: 15 },
  collectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#232F3E', marginBottom: 5 },
  productCountRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  productCount: { fontSize: 16, color: '#666', flex: 1 },
  filterButtonInline: { 
    width: 40, 
    height: 40, 
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
  },
  filterIconInline: { fontSize: 20, color: '#232F3E' },
  filterBadgeInline: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#da4925ff',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  row: { justifyContent: 'space-between', paddingHorizontal: 10 },
  productItem: {
    width: (width - 30) / 2, backgroundColor: '#FFFFFF', borderRadius: 8,
    marginVertical: 5, elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  productImage: { width: '100%', height: 150, borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor: '#F0F0F0' },
  productInfo: { padding: 12 },
  productName: { fontSize: 14, fontWeight: '500', color: '#232F3E', marginBottom: 4, minHeight: 35 },
  productBrand: { fontSize: 12, color: '#666', marginBottom: 4 },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#da4925ff' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, paddingVertical: 60 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#232F3E', marginBottom: 10, textAlign: 'center' },
  emptySubtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30, lineHeight: 22 },
  retryButton: { backgroundColor: '#da4925ff', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 6 },
  retryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#232F3E',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  filterScrollView: {
    paddingHorizontal: 20,
  },
  filterSection: {
    marginTop: 20,
    marginBottom: 10,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#232F3E',
    marginBottom: 12,
  },
  priceDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 8,
  },
  priceDisplayText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#da4925ff',
  },
  priceDisplaySeparator: {
    fontSize: 18,
    color: '#666',
    marginHorizontal: 15,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    position: 'relative',
    width: '100%',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#da4925ff',
    borderRadius: 3,
    position: 'absolute',
  },
  sliderThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#da4925ff',
    position: 'absolute',
    top: -9,
    marginLeft: -12,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  sliderThumbActive: {
    transform: [{ scale: 1.2 }],
    shadowOpacity: 0.5,
    elevation: 8,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#da4925ff',
    borderColor: '#da4925ff',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#232F3E',
    flex: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 15,
    gap: 10,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#da4925ff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CollectionScreen;