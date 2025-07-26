// AirtimeAndDataScreen.js
import React, { useState, useEffect } from 'react';
import {
  ScrollView, TextInput, Pressable, Alert, ActivityIndicator, Dimensions,
} from 'react-native';
import { View, Text } from 'dripsy';
import RNPickerSelect from 'react-native-picker-select';
import { getAuth } from 'firebase/auth';
import {
  getFirestore, collection, addDoc, query, orderBy, getDocs,
} from 'firebase/firestore';
import { WebView } from 'react-native-webview';
import LottieView from 'lottie-react-native';

const NETWORKS = [
  { label: 'MTN', value: 'MTN' },
  { label: 'Airtel', value: 'Airtel' },
  { label: 'Glo', value: 'Glo' },
  { label: '9mobile', value: '9mobile' },
];

const DATA_BUNDLES_BY_NETWORK = {
  MTN: [
    { label: '₦200 - 500MB', value: '200' },
    { label: '₦500 - 1.5GB', value: '500' },
    { label: '₦1000 - 3GB', value: '1000' },
    { label: '₦5000 - 20GB', value: '5000' },
  ],
  Airtel: [
    { label: '₦200 - 750MB', value: '200' },
    { label: '₦500 - 1.8GB', value: '500' },
    { label: '₦1000 - 4GB', value: '1000' },
    { label: '₦5000 - 20GB', value: '5000' },
  ],
  Glo: [
    { label: '₦200 - 1GB', value: '200' },
    { label: '₦500 - 2GB', value: '500' },
    { label: '₦1000 - 5GB', value: '1000' },
    { label: '₦5000 - 20GB', value: '5000' },
  ],
  '9mobile': [
    { label: '₦200 - 700MB', value: '200' },
    { label: '₦500 - 1.5GB', value: '500' },
    { label: '₦1000 - 3GB', value: '1000' },
    { label: '₦5000 - 20GB', value: '5000' },
  ],
};

export default function AirtimeAndDataScreen() {
  const [mode, setMode] = useState('airtime');
  const [network, setNetwork] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPaystack, setShowPaystack] = useState(false);
  const [payRef, setPayRef] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const auth = getAuth();
  const db = getFirestore();
  const userId = auth.currentUser?.uid;

  const formatPhoneNumber = (input) => {
    const digits = input.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
  };

  const handlePayment = () => {
    if (!network || !phone || !amount) {
      Alert.alert('Incomplete', 'Please fill all fields');
      return;
    }
    const ref = 'REF' + Math.floor(Math.random() * 1000000000 + 1);
    setPayRef(ref);
    setShowPaystack(true);
  };

  const fetchHistory = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const ref = collection(db, 'users', userId, `${mode}Purchases`);
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
  }, [userId, mode]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }} style={{ flex: 1, position: 'relative' }}>
      <Text sx={{ fontSize: 40, fontWeight: 'bold', textAlign: 'center', mb: 16 }}>
        Buy Airtime or Data
      </Text>

      <View sx={{ flexDirection: 'row', mb: 20, justifyContent: 'center' }}>
        <Pressable
          onPress={() => setMode('airtime')}
          style={{
            backgroundColor: mode === 'airtime' ? '#0f172a' : '#e5e7eb',
            padding: 10,
            borderRadius: 6,
            marginRight: 10,
          }}
        >
          <Text style={{ color: mode === 'airtime' ? 'white' : 'black' }}>Airtime</Text>
        </Pressable>
        <Pressable
          onPress={() => setMode('data')}
          style={{
            backgroundColor: mode === 'data' ? '#0f172a' : '#e5e7eb',
            padding: 10,
            borderRadius: 6,
          }}
        >
          <Text style={{ color: mode === 'data' ? 'white' : 'black' }}>Data</Text>
        </Pressable>
      </View>

      <RNPickerSelect
        placeholder={{ label: 'Select Network', value: null }}
        onValueChange={setNetwork}
        items={NETWORKS}
        value={network}
        style={{ inputIOS: inputStyle, inputAndroid: inputStyle }}
      />

      <TextInput
        placeholder="Phone Number"
        keyboardType="phone-pad"
        maxLength={13}
        value={formatPhoneNumber(phone)}
        onChangeText={text => setPhone(text.replace(/\D/g, '').slice(0, 11))}
        style={inputStyle}
      />

      {mode === 'airtime' ? (
        <TextInput
          placeholder="Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          style={inputStyle}
        />
      ) : (
        <>
          <RNPickerSelect
            placeholder={{ label: 'Select Data Bundle', value: null }}
            onValueChange={setAmount}
            value={amount}
            items={network ? DATA_BUNDLES_BY_NETWORK[network] || [] : []}
            style={{ inputIOS: inputStyle, inputAndroid: inputStyle }}
          />
          {amount && network && (
            <Text sx={{ mb: 16, fontWeight: '500', color: '#4b5563', mt: -10 }}>
              Selected: {
                DATA_BUNDLES_BY_NETWORK[network]?.find(bundle => bundle.value === amount)?.label || ''
              }
            </Text>
          )}
        </>
      )}

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
              </html>
            `,
          }}
          onMessage={async (event) => {
            const data = event.nativeEvent.data;
            if (data.startsWith('success:')) {
              const reference = data.split(':')[1];
              setShowPaystack(false);
              try {
                const ref = collection(db, 'users', userId, `${mode}Purchases`);
                await addDoc(ref, {
                  network,
                  phone,
                  amount,
                  type: mode,
                  createdAt: new Date(),
                  paystackRef: reference,
                });
                setShowSuccess(true);
                setTimeout(() => {
                  setShowSuccess(false);
                  setPhone('');
                  setAmount('');
                  setNetwork('');
                  fetchHistory();
                }, 2500);
                Alert.alert('Success', 'Transaction completed successfully');
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

      <Text sx={{ fontSize: 30, fontWeight: 'bold', mt: 32, mb: 12 }}>
        {mode === 'airtime' ? 'Airtime' : 'Data'} Purchase History
      </Text>

      {loading ? (
        <ActivityIndicator size="small" color="#0f172a" />
      ) : (
        history.map(item => (
          <View
            key={item.id}
            sx={{ bg: '#0f172a', borderRadius: 8, p: 12, mb: 8 }}
          >
            <Text sx={{ color: 'white' }}>Network: {item.network}</Text>
            <Text sx={{ color: 'white' }}>Phone: {item.phone}</Text>
            <Text sx={{ color: 'white' }}>Amount: ₦{item.amount}</Text>
            <Text sx={{ color: 'white' }}>Date: {new Date(item.createdAt?.toDate?.() || item.createdAt).toLocaleString()}</Text>
          </View>
        ))
      )}

      {showSuccess && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
          }}
        >
          <LottieView
            source={require('../assets/checkmark.json')}
            autoPlay
            loop={false}
            style={{ width: 180, height: 180 }}
          />
          <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold', marginTop: 16 }}>
            Payment Successful!
          </Text>
        </View>
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
  backgroundColor: 'white',
};