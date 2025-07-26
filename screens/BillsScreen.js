import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Text, View } from 'dripsy';
import { Pressable, ScrollView } from 'react-native';

const bills = [
  { name: 'Airtime & Data', icon: 'phone-portrait-outline' },
  { name: 'Electricity', icon: 'flash-outline' },
  { name: 'Cable TV', icon: 'tv-outline' },
  { name: 'Internet', icon: 'wifi-outline' },
  { name: 'Water', icon: 'water-outline' },
  { name: 'Government Levies', icon: 'document-text-outline' },
];

export default function BillsScreen() {
  const navigation = useNavigation();

  const handlePress = (name) => {
    const routeMap = {
      'Airtime & Data': 'AirtimeAndData',
      'Electricity': 'Electricity',
      'Cable TV': 'CableTV',
      'Internet': 'Internet',
      'Water': 'Water',
      'Government Levies': 'GovernmentLevies',
    };

    const screen = routeMap[name];
    if (screen) {
      navigation.navigate(screen);
    } else {
      alert(`${name} coming soon!`);
    }
  };

  return (
    // dark navy background 
    <View sx={{ flex: 1, bg: '#0f172a' }}> 
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text
          sx={{
            fontSize: 26,
            fontWeight: 'bold',
            mb: 24,
            textAlign: 'center',
            color: '#059669',
          }}
        >
          Pay Bills
        </Text>

        {bills.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => handlePress(item.name)}
            style={{
              backgroundColor: '#065f46', 
              borderRadius: 12,
              padding: 16,
              marginBottom: 16,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            }}
          >
            <Ionicons name={item.icon} size={26} color="white" />
            <Text
              style={{
                fontSize: 20,
                marginLeft: 12,
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              {item.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
