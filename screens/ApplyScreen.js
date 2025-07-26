import { Text, useSx, View } from 'dripsy';
import { Image, Pressable } from 'react-native';

console.log('✅ Loaded ApplyScreen');

export default function ApplyScreen({ navigation }) {
  const sx = useSx();

  return (
    <View
      sx={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        bg: '#0f172a', // Dark navy background
        px: 16,
      }}
    >
      <Image
        source={require('../assets/loanwave.png')}
        style={{
          width: 400,
          height: 400,
          resizeMode: 'contain',
          marginBottom: 20,
        }}
      />

      <Text
        sx={{
          fontSize: 40,
          fontWeight: 'bold',
          color: 'white',
          mb: 16,
          textAlign: 'center',
        }}
      >
        Welcome to LoanWave 📲
      </Text>

      <Text
        sx={{
          fontSize: 16,
          color: '#e2e8f0',
          textAlign: 'center',
          mb: 24,
          px: 10,
        }}
      >
        Get quick and reliable loans to meet your needs. No collateral required. Fast approval process.
      </Text>

      <View sx={{ mb: 24 }}>
        <Text sx={{ color: '#38bdf8', fontWeight: 'bold', fontSize: 14 }}>
          Step 1 of 3: Personal Details
        </Text>
      </View>

      <Pressable
        onPress={() => navigation.navigate('LoanFormScreen')}
        style={sx({
          bg: '#38bdf8',
          px: 24,
          py: 12,
          borderRadius: 8,
        })}
      >
        <Text
          sx={{
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          APPLY FOR A LOAN
        </Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate('LoanStatusScreen')}
        style={sx({
          mt: 16,
          borderColor: '#38bdf8',
          borderWidth: 1,
          px: 24,
          py: 12,
          borderRadius: 8,
        })}
      >
        <Text
          sx={{
            color: '#38bdf8',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          VIEW LOAN STATUS
        </Text>
      </Pressable>

      <Text
        sx={{
          fontSize: 12,
          color: '#94a3b8',
          mt: 40,
          textAlign: 'center',
          px: 20,
        }}
      >
        By applying, you agree to LoanWave’s Terms of Service and Privacy Policy.
      </Text>
    </View>
  );
}
