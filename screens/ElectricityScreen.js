import { Text, View } from 'dripsy';
import { getAuth } from 'firebase/auth';
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from 'firebase/firestore';
import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Pressable,
  ScrollView, TextInput,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { WebView } from 'react-native-webview';

const PROVIDERS = [
  { label: 'IKEDC', value: 'IKEDC' },
  { label: 'EKEDC', value: 'EKEDC' },
  { label: 'KEDCO', value: 'KEDCO' },
  { label: 'EEDC', value: 'EEDC' },
  { label: 'AEDC', value: 'AEDC' },
  { label: 'PHED', value: 'PHED' },
  { label: 'JED', value: 'JED' },
  { label: 'BEDC', value: 'BEDC' },
  { label: 'IBEDC', value: 'IBEDC' },
  { label: 'YEDC', value: 'YEDC' },
];

const METER_TYPES = [
  { label: 'Prepaid', value: 'prepaid' },
  { label: 'Postpaid', value: 'postpaid' },
];

export default function ElectricityScreen() {
  const [provider, setProvider] = useState('');
  const [meterType, setMeterType] = useState('');
  const [meterNumber, setMeterNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [payRef, setPayRef] = useState('');
  const [showPaystack, setShowPaystack] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const db = getFirestore();
  const userId = auth.currentUser?.uid;

  const formatPhoneNumber = (input) => {
    const digits = input.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
  };

  const formatMeterNumber = (input) => {
    const digits = input.replace(/\D/g, '').slice(0, 13);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
  };

  const handlePayment = () => {
    const rawMeter = meterNumber.replace(/\D/g, '');
    const rawPhone = phone.replace(/\D/g, '');

    if (!provider || !meterType || !rawMeter || !rawPhone || !amount) {
      Alert.alert('Incomplete', 'Please fill all fields');
      return;
    }

    if (rawMeter.length < 11 || rawMeter.length > 13) {
      Alert.alert('Invalid Meter Number', 'Meter number must be 11–13 digits');
      return;
    }

    const ref = 'ELEC' + Math.floor(Math.random() * 1000000000 + 1);
    setPayRef(ref);
    setShowPaystack(true);
  };

  const fetchHistory = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const ref = collection(db, 'users', userId, 'electricityPurchases');
      const q = query(ref, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistory(list);
    } catch (e) {
      console.error('Error loading history:', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, [userId]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text sx={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', mb: 16 }}>
        Electricity Payment
      </Text>

      <RNPickerSelect
        placeholder={{ label: 'Select Provider', value: null }}
        onValueChange={setProvider}
        items={PROVIDERS}
        value={provider}
        style={{ inputIOS: inputStyle, inputAndroid: inputStyle }}
      />

      <RNPickerSelect
        placeholder={{ label: 'Select Meter Type', value: null }}
        onValueChange={setMeterType}
        items={METER_TYPES}
        value={meterType}
        style={{ inputIOS: inputStyle, inputAndroid: inputStyle }}
      />

      <TextInput
        placeholder="Meter Number"
        keyboardType="numeric"
        maxLength={16}
        value={formatMeterNumber(meterNumber)}
        onChangeText={(text) => setMeterNumber(text.replace(/\D/g, ''))}
        style={inputStyle}
      />

      <TextInput
        placeholder="Phone Number"
        keyboardType="phone-pad"
        maxLength={13}
        value={formatPhoneNumber(phone)}
        onChangeText={(text) => setPhone(text.replace(/\D/g, '').slice(0, 11))}
        style={inputStyle}
      />

      <TextInput
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={inputStyle}
      />

      <Pressable
        onPress={handlePayment}
        style={{ backgroundColor: '#0f172a', borderRadius: 8, padding: 16, marginTop: 20 }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          Pay with Paystack
        </Text>
      </Pressable>

      {showPaystack && (
        <WebView
          originWhitelist={['*']}
          style={{ height: Dimensions.get('window').height - 100 }}
          javaScriptEnabled
          domStorageEnabled
          source={{
            html: `
              <html>
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <script src="https://js.paystack.co/v1/inline.js"></script>
                </head>
                <body>
                  <button id="payBtn" onclick="payWithPaystack()">Pay Now</button>
                  <script>
                    function payWithPaystack() {
                      var handler = PaystackPop.setup({
                        key: 'pk_test_3d90c9da5c06a6cad785873e6ebf49e2f19216d2',
                        email: '${auth.currentUser?.email || 'user@example.com'}',
                        amount: ${parseFloat(amount) * 100},
                        currency: 'NGN',
                        ref: '${payRef}',
                        callback: function(response) {
                          window.ReactNativeWebView.postMessage('success:' + response.reference);
                        },
                        onClose: function() {
                          window.ReactNativeWebView.postMessage('cancelled');
                        }
                      });
                      handler.openIframe();
                    }
                    document.getElementById('payBtn').click();
                  </script>
                </body>
              </html>
            `,
          }}
          onMessage={async (event) => {
            const data = event.nativeEvent.data;
            if (data.startsWith('success:')) {
              const reference = data.split(':')[1];
              setShowPaystack(false);
              try {
                const ref = collection(db, 'users', userId, 'electricityPurchases');
                await addDoc(ref, {
                  provider,
                  meterType,
                  meterNumber,
                  phone,
                  amount,
                  createdAt: new Date(),
                  paystackRef: reference,
                });
                setShowSuccess(true);
                setTimeout(() => {
                  setShowSuccess(false);
                  setProvider('');
                  setMeterType('');
                  setMeterNumber('');
                  setPhone('');
                  setAmount('');
                  fetchHistory();
                }, 2500);
              } catch (err) {
                Alert.alert('Error', 'Failed to save transaction');
              }
            } else if (data === 'cancelled') {
              setShowPaystack(false);
              Alert.alert('Cancelled', 'Payment was cancelled');
            }
          }}
        />
      )}

      {showSuccess && (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <LottieView
            source={require('../assets/checkmark.json')}
            autoPlay
            loop={false}
            style={{ width: 150, height: 150 }}
          />
          <Text style={{ fontSize: 16, color: 'green', fontWeight: 'bold', marginTop: 10 }}>
            Payment Successful!
          </Text>
        </View>
      )}

      <Text sx={{ fontSize: 20, fontWeight: 'bold', mt: 32, mb: 12 }}>Purchase History</Text>

      {loading ? (
        <ActivityIndicator size="small" color="#000" />
      ) : (
        history.map(item => (
          <View key={item.id} sx={{ bg: '#0f172a', borderRadius: 8, p: 12, mb: 8 }}>
            <Text sx={{ color: 'white' }}>Provider: {item.provider}</Text>
            <Text sx={{ color: 'white' }}>Type: {item.meterType}</Text>
            <Text sx={{ color: 'white' }}>Meter: {item.meterNumber}</Text>
            <Text sx={{ color: 'white' }}>Amount: ₦{item.amount}</Text>
            <Text sx={{ color: 'white' }}>Phone: {item.phone}</Text>
            <Text sx={{ color: 'white' }}>
              Date: {new Date(item.createdAt?.toDate?.() || item.createdAt).toLocaleString()}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 12,
  marginBottom: 16,
  fontSize: 16,
  backgroundColor: 'gray',
};
