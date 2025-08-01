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

const logo = require('../assets/loanwave.png');

const PROVIDERS = [
  { label: 'DSTV', value: 'DSTV' },
  { label: 'GOTV', value: 'GOTV' },
  { label: 'Startimes', value: 'Startimes' },
];

const PACKAGES = {
  DSTV: [
    { label: 'Padi - ₦2500', value: '2500' },
    { label: 'Yanga - ₦3500', value: '3500' },
    { label: 'Confam - ₦6200', value: '6200' },
    { label: 'Compact - ₦9800', value: '9800' },
    { label: 'Compact Plus - ₦15000', value: '15000' },
    { label: 'Premium - ₦24000', value: '24000' },
  ],
  GOTV: [
    { label: 'Smallie - ₦1200', value: '1200' },
    { label: 'Jinja - ₦2450', value: '2450' },
    { label: 'Jolli - ₦3300', value: '3300' },
    { label: 'Max - ₦4850', value: '4850' },
    { label: 'Supa - ₦6400', value: '6400' },
  ],
  Startimes: [
    { label: 'Basic - ₦1900', value: '1900' },
    { label: 'Smart - ₦2600', value: '2600' },
    { label: 'Classic - ₦3900', value: '3900' },
    { label: 'Super - ₦5200', value: '5200' },
  ],
};

export default function CableTVScreen() {
  const [provider, setProvider] = useState('');
  const [packageValue, setPackageValue] = useState('');
  const [smartcard, setSmartcard] = useState('');
  const [phone, setPhone] = useState('');
  const [payRef, setPayRef] = useState('');
  const [showPaystack, setShowPaystack] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cableHistory, setCableHistory] = useState([]);

  const auth = getAuth();
  const db = getFirestore();
  const userId = auth.currentUser?.uid;

  const formatSmartcard = (input) => {
    const digits = input.replace(/\D/g, '').slice(0, 10);
    return digits.length <= 5 ? digits : `${digits.slice(0, 5)} ${digits.slice(5)}`;
  };

  const formatPhone = (input) => {
    const digits = input.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
  };

  const fetchCableHistory = async () => {
    if (!userId) return;
    try {
      const ref = collection(db, 'users', userId, 'cablePurchases');
      const q = query(ref, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCableHistory(list);
    } catch (e) {
      console.error('Error fetching cable history:', e);
    }
  };

  useEffect(() => {
    fetchCableHistory();
  }, [userId]);

  const handlePayment = () => {
    if (!provider || !packageValue || !smartcard || !phone) {
      Alert.alert('Incomplete', 'Please fill all fields');
      return;
    }
    const ref = 'REF' + Math.floor(Math.random() * 1000000000 + 1);
    setPayRef(ref);
    setShowPaystack(true);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <Image
          source={logo}
          style={{ width: 120, height: 40, resizeMode: 'contain' }}
        />
      </View>

      <Text sx={{ fontSize: 24, fontWeight: 'bold', mb: 24, textAlign: 'center' }}>
        Pay for Cable TV
      </Text>

      <RNPickerSelect
        placeholder={{ label: 'Select Provider', value: null }}
        onValueChange={(val) => {
          setProvider(val);
          setPackageValue('');
        }}
        items={PROVIDERS}
        value={provider}
        style={{ inputIOS: inputStyle, inputAndroid: inputStyle }}
      />

      {provider && (
        <RNPickerSelect
          placeholder={{ label: 'Select Package', value: null }}
          onValueChange={setPackageValue}
          items={PACKAGES[provider] || []}
          value={packageValue}
          style={{ inputIOS: inputStyle, inputAndroid: inputStyle }}
        />
      )}

      <TextInput
        placeholder="Smartcard/IUC Number"
        keyboardType="numeric"
        value={formatSmartcard(smartcard)}
        onChangeText={text => setSmartcard(text.replace(/\D/g, '').slice(0, 10))}
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
          marginTop: 20,
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
                        amount: ${parseFloat(packageValue) * 100},
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

              if (!userId) {
                Alert.alert('Error', 'User not logged in. Please sign in again.');
                return;
              }

              try {
                const ref = collection(db, 'users', userId, 'cablePurchases');
                await addDoc(ref, {
                  provider,
                  package: packageValue,
                  smartcard,
                  phone,
                  createdAt: new Date(),
                  paystackRef: reference,
                });

                await fetchCableHistory();

                setShowSuccess(true);
                setTimeout(() => {
                  setShowSuccess(false);
                  setProvider('');
                  setPackageValue('');
                  setPhone('');
                  setSmartcard('');
                }, 2500);
              } catch (err) {
                console.error('❌ Firestore error:', err.message);
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
        Cable TV Payment History
      </Text>

      {cableHistory.length === 0 ? (
        <Text>No past transactions found.</Text>
      ) : (
        cableHistory.map((item) => (
          <View
            key={item.id}
            sx={{
              bg: '#0f172a',
              borderRadius: 8,
              textColor: 'white',
              p: 12,
              mb: 8,
              borderLeftWidth: 4,
              borderLeftColor: '#10b981',
            }}
          >
            <Text sx={{ color: 'white' }}>Provider: {item.provider}</Text>
            <Text sx={{ color: 'white' }}>Package: ₦{item.package}</Text>
            <Text sx={{ color: 'white' }}>Smartcard: {item.smartcard}</Text>
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
