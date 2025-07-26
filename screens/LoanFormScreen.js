import DateTimePicker from '@react-native-community/datetimepicker';
import { Text, useSx, View } from 'dripsy';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { auth, db } from '../firebase';

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
  const [userEmail, setUserEmail] = useState('');
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
  const [monthlyRepayment, setMonthlyRepayment] = useState(null);

  const INTEREST_RATE = 0.05; // 5% monthly interest

  useEffect(() => {
    if (amount && duration) {
      const principal = parseFloat(amount);
      const months = parseInt(duration);
      if (!isNaN(principal) && !isNaN(months) && months > 0) {
        const totalRepayable = principal + (principal * INTEREST_RATE * months);
        const monthly = totalRepayable / months;
        setMonthlyRepayment(monthly.toFixed(2));
      } else {
        setMonthlyRepayment(null);
      }
    } else {
      setMonthlyRepayment(null);
    }
  }, [amount, duration]);

  const handleSubmit = () => {
    if (!name || !gender || !amount || !loanPurpose || !duration || !repaymentMethod || !income || !employmentStatus || !dob || !repaymentDate || !maritalStatus || !state) {
      Alert.alert('Incomplete Form', 'Please fill out all required fields.');
      return;
    }

    navigation.navigate('NextOfKinScreen', {
      email: userEmail,
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
      monthlyRepayment,
    });
  };

  useEffect(() => {
    const fetchEmail = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserEmail(data.email || user.email);
        }
      }
    };
    fetchEmail();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={sx({ p: 16, bg: 'white', pb: 40 })}>
        <Text sx={{ fontSize: 26, fontWeight: 'bold', textAlign: 'center', mb: 24 }}>
          Loan Application
        </Text>

        <Text sx={{ fontSize: 16, fontWeight: 'bold', mb: 8, color: '#1f2937' }}>
          Email: {userEmail}
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
          onChangeText={(text) => setAmount(text.replace(/[^0-9.]/g, ''))}
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

        {monthlyRepayment && (
          <View sx={{ mb: 16, bg: '#f0fdf4', p: 12, borderRadius: 8 }}>
            <Text sx={{ color: '#15803d', fontWeight: 'bold', fontSize: 16 }}>
              Estimated Monthly Repayment: ₦{monthlyRepayment}
            </Text>
          </View>
        )}

        <RNPickerSelect
          placeholder={{ label: 'Select Repayment Method', value: null }}
          onValueChange={(value) => {
            setRepaymentMethod(value);
            const num = parseInt(value);
            if (!isNaN(num)) setDuration(num.toString());
          }}
          items={[
            { label: '1 month', value: '1 month' },
            { label: '2 months', value: '2 months' },
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
