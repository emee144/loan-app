import { useNavigation, useRoute } from '@react-navigation/native';
import { Text } from 'dripsy';
import { getAuth } from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, TextInput } from 'react-native';

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
      if (!cardNumber || !cvv || !expiryDate) {
        Alert.alert('Error', 'Please fill in all card fields');
        return false;
      }

      if (cardNumber.length !== 16) {
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

    console.log('📌 BVN value:', bvn);

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
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text variant="headline" sx={{ mb: 3 }}>
        Bank Details
      </Text>

      <TextInput
        placeholder="Bank Name"
        value={bankName}
        onChangeText={setBankName}
        style={{ marginBottom: 10, padding: 10, backgroundColor: '#fff', borderRadius: 8 }}
      />
      <TextInput
        placeholder="Account Number"
        value={accountNumber}
        onChangeText={setAccountNumber}
        keyboardType="numeric"
        maxLength={10}
        style={{ marginBottom: 10, padding: 10, backgroundColor: '#fff', borderRadius: 8 }}
      />
      <TextInput
        placeholder="BVN"
        value={bvn}
        onChangeText={setBvn}
        keyboardType="numeric"
        maxLength={11}
        style={{ marginBottom: 10, padding: 10, backgroundColor: '#fff', borderRadius: 8 }}
      />

      <Pressable
        onPress={() => setShowCardFields(!showCardFields)}
        style={{ marginBottom: 15, backgroundColor: '#ddd', padding: 10, borderRadius: 8 }}
      >
        <Text>{showCardFields ? 'Hide' : 'Add'} Card Info</Text>
      </Pressable>

      {showCardFields && (
        <>
          <TextInput
            placeholder="Card Number"
            value={cardNumber}
            onChangeText={setCardNumber}
            keyboardType="numeric"
            maxLength={16}
            style={{ marginBottom: 10, padding: 10, backgroundColor: '#fff', borderRadius: 8 }}
          />
          <TextInput
            placeholder="CVV"
            value={cvv}
            onChangeText={setCvv}
            keyboardType="numeric"
            maxLength={3}
            style={{ marginBottom: 10, padding: 10, backgroundColor: '#fff', borderRadius: 8 }}
          />
          <TextInput
            placeholder="Expiry Date (MM/YY)"
            value={expiryDate}
            onChangeText={setExpiryDate}
            style={{ marginBottom: 10, padding: 10, backgroundColor: '#fff', borderRadius: 8 }}
          />
        </>
      )}

      <Pressable
        onPress={handleContinue}
        style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 8 }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>Continue</Text>
      </Pressable>
    </ScrollView>
  );
}