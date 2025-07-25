import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useSx } from 'dripsy';

console.log('✅ Loaded ApplyScreen');

export default function ApplyScreen({ navigation }) {
  const sx = useSx();

  return (
    <View
      sx={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        bg: '#0f172a',
        px: 16,
      }}
    >
      <Image
        source={require('../assets/loanwave.png')}
        style={{
          width: 200,
          height: 200,
          resizeMode: 'contain',
          marginBottom: 20,
        }}
      />

      <Text
        sx={{
          fontSize: 40,
          fontWeight: 'bold',
          color: 'white',
          mb: 24,
          textAlign: 'center',
        }}
      >
        Welcome to LoanWave 📲
      </Text>

      <Pressable
        onPress={() => navigation.navigate('LoanFormScreen')}
        style={sx({
          bg: '#0f172a',
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
    </View>
  );
}