import React, { useState, useEffect } from 'react';
import { TextInput, Image, Alert, View as RNView } from 'react-native';
import { View, Text, Pressable } from 'dripsy';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import LoanWaveLogo from '../assets/loanwave.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      const storedSession = await AsyncStorage.getItem('userSession');
      if (storedSession) {
        const { email: savedEmail } = JSON.parse(storedSession);
        setEmail(savedEmail);
        setRememberMe(true);
      }
    };
    loadSession();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (rememberMe) {
        await AsyncStorage.setItem('userSession', JSON.stringify({ email }));
      } else {
        await AsyncStorage.removeItem('userSession');
      }
      Alert.alert('Login Successful');
      navigation.replace('AppTabs');
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

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

      <CustomInput placeholder="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" />

      {/* Password with toggle icon */}
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

      {/* Remember Me */}
      <Pressable onPress={() => setRememberMe(!rememberMe)} sx={{ flexDirection: 'row', alignItems: 'center', mb: 16 }}>
        <Ionicons
          name={rememberMe ? 'checkbox' : 'square-outline'}
          size={22}
          color="#38bdf8"
          style={{ marginRight: 8 }}
        />
        <Text sx={{ color: '#cbd5e1' }}>Remember Me</Text>
      </Pressable>

      <Pressable onPress={handleLogin} sx={button}>
        <Text sx={buttonText}>Login</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Signup')} sx={{ mt: 16 }}>
        <Text sx={{ color: '#38bdf8', textAlign: 'center' }}>
          Don't have an account? Sign up
        </Text>
      </Pressable>
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