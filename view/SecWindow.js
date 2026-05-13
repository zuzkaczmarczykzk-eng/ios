import { View, Text } from 'react-native';

export default function SecWindow({ route }) {
  const { city } = route.params;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>{city}</Text>
    </View>
  );
}