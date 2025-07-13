import { DripsyProvider, makeTheme } from 'dripsy';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import WelcomeScreen from './screens/WelcomeScreen'; // Optional
import LoanFormScreen from './screens/LoanFormScreen';
import NextOfKinScreen from './screens/NextOfKinScreen';
import BankDetailsScreen from './screens/BankDetailsScreen';
import LoanSummaryScreen from './screens/LoanSummaryScreen';
import AirtimeAndDataScreen from './screens/AirtimeAndDataScreen';
import ElectricityScreen from './screens/ElectricityScreen';
import CableTVScreen from './screens/CableTVScreen';
import InternetScreen from './screens/InternetScreen';
import WaterScreen from './screens/WaterScreen';
import GovernmentLeviesScreen from './screens/GovernmentLeviesScreen';
import LoanStatusScreen from './screens/LoanStatusScreen'; // ✅ NEW: Import LoanStatusScreen
// ✅ NEW: Import AppTabs (footer with Loan, Bills, Account)
import AppTabs from './navigation/AppTabs';

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

          {/* 👇 This will now serve as your main "Home" tab layout */}
          <Stack.Screen name="AppTabs" component={AppTabs} />

          {/* These can be navigated from tabs or form flows */}
          <Stack.Screen name="LoanForm" component={LoanFormScreen} />
          <Stack.Screen name="NextOfKinScreen" component={NextOfKinScreen} />
          <Stack.Screen name="BankDetailsScreen" component={BankDetailsScreen} />
          <Stack.Screen name="LoanSummaryScreen" component={LoanSummaryScreen} />
          <Stack.Screen name="LoanStatusScreen" component={LoanStatusScreen} />

          {/* Optional: Keep Welcome if needed */}
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          {/* Bill-specific screens */}
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
