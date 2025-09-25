import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { fetchProductsByCollection, fetchCollectionByHandle } from '../shopifyApi';

const { width } = Dimensions.get('window');

const HomePage = () => {
  const navigation = useNavigation();

  // Single state for all collections
  const [collections, setCollections] = useState({});
  const [loading, setLoading] = useState({});

  // Define your collection groups
  const COLLECTION_GROUPS = {
    featured: {
      title: "Coffee Machines",
      handles: [
        'professional-coffee-machines',
        'automatic-coffee-machine', 
        'coffee-equipment',
        'delonghi-automatic-coffee-machine'
      ]
    },
    homeAppliances: {
      title: "Home Appliances",
      handles: [
        'kitchen-appliances',
        'home-appliance',
        'water-heater',
        'all-spare-accessories'
      ]
    },
    Electronics: {
      title: "Electronic", 
      handles: [
        'energy-power-quality-analyzer',
        'electrical-and-electronics',
        'stabilizer-and-transformer',
        'dehumidifier'
      ]
    }
  };

  const loadCollections = async (groupKey, handles) => {
    try {
      setLoading(prev => ({ ...prev, [groupKey]: true }));
      
      const collectionPromises = handles.map(handle =>
        fetchCollectionByHandle(handle)
      );
      
      const results = await Promise.all(collectionPromises);
      const validCollections = results.filter(collection => collection !== null);
      
      setCollections(prev => ({
        ...prev,
        [groupKey]: validCollections
      }));
      
    } catch (error) {
      console.error(`Error fetching ${groupKey} collections:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [groupKey]: false }));
    }
  };

  const [coffeeMachines, setCoffeeMachines] = useState([]);
  const [loadingCoffee, setLoadingCoffee] = useState(true);

  useEffect(() => {
    const loadCoffeeMachines = async () => {
      try {
        const products = await fetchProductsByCollection("professional-coffee-machines");
        setCoffeeMachines(products);
      } catch (error) {
        console.error("Error fetching coffee machine products:", error);
      } finally {
        setLoadingCoffee(false);
      }
    };
    loadCoffeeMachines();
  }, []);

  
  useEffect(() => {
    Object.entries(COLLECTION_GROUPS).forEach(([groupKey, group]) => {
      loadCollections(groupKey, group.handles);
    });
  }, []);

  const bannerData = [
    { id: 1, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcK6Z2RB7mrb6haKMoFcmz_6JyFaK7r1m5Wg&s' },
    { id: 2, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcK6Z2RB7mrb6haKMoFcmz_6JyFaK7r1m5Wg&s' },
    { id: 3, image: 'https://via.placeholder.com/400x200/FF9900/FFFFFF?text=Free+Delivery' },
  ];

  const categories = [
    { id: 1, name: 'Coffee Machine', image: 'https://www.fajtradingllc.com/cdn/shop/collections/refrigerator_82110317-e2b4-47b5-8395-54aade9aaf0f_200x200.jpg?v=1746439090' },
    { id: 2, name: 'Vacuum Cleaner', image: 'https://www.fajtradingllc.com/cdn/shop/collections/robotic-vacuum-cleaner_a0aa2b94-945e-4fa8-8990-8a02e39273e7_375x.jpg?v=1746444970' },
    { id: 3, name: 'Washing Machine', image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=300&h=400&fit=crop&crop=center' },
    { id: 4, name: 'Cookers', image: 'https://www.fajtradingllc.com/cdn/shop/collections/Dr_Coffee_F11_Pro_Fully_Automatic_Coffee_Machine_535x.png?v=1746437119' },
    { id: 5, name: 'Air Conditioner', image: 'https://www.fajtradingllc.com/cdn/shop/collections/ac_39ccf573-4268-48b7-bfb6-c90f3ea4fc32_535x.jpg?v=1746443774' },
    { id: 6, name: 'Dishwasher', image: 'https://www.fajtradingllc.com/cdn/shop/files/3_e7c0d71f-e53f-4a2c-8caa-0d63ee546891_535x.jpg?v=1737182158' },
    { id: 7, name: 'Refrigerators', image: 'https://www.fajtradingllc.com/cdn/shop/collections/refrigerator_375x.jpg?v=1746432020' },
  ];

  const deals = [
    { id: 1, name: 'Gaming Laptop', salePrice: '$899.99', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRc4aSsFA96t5sfaxwxD8bbbDzYnusOissMZA&s', discount: '31%' },
    { id: 2, name: 'Coffee Maker', salePrice: '$89.99', image: 'https://down-sg.img.susercontent.com/file/cn-11134207-7ras8-m6evdp35a2fn73', discount: '40%' },
    { id: 3, name: 'Coffee Maker', salePrice: '$89.99', image: 'https://cumuluscoffee.com/cdn/shop/files/image6344284.jpg?v=1750178201&width=2475', discount: '40%' },
  ];

    const shopsave = [
    { id: 1, name: 'How to get free deliveries', image: 'https://img.freepik.com/premium-photo/delivery-man-red-uniform-holding-phone-with-blank-screen-custom-app-promotion-branding_1267867-19074.jpg?w=360'},
    { id: 2, name: 'How to Return an items',  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNORpbLTSRP4WB99TmvnQ3aLCAKxlkruStYZeWJ_IeVIFbWAQnBWG4tTzZaLWH09GG4yc&usqp=CAU'},
    { id: 3, name: 'How to contact us',  image: 'https://img.freepik.com/premium-photo/delivery-man-red-uniform-holding-phone-with-blank-screen-custom-app-promotion-branding_1267867-19062.jpg?w=360'},
    { id: 4, name: 'How to pay with cash',  image: 'https://images.pond5.com/back-rear-view-delivery-young-footage-136281600_iconl.jpeg'},
    { id: 5, name: 'How to place an order',  image: 'https://www.shutterstock.com/shutterstock/videos/1092499343/thumb/4.jpg?ip=x480'},
    { id: 6, name: 'How to create a new account',  image: 'https://thumbs.dreamstime.com/b/handwriting-text-writing-login-concept-meaning-entering-website-blog-using-username-password-registration-halftone-blank-180749996.jpg'},
  ];

  const featuredpartners = [
    { id: 1, name: 'Gaming Laptop', originalPrice: '$199.99', salePrice: '$899.99', image: 'https://cumuluscoffee.com/cdn/shop/files/image6344284.jpg?v=1750178201&width=2475', discount: '31%' },
    { id: 2, name: 'Coffee Maker', originalPrice: '$149.99', salePrice: '$89.99', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzXB4-Y4B_3R3GUH04tTjmMQx7VbUfA-pkuA&s', discount: '40%' },
    { id: 3, name: 'Coffee Maker', originalPrice: '$149.99', salePrice: '$89.99', image: 'https://via.placeholder.com/200x150/000000/FFFFFF?text=Coffee', discount: '40%' },
  ];

  
  const CollectionGrid = ({ groupKey, title }) => {
    const groupCollections = collections[groupKey] || [];
    const isLoading = loading[groupKey];

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#000" style={{ marginVertical: 20 }} />
        ) : groupCollections.length === 0 ? (
          <Text style={{ textAlign: "center", marginVertical: 20 }}>
            No {title.toLowerCase()} found.
          </Text>
        ) : (
          <View style={styles.gridContainer}>
            {groupCollections.slice(0, 6).map((item, index) => (
              <TouchableOpacity
                key={`${groupKey}-${item.id}`}
                style={styles.gridItem}
                onPress={() => {
                console.log("Navigate to collection:", item.title, item.handle);
                navigation.navigate('CollectionProducts', { 
                handle: item.handle, 
                title: item.title 
                });
                }}
              >
                <Image
                  source={{
                    uri: item.image || 'https://via.placeholder.com/200x150/E0E0E0/666666?text=No+Image'
                  }}
                  style={styles.gridImage}
                />
                <View style={styles.gridOverlay}>
                  <Text style={styles.gridText}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* Fill empty spots if less than 4 collections */}
            {groupCollections.length < 4 && Array.from({ length: 4 - groupCollections.length }).map((_, index) => (
              <View key={`empty-${groupKey}-${index}`} style={[styles.gridItem, styles.emptyGridItem]}>
                <Text style={styles.emptyGridText}>Coming Soon</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  // Your existing render functions
  const renderBanner = ({ item }) => (
    <TouchableOpacity style={styles.bannerItem}>
      <Image source={{ uri: item.image }} style={styles.bannerImage} />
    </TouchableOpacity>
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => {
        console.log("Navigate to category:", item.name);
      }}
    >
      <Image source={{ uri: item.image }} style={styles.categoryImage} />
      <View style={styles.categoryOverlay}>
        <Text style={styles.categoryName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.productItem}
      onPress={() => {
        console.log("Navigate to product:", item.name);
      }}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productPrice}>
          {parseFloat(item.price).toLocaleString("en-US", {
            style: "currency",
            currency: "aed",
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderDeal = ({ item }) => (
    <TouchableOpacity 
      style={styles.dealItem}
      onPress={() => {
        console.log("Navigate to deal:", item.name);
      }}
    >
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

  const saveshop = ({ item }) => (
    <TouchableOpacity 
      style={styles.dealItem}
      onPress={() => {
        console.log("Navigate to deal:", item.name);
      }}
    >
      <Image source={{ uri: item.image }} style={styles.dealImage} />
      <View style={styles.dealInfo}>      
        <Text style={styles.dealName} numberOfLines={1}>{item.name}</Text>
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

        {/* Sponsor Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sponsor Products</Text>
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

         {/* Featured by Partners */}
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

       

        {/* Dynamic Collection Grids */}

        <CollectionGrid groupKey="featured" title="Coffee Machines" />

         {/* Featured by Partners */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Get Discount on Coffee machine</Text>
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
        <CollectionGrid groupKey="homeAppliances" title="Home Appliances" />
        <CollectionGrid groupKey="Electronics" title="Electronics" />

        {/* Save and Shop Slider */}
          <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shop & save on FAJ Tradding LLC</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={shopsave}
            renderItem={saveshop}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dealsContainer}
          />
        </View>

        {/* <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Discover Product for you</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {loadingCoffee ? (
            <ActivityIndicator size="large" color="#000" style={{ marginVertical: 20 }} />
          ) : coffeeMachines.length === 0 ? (
            <Text style={{ textAlign: "center", marginVertical: 20 }}>
              No products found.
            </Text>
          ) : (
            <FlatList
              data={coffeeMachines}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.productsGrid}
            />
          )}
        </View> */}

          
        
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
    marginHorizontal: 8,
    width: 180,
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: '600',
    lineHeight: 16,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dealImage: {
    width: '100%',
    height: 200,
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
    fontWeight: '800',
    color: '#030303ff',
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
    color: '#000000ff',
    marginBottom: 5,
    height: 35,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B12704',
  },
  bottomSpacer: {
    height: 20,
  },

  // Collection Grid Styles
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: (width - 40) / 2,
    height: 250,
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gridOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  gridText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'left',
  },
  emptyGridItem: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  emptyGridText: {
    color: '#666',
    fontSize: 14,
  },
});

export default HomePage;