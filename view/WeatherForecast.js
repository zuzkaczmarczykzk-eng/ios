import { View, Text } from 'react-native';

export default function WeatherForecast({ route }) {
    const { city } = route.params;

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Text
                style={{
                    fontSize: 28,
                    fontWeight: 'bold',
                }}>
                Prognoza pogody
            </Text>
            <Text
                style={{
                    marginTop: 20,
                    fontSize: 22,
                }}>
                {city}
            </Text>
        </View>
    );
}