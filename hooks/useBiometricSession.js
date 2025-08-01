import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';
import { auth } from '../firebase';

const CREDENTIALS_KEY = 'biometric_credentials';

export function useBiometricSession() {
  const [isLoading, setIsLoading] = useState(true);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [hasEnrolled, setHasEnrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check biometric hardware and enrollment status
  useEffect(() => {
    (async () => {
      const available = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricAvailable(available);
      setHasEnrolled(enrolled);
      setIsLoading(false);
    })();
  }, []);

  // Save credentials to SecureStore
  const saveSession = useCallback(async (email, password) => {
    const creds = JSON.stringify({ email, password });
    await SecureStore.setItemAsync(CREDENTIALS_KEY, creds, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED,
    });
    console.log('✅ Saved credentials:', creds);
  }, []);

  // Clear saved biometric credentials
  const clearSession = useCallback(async () => {
    await SecureStore.deleteItemAsync(CREDENTIALS_KEY);
    setIsLoggedIn(false);
    console.log('✅ Biometric session cleared');
  }, []);

  // Unlock using biometrics
  const unlockWithBiometrics = useCallback(async () => {
    if (!isBiometricAvailable || !hasEnrolled) return false;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock LoanWave',
      fallbackLabel: 'Use device passcode',
    });

    if (!result.success) return false;

    const creds = await SecureStore.getItemAsync(CREDENTIALS_KEY);
    console.log('📦 Retrieved from SecureStore:', creds);

    if (!creds) return false;

    const { email, password } = JSON.parse(creds);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
      console.log('✅ Firebase re-login success:', email);
      return true;
    } catch (error) {
      console.error('❌ Biometric login Firebase failed:', error.message);
      return false;
    }
  }, [isBiometricAvailable, hasEnrolled]);

  return {
    isLoading,
    isBiometricAvailable,
    hasEnrolled,
    isLoggedIn,
    saveSession,
    clearSession,
    unlockWithBiometrics,
  };
}
