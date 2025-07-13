import React, { useState } from 'react';
import {
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Image,
  Animated,
  View as RNView,
} from 'react-native';
import { View, Text, useSx } from 'dripsy';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const BANKS = [
  { label: 'Access Bank', value: 'Access Bank' },
  { label: 'Citibank Nigeria', value: 'Citibank Nigeria' },
  { label: 'EcoBank', value: 'EcoBank' },
  { label: 'FBNQuest Merchant Bank', value: 'FBNQuest Merchant Bank' },
  { label: 'Fidelity Bank', value: 'Fidelity Bank' },
  { label: 'First Bank', value: 'First Bank' },
  { label: 'GTBank', value: 'GTBank' },
  { label: 'Heritage Bank', value: 'Heritage Bank' },
  { label: 'Jaiz Bank', value: 'Jaiz Bank' },
  { label: 'Keystone Bank', value: 'Keystone Bank' },
  { label: 'Polaris Bank', value: 'Polaris Bank' },
  { label: 'Providus Bank', value: 'Providus Bank' },
  { label: 'Stanbic IBTC', value: 'Stanbic IBTC' },
  { label: 'Standard Chartered Bank', value: 'Standard Chartered Bank' },
  { label: 'Sterling Bank', value: 'Sterling Bank' },
  { label: 'SunTrust Bank', value: 'SunTrust Bank' },
  { label: 'UBA', value: 'UBA' },
  { label: 'Union Bank', value: 'Union Bank' },
  { label: 'Unity Bank', value: 'Unity Bank' },
  { label: 'Wema Bank', value: 'Wema Bank' },
  { label: 'Zenith Bank', value: 'Zenith Bank' },
];

