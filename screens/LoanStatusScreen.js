import { Text, View } from 'dripsy';
import { getAuth } from 'firebase/auth';
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import LoanStatusTracker from '../components/LoanStatusTracker';

export default function LoanStatusScreen() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const auth = getAuth();
  const db = getFirestore();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchLoans = async () => {
      if (!userId) return;
      setLoading(true);
      setError('');
      try {
        const ref = collection(db, 'users', userId, 'loanApplications');
        const q = query(ref, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLoans(data);
      } catch (err) {
        console.error('Error fetching loan status:', err);
        setError('Failed to load loan applications.');
      }
      setLoading(false);
    };

    fetchLoans();
  }, [userId]);

  const formatDate = (createdAt) => {
    try {
      if (createdAt?.toDate) {
        return createdAt.toDate().toLocaleString();
      } else {
        return new Date(createdAt).toLocaleString();
      }
    } catch {
      return 'Invalid Date';
    }
  };

  const formatAmount = (amount) => {
    const num = Number(amount);
    return isNaN(num) ? 'N/A' : `₦${num.toLocaleString()}`;
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text sx={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', mb: 16, color: 'white' }}>
        My Loan Applications
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="green" />
      ) : error ? (
        <Text sx={{ color: 'red', textAlign: 'center', mt: 20 }}>{error}</Text>
      ) : loans.length === 0 ? (
        <Text sx={{ textAlign: 'center', mt: 20, color: 'white' }}>No loan applications found.</Text>
      ) : (
        loans.map(loan => (
          <View
            key={loan.id}
            sx={{
              bg: '#0f172a',
              borderRadius: 8,
              p: 12,
              mb: 16,
              borderLeftWidth: 4,
              borderLeftColor: '#10b981',
            }}
          >
            <Text sx={{ color: 'white' }}>
              Amount: {formatAmount(loan.loanAmount)}
            </Text>
            <Text sx={{ color: 'white' }}>
              Purpose: {loan.loanPurpose || 'N/A'}
            </Text>
            <Text sx={{ color: 'white' }}>
              Date: {formatDate(loan.createdAt)}
            </Text>
            <Text sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
              Status: {loan.status || 'submitted'}
            </Text>

            {/* Visual status tracker */}
            <LoanStatusTracker status={loan.status || 'submitted'} />
          </View>
        ))
      )}
    </ScrollView>
  );
}