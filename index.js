<<<<<<< HEAD
import 'react-native-gesture-handler';
import 'react-native-reanimated';

=======
>>>>>>> ce05d2edea089de25d71584dcb8be55e5f57943e
import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
