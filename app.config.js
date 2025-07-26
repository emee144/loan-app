export default {
  expo: {
    name: 'LoanApp',
    slug: 'loan-app',
    owner: 'emee144',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.emee144.loanapp',
    },
    android: {
      package: 'com.emee144.loanapp',
      permissions: ['INTERNET', 'ACCESS_NETWORK_STATE'],
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      firebaseApiKey: 'AIzaSyBjz7qJlfxFA8MJwE8nMxCKJ8k6sxMvVlE',
      firebaseAuthDomain: 'loanapp-711a0.firebaseapp.com',
      firebaseProjectId: 'loanapp-711a0',
      firebaseStorageBucket: 'loanapp-711a0.appspot.com',
      firebaseMessagingSenderId: '611858337866',
      firebaseAppId: '1:611858337866:web:e99ca1cffcf352064716b3',
      eas: {
        projectId: '11652b2b-34a6-4745-94c4-5e372366210d',
      },
    },
  },
};
