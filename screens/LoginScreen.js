import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, Alert } from 'react-native';
import { Text as DripsyText } from 'dripsy';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // ✅ make sure path is correct

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Login Successful');
      navigation.replace('AppTabs'); // ✅ Redirect to Welcome screen
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
      <DripsyText sx={{ fontSize: 24, mb: 20, textAlign: 'center', color: '#111827' }}>
        Login
      </DripsyText>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#6b7280"
        value={email}
        onChangeText={setEmail}
        style={inputStyle}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#6b7280"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={inputStyle}
      />

      <Pressable onPress={handleLogin} style={buttonStyle}>
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Login</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Signup')}>
        <Text style={{ marginTop: 10, textAlign: 'center', color: 'blue' }}>
          Don't have an account? Sign up
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

const buttonStyle = {
  backgroundColor: '#4f46e5',
  padding: 16,
  borderRadius: 8,
};
