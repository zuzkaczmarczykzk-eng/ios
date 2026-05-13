import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';


//TODO - Paweł
export default function SecWindow({route,navigation,}) {
    const { city } = route.params;

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
            }}>
            <Text
                style={{
                    fontSize: 30,
                    fontWeight: 'bold',
                    marginBottom: 40,
                }}>
                {city}
            </Text>
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate(
                        'WeatherForecast',
                        { city }
                    )
                }
                style={{
                    backgroundColor: '#1f6d8c',
                    paddingVertical: 15,
                    paddingHorizontal: 30,
                    borderRadius: 12,
                }}>
                <Text
                    style={{
                        color: '#fff',
                        fontSize: 18,
                        fontWeight: 'bold',
                    }}>
                    Pokaż prognozę
                </Text>
            </TouchableOpacity>
        </View>
    );
}