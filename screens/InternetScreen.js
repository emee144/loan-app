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
  Alert,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { WebView } from 'react-native-webview';

const ISPS = [
  { label: 'Spectranet', value: 'Spectranet' },
  { label: 'Smile', value: 'Smile' },
  { label: 'Airtel Router', value: 'Airtel' },
];

const PLANS = {
  Spectranet: [
    { label: '7GB - ₦2000', value: '2000' },
    { label: '16GB - ₦4000', value: '4000' },
    { label: '30GB - ₦7000', value: '7000' },
  ],
  Smile: [
    { label: '10GB - ₦3500', value: '3500' },
    { label: '20GB - ₦6000', value: '6000' },
    { label: '50GB - ₦10000', value: '10000' },
  ],
  Airtel: [
    { label: '15GB - ₦3000', value: '3000' },
    { label: '40GB - ₦8000', value: '8000' },
    { label: '100GB - ₦15000', value: '15000' },
  ],
};

export default function InternetScreen() {
  const [provider, setProvider] = useState('');
  const [planValue, setPlanValue] = useState('');
  const [modemNumber, setModemNumber] = useState('');
  const [isp, setIsp] = useState('');
  const [phone, setPhone] = useState('');
  const [payRef, setPayRef] = useState('');
  const [showPaystack, setShowPaystack] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [internetHistory, setInternetHistory] = useState([]);

  const auth = getAuth();
  const db = getFirestore();
  const userId = auth.currentUser?.uid;

  const formatModemNumber = (input, isp) => {
    const digits = input.replace(/\D/g, '');
    if (isp === 'Spectranet') {
      return digits.slice(0, 10);
    } else if (isp === 'Smile') {
      const max = digits.slice(0, 12);
      return max.replace(/(\d{3})(?=\d)/g, '$1 ');
    } else if (isp === 'Airtel') {
      const max = digits.slice(0, 15);
      return max.replace(/(.{4})/g, '$1 ').trim();
    }
    return digits;
  };

  const formatPhone = (input) => {
    const digits = input.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
  };

  const handlePayment = () => {
    if (!provider || !planValue || !modemNumber || !phone) {
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
        const ref = collection(db, 'users', userId, 'internetPurchases');
        const q = query(ref, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setInternetHistory(list);
      } catch (e) {
        console.error('Fetch error:', e);
      }
    };
    fetchHistory();
  }, [userId]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {/* LoanWave Logo */}
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Image
          source={require('../assets/loanwave.png')}
          style={{ width: 120, height: 40, resizeMode: 'contain' }}
        />
      </View>

      <Text sx={{ fontSize: 24, fontWeight: 'bold', mb: 24, textAlign: 'center' }}>
        Internet Subscription
      </Text>

      <RNPickerSelect
        placeholder={{ label: 'Select ISP', value: null }}
        onValueChange={(val) => {
          setProvider(val);
          setPlanValue('');
          setIsp(val);
        }}
        items={ISPS}
        value={provider}
        style={{ inputIOS: inputStyle, inputAndroid: inputStyle }}
      />

      {provider && (
        <RNPickerSelect
          placeholder={{ label: 'Select Plan', value: null }}
          onValueChange={setPlanValue}
          items={PLANS[provider] || []}
          value={planValue}
          style={{ inputIOS: inputStyle, inputAndroid: inputStyle }}
        />
      )}

      <TextInput
        placeholder="Modem / Account Number"
        keyboardType="numeric"
        value={formatModemNumber(modemNumber, isp)}
        onChangeText={text => setModemNumber(text.replace(/\D/g, ''))}
        style={inputStyle}
      />

      <TextInput
        placeholder="Phone Number"
        keyboardType="phone-pad"
        maxLength={13}
        value={formatPhone(phone)}
        onChangeText={text => setPhone(text.replace(/\D/g, '').slice(0, 11))}
        style={inputStyle}
      />

      <Pressable
        onPress={handlePayment}
        style={{
          backgroundColor: '#0f172a',
          borderRadius: 8,
          padding: 16,
          marginTop: 20
        }}
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
                        amount: ${parseFloat(planValue) * 100},
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
                const ref = collection(db, 'users', currentUserId, 'internetPurchases');
                await addDoc(ref, {
                  provider,
                  plan: planValue,
                  modemNumber,
                  phone,
                  createdAt: new Date(),
                  paystackRef: reference,
                });
                const snapshot = await getDocs(query(ref, orderBy('createdAt', 'desc')));
                const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setInternetHistory(list);
                setShowSuccess(true);
                setTimeout(() => {
                  setShowSuccess(false);
                  setProvider('');
                  setPlanValue('');
                  setPhone('');
                  setModemNumber('');
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
        Internet Subscription History
      </Text>

      {internetHistory.length === 0 ? (
        <Text>No past transactions found.</Text>
      ) : (
        internetHistory.map((item) => (
          <View
            key={item.id}
            sx={{
              bg: '#0f172a',
              borderRadius: 8,
              p: 12,
              mb: 8,
              borderLeftWidth: 4,
              borderLeftColor: '#10b981'
            }}
          >
            <Text sx={{ color: 'white' }}>Provider: {item.provider}</Text>
            <Text sx={{ color: 'white' }}>Plan: ₦{item.plan}</Text>
            <Text sx={{ color: 'white' }}>Modem ID: {item.modemNumber}</Text>
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
  color: 'white',
  backgroundColor: 'grey',
};
