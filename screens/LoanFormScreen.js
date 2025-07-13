import React, { useState } from 'react';
import {
  TextInput,
  Pressable,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { View, Text, useSx } from 'dripsy';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
].map(state => ({ label: state, value: state }));

export default function LoanFormScreen({ navigation }) {
  const sx = useSx();

  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [loanPurpose, setLoanPurpose] = useState('');
  const [repaymentMethod, setRepaymentMethod] = useState('');
  const [income, setIncome] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [repaymentDate, setRepaymentDate] = useState(new Date());
  const [dob, setDob] = useState(new Date());
  const [maritalStatus, setMaritalStatus] = useState('');
  const [state, setState] = useState('');
  const [showRepaymentPicker, setShowRepaymentPicker] = useState(false);
  const [showDobPicker, setShowDobPicker] = useState(false);

  const handleSubmit = () => {
    alert(`Loan Application:
Name: ${name}
Gender: ${gender}
Amount: ₦${amount}
Purpose: ${loanPurpose}
Duration: ${duration} months
Repayment Method: ${repaymentMethod}
Repayment Date: ${repaymentDate.toDateString()}
Date of Birth: ${dob.toDateString()}
Marital Status: ${maritalStatus}
State: ${state}
Monthly Income: ₦${income}
Employment Status: ${employmentStatus}`);
navigation.navigate('NextOfKinScreen', {
  name,
  gender,
  amount,
  loanPurpose,
  duration,
  repaymentMethod,
  income,
  employmentStatus,
  repaymentDate: repaymentDate.toISOString(),
  dob: dob.toISOString(),
  maritalStatus,
  state,
});

  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={sx({ p: 16, bg: 'white', pb: 40 })}>
        <Text sx={{ fontSize: 26, fontWeight: 'bold', textAlign: 'center', mb: 24 }}>
          Loan Application
        </Text>

        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          style={inputStyle}
        />

        <RNPickerSelect
          placeholder={{ label: 'Select Gender', value: null }}
          onValueChange={setGender}
          items={[
            { label: 'Male', value: 'Male' },
            { label: 'Female', value: 'Female' },
          ]}
          value={gender}
          style={pickerStyle}
        />

        <TextInput
          placeholder="Loan Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          style={inputStyle}
        />

        <TextInput
          placeholder="Loan Purpose"
          value={loanPurpose}
          onChangeText={setLoanPurpose}
          style={inputStyle}
        />

        <TextInput
          placeholder="Duration (months)"
          keyboardType="numeric"
          value={duration}
          onChangeText={setDuration}
          style={inputStyle}
        />

        <RNPickerSelect
          placeholder={{ label: 'Select Repayment Method', value: null }}
          onValueChange={setRepaymentMethod}
          items={[
            { label: '1 month', value: '1 month' },
            { label: '3 months', value: '3 months' },
          ]}
          value={repaymentMethod}
          style={pickerStyle}
        />

        <TextInput
          placeholder="Monthly Income"
          keyboardType="numeric"
          value={income}
          onChangeText={setIncome}
          style={inputStyle}
        />

        <RNPickerSelect
          placeholder={{ label: 'Employment Status', value: null }}
          onValueChange={setEmploymentStatus}
          items={[
            { label: 'Employed', value: 'Employed' },
            { label: 'Self-Employed', value: 'Self-Employed' },
            { label: 'Unemployed', value: 'Unemployed' },
          ]}
          value={employmentStatus}
          style={pickerStyle}
        />

        <Pressable
          onPress={() => setShowRepaymentPicker(true)}
          style={sx({ bg: '#3b82f6', borderRadius: 8, p: 12, mb: 16 })}
        >
          <Text sx={{ color: 'white', textAlign: 'center' }}>
            Repayment Date: {repaymentDate.toDateString()}
          </Text>
        </Pressable>

        {showRepaymentPicker && (
          <DateTimePicker
            value={repaymentDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowRepaymentPicker(false);
              if (date) setRepaymentDate(date);
            }}
          />
        )}

        <Pressable
          onPress={() => setShowDobPicker(true)}
          style={sx({ bg: '#3b82f6', borderRadius: 8, p: 12, mb: 16 })}
        >
          <Text sx={{ color: 'white', textAlign: 'center' }}>
            Date of Birth: {dob.toDateString()}
          </Text>
        </Pressable>

        {showDobPicker && (
          <DateTimePicker
            value={dob}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDobPicker(false);
              if (date) setDob(date);
            }}
          />
        )}

        <RNPickerSelect
          placeholder={{ label: 'Select Marital Status', value: null }}
          onValueChange={setMaritalStatus}
          items={[
            { label: 'Single', value: 'Single' },
            { label: 'Married', value: 'Married' },
          ]}
          value={maritalStatus}
          style={pickerStyle}
        />

        <RNPickerSelect
          placeholder={{ label: 'Select State', value: null }}
          onValueChange={setState}
          items={NIGERIAN_STATES}
          value={state}
          style={pickerStyle}
        />

        <Pressable
          onPress={handleSubmit}
          style={sx({ bg: 'green', p: 16, borderRadius: 8, mt: 24 })}
        >
          <Text sx={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
            Submit Loan Request
          </Text>
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