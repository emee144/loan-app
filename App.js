import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DripsyProvider, makeTheme } from 'dripsy';

import AppTabs from './navigation/AppTabs';
import AirtimeAndDataScreen from './screens/AirtimeAndDataScreen';
import BankDetailsScreen from './screens/BankDetailsScreen';
import CableTVScreen from './screens/CableTVScreen';
import ElectricityScreen from './screens/ElectricityScreen';
import GovernmentLeviesScreen from './screens/GovernmentLeviesScreen';
import InternetScreen from './screens/InternetScreen';
import LoanFormScreen from './screens/LoanFormScreen';
import LoanStatusScreen from './screens/LoanStatusScreen';
import LoanSummaryScreen from './screens/LoanSummaryScreen';
import LoginScreen from './screens/LoginScreen';
import NextOfKinScreen from './screens/NextOfKinScreen';
import SignupScreen from './screens/SignupScreen';
import WaterScreen from './screens/WaterScreen';
import WelcomeScreen from './screens/WelcomeScreen';

const Stack = createNativeStackNavigator();

const theme = makeTheme({
  colors: {
    text: '#000',
    background: '#fff',
    primary: '#4f46e5',
    secondary: '#10b981',
  },
  space: {
    sm: 8,
    md: 16,
    lg: 24,
  },
  text: {
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    body: {
      fontSize: 16,
    },
  },
});

export default function App() {
  return (
    <DripsyProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Signup" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="AppTabs" component={AppTabs} />
          <Stack.Screen name="LoanForm" component={LoanFormScreen} />
          <Stack.Screen name="NextOfKinScreen" component={NextOfKinScreen} />
          <Stack.Screen name="BankDetailsScreen" component={BankDetailsScreen} />
          <Stack.Screen name="LoanSummaryScreen" component={LoanSummaryScreen} />
          <Stack.Screen name="LoanStatusScreen" component={LoanStatusScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="AirtimeAndData" component={AirtimeAndDataScreen} />
          <Stack.Screen name="Electricity" component={ElectricityScreen} />
          <Stack.Screen name="CableTV" component={CableTVScreen} />
          <Stack.Screen name="Internet" component={InternetScreen} />
          <Stack.Screen name="Water" component={WaterScreen} />
          <Stack.Screen name="GovernmentLevies" component={GovernmentLeviesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </DripsyProvider>
  );
}
