import React, { useEffect, useState } from 'react';
import {
  TextInput,
  Pressable,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { View, Text, useSx } from 'dripsy';
import RNPickerSelect from 'react-native-picker-select';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function NextOfKinScreen() {
  const sx = useSx();
  const navigation = useNavigation();
  const route = useRoute();

useEffect(() => {
  console.log('🧾 All data in NextOfKinScreen:', route.params);
}, []);

  // Retrieve previous data (loan info)
  const previousData = route.params || {};

  const [fullName, setFullName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = () => {
    if (!fullName || !relationship || !phone) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    const isValidPhone = /^0[789][01]\d{8}$/.test(phone);
    if (!isValidPhone) {
      Alert.alert('Invalid Phone', 'Enter a valid Nigerian phone number.');
      return;
    }

    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    navigation.navigate('BankDetailsScreen', {
      ...previousData,
      nextOfKinName: fullName,
      nextOfKinPhone: phone,
      nextOfKinRelationship: relationship,
      nextOfKinEmail: email,
      nextOfKinAddress: address,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={sx({ p: 16, bg: 'white', pb: 40 })}>
          <Text sx={{ fontSize: 26, fontWeight: 'bold', textAlign: 'center', mb: 24 }}>
            Next of Kin Details
          </Text>

          <TextInput
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            style={inputStyle}
          />

          <View sx={{ mb: 16 }}>
            <RNPickerSelect
              placeholder={{ label: 'Select Relationship', value: null }}
              onValueChange={setRelationship}
              items={[
                { label: 'Parent', value: 'Parent' },
                { label: 'Sibling', value: 'Sibling' },
                { label: 'Spouse', value: 'Spouse' },
                { label: 'Child', value: 'Child' },
                { label: 'Friend', value: 'Friend' },
                { label: 'Other', value: 'Other' },
              ]}
              value={relationship}
              style={pickerStyle}
            />
          </View>

          <TextInput
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            style={inputStyle}
          />

          <TextInput
            placeholder="Email (optional)"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            style={inputStyle}
          />

          <TextInput
            placeholder="Address (optional)"
            value={address}
            onChangeText={setAddress}
            style={[inputStyle, { height: 80, textAlignVertical: 'top' }]}
            multiline
          />

          <Pressable
            onPress={handleSubmit}
            style={sx({ bg: 'green', p: 16, borderRadius: 8, mt: 24 })}
          >
            <Text sx={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
              Continue
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 12,
  marginBottom: 16,
  fontSize: 16,
  backgroundColor: 'white',
};

const pickerStyle = {
  inputIOS: inputStyle,
  inputAndroid: inputStyle,
};