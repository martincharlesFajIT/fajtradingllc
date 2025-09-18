import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import Header from '../components/Header';

const { width } = Dimensions.get('window');

const HomePage = () => {
  
  const bannerData = [
    { id: 1, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcK6Z2RB7mrb6haKMoFcmz_6JyFaK7r1m5Wg&s' },
    { id: 2, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcK6Z2RB7mrb6haKMoFcmz_6JyFaK7r1m5Wg&s' },
    { id: 3, image: 'https://via.placeholder.com/400x200/FF9900/FFFFFF?text=Free+Delivery' },
  ];

  const categories = [
    { id: 1, name: 'Coffee Machine', icon: '📱' },
    { id: 2, name: 'Vacuume Cleaner', icon: '👗' },
    { id: 3, name: 'Washing Machine', icon: '🏠' },
    { id: 4, name: 'Cookers', icon: '' },
    { id: 5, name: 'Air Conditioner', icon: '⚽' },
    { id: 6, name: 'Washing Machine', icon: '💄' },
    { id: 7, name: 'Refrigerators', icon: '💄' },
  ];

  const featuredProducts = [
    { id: 1, name: 'Wireless Headphones', price: '$99.99', image: 'https://via.placeholder.com/150x150/000000/FFFFFF?text=Headphones', rating: 4.5 },
    { id: 2, name: 'Smart Watch', price: '$199.99', image: 'https://via.placeholder.com/150x150/000000/FFFFFF?text=Smart+Watch', rating: 4.2 },
    { id: 3, name: 'Bluetooth Speaker', price: '$49.99', image: 'https://via.placeholder.com/150x150/000000/FFFFFF?text=Speaker', rating: 4.8 },
    { id: 4, name: 'Phone Case', price: '$19.99', image: 'https://via.placeholder.com/150x150/000000/FFFFFF?text=Case', rating: 4.0 },
  ];

  const deals = [
    { id: 1, name: 'Gaming Laptop', originalPrice: '$1299.99', salePrice: '$899.99', image: 'https://via.placeholder.com/200x150/000000/FFFFFF?text=Laptop', discount: '31%' },
    { id: 2, name: 'Coffee Maker', originalPrice: '$149.99', salePrice: '$89.99', image: 'https://via.placeholder.com/200x150/000000/FFFFFF?text=Coffee', discount: '40%' },
    { id: 2, name: 'Coffee Maker', originalPrice: '$149.99', salePrice: '$89.99', image: 'https://via.placeholder.com/200x150/000000/FFFFFF?text=Coffee', discount: '40%' },
  ];
  const featuredpartners = [
    { id: 1, name: 'Gaming Laptop', originalPrice: '$1299.99', salePrice: '$899.99', image: 'https://via.placeholder.com/200x150/000000/FFFFFF?text=Laptop', discount: '31%' },
    { id: 2, name: 'Coffee Maker', originalPrice: '$149.99', salePrice: '$89.99', image: 'https://via.placeholder.com/200x150/000000/FFFFFF?text=Coffee', discount: '40%' },
    { id: 2, name: 'Coffee Maker', originalPrice: '$149.99', salePrice: '$89.99', image: 'https://via.placeholder.com/200x150/000000/FFFFFF?text=Coffee', discount: '40%' },
  ];

    const brandhighlights = [
    { id: 1, name: 'Gaming Laptop', originalPrice: '$1299.99', salePrice: '$899.99', image: 'https://via.placeholder.com/200x150/000000/FFFFFF?text=Laptop', discount: '31%' },
    { id: 2, name: 'Coffee Maker', originalPrice: '$149.99', salePrice: '$89.99', image: 'https://via.placeholder.com/200x150/000000/FFFFFF?text=Coffee', discount: '40%' },
    { id: 2, name: 'Coffee Maker', originalPrice: '$149.99', salePrice: '$89.99', image: 'https://via.placeholder.com/200x150/000000/FFFFFF?text=Coffee', discount: '40%' },
  ];

  const renderBanner = ({ item }) => (
    <TouchableOpacity style={styles.bannerItem}>
      <Image source={{ uri: item.image }} style={styles.bannerImage} />
    </TouchableOpacity>
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => (
    <TouchableOpacity style={styles.productItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
        </View>
        <Text style={styles.productPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderDeal = ({ item }) => (
    <TouchableOpacity style={styles.dealItem}>
      <Image source={{ uri: item.image }} style={styles.dealImage} />
      <View style={styles.dealInfo}>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount} OFF</Text>
        </View>
        <Text style={styles.dealName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.salePrice}>{item.salePrice}</Text>
          <Text style={styles.originalPrice}>{item.originalPrice}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner Carousel */}
        <View style={styles.section}>
          <FlatList
            data={bannerData}
            renderItem={renderBanner}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToInterval={width - 20}
            decelerationRate="fast"
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          />
        </View>

        {/* Today's Deals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sponser Products</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={deals}
            renderItem={renderDeal}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dealsContainer}
          />
        </View>

         <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured by Partners</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredpartners}
            renderItem={renderDeal}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dealsContainer}
          />
        </View>

         <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Brand Highlights</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredpartners}
            renderItem={renderDeal}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dealsContainer}
          />
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Professional Coffee Machines</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.productsGrid}
          />
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232F3E',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  seeAllText: {
    color: '#007185',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Banner Styles
  bannerItem: {
    width: width - 20,
    marginHorizontal: 10,
  },
  bannerImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  
  // Category Styles
  categoriesContainer: {
    paddingHorizontal: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 10,
    width: 80,
  },
  categoryIcon: {
    fontSize: 30,
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
    color: '#232F3E',
    fontWeight: '500',
  },
  
  // Deal Styles
  dealsContainer: {
    paddingHorizontal: 10,
  },
  dealItem: {
    width: 200,
    marginHorizontal: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dealImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    resizeMode: 'cover',
  },
  dealInfo: {
    padding: 10,
  },
  discountBadge: {
    position: 'absolute',
    top: -60,
    right: 10,
    backgroundColor: '#FF4757',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  dealName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#232F3E',
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  salePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B12704',
    marginRight: 5,
  },
  originalPrice: {
    fontSize: 12,
    color: '#666',
    textDecorationLine: 'line-through',
  },
  
  // Product Styles
  productsGrid: {
    paddingHorizontal: 10,
  },
  productItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    margin: 5,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#232F3E',
    marginBottom: 5,
    height: 35,
  },
  ratingContainer: {
    marginBottom: 5,
  },
  rating: {
    fontSize: 12,
    color: '#FF9900',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B12704',
  },
  bottomSpacer: {
    height: 20,
  },
});

export default HomePage;