// navigation/ApplyStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ApplyScreen from '../screens/ApplyScreen';
import LoanFormScreen from '../screens/LoanFormScreen';
import NextOfKinScreen from '../screens/NextOfKinScreen';
import BankDetailsScreen from '../screens/BankDetailsScreen';
import LoanSummaryScreen from '../screens/LoanSummaryScreen';
import LoanStatusScreen from '../screens/LoanStatusScreen';

const Stack = createNativeStackNavigator();

export default function ApplyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ApplyScreen" component={ApplyScreen} />
      <Stack.Screen name="LoanFormScreen" component={LoanFormScreen} />
      <Stack.Screen name="NextOfKinScreen" component={NextOfKinScreen} />
      <Stack.Screen name="BankDetailsScreen" component={BankDetailsScreen} />
      <Stack.Screen name="LoanSummaryScreen" component={LoanSummaryScreen} />
      <Stack.Screen name="LoanStatusScreen" component={LoanStatusScreen} />
    </Stack.Navigator>
  );
}