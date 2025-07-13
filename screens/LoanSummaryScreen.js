import React from 'react';
import { ScrollView, Pressable, Alert } from 'react-native';
import { View, Text } from 'dripsy';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const LoanSummaryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const data = route.params || {};

  const handleSubmit = async () => {
    const auth = getAuth();
    const db = getFirestore();
    const userId = auth.currentUser?.uid;

    if (!userId) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    try {
      const loanId = new Date().getTime().toString();
      const loanRef = doc(db, 'users', userId, 'loanApplications', loanId);

      await setDoc(loanRef, {
        loanAmount: Number(data.amount),
        loanPurpose: data.loanPurpose || 'N/A',
        repaymentMonths: Number(data.duration),
        nextOfKinName: data.nextOfKinName,
        nextOfKinPhone: data.nextOfKinPhone,
        nextOfKinRelationship: data.nextOfKinRelationship,
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        bvn: data.bvn,
        cardNumber: data.cardNumber || '',
        expiry: data.expiry || '',
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      Alert.alert('Success', 'Loan application submitted!');
      navigation.navigate('LoanStatusScreen');
    } catch (error) {
      console.error('❌ Error submitting loan:', error);
      Alert.alert('Error', 'Something went wrong. Try again.');
    }
  };

  return (
    <ScrollView>
      <View sx={{ px: 16, py: 20, bg: 'green' }}>
        <Text sx={{ fontSize: 24, fontWeight: 'bold', mb: 20 }}>
          Loan Summary
        </Text>

        <Text sx={{ fontWeight: 'bold' }}>Loan Amount:</Text>
        <Text>₦{Number(data.amount).toLocaleString()}</Text>

        <Text sx={{ fontWeight: 'bold', mt: 2 }}>Purpose:</Text>
        <Text>{data.loanPurpose || 'N/A'}</Text>

        <Text sx={{ fontWeight: 'bold', mt: 2 }}>Repayment Term:</Text>
        <Text>{data.duration} months</Text>

        <Text sx={{ fontWeight: 'bold', mt: 4 }}>Next of Kin:</Text>
        <Text>Name: {data.nextOfKinName}</Text>
        <Text>Phone: {data.nextOfKinPhone}</Text>
        <Text>Relationship: {data.nextOfKinRelationship}</Text>

        <Text sx={{ fontWeight: 'bold', mt: 4 }}>Bank Details:</Text>
        <Text>Bank: {data.bankName}</Text>
        <Text>Account Number: {data.accountNumber}</Text>
        <Text>BVN: {data.bvn}</Text>

        {data.cardNumber && (
          <>
            <Text sx={{ fontWeight: 'bold', mt: 4 }}>Card:</Text>
            <Text>Card Number: **** **** **** {data.cardNumber.slice(-4)}</Text>
            <Text>Expiry: {data.expiry}</Text>
          </>
        )}

        <Pressable
          onPress={handleSubmit}
          style={{
            backgroundColor: '#008080',
            padding: 15,
            marginTop: 30,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>
            Submit Loan Application
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default LoanSummaryScreen;