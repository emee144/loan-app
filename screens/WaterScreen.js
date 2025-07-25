import React, { useState, useEffect } from 'react';
import {
  ScrollView, TextInput, Pressable, Alert, Dimensions,
} from 'react-native';
import { View, Text } from 'dripsy';
import RNPickerSelect from 'react-native-picker-select';
import { getAuth } from 'firebase/auth';
import {
  getFirestore, collection, addDoc, query, orderBy, getDocs,
} from 'firebase/firestore';
import { WebView } from 'react-native-webview';
import LottieView from 'lottie-react-native';

const PROVIDERS = [
  { label: 'Lagos Water Board', value: 'Lagos Water' },
  { label: 'Abuja Water Board', value: 'Abuja Water' },
  { label: 'Port Harcourt Water Corp', value: 'PH Water' },
];

export default function WaterScreen() {
  const [provider, setProvider] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [payRef, setPayRef] = useState('');
  const [showPaystack, setShowPaystack] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [waterHistory, setWaterHistory] = useState([]);

  const auth = getAuth();
  const db = getFirestore();
  const userId = auth.currentUser?.uid;

  const formatPhone = (input) => {
    const digits = input.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
  };

  const handlePayment = () => {
    if (!provider || !accountNumber || !phone || !amount) {
      Alert.alert('Incomplete', 'Please fill all fields');
      return;
    }
    const ref = 'REF' + Math.floor(Math.random() * 1000000000 + 1);
    setPayRef(ref);
    setShowPaystack(true);
  };

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) return;
      try {
        const ref = collection(db, 'users', userId, 'waterPayments');
        const q = query(ref, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setWaterHistory(list);
      } catch (e) {
        console.error('Fetch error:', e);
      }
    };
    fetchHistory();
  }, [userId]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text sx={{ fontSize: 24, fontWeight: 'bold', mb: 24, textAlign: 'center' }}>
        Pay Water Bill
      </Text>

      <RNPickerSelect
        placeholder={{ label: 'Select Water Board', value: null }}
        onValueChange={setProvider}
        items={PROVIDERS}
        value={provider}
        style={{ inputIOS: inputStyle, inputAndroid: inputStyle }}
      />

      <TextInput
        placeholder="Account/Customer Number"
        keyboardType="numeric"
        value={accountNumber}
        onChangeText={text => setAccountNumber(text.replace(/\D/g, '').slice(0, 12))}
        style={inputStyle}
      />

      <TextInput
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={formatPhone(phone)}
        onChangeText={text => setPhone(text.replace(/\D/g, '').slice(0, 11))}
        style={inputStyle}
      />

      <TextInput
        placeholder="Amount (₦)"
        keyboardType="numeric"
        value={amount}
        onChangeText={text => setAmount(text.replace(/\D/g, ''))}
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
                <head><meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="https://js.paystack.co/v1/inline.js"></script></head>
                <body>
                  <button id="payBtn" onclick="payWithPaystack()">Pay Now</button>
                  <script>
                    function payWithPaystack() {
                      var handler = PaystackPop.setup({
                        key: 'pk_test_3d90c9da5c06a6cad785873e6ebf49e2f19216d2',
                        email: '${auth.currentUser?.email || 'example@example.com'}',
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
              </html>`
          }}
          onMessage={async (event) => {
            const data = event.nativeEvent.data;
            if (data.startsWith('success:')) {
              const reference = data.split(':')[1];
              setShowPaystack(false);
              const currentUserId = getAuth().currentUser?.uid;
              if (!currentUserId) return;

              try {
                const ref = collection(db, 'users', currentUserId, 'waterPayments');
                await addDoc(ref, {
                  provider,
                  accountNumber,
                  phone,
                  amount,
                  createdAt: new Date(),
                  paystackRef: reference,
                });

                const snapshot = await getDocs(query(ref, orderBy('createdAt', 'desc')));
                const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setWaterHistory(list);

                setShowSuccess(true);
                setTimeout(() => {
                  setShowSuccess(false);
                  setProvider('');
                  setAccountNumber('');
                  setPhone('');
                  setAmount('');
                }, 2500);
              } catch (err) {
                Alert.alert('Error', 'Failed to save transaction: ' + err.message);
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

      <Text sx={{ fontSize: 20, fontWeight: 'bold', mt: 32, mb: 12 }}>
        Water Payment History
      </Text>

      {waterHistory.length === 0 ? (
        <Text>No past transactions found.</Text>
      ) : (
        waterHistory.map((item) => (
          <View
            key={item.id}
            sx={{ bg: '#0f172a', borderRadius: 8, p: 12, mb: 8, borderLeftWidth: 4, borderLeftColor: '#10b981' }}
          >
            <Text sx={{ color: 'white' }}>Provider: {item.provider}</Text>
            <Text sx={{ color: 'white' }}>Account: {item.accountNumber}</Text>
            <Text sx={{ color: 'white' }}>Phone: {item.phone}</Text>
            <Text sx={{ color: 'white' }}>Amount: ₦{item.amount}</Text>
            <Text sx={{ color: 'white' }}>Date: {new Date(item.createdAt?.toDate?.() || item.createdAt).toLocaleString()}</Text>
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
  textColor: 'white',
  backgroundColor: 'grey',
};