import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'dripsy';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  View as RNView,
  TextInput,
} from 'react-native';
import LoanWaveLogo from '../assets/loanwave.png';
import { auth, db } from '../firebase';
import { useBiometricSession } from '../hooks/useBiometricSession';

export default function LoginScreen({ navigation }) {
  const {
    isLoggedIn,
    isLoading,
    isBiometricAvailable,
    hasEnrolled,
    saveSession,
    unlockWithBiometrics,
    clearSession,
  } = useBiometricSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [doingLogin, setDoingLogin] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    const tryAutoBiometricLogin = async () => {
      const success = await unlockWithBiometrics();
      if (success) {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('🔐 Loaded profile:', userData.fullName);
          }
        }

        Alert.alert('Unlocked', 'Logged in with biometrics.');
        navigation.replace('AppTabs');
      }
    };

    tryAutoBiometricLogin();
  }, [isLoading]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Input required', 'Please enter email and password.');
      return;
    }

    setDoingLogin(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await userCredential.user.getIdToken();

      if (rememberMe) {
        await saveSession(email, password);
      } else {
        await clearSession();
      }

      Alert.alert('Success', 'Logged in. Next time you can use biometrics.');
      navigation.replace('AppTabs');
    } catch (err) {
      Alert.alert('Login Error', err.message || String(err));
    } finally {
      setDoingLogin(false);
    }
  };

  const handleBiometric = async () => {
    const ok = await unlockWithBiometrics();
    if (ok) {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('🔐 Loaded profile:', userData.fullName);
        }
      }
      Alert.alert('Unlocked', 'Logged in with biometrics.');
      navigation.replace('AppTabs');
    } else {
      Alert.alert('Failed', 'Biometric login failed or no session saved.');
    }
  };

  if (isLoading) {
    return (
      <View sx={{ flex: 1, justifyContent: 'center', px: 24, bg: '#0f172a' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View sx={{ flex: 1, px: 24, justifyContent: 'center', bg: '#0f172a' }}>
      <Image
        source={LoanWaveLogo}
        style={{
          width: '100%',
          height: 180,
          resizeMode: 'contain',
          alignSelf: 'center',
          marginBottom: 24,
        }}
      />

      <Text sx={{ fontSize: 26, fontWeight: 'bold', color: 'white', textAlign: 'center', mb: 16 }}>
        Welcome back!
      </Text>

      <CustomInput
        placeholder="Email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <RNView style={inputWrapper}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#94a3b8"
          secureTextEntry={secure}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          style={inputField}
        />
        <Pressable onPress={() => setSecure(!secure)}>
          <Ionicons name={secure ? 'eye-off' : 'eye'} size={22} color="#94a3b8" />
        </Pressable>
      </RNView>

      <Pressable onPress={() => setRememberMe(!rememberMe)} sx={{ flexDirection: 'row', alignItems: 'center', mb: 16 }}>
        <Ionicons
          name={rememberMe ? 'checkbox' : 'square-outline'}
          size={22}
          color="#38bdf8"
          style={{ marginRight: 8 }}
        />
        <Text sx={{ color: '#cbd5e1' }}>Remember Me (enable biometrics next time)</Text>
      </Pressable>

      <Pressable onPress={handleLogin} sx={button} disabled={doingLogin}>
        <Text sx={buttonText}>{doingLogin ? 'Logging in...' : 'Login'}</Text>
      </Pressable>

      {isBiometricAvailable && hasEnrolled && (
        <>
          <View style={{ height: 12 }} />
          <Pressable onPress={handleBiometric} sx={{ ...button, backgroundColor: '#10b981' }}>
            <Text sx={buttonText}>Login with Biometrics</Text>
          </Pressable>
        </>
      )}

      <Pressable onPress={() => navigation.navigate('Signup')} sx={{ mt: 16 }}>
        <Text sx={{ color: '#38bdf8', textAlign: 'center' }}>
          Don't have an account? Sign up
        </Text>
      </Pressable>

      <View style={{ marginTop: 20 }}>
        <Pressable onPress={clearSession}>
          <Text sx={{ color: '#f87171', textAlign: 'center', fontSize: 12 }}>
            Clear saved biometric session
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const inputWrapper = {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#334155',
  borderRadius: 12,
  padding: 12,
  marginBottom: 16,
  backgroundColor: '#1e293b',
};

const inputField = {
  flex: 1,
  fontSize: 16,
  color: 'white',
};

const button = {
  backgroundColor: '#2563eb',
  p: 16,
  borderRadius: 12,
  mt: 8,
};

const buttonText = {
  color: 'white',
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: 16,
};

function CustomInput({ placeholder, ...props }) {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#94a3b8"
      style={{
        ...inputWrapper,
        color: 'white',
      }}
      {...props}
    />
  );
}
