import React, { useEffect, useState, useRef } from 'react';
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
  const bannerRef = useRef(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const [collections, setCollections] = useState({});
  const [loading, setLoading] = useState({});

  const COLLECTION_GROUPS = {
    featured: {
      title: "Coffee Machines",
      handles: [
        'professional-espresso-machines',
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
    },
    commercialequipment: {
      title: "Commercial Equipment",
      handles: [
        'laundry-equipment',
        'refrigeration-equipment',
        'air-conditioners',
        'kitchen-equipment'
      ]
    }
  };

  // Categories with their Shopify collection handles
  const categories = [
    {
      id: 1,
      name: 'Coffee Machine',
      handle: 'professional-espresso-machines',
      image: 'https://www.fajtradingllc.com/cdn/shop/collections/refrigerator_82110317-e2b4-47b5-8395-54aade9aaf0f_200x200.jpg?v=1746439090'
    },
    {
      id: 2,
      name: 'Vacuum Cleaner',
      handle: 'robot-vacuum-cleaners',
      image: 'https://www.fajtradingllc.com/cdn/shop/collections/robotic-vacuum-cleaner_a0aa2b94-945e-4fa8-8990-8a02e39273e7_375x.jpg?v=1746444970'
    },
    {
      id: 3,
      name: 'Washing Machine',
      handle: 'washing-machines',
      image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=300&h=400&fit=crop&crop=center'
    },
    {
      id: 4,
      name: 'Cookers',
      handle: 'cookers',
      image: 'https://www.fajtradingllc.com/cdn/shop/collections/Dr_Coffee_F11_Pro_Fully_Automatic_Coffee_Machine_535x.png?v=1746437119'
    },
    {
      id: 5,
      name: 'Air Conditioner',
      handle: 'air-conditioners',
      image: 'https://www.fajtradingllc.com/cdn/shop/collections/ac_39ccf573-4268-48b7-bfb6-c90f3ea4fc32_535x.jpg?v=1746443774'
    },
    {
      id: 6,
      name: 'Dishwasher',
      handle: 'dishwashers',
      image: 'https://cdn.shopify.com/s/files/1/0706/8139/5436/collections/dishwasher.jpg?v=1746440666'
    },
    {
      id: 7,
      name: 'Refrigerators',
      handle: 'refrigerator',
      image: 'https://www.fajtradingllc.com/cdn/shop/collections/refrigerator_375x.jpg?v=1746432020'
    },
  ];

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
        const products = await fetchProductsByCollection("professional-espresso-machines");
        setCoffeeMachines(products.products || products);
      } catch (error) {
        console.error("Error fetching espresso-machines products:", error);
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
    { id: 1, image: 'https://cdn.shopify.com/s/files/1/0706/8139/5436/files/mobile_app_banner.jpg?v=1764572984' },
    { id: 2, image: 'https://cdn.shopify.com/s/files/1/0706/8139/5436/files/Faj_Trading_llc_Mobile_Banner_2-01_1.jpg?v=1764576243' },
  ];

  // Auto-slide effect for banner
  useEffect(() => {
    if (bannerData.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % bannerData.length;

        if (bannerRef.current) {
          bannerRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
        }

        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [bannerData.length]);

  const handleBannerScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / (width - 20));
    setCurrentBannerIndex(index);
  };

  const deals = [
    { id: 1, image: 'https://www.fajtradingllc.com/cdn/shop/files/De_Longhi_ECAM450.55.G_Eletta_Explore_Grey_Automatic_Coffee_Machine_-_Black_7c7c3f85-d7a1-4ce5-853e-245beb9e93a6_375x.jpg?v=1738126233',
      link: 'CollectionProducts',
      params: { 
      handle: 'de-longhi-dedica-arte-pump-espresso',
      title: 'Delonghi Dedica Arte Pump' 
      }
    },
    { id: 2, image: 'https://www.fajtradingllc.com/cdn/shop/files/Marco_T20_Ecoboiler_20Ltr_Automatic_Hot_Water_Boiler_3b028443-8d3c-4215-90ab-7d794929cfa9_375x.jpg?v=1738125949',
      link: 'CollectionProducts',
      params: { 
      handle: 'automatic-coffee-machine',
      title: 'Automatic Coffee Machines' 
      }
    },
    { id: 3, image: 'https://www.fajtradingllc.com/cdn/shop/files/espresso_machine_375x.jpg?v=1738125802',
      link: 'CollectionProducts',
      params: { 
      handle: 'espresso-machines',
      title: 'Espresso Machines' 
      }
    },
    { id: 4, image: 'https://www.fajtradingllc.com/cdn/shop/files/La_Marzocco_Linea_PB_3_Group_AV_Automatic_Espresso_Machine_ff577260-890b-424d-9d4a-0bd7ded64467_11zon_375x.jpg?v=1744962755',
      link: 'CollectionProducts',
      params: { 
      handle: '3-group-espresso-machines',
      title: '3 Group Espresso Machines' 
      }
    },
    { id: 5, image: 'https://www.fajtradingllc.com/cdn/shop/files/single_group_375x.jpg?v=1738125898',
      link: 'CollectionProducts',
      params: { 
      handle: 'single-group-espresso-machine',
      title: 'Single Group Espresso Machine' 
      }
    },
    { id: 6, image: 'https://www.fajtradingllc.com/cdn/shop/files/2_group_espresso_machine_375x.jpg?v=1738125660',
      link: 'CollectionProducts',
      params: { 
      handle: 'single-group-espresso-machine',
      title: 'Single Group Espresso Machine' 
      }
    },
  ];

  const Homeappliancedeals = [
    { id: 1, image: 'https://www.fajtradingllc.com/cdn/shop/files/ac_f1c5368e-ebfb-4759-a1c3-95e800b9af98_375x.jpg?v=1737702308',
      link: 'CollectionProducts',
      params: { 
      handle: 'air-conditioners',
      title: 'Air Conditioners' 
      }
    },
    { id: 2, image: 'https://www.fajtradingllc.com/cdn/shop/files/washing-machine_92906805-21f3-462d-aa17-b7a35fefcbfa_375x.jpg?v=1738044028',
      link: 'CollectionProducts',
      params: { 
      handle: 'washing-machines',
      title: 'Washing Machine' 
      }
    },
    { id: 3, image: 'https://www.fajtradingllc.com/cdn/shop/files/oven_4b038e12-1edd-4afd-a552-c9246a4f662c_375x.jpg?v=1738131296',
      link: 'CollectionProducts',
      params: { 
      handle: 'ovens',
      title: 'Ovens' 
      }
    },
    { id: 4, image: 'https://www.fajtradingllc.com/cdn/shop/files/refrigerator_cb6510b3-e870-4829-a047-48b417e9f806_375x.jpg?v=1738131138',
      link: 'CollectionProducts',
      params: { 
      handle: 'refrigerators',
      title: 'Refrigerator' 
      }
    },
     { id: 5, image: 'http://fajtradingllc.com/cdn/shop/files/dishwasher_fb5b1d17-9b30-4b0b-bf75-7d52f364ba94_375x.jpg?v=1737702362',
      link: 'CollectionProducts',
      params: { 
      handle: 'dishwashers',
      title: 'Dishwasher' 
      }
    },
    { id: 6, image: 'https://www.fajtradingllc.com/cdn/shop/files/grinder_375x.jpg?v=1738131395',
      link: 'CollectionProducts',
      params: { 
      handle: 'mixer-grinder',
      title: 'Mixer Grinder' 
      }
    },
  ];

  const electronicdeals = [
    { id: 1, image: 'https://www.fajtradingllc.com/cdn/shop/files/IC3-Converter-RS232-RS485_375x.jpg?v=1738556122',
      link: 'CollectionProducts',
      params: { 
      handle: 'energy-power-quality-analyzer',
      title: 'Janitza Power Supply Analyzer' 
      }
    },
    { id: 2, image: 'https://www.fajtradingllc.com/cdn/shop/files/TRM210-PID-Controller_1_375x.jpg?v=1738556196',
      link: 'CollectionProducts',
      params: { 
      handle: 'energy-power-quality-analyzer',
      title: 'Energy Power Quality Analyzer' 
      }
    },
    { id: 3, image: 'https://www.fajtradingllc.com/cdn/shop/files/H248f55ec5705419da73908098388c591Q_720x.jpg?v=1757919883',
      link: 'CollectionProducts',
      params: { 
      handle: 'stabilizer-and-transformer',
      title: 'Stabilizer and Transformer' 
      }
    },
    { id: 4, image: 'https://www.fajtradingllc.com/cdn/shop/files/1_5f368c1b-2f49-429f-9790-077a7a76654e_375x.jpg?v=1739765733',
      link: 'CollectionProducts',
      params: { 
      handle: 'dehumidifier',
      title: 'Dehumidifier'
      }
    },
  ];

  const commercialequipmentdeals = [
    { id: 1, image: 'https://www.fajtradingllc.com/cdn/shop/files/portable_air_condition_375x.png?v=1738151645',
      link: 'CollectionProducts',
      params: { 
      handle: 'floor-standing',
      title: 'Floor Standing' 
      }
    },
    { id: 2, image: 'https://www.fajtradingllc.com/cdn/shop/files/fridge_1_1_375x.png?v=1738151432',
      link: 'CollectionProducts',
      params: { 
      handle: 'refrigerators',
      title: 'Refrigerators' 
      }
    },
    { id: 3, image: 'https://www.fajtradingllc.com/cdn/shop/files/fridge_2_1_375x.png?v=1738152093',
      link: 'CollectionProducts',
      params: { 
      handle: 'refrigeration-equipment',
      title: 'Refrigeration Equipment' 
      }
    },
    { id: 4, image: 'https://www.fajtradingllc.com/cdn/shop/files/spli_air_condition_375x.png?v=1738151394',
      link: 'CollectionProducts',
      params: { 
      handle: 'air-conditioners',
      title: 'Air Conditioners'
      }
    },
  ];

  const CollectionGrid = ({ groupKey, title }) => {
    const groupCollections = collections[groupKey] || [];
    const isLoading = loading[groupKey];

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <TouchableOpacity>
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

  const renderBanner = ({ item }) => (
    <TouchableOpacity style={styles.bannerItem}>
      <Image source={{ uri: item.image }} style={styles.bannerImage} />
    </TouchableOpacity>
  );

  // Updated renderCategory to make it clickable
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => {
        console.log("🔗 Navigate to category:", item.name, "handle:", item.handle);
        navigation.navigate('CollectionProducts', {
          handle: item.handle,
          title: item.name
        });
      }}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.categoryImage} />
      <View style={styles.categoryOverlay}>
        <Text style={styles.categoryName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

const renderDeal = ({ item }) => (
  <TouchableOpacity
    style={styles.dealItem}
    onPress={() => {
      console.log("Navigate to:", item.params?.title || item.name);
      if (item.link && item.params) {
        navigation.navigate(item.link, item.params);
      }
    }}
    activeOpacity={0.7}
  >
    <Image source={{ uri: item.image }} style={styles.dealImage} />
    {item.name && (
      <View style={styles.dealInfo}>
        <Text style={styles.dealName} numberOfLines={1}>{item.name}</Text>
        {item.salePrice && (
          <View style={styles.priceContainer}>
            <Text style={styles.salePrice}>{item.salePrice}</Text>
            {item.originalPrice && (
              <Text style={styles.originalPrice}>{item.originalPrice}</Text>
            )}
          </View>
        )}
      </View>
    )}
  </TouchableOpacity>
);

 const Homeapplianceslider = ({ item }) => (
  <TouchableOpacity
    style={styles.dealItem}
    onPress={() => {
      console.log("Navigate to:", item.params?.title);
      if (item.link && item.params) {
        navigation.navigate(item.link, item.params);
      }
    }}
    activeOpacity={0.7}
  >
    <Image source={{ uri: item.image }} style={styles.dealImage} />
  </TouchableOpacity>
);

const electronicslider = ({ item }) => (
  <TouchableOpacity
    style={styles.dealItem}
    onPress={() => {
      console.log("Navigate to:", item.params?.title);
      if (item.link && item.params) {
        navigation.navigate(item.link, item.params);
      }
    }}
    activeOpacity={0.7}
  >
    <Image source={{ uri: item.image }} style={styles.dealImage} />
  </TouchableOpacity>
);

const commercialslider = ({ item }) => (
  <TouchableOpacity
    style={styles.dealItem}
    onPress={() => {
      console.log("Navigate to:", item.params?.title);
      if (item.link && item.params) {
        navigation.navigate(item.link, item.params);
      }
    }}
    activeOpacity={0.7}
  >
    <Image source={{ uri: item.image }} style={styles.dealImage} />
  </TouchableOpacity>
);

  // const saveshop = ({ item }) => (
  //   <TouchableOpacity
  //     style={styles.dealItem}
  //     onPress={() => {
  //       console.log("Navigate to:", item.name);
  //       if (item.link && item.params) {
  //         navigation.navigate(item.link, item.params);
  //       }
  //     }}
  //     activeOpacity={0.7}
  //   >
  //     <Image source={{ uri: item.image }} style={styles.dealImage} />
  //     <View style={styles.dealInfo}>
  //       <Text style={styles.dealName} numberOfLines={1}>{item.name}</Text>
  //     </View>
  //   </TouchableOpacity>
  // );

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner Carousel */}
        <View style={styles.section}>
          <FlatList
            ref={bannerRef}
            data={bannerData}
            renderItem={renderBanner}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToInterval={width - 20}
            decelerationRate="fast"
            onMomentumScrollEnd={handleBannerScroll}
            onScrollToIndexFailed={(info) => {
              console.log('Banner scroll failed:', info);
            }}
          />
        </View>

        {/* Categories - Now Clickable! */}
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

        {/* Dynamic Collection Grids */}
        <CollectionGrid groupKey="featured" title="Coffee Machines" />

        {/* Get Discount on Coffee machine */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Get Discount on Coffee machine</Text>
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
         {/* Get Discount on Home Appliance */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Get Discount on Home Appliances</Text>
          </View>
          <FlatList
            data={Homeappliancedeals}
            renderItem={Homeapplianceslider}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dealsContainer}
          />
        </View>

        
        <CollectionGrid groupKey="Electronics" title="Electronics" />
        {/* Get Discount on Electronics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Get Discount on Stabilizer's & Energy Meter's</Text>
          </View>
          <FlatList
            data={electronicdeals}
            renderItem={electronicslider}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dealsContainer}
          />
        </View>

        <CollectionGrid groupKey="commercialequipment" title="Commercial Equipment" />
        {/* Get Discount on Electronics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Get Discount on Stabilizer's & Energy Meter's</Text>
          </View>
          <FlatList
            data={commercialequipmentdeals}
            renderItem={commercialslider}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dealsContainer}
          />
        </View>
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
  bannerIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 15,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C4C4C4',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#da4925ff',
    width: 20,
    borderRadius: 4,
  },
  categoriesContainer: {
    paddingHorizontal: 10,
  },
  categoryItem: {
    marginHorizontal: 8,
    width: 280,
    height: 280,
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