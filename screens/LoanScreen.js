import { Text, View } from 'dripsy';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';

const LoanScreen = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.warn('User not logged in');
        setLoading(false);
        return;
      }

      try {
        const db = getFirestore();
        const loansRef = collection(db, 'users', user.uid, 'loanApplications');
        const snapshot = await getDocs(loansRef);

        const loansList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLoans(loansList);
      } catch (error) {
        console.error('Error fetching loans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  if (loading) {
    return (
      <View sx={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text mt={2}>Loading your loans...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text sx={{ fontSize: 24, fontWeight: 'bold', mb: 3, color: '#0f172a' }}>
        Your Loan Applications
      </Text>

      {loans.length === 0 ? (
        <Text sx={{ color: 'white' }}>No loan applications found.</Text>
      ) : (
        loans.map((loan, index) => (
          <View
            key={loan.id}
            sx={{
              bg: '#0f172a',
              borderRadius: 10,
              p: 12,
              mb: 12,
              borderLeftWidth: 4,
              borderLeftColor: '#10b981',
            }}
          >
            <Text sx={{ color: 'white', fontWeight: 'bold' }}>
              Loan #{index + 1}
            </Text>
            <Text sx={{ color: 'white' }}>
              Amount: ₦
              {loan.loanAmount ? Number(loan.loanAmount).toLocaleString() : 'N/A'}
            </Text>
            <Text sx={{ color: 'white' }}>
              Purpose: {loan.loanPurpose || 'N/A'}
            </Text>
            <Text sx={{ color: 'white' }}>
              Term: {loan.repaymentMonths || 'N/A'} months
            </Text>
            <Text sx={{ color: 'white' }}>
              Status: {loan.status || 'pending'}
            </Text>
            {loan.createdAt?.toDate && (
              <Text sx={{ color: 'white' }}>
                Date: {loan.createdAt.toDate().toLocaleDateString()}
              </Text>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default LoanScreen;