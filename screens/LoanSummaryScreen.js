import React, { useEffect } from 'react';
import { ScrollView, Pressable, Alert } from 'react-native';
import { View, Text } from 'dripsy';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const LoanSummaryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const data = route.params || {};

  useEffect(() => {
    console.log('📦 LoanSummaryScreen route params:', route.params);
  }, []);

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
        monthlyRepayment: Number(data.monthlyRepayment),
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
    <ScrollView style={{ backgroundColor: 'white' }}>
      <View sx={{ px: 16, py: 24 }}>
        <Text sx={{ fontSize: 24, fontWeight: 'bold', color: 'green', mb: 24 }}>
          Loan Summary
        </Text>

        {/* Loan Amount */}
        <View sx={{ bg: 'green', p: 16, borderRadius: 12, mb: 16 }}>
          <Text sx={{ color: 'white', fontWeight: 'bold' }}>Loan Amount</Text>
          <Text sx={{ color: 'white' }}>₦{Number(data.amount).toLocaleString()}</Text>
        </View>

        {/* Purpose */}
        <View sx={{ bg: 'green', p: 16, borderRadius: 12, mb: 16 }}>
          <Text sx={{ color: 'white', fontWeight: 'bold' }}>Purpose</Text>
          <Text sx={{ color: 'white' }}>{data.loanPurpose || 'N/A'}</Text>
        </View>

        {/* Repayment */}
        <View sx={{ bg: 'green', p: 16, borderRadius: 12, mb: 16 }}>
          <Text sx={{ color: 'white', fontWeight: 'bold' }}>Repayment Term</Text>
          <Text sx={{ color: 'white' }}>{data.duration} months</Text>
        </View>

        {/* Monthly Repayment */}
        <View sx={{ bg: 'green', p: 16, borderRadius: 12, mb: 16 }}>
          <Text sx={{ color: 'white', fontWeight: 'bold' }}>Monthly Repayment</Text>
          <Text sx={{ color: 'white' }}>₦{Number(data.monthlyRepayment).toLocaleString()}</Text>
        </View>

        {/* Next of Kin */}
        <View sx={{ bg: 'green', p: 16, borderRadius: 12, mb: 16 }}>
          <Text sx={{ color: 'white', fontWeight: 'bold' }}>Next of Kin</Text>
          <Text sx={{ color: 'white' }}>Name: {data.nextOfKinName}</Text>
          <Text sx={{ color: 'white' }}>Phone: {data.nextOfKinPhone}</Text>
          <Text sx={{ color: 'white' }}>Relationship: {data.nextOfKinRelationship}</Text>
        </View>

        {/* Bank Details */}
        <View sx={{ bg: 'green', p: 16, borderRadius: 12, mb: 16 }}>
          <Text sx={{ color: 'white', fontWeight: 'bold' }}>Bank Details</Text>
          <Text sx={{ color: 'white' }}>Bank: {data.bankName}</Text>
          <Text sx={{ color: 'white' }}>Account Number: {data.accountNumber}</Text>
          <Text sx={{ color: 'white' }}>BVN: {data.bvn}</Text>
        </View>

        {/* Optional Card */}
        {data.cardNumber && (
          <View sx={{ bg: 'green', p: 16, borderRadius: 12, mb: 16 }}>
            <Text sx={{ color: 'white', fontWeight: 'bold' }}>Card Info</Text>
            <Text sx={{ color: 'white' }}>
              Card Number: **** **** **** {data.cardNumber.slice(-4)}
            </Text>
            <Text sx={{ color: 'white' }}>Expiry: {data.expiry}</Text>
          </View>
        )}

        {/* Submit Button */}
        <Pressable
          onPress={handleSubmit}
          style={{
            backgroundColor: '#004d40',
            padding: 16,
            marginTop: 10,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
            Submit Loan Application
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default LoanSummaryScreen;