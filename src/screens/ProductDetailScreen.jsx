import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchProductById } from '../shopifyApi';

const { width } = Dimensions.get('window');

// Default VAT percentage (you can change this or make it dynamic)
const VAT_PERCENTAGE = 5; // 5% VAT for UAE

const ProductDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId, productName } = route.params;
  const scrollViewRef = useRef(null);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState(null);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [showReturnPolicy, setShowReturnPolicy] = useState(false);

  // Format price with commas
  const formatPrice = (amount) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return amount;
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  // Calculate VAT amount
  const calculateVAT = (price) => {
    return (parseFloat(price) * VAT_PERCENTAGE) / 100;
  };

  const loadProductData = async () => {
    try {
      setLoading(true);
      const productData = await fetchProductById(productId);
      
      if (!productData) {
        Alert.alert(
          'Product Not Found',
          'The product you are looking for could not be found.',
          [{ text: 'Go Back', onPress: () => navigation.goBack() }]
        );
        return;
      }

      setProduct(productData);
    } catch (error) {
      console.error('Error loading product:', error);
      Alert.alert(
        'Error',
        'Failed to load product details. Please try again.',
        [
          { text: 'Retry', onPress: () => loadProductData() },
          { text: 'Go Back', onPress: () => navigation.goBack() }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductData();
  }, [productId]);

  const handleAddToCart = () => {
    const variant = product.variants[selectedVariant];
    
    // Here you would normally add to your cart state/context
    // For now, we'll just navigate to cart screen
    
    Alert.alert(
      'Added to Cart',
      `${quantity} x ${product.title} added to cart`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { 
          text: 'View Cart', 
          onPress: () => navigation.navigate('Cart')
        }
      ]
    );
  };

  const handleBuyNow = () => {
    const variant = product.variants[selectedVariant];
    Alert.alert(
      'Buy Now',
      `Proceeding to checkout with ${quantity} x ${product.title}\nTotal: ${formatPrice(parseFloat(variant.price.amount) * quantity)} ${variant.price.currencyCode}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Proceed', onPress: () => console.log('Proceed to checkout') }
      ]
    );
  };

  const handleGetQuote = () => {
    Alert.alert(
      'Get a Quote',
      `Request a quote for ${product.title}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Request Quote', onPress: () => console.log('Request quote sent') }
      ]
    );
  };

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setSelectedImage(currentIndex);
  };

  const scrollToImage = (index) => {
    setSelectedImage(index);
    scrollViewRef.current?.scrollTo({ x: width * index, animated: true });
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const selectQuantity = (qty) => {
    setQuantity(qty);
    setShowQuantityModal(false);
  };

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
          <Text style={styles.headerTitle}>Product Details</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#da4925ff" />
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return null;
  }

  const currentVariant = product.variants[selectedVariant];
  const currentPrice = parseFloat(currentVariant.price.amount);
  const isPriceZero = currentPrice === 0;
  const hasDiscount = currentVariant.compareAtPrice && 
    parseFloat(currentVariant.compareAtPrice.amount) > currentPrice;
  const vatAmount = calculateVAT(currentVariant.price.amount);

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
        <Text style={styles.headerTitle} numberOfLines={1}>
          {product.title}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Images with Swipe */}
        <View style={styles.imageSection}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {product.images.map((image, index) => (
              <Image 
                key={index}
                source={{ uri: image.url || 'https://via.placeholder.com/400' }} 
                style={styles.mainImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Dot Indicators */}
          {product.images.length > 1 && (
            <View style={styles.dotContainer}>
              {product.images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    selectedImage === index && styles.dotActive
                  ]}
                />
              ))}
            </View>
          )}
          
          {/* Thumbnail Gallery */}
          {product.images.length > 1 && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.thumbnailContainer}
            >
              {product.images.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => scrollToImage(index)}
                  style={[
                    styles.thumbnail,
                    selectedImage === index && styles.thumbnailSelected
                  ]}
                >
                  <Image 
                    source={{ uri: image.url }} 
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          <Text style={styles.productTitle}>{product.title}</Text>
          
          {/* Show Brand if available from metafield, otherwise show vendor */}
          {(product.brand || product.vendor) && (
            <Text style={styles.vendor}>
              by {product.brand || product.vendor}
            </Text>
          )}

          {/* Price Section */}
          {!isPriceZero && (
            <>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>
                  {formatPrice(currentVariant.price.amount)} {currentVariant.price.currencyCode}
                </Text>
                {hasDiscount && (
                  <>
                    <Text style={styles.comparePrice}>
                      {formatPrice(currentVariant.compareAtPrice.amount)} {currentVariant.compareAtPrice.currencyCode}
                    </Text>
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>
                        {Math.round(((parseFloat(currentVariant.compareAtPrice.amount) - parseFloat(currentVariant.price.amount)) / parseFloat(currentVariant.compareAtPrice.amount)) * 100)}% OFF
                      </Text>
                    </View>
                  </>
                )}
              </View>

              {/* Free Return Badge - Clickable */}
              <TouchableOpacity 
                style={styles.freeReturnContainer}
                onPress={() => setShowReturnPolicy(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.freeReturnText}>✓ Free Return</Text>
                <Text style={styles.freeReturnIcon}>ℹ️</Text>
              </TouchableOpacity>

              {/* VAT Information */}
              {currentVariant.taxable && (
                <View style={styles.vatContainer}>
                  <Text style={styles.vatLabel}>Excl. VAT: </Text>
                  <Text style={styles.vatAmount}>
                    {formatPrice(vatAmount.toFixed(2))} {currentVariant.price.currencyCode} ({VAT_PERCENTAGE}%)
                  </Text>
                </View>
              )}
            </>
          )}

          {/* Availability */}
          {!isPriceZero && (
            <View style={styles.availabilityContainer}>
              {currentVariant.availableForSale ? (
                <View style={styles.availableBadge}>
                  <Text style={styles.availableText}>✓ In Stock</Text>
                </View>
              ) : (
                <View style={styles.unavailableBadge}>
                  <Text style={styles.unavailableText}>Out of Stock</Text>
                </View>
              )}
            </View>
          )}

          {/* Variants Selection */}
          {product.variants.length > 1 && (
            <View style={styles.variantsSection}>
              <Text style={styles.sectionTitle}>Select Variant</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.variantsScroll}
              >
                {product.variants.map((variant, index) => (
                  <TouchableOpacity
                    key={variant.id}
                    onPress={() => setSelectedVariant(index)}
                    style={[
                      styles.variantButton,
                      selectedVariant === index && styles.variantButtonSelected,
                      !variant.availableForSale && styles.variantButtonDisabled
                    ]}
                    disabled={!variant.availableForSale}
                  >
                    <Text style={[
                      styles.variantText,
                      selectedVariant === index && styles.variantTextSelected,
                      !variant.availableForSale && styles.variantTextDisabled
                    ]}>
                      {variant.title}
                    </Text>
                    {!variant.availableForSale && (
                      <Text style={styles.variantUnavailable}>Unavailable</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Quantity Dropdown - Only show if price is not zero */}
          {!isPriceZero && (
            <View style={styles.quantitySection}>
              <Text style={styles.sectionTitle}>Quantity</Text>
              <TouchableOpacity
                style={styles.quantityDropdown}
                onPress={() => setShowQuantityModal(true)}
              >
                <Text style={styles.quantityText}>{quantity}</Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Product Details Accordion */}
          <View style={styles.accordionSection}>
            <Text style={styles.mainSectionTitle}>Product Details</Text>

            {/* Brand */}
            {product.brand && (
              <View style={styles.accordionItem}>
                <TouchableOpacity
                  style={styles.accordionHeader}
                  onPress={() => toggleSection('brand')}
                >
                  <Text style={styles.accordionTitle}>Brand</Text>
                  <Text style={styles.accordionIcon}>
                    {expandedSection === 'brand' ? '−' : '+'}
                  </Text>
                </TouchableOpacity>
                {expandedSection === 'brand' && (
                  <View style={styles.accordionContent}>
                    <Text style={styles.accordionText}>{product.brand}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Short Description */}
            {product.shortDescription && (
              <View style={styles.accordionItem}>
                <TouchableOpacity
                  style={styles.accordionHeader}
                  onPress={() => toggleSection('short')}
                >
                  <Text style={styles.accordionTitle}>Short Description</Text>
                  <Text style={styles.accordionIcon}>
                    {expandedSection === 'short' ? '−' : '+'}
                  </Text>
                </TouchableOpacity>
                {expandedSection === 'short' && (
                  <View style={styles.accordionContent}>
                    <Text style={styles.accordionText}>{product.shortDescription}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Full Description */}
            {product.description && (
              <View style={styles.accordionItem}>
                <TouchableOpacity
                  style={styles.accordionHeader}
                  onPress={() => toggleSection('description')}
                >
                  <Text style={styles.accordionTitle}>Description</Text>
                  <Text style={styles.accordionIcon}>
                    {expandedSection === 'description' ? '−' : '+'}
                  </Text>
                </TouchableOpacity>
                {expandedSection === 'description' && (
                  <View style={styles.accordionContent}>
                    <Text style={styles.accordionText}>{product.description}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Product Type */}
            {product.productType && (
              <View style={styles.accordionItem}>
                <TouchableOpacity
                  style={styles.accordionHeader}
                  onPress={() => toggleSection('category')}
                >
                  <Text style={styles.accordionTitle}>Category</Text>
                  <Text style={styles.accordionIcon}>
                    {expandedSection === 'category' ? '−' : '+'}
                  </Text>
                </TouchableOpacity>
                {expandedSection === 'category' && (
                  <View style={styles.accordionContent}>
                    <Text style={styles.accordionText}>{product.productType}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <View style={styles.accordionItem}>
                <TouchableOpacity
                  style={styles.accordionHeader}
                  onPress={() => toggleSection('tags')}
                >
                  <Text style={styles.accordionTitle}>Tags</Text>
                  <Text style={styles.accordionIcon}>
                    {expandedSection === 'tags' ? '−' : '+'}
                  </Text>
                </TouchableOpacity>
                {expandedSection === 'tags' && (
                  <View style={styles.accordionContent}>
                    <View style={styles.tagsContainer}>
                      {product.tags.map((tag, index) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        {isPriceZero ? (
          // Show only "Get a Quote" button when price is 0
          <TouchableOpacity 
            style={styles.quoteButton}
            onPress={handleGetQuote}
          >
            <Text style={styles.quoteButtonText}>Get a Quote</Text>
          </TouchableOpacity>
        ) : (
          // Show Add to Cart and Buy Now buttons when price is not 0
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[
                styles.addToCartButton,
                !currentVariant.availableForSale && styles.buttonDisabled
              ]}
              onPress={handleAddToCart}
              disabled={!currentVariant.availableForSale}
            >
              <Text style={styles.addToCartText}>
                {currentVariant.availableForSale ? 'Add to Cart' : 'Out of Stock'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.buyNowButton,
                !currentVariant.availableForSale && styles.buttonDisabled
              ]}
              onPress={handleBuyNow}
              disabled={!currentVariant.availableForSale}
            >
              <Text style={styles.buyNowText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Quantity Modal */}
      <Modal
        visible={showQuantityModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowQuantityModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowQuantityModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Quantity</Text>
              <TouchableOpacity onPress={() => setShowQuantityModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.quantityList}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.quantityOption,
                    quantity === num && styles.quantityOptionSelected
                  ]}
                  onPress={() => selectQuantity(num)}
                >
                  <Text style={[
                    styles.quantityOptionText,
                    quantity === num && styles.quantityOptionTextSelected
                  ]}>
                    {num}
                  </Text>
                  {quantity === num && (
                    <Text style={styles.checkMark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Return Policy Modal */}
      <Modal
        visible={showReturnPolicy}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowReturnPolicy(false)}
      >
        <TouchableOpacity
          style={styles.policyModalOverlay}
          activeOpacity={1}
          onPress={() => setShowReturnPolicy(false)}
        >
          <View style={styles.policyModalContent}>
            <View style={styles.policyHeader}>
              <Text style={styles.policyTitle}>Return Policy</Text>
              <TouchableOpacity onPress={() => setShowReturnPolicy(false)}>
                <Text style={styles.policyClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.policyBody}>
              <Text style={styles.policyText}>
                <Text style={styles.policyBold}>Free Returns Within 30 Days</Text>
                {'\n\n'}
                We offer free returns on all eligible products within 30 days of delivery. 
                {'\n\n'}
                <Text style={styles.policyBold}>Return Conditions:</Text>
                {'\n'}
                • Product must be unused and in original packaging
                {'\n'}
                • All tags and labels must be intact
                {'\n'}
                • Original receipt or proof of purchase required
                {'\n\n'}
                <Text style={styles.policyBold}>How to Return:</Text>
                {'\n'}
                1. Contact our customer service team
                {'\n'}
                2. Pack the item securely in its original packaging
                {'\n'}
                3. We'll arrange a free pickup from your location
                {'\n'}
                4. Refund will be processed within 5-7 business days
                {'\n\n'}
                <Text style={styles.policyBold}>Exclusions:</Text>
                {'\n'}
                • Damaged or modified products
                {'\n'}
                • Products without original packaging
                {'\n'}
                • Sale or clearance items (unless defective)
                {'\n\n'}
                For more information, please contact our customer service team.
              </Text>
            </ScrollView>
            <TouchableOpacity 
              style={styles.policyButton}
              onPress={() => setShowReturnPolicy(false)}
            >
              <Text style={styles.policyButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#232F3E', flex: 1, textAlign: 'center', paddingHorizontal: 10 },
  headerRight: { width: 40 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  scrollView: { flex: 1 },
  imageSection: { backgroundColor: '#FFFFFF', marginBottom: 10 },
  mainImage: { width: width, height: width, backgroundColor: '#F0F0F0' },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DDD',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#da4925ff',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  thumbnailContainer: { paddingHorizontal: 10, paddingVertical: 10 },
  thumbnail: {
    width: 60, height: 60, marginRight: 10, borderRadius: 8,
    borderWidth: 2, borderColor: '#E5E5E5', overflow: 'hidden'
  },
  thumbnailSelected: { borderColor: '#da4925ff' },
  thumbnailImage: { width: '100%', height: '100%' },
  infoSection: { backgroundColor: '#FFFFFF', padding: 15, marginBottom: 10 },
  productTitle: { fontSize: 24, fontWeight: 'bold', color: '#232F3E', marginBottom: 5 },
  vendor: { fontSize: 16, color: '#666', marginBottom: 15 },
  priceContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' },
  price: { fontSize: 28, fontWeight: 'bold', color: '#da4925ff', marginRight: 10 },
  comparePrice: { fontSize: 20, color: '#999', textDecorationLine: 'line-through', marginRight: 10 },
  discountBadge: { backgroundColor: '#da4925ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  discountText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  freeReturnContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 8,
    paddingVertical: 4,
  },
  freeReturnText: { fontSize: 14, color: '#2E7D32', fontWeight: '600', marginRight: 5 },
  freeReturnIcon: { fontSize: 14 },
  vatContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  vatLabel: { fontSize: 14, color: '#666', fontWeight: '600' },
  vatAmount: { fontSize: 14, color: '#666' },
  availabilityContainer: { marginBottom: 20 },
  availableBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, alignSelf: 'flex-start' },
  availableText: { color: '#2E7D32', fontSize: 14, fontWeight: '600' },
  unavailableBadge: { backgroundColor: '#FFEBEE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, alignSelf: 'flex-start' },
  unavailableText: { color: '#C62828', fontSize: 14, fontWeight: '600' },
  variantsSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#232F3E', marginBottom: 10 },
  variantsScroll: { flexDirection: 'row' },
  variantButton: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 6,
    borderWidth: 2, borderColor: '#E5E5E5', marginRight: 10, backgroundColor: '#FFFFFF'
  },
  variantButtonSelected: { borderColor: '#da4925ff', backgroundColor: '#FFF5F3' },
  variantButtonDisabled: { opacity: 0.5 },
  variantText: { fontSize: 14, color: '#232F3E', fontWeight: '500' },
  variantTextSelected: { color: '#da4925ff', fontWeight: 'bold' },
  variantTextDisabled: { color: '#999' },
  variantUnavailable: { fontSize: 10, color: '#999', marginTop: 2 },
  quantitySection: { marginBottom: 20 },
  quantityDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  quantityText: { fontSize: 16, color: '#232F3E', fontWeight: '500' },
  dropdownArrow: { fontSize: 12, color: '#666' },
  accordionSection: { marginTop: 10 },
  mainSectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#232F3E', marginBottom: 15 },
  accordionItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  accordionTitle: { fontSize: 16, fontWeight: '600', color: '#232F3E', flex: 1 },
  accordionIcon: { fontSize: 24, fontWeight: 'bold', color: '#232F3E', width: 30, textAlign: 'center' },
  accordionContent: {
    paddingBottom: 15,
    paddingRight: 10,
  },
  accordionText: { fontSize: 15, color: '#666', lineHeight: 22 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 },
  tag: { backgroundColor: '#F0F0F0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, marginRight: 8, marginBottom: 8 },
  tagText: { fontSize: 14, color: '#666' },
  footer: {
    backgroundColor: '#FFFFFF', paddingHorizontal: 15, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: '#E5E5E5'
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#da4925ff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addToCartText: { color: '#da4925ff', fontSize: 16, fontWeight: 'bold' },
  buyNowButton: {
    flex: 1,
    backgroundColor: '#da4925ff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buyNowText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  quoteButton: {
    backgroundColor: '#da4925ff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  buttonDisabled: { backgroundColor: '#CCC', borderColor: '#CCC' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#232F3E' },
  modalClose: { fontSize: 24, color: '#666', fontWeight: 'bold' },
  quantityList: {
    maxHeight: 300,
  },
  quantityOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  quantityOptionSelected: {
    backgroundColor: '#FFF5F3',
  },
  quantityOptionText: { fontSize: 16, color: '#232F3E' },
  quantityOptionTextSelected: { color: '#da4925ff', fontWeight: 'bold' },
  checkMark: { fontSize: 18, color: '#da4925ff', fontWeight: 'bold' },
  policyModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  policyModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: '100%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  policyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#F8F8F8',
  },
  policyTitle: { fontSize: 20, fontWeight: 'bold', color: '#232F3E' },
  policyClose: { fontSize: 28, color: '#666', fontWeight: 'bold' },
  policyBody: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  policyText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
  },
  policyBold: {
    fontWeight: 'bold',
    color: '#232F3E',
    fontSize: 16,
  },
  policyButton: {
    backgroundColor: '#da4925ff',
    marginHorizontal: 20,
    marginVertical: 15,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  policyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;