import React, { useState } from 'react';
import { TextInput, Pressable } from 'react-native';
import { View, Text } from 'dripsy';
import RNPickerSelect from 'react-native-picker-select';

export default function LoanCalculator() {
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [result, setResult] = useState(null);

  const interestRate = 10; // flat 10% for all durations

  const calculateLoan = () => {
    const amt = parseFloat(amount);
    const months = parseInt(duration);

    if (!amt || !months) return;

    const interest = (amt * interestRate) / 100;
    const totalRepayment = amt + interest;
    const monthlyRepayment = totalRepayment / months;

    setResult({
      interest: interest.toFixed(2),
      totalRepayment: totalRepayment.toFixed(2),
      monthlyRepayment: monthlyRepayment.toFixed(2),
    });
  };

  return (
    <View sx={{ p: 16 }}>
      <Text sx={{ fontSize: 24, fontWeight: 'bold', mb: 16 }}>
        Loan Calculator
      </Text>

      <Text sx={{ mb: 4 }}>Loan Amount (₦)</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount"
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 12,
          borderRadius: 8,
        }}
      />

      <Text sx={{ mb: 4 }}>Repayment Duration (months)</Text>
      <RNPickerSelect
        onValueChange={setDuration}
        placeholder={{ label: 'Select duration', value: null }}
        items={[
          { label: '1 month', value: '1' },
          { label: '2 months', value: '2' },
          { label: '3 months', value: '3' },
        ]}
        style={{
          inputIOS: {
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            borderRadius: 8,
            marginBottom: 12,
          },
        }}
      />

      <Pressable
        onPress={calculateLoan}
        style={{
          backgroundColor: '#10b981',
          padding: 12,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text sx={{ color: 'white', fontWeight: 'bold' }}>Calculate</Text>
      </Pressable>

      {result && (
        <View sx={{ mt: 24, bg: '#ecfdf5', p: 16, borderRadius: 8 }}>
          <Text sx={{ fontSize: 18, mb: 6 }}>
            Monthly Repayment: ₦{result.monthlyRepayment}
          </Text>
          <Text sx={{ fontSize: 18, mb: 6 }}>
            Total Repayment: ₦{result.totalRepayment}
          </Text>
          <Text sx={{ fontSize: 18 }}>
            Interest: ₦{result.interest}
          </Text>
        </View>
      )}
    </View>
  );
}