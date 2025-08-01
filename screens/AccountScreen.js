import { useNavigation } from '@react-navigation/native';
import { Text, useSx, View } from 'dripsy';
import { getAuth, signOut, updateEmail } from 'firebase/auth';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, Pressable, TextInput } from 'react-native';

export default function AccountScreen() {
  const sx = useSx();
  const navigation = useNavigation();
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [bvn, setBvn] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFullName(data.fullName || '');
            setPhone(data.phone || '');
            setBvn(data.bvn || '');
          }
        } catch (e) {
          console.error('Error fetching user:', e);
        }
      }
    };
    fetchUser();
  }, [user]);

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      if (email !== user.email) {
        await updateEmail(user, email);
      }

      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        phone,
        fullName,
      });

      Alert.alert('Updated successfully!');
    } catch (e) {
      Alert.alert('Update Failed', e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Signed out');
      navigation.replace('Login');
    } catch (e) {
      Alert.alert('Error signing out', e.message);
    }
  };

  return (
    <View sx={{ flex: 1, bg: '#0f172a', p: 16 }}>
      <Text sx={{ fontSize: 28, color: 'white', fontWeight: 'bold', mb: 24, textAlign: 'center' }}>
        My Account
      </Text>

      {user ? (
        <View
          sx={{
            bg: '#e5f4ec',
            borderRadius: 16,
            p: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          {/* Email Input */}
          <Text sx={{ color: '#065f46', fontSize: 18, fontWeight: 'bold', mb: 1 }}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={sx({
              bg: 'white',
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 8,
              p: 10,
              mb: 3,
            })}
          />

          {/* Full Name Input */}
          <Text sx={{ color: '#065f46', fontSize: 18, fontWeight: 'bold', mb: 1 }}>Full Name</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            style={sx({
              bg: 'white',
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 8,
              p: 10,
              mb: 3,
            })}
          />

          {/* Phone Number */}
          <Text sx={{ color: '#065f46', fontSize: 18, fontWeight: 'bold', mb: 1 }}>Phone Number</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={sx({
              bg: 'white',
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 8,
              p: 10,
              mb: 3,
            })}
          />

          {/* BVN (read-only) */}
          <Text sx={{ color: '#065f46', fontSize: 18, fontWeight: 'bold', mb: 1 }}>BVN</Text>
          <Text>{bvn || 'Not provided'}</Text>
        </View>
      ) : (
        <Text sx={{ textAlign: 'center', mt: 40 }}>No user is currently logged in.</Text>
      )}

      {/* Save Button */}
      <Pressable
        onPress={handleUpdate}
        disabled={isSaving}
        style={sx({
          bg: isSaving ? '#7dd3fc' : '#065f46',
          mt: 32,
          py: 14,
          borderRadius: 12,
          alignItems: 'center',
        })}
      >
        <Text sx={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
          {isSaving ? 'Saving...' : 'Update Info'}
        </Text>
      </Pressable>

      {/* Log Out Button */}
      <Pressable
        onPress={handleLogout}
        style={sx({
          bg: 'red',
          mt: 16,
          py: 14,
          borderRadius: 12,
          alignItems: 'center',
        })}
      >
        <Text sx={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Log Out</Text>
      </Pressable>
    </View>
  );
}