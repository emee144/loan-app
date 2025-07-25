// navigation/AppTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import LoanScreen from '../screens/LoanScreen';
import BillsStack from './BillsStack';
import AccountScreen from '../screens/AccountScreen';
import ApplyStack from './ApplyStack'; 

const Tab = createBottomTabNavigator();

export default function AppTabs() {
 return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#10b981',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Loan') iconName = 'cash-outline';
          else if (route.name === 'Bills') iconName = 'receipt-outline';
          else if (route.name === 'Account') iconName = 'person-circle-outline';
          else if (route.name === 'Apply') iconName = 'document-text-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Loan" component={LoanScreen} />
      <Tab.Screen name="Bills" component={BillsStack} />
      <Tab.Screen name="Account" component={AccountScreen} />
      <Tab.Screen name="Apply" component={ApplyStack} />
    </Tab.Navigator>
  );
}
