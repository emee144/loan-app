import { DripsyProvider, makeTheme } from 'dripsy';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
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
        <Stack.Navigator
          initialRouteName="Signup"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="AppTabs" component={AppTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </DripsyProvider>
  );
}