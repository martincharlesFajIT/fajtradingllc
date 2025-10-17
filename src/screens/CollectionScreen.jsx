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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchProductsByCollection, fetchCollectionByHandle } from '../shopifyApi';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width } = Dimensions.get('window');

const CollectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { handle, title } = route.params;

  const [products, setProducts] = useState([]);
  const [collectionInfo, setCollectionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [endCursor, setEndCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadCollectionData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [collectionData, productData] = await Promise.all([
        fetchCollectionByHandle(handle),
        fetchProductsByCollection(handle, 10)
      ]);

      setCollectionInfo(collectionData);
      setProducts(productData.products);
      setHasNextPage(productData.hasNextPage);
      setEndCursor(productData.endCursor);

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
      const moreData = await fetchProductsByCollection(handle, 10, endCursor);

      setProducts(prev => [...prev, ...moreData.products]);
      setHasNextPage(moreData.hasNextPage);
      setEndCursor(moreData.endCursor);

    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadCollectionData();
  }, [handle]);

  const onRefresh = () => {
    loadCollectionData(true);
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.productItem}
      onPress={() => {
        // ✅ Navigate to Product Detail Screen
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
        <Text style={styles.productCount}>
          {products.length} {products.length === 1 ? 'Product' : 'Products'}
        </Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Products Found</Text>
      <Text style={styles.emptySubtitle}>
        This collection doesn't have any products yet.
      </Text>
      <TouchableOpacity 
        style={styles.retryButton}
        onPress={() => loadCollectionData()}
      >
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
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
        data={products}
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
        columnWrapperStyle={products.length > 0 ? styles.row : null}
      />
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  listContainer: { paddingBottom: 20 },
  headerContainer: { backgroundColor: '#FFFFFF', marginBottom: 10, paddingBottom: 20 },
  collectionImage: { width: '100%', height: 200, backgroundColor: '#F0F0F0' },
  headerTextContainer: { paddingHorizontal: 15, paddingTop: 15 },
  collectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#232F3E', marginBottom: 5 },
  productCount: { fontSize: 16, color: '#666' },
  row: { justifyContent: 'space-between', paddingHorizontal: 10 },
  productItem: {
    width: (width - 30) / 2, backgroundColor: '#FFFFFF', borderRadius: 8,
    marginVertical: 5, elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  productImage: { width: '100%', height: 150, borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor: '#F0F0F0' },
  productInfo: { padding: 12 },
  productName: { fontSize: 14, fontWeight: '500', color: '#232F3E', marginBottom: 8, minHeight: 35 },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#da4925ff' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, paddingVertical: 60 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#232F3E', marginBottom: 10, textAlign: 'center' },
  emptySubtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30, lineHeight: 22 },
  retryButton: { backgroundColor: '#da4925ff', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 6 },
  retryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});

export default CollectionScreen;