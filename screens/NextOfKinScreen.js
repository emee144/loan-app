import { useNavigation, useRoute } from '@react-navigation/native';
import { Text, useSx, View } from 'dripsy';
import { useEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

export default function NextOfKinScreen() {
  const sx = useSx();
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    console.log('🧾 All data in NextOfKinScreen:', route.params);
  }, []);

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
        <View style={{ flex: 1, backgroundColor: '#0f172a' }}>
          <ScrollView contentContainerStyle={sx({ p: 16, pb: 40 })}>
            <Text sx={{ fontSize: 26, fontWeight: 'bold', textAlign: 'center', mb: 24, color: '#059669' }}>
              Next of Kin Details
            </Text>

            <TextInput
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
              style={inputStyle}
              placeholderTextColor="#94a3b8"
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
              placeholderTextColor="#94a3b8"
            />

            <TextInput
              placeholder="Email (optional)"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              style={inputStyle}
              placeholderTextColor="#94a3b8"
            />

            <TextInput
              placeholder="Address (optional)"
              value={address}
              onChangeText={setAddress}
              style={[inputStyle, { height: 80, textAlignVertical: 'top' }]}
              multiline
              placeholderTextColor="#94a3b8"
            />

            <Pressable
              onPress={handleSubmit}
              style={sx({ bg: '#15803d', p: 16, borderRadius: 8, mt: 24 })}
            >
              <Text sx={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                Continue
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: '#334155',
  borderRadius: 8,
  padding: 12,
  marginBottom: 16,
  fontSize: 16,
  backgroundColor: '#1e293b',
  color: 'white',
};

const pickerStyle = {
  inputIOS: inputStyle,
  inputAndroid: inputStyle,
};