function isValidCardNumber(cardNumber) {
  const cleaned = cardNumber.replace(/\D/g, '');
  let sum = 0;
  let shouldDouble = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

function getCardType(number) {
  const cleaned = number.replace(/\D/g, '');
  if (/^4/.test(cleaned)) return 'Visa';
  if (/^5[1-5]/.test(cleaned)) return 'MasterCard';
  if (/^50|^56|^57|^58|^60|^62|^63|^65/.test(cleaned)) return 'Verve';
  return null;
}

export default function BankDetailsScreen() {
  const sx = useSx();
  const navigation = useNavigation();
  const route = useRoute();
  const previousData = route.params || {};
  const {
  amount,
  loanPurpose,
  duration,
  repaymentMethod,
  income,
  nextOfKinName,
  nextOfKinPhone,
  nextOfKinRelationship,
  nextOfKinEmail,
  nextOfKinAddress,
} = previousData;


  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [bvn, setBvn] = useState('');
  const [showCardFields, setShowCardFields] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cardType, setCardType] = useState(null);
  const [logoOpacity] = useState(new Animated.Value(0));

  const isCardNumberValid = isValidCardNumber(cardNumber);
  const isCvvValid = /^\d{3}$/.test(cvv);
  const isExpiryValid = (() => {
    const match = expiryDate.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;
    const [_, mm] = match;
    const month = parseInt(mm, 10);
    return month >= 1 && month <= 12;
  })();

  const validate = () => {
    if (!accountNumber || accountNumber.length !== 10) {
      Alert.alert('Invalid Account Number', 'Account number must be 10 digits.');
      return false;
    }
    if (!bankName) {
      Alert.alert('Bank Required', 'Please select your bank.');
      return false;
    }
    if (!bvn || bvn.length !== 11) {
      Alert.alert('Invalid BVN', 'BVN must be 11 digits.');
      return false;
    }
    if (showCardFields) {
      if (!cardNumber || !isCardNumberValid) {
        Alert.alert('Invalid Card Number', 'Please enter a valid card number.');
        return false;
      }
      if (!cvv || !isCvvValid) {
        Alert.alert('Invalid CVV', 'CVV must be 3 digits.');
        return false;
      }
      if (!expiryDate || !isExpiryValid) {
        Alert.alert('Invalid Expiry Date', 'Format should be MM/YY.');
        return false;
      }
    }
    return true;
  };

  const handleContinue = () => {
    if (!validate()) return;

navigation.navigate('LoanSummaryScreen', {
  amount,
  loanPurpose,
  duration,
  income,
  repaymentMethod,
  nextOfKinName,
  nextOfKinPhone,
  nextOfKinRelationship,
  nextOfKinEmail,
  nextOfKinAddress,
  accountNumber,
  bankName,
  bvn,
  cardNumber: showCardFields ? cardNumber : null,
  cvv: showCardFields ? cvv : null,
  expiry: showCardFields ? expiryDate : null,
});

    Alert.alert('Success', 'Bank details saved successfully!');
  };

  const getBorderColor = (isValid) => (isValid ? '#10b981' : '#ef4444');

  const fadeInLogo = () => {
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={sx({ p: 16, bg: 'white', pb: 40 })}>
        <Text sx={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', mb: 24 }}>Bank Details</Text>

        <TextInput
          placeholder="Account Number"
          keyboardType="numeric"
          maxLength={10}
          value={accountNumber}
          onChangeText={setAccountNumber}
          style={inputStyle}
        />

        <RNPickerSelect
          placeholder={{ label: 'Select Bank Name', value: null }}
          onValueChange={setBankName}
          items={BANKS}
          value={bankName}
          style={pickerStyle}
        />

        <TextInput
          placeholder="BVN"
          keyboardType="numeric"
          maxLength={11}
          value={bvn}
          onChangeText={setBvn}
          style={inputStyle}
        />

        {!showCardFields && (
          <Pressable onPress={() => setShowCardFields(true)} style={sx({ bg: '#3b82f6', borderRadius: 8, p: 12, mb: 16 })}>
            <Text sx={{ color: 'white', textAlign: 'center' }}>Add Card Details (Optional)</Text>
          </Pressable>
        )}

        {showCardFields && (
          <>
            <RNView style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <TextInput
                placeholder="Card Number"
                keyboardType="numeric"
                maxLength={23}
                value={cardNumber}
                onChangeText={(text) => {
                  const cleaned = text.replace(/\D/g, '');
                  const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || '';
                  setCardNumber(formatted);

                  const detectedType = getCardType(cleaned);
                  if (cleaned.length === 0) {
                    setCardType(null);
                    logoOpacity.setValue(0);
                  } else if (detectedType !== cardType) {
                    setCardType(detectedType);
                    logoOpacity.setValue(0);
                  }
                }}
                style={{
                  ...inputStyle,
                  flex: 1,
                  marginBottom: 0,
                  borderColor: cardNumber.length > 0 ? getBorderColor(isCardNumberValid) : '#ccc',
                }}
              />

              {cardType && (
                <Animated.View style={{ opacity: logoOpacity, marginLeft: 8 }}>
                  <Image
                    source={
                      cardType === 'Visa'
                        ? require('../assets/visa.png')
                        : cardType === 'MasterCard'
                        ? require('../assets/mastercard.png')
                        : cardType === 'Verve'
                        ? require('../assets/verve.png')
                        : null
                    }
                    onLoad={fadeInLogo}
                    onError={() => logoOpacity.setValue(0)}
                    style={{ width: 40, height: 24, resizeMode: 'contain' }}
                  />
                </Animated.View>
              )}
            </RNView>

            <RNView style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <TextInput
                placeholder="CVV"
                keyboardType="numeric"
                maxLength={3}
                value={cvv}
                onChangeText={setCvv}
                style={{
                  ...inputStyle,
                  flex: 1,
                  marginBottom: 0,
                  borderColor: cvv.length > 0 ? getBorderColor(isCvvValid) : '#ccc',
                }}
              />
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color="#6b7280"
                style={{ marginLeft: 8 }}
              />
            </RNView>

            <TextInput
              placeholder="Expiry Date (MM/YY)"
              keyboardType="numeric"
              maxLength={5}
              value={expiryDate}
              onChangeText={(text) => {
                const cleaned = text.replace(/\D/g, '');
                let formatted = '';
                if (cleaned.length === 0) {
                  formatted = '';
                } else if (cleaned.length === 1) {
                  if (parseInt(cleaned[0]) > 1) return;
                  formatted = cleaned;
                } else if (cleaned.length === 2) {
                  const mm = parseInt(cleaned, 10);
                  if (mm === 0 || mm > 12) return;
                  formatted = cleaned;
                } else {
                  const mm = parseInt(cleaned.slice(0, 2), 10);
                  if (mm === 0 || mm > 12) return;
                  formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
                }
                setExpiryDate(formatted);
              }}
              style={{
                ...inputStyle,
                borderColor: expiryDate.length > 0 ? getBorderColor(isExpiryValid) : '#ccc',
              }}
            />
          </>
        )}

        <Pressable
          onPress={handleContinue}
          style={sx({ bg: 'green', p: 16, borderRadius: 8, mt: 24 })}
        >
          <Text sx={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Continue</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
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
