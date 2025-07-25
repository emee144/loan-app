// SignupScreen.js
import React, { useState } from 'react';
import { TextInput, Alert, Image, View as RNView } from 'react-native';
import { View, Text, Pressable } from 'dripsy';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Ionicons } from '@expo/vector-icons';
import LoanWaveLogo from '../assets/loanwave.png';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email,
        phone,
        createdAt: new Date(),
      });

      Alert.alert('Success', 'Signup complete');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Signup Error', error.message);
    }
  };

  return (
    <View sx={{ flex: 1, justifyContent: 'center', px: 24, bg: '#0f172a' }}>
      <Image
        source={LoanWaveLogo}
        style={{
          width: '100%',
          height: 180,
          resizeMode: 'contain',
          marginBottom: 24,
          alignSelf: 'center',
        }}
      />

      <Text sx={{ fontSize: 26, fontWeight: 'bold', color: 'white', textAlign: 'center', mb: 16 }}>
        Let's get started
      </Text>

      <CustomInput placeholder="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <CustomInput placeholder="Phone number (optional)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

      {/* Password with Eye Icon */}
      <RNView style={inputWrapper}>
        <TextInput
          placeholder="Password"
          secureTextEntry={secure}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#94a3b8"
          autoCapitalize="none"
          style={inputField}
        />
        <Pressable onPress={() => setSecure(!secure)}>
          <Ionicons name={secure ? 'eye-off' : 'eye'} size={22} color="#94a3b8" />
        </Pressable>
      </RNView>

      <Pressable onPress={handleSignup} sx={button}>
        <Text sx={buttonText}>Sign Up</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Login')} sx={{ mt: 16 }}>
        <Text sx={{ color: '#38bdf8', textAlign: 'center' }}>
          Already have an account? Login
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
