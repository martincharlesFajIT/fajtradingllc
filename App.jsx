import React from 'react';
import {
  StatusBar,
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './src/screens/HomePage';
import CollectionScreen from './src/screens/CollectionScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
     <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={HomePage}/>
          <Stack.Screen name="CollectionProducts" component={CollectionScreen}/>
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen}/>
          <Stack.Screen name="Cart" component={CartScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
      </SafeAreaProvider>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default App;