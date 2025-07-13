import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { View, Text } from 'dripsy';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore';

export default function LoanStatusScreen() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const db = getFirestore();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchLoans = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const ref = collection(db, 'users', userId, 'loanApplications');
        const q = query(ref, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLoans(data);
      } catch (err) {
        console.error('Error fetching loan status:', err);
      }
      setLoading(false);
    };

    fetchLoans();
  }, [userId]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text sx={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', mb: 16 }}>
        My Loan Applications
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="green" />
      ) : loans.length === 0 ? (
        <Text sx={{ textAlign: 'center', mt: 20 }}>No loan applications found.</Text>
      ) : (
        loans.map(loan => (
          <View
            key={loan.id}
            sx={{
              bg: 'green',
              borderRadius: 8,
              p: 12,
              mb: 12,
              borderLeftWidth: 4,
              borderLeftColor: '#10b981',
            }}
          >
            <Text sx={{ color: 'white' }}>
  Amount: ₦{loan.loanAmount ? Number(loan.loanAmount).toLocaleString() : 'N/A'}
</Text>

            <Text sx={{ color: 'white' }}>Purpose: {loan.loanPurpose || 'N/A'}</Text>
            <Text sx={{ color: 'white' }}>
              Date: {new Date(loan.createdAt?.toDate?.() || loan.createdAt).toLocaleString()}
            </Text>
            <Text sx={{ color: 'white', fontWeight: 'bold' }}>
              Status: {loan.status || 'Pending'}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}