// navigation/BillsStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BillsScreen from '../screens/BillsScreen';
import AirtimeAndDataScreen from '../screens/AirtimeAndDataScreen';
import ElectricityScreen from '../screens/ElectricityScreen';
import CableTVScreen from '../screens/CableTVScreen';
import InternetScreen from '../screens/InternetScreen';
import WaterScreen from '../screens/WaterScreen';
import GovernmentLeviesScreen from '../screens/GovernmentLeviesScreen';
console.log('ElectricityScreen loaded:', typeof ElectricityScreen);

const Stack = createNativeStackNavigator();

export default function BillsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BillsMain" component={BillsScreen} />
      <Stack.Screen name="AirtimeAndData" component={AirtimeAndDataScreen} />
      <Stack.Screen name="Electricity" component={ElectricityScreen} />
      <Stack.Screen name="CableTV" component={CableTVScreen} />
      <Stack.Screen name="Internet" component={InternetScreen} />
      <Stack.Screen name="Water" component={WaterScreen} />
      <Stack.Screen name="GovernmentLevies" component={GovernmentLeviesScreen} />
    </Stack.Navigator>
  );
}
