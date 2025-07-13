import React, { useEffect, useState } from 'react';
import { Pressable, Alert } from 'react-native';
import { View, Text, useSx } from 'dripsy';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export default function AccountScreen() {
  const sx = useSx();
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (e) {
          console.error('Error fetching user:', e);
        }
      }
    };
    fetchUser();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Signed out');
    } catch (e) {
      Alert.alert('Error signing out', e.message);
    }
  };

  return (
    <View sx={{ flex: 1, bg: 'white', p: 16 }}>
      <Text sx={{ fontSize: 28, fontWeight: 'bold', mb: 24, textAlign: 'center' }}>
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
          <Text sx={{ color: '#065f46', fontSize: 18, fontWeight: 'bold', mb: 1 }}>Email</Text>
          <Text sx={{ mb: 3 }}>{user.email}</Text>

          <Text sx={{ color: '#065f46', fontSize: 18, fontWeight: 'bold', mb: 1 }}>Full Name</Text>
          <Text sx={{ mb: 3 }}>{userData?.fullName || 'Not provided'}</Text>

          <Text sx={{ color: '#065f46', fontSize: 18, fontWeight: 'bold', mb: 1 }}>Phone Number</Text>
          <Text>{userData?.phone || 'Not provided'}</Text>
        </View>
      ) : (
        <Text sx={{ textAlign: 'center', mt: 40 }}>No user is currently logged in.</Text>
      )}

      <Pressable
        onPress={handleLogout}
        style={sx({
          bg: 'red',
          mt: 32,
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
