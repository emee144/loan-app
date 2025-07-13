import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useSx } from 'dripsy';

console.log('✅ Loaded WelcomeScreen');

export default function WelcomeScreen({ navigation }) {
  const sx = useSx();

  return (
    <View
      sx={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        bg: 'green',
        px: 16,
      }}
    >
      <Image
        source={require('../assets/loanwave.png')}
        style={{
          width: 400,
          height: 300,
          resizeMode: 'contain',
          marginBottom: 20,
        }}
      />

      <Text
        sx={{
          fontSize: 40,
          fontWeight: 'bold',
          color: 'text',
          mb: 24,
          textAlign: 'center',
        }}
      >
        Welcome to LoanWave 📲
      </Text>

      <Pressable
        onPress={() => navigation.navigate('LoanForm')}
        style={sx({
          bg: 'green',
          px: 24,
          py: 12,
          borderRadius: 8,
        })}
      >
        <Text
          sx={{
            color: 'black',
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
