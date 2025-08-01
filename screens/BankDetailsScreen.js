import { useNavigation, useRoute } from '@react-navigation/native';
import { Text } from 'dripsy';
import { getAuth } from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';

export default function BankDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const {
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
    monthlyRepayment,
  } = route.params;

  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bvn, setBvn] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [showCardFields, setShowCardFields] = useState(false);

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\D+/g, '').slice(0, 16); // only digits, max 16
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim(); // add space after every 4 digits
    setCardNumber(formatted);
  };

  const detectCardType = (number) => {
    const noSpaces = number.replace(/\s+/g, '');
    if (/^4/.test(noSpaces)) return 'Visa';
    if (/^5[1-5]/.test(noSpaces)) return 'MasterCard';
    if (/^506/.test(noSpaces)) return 'Verve';
    return 'Unknown';
  };

  const cardType = detectCardType(cardNumber);

  const getCardLogo = () => {
    switch (cardType) {
      case 'Visa':
        return require('../assets/visa.png');
      case 'MasterCard':
        return require('../assets/mastercard.png');
      case 'Verve':
        return require('../assets/verve.png');
      default:
        return null;
    }
  };

  const validate = () => {
    if (!bankName || !accountNumber || !bvn) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (accountNumber.length !== 10) {
      Alert.alert('Error', 'Account number must be 10 digits');
      return false;
    }

    if (bvn.length !== 11) {
      Alert.alert('Error', 'BVN must be 11 digits');
      return false;
    }

    if (showCardFields) {
      const rawCard = cardNumber.replace(/\s+/g, '');

      if (!cardNumber || !cvv || !expiryDate) {
        Alert.alert('Error', 'Please fill in all card fields');
        return false;
      }

      if (rawCard.length !== 16) {
        Alert.alert('Error', 'Card number must be 16 digits');
        return false;
      }

      if (cvv.length !== 3) {
        Alert.alert('Error', 'CVV must be 3 digits');
        return false;
      }
    }

    return true;
  };

  const handleContinue = async () => {
    if (!validate()) return;

    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Error', 'No user is logged in');
      return;
    }

    try {
      await setDoc(
        doc(db, 'users', user.uid),
        {
          bankName,
          accountNumber,
          bvn,
          cardNumber: showCardFields ? cardNumber : null,
          cvv: showCardFields ? cvv : null,
          expiry: showCardFields ? expiryDate : null,
        },
        { merge: true }
      );

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
        monthlyRepayment,
        accountNumber,
        bankName,
        bvn,
        cardNumber: showCardFields ? cardNumber : null,
        cvv: showCardFields ? cvv : null,
        expiry: showCardFields ? expiryDate : null,
      });

      Alert.alert('Success', 'Bank details saved successfully!');
    } catch (error) {
      console.error('Error saving bank details:', error);
      Alert.alert('Error', 'Failed to save bank details');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: '#0f172a', flexGrow: 1 }}>
      <Text sx={{ fontSize: 26, fontWeight: 'bold', color: '#059669', textAlign: 'center', mb: 20 }}>
        Bank Details
      </Text>

      <TextInput
        placeholder="Bank Name"
        value={bankName}
        onChangeText={setBankName}
        placeholderTextColor="#94a3b8"
        style={inputStyle}
      />
      <TextInput
        placeholder="Account Number"
        value={accountNumber}
        onChangeText={setAccountNumber}
        keyboardType="numeric"
        maxLength={10}
        placeholderTextColor="#94a3b8"
        style={inputStyle}
      />
      <TextInput
        placeholder="BVN"
        value={bvn}
        onChangeText={setBvn}
        keyboardType="numeric"
        maxLength={11}
        placeholderTextColor="#94a3b8"
        style={inputStyle}
      />

      <Pressable
        onPress={() => setShowCardFields(!showCardFields)}
        style={{
          marginBottom: 15,
          backgroundColor: '#334155',
          padding: 10,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          {showCardFields ? 'Hide' : 'Add'} Card Info
        </Text>
      </Pressable>

      {showCardFields && (
        <>
          <View style={{ position: 'relative', marginBottom: 12 }}>
            <TextInput
              placeholder="Card Number"
              value={cardNumber}
              onChangeText={formatCardNumber}
              keyboardType="numeric"
              maxLength={19} // 16 digits + 3 spaces
              placeholderTextColor="#94a3b8"
              style={{ ...inputStyle, paddingRight: 48 }}
            />
            {cardType !== 'Unknown' && (
              <View style={{ position: 'absolute', right: 12, top: 12 }}>
                <Image
                  source={getCardLogo()}
                  style={{ width: 32, height: 20, resizeMode: 'contain' }}
                />
              </View>
            )}
          </View>

          <TextInput
            placeholder="CVV"
            value={cvv}
            onChangeText={setCvv}
            keyboardType="numeric"
            maxLength={3}
            placeholderTextColor="#94a3b8"
            style={inputStyle}
          />
          <TextInput
            placeholder="Expiry Date (MM/YY)"
            value={expiryDate}
            onChangeText={setExpiryDate}
            placeholderTextColor="#94a3b8"
            style={inputStyle}
          />
        </>
      )}

      <Pressable
        onPress={handleContinue}
        style={{
          backgroundColor: '#15803d',
          padding: 15,
          borderRadius: 8,
          marginTop: 20,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          Continue
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const inputStyle = {
  marginBottom: 12,
  padding: 12,
  backgroundColor: '#1e293b',
  borderRadius: 8,
  color: 'white',
  fontSize: 16,
};
