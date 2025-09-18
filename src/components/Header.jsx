import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';

const Header = () => {
  return (
    <View style={styles.container}>
      {/* Top section with logo and cart */}
      <View style={styles.topSection}>
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
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff0000ff',
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
});

export default Header;