import React, { useState } from 'react';
import { TextInput, Alert } from 'react-native';
import { View, Text, Pressable } from 'dripsy';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // ✅ make sure db is exported from firebase.js

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Save phone number to Firestore (optional)
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
    <View sx={{ flex: 1, justifyContent: 'center', px: 24, bg: '#f3f4f6' }}>
      <Text sx={{ fontSize: 28, fontWeight: 'bold', mb: 24, textAlign: 'center', color: '#111827' }}>
        Create an Account
      </Text>

      <TextInput
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={inputStyle}
        autoCapitalize="none"
        placeholderTextColor="#6b7280"
      />

      <TextInput
        placeholder="Phone Number (optional)"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={inputStyle}
        placeholderTextColor="#6b7280"
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={inputStyle}
        placeholderTextColor="#6b7280"
        autoCapitalize="none"
      />

      <Pressable onPress={handleSignup} sx={{ bg: 'primary', p: 16, borderRadius: 8, mt: 16 }}>
        <Text sx={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          Sign Up
        </Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Login')} sx={{ mt: 16 }}>
        <Text sx={{ color: 'blue', textAlign: 'center' }}>
          Already have an account? Login
        </Text>
      </Pressable>
    </View>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: '#d1d5db',
  borderRadius: 8,
  padding: 12,
  marginBottom: 16,
  fontSize: 16,
  backgroundColor: 'white',
  color: '#111827',
};
