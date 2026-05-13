import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

//TODO - Paweł
export default function SecWindow({ route, navigation, }) {
   const { city, displayName } = route.params;

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
            }}
        >

            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                    position: 'absolute',
                    top: 60,
                    left: 20,
                    zIndex: 10,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    borderRadius: 20,
                    padding: 8,
                }}
            >
                <Ionicons
                    name="arrow-back"
                    size={24}
                    color="#000"
                />
            </TouchableOpacity>

            <Text
                style={{
                    fontSize: 30,
                    fontWeight: 'bold',
                    marginBottom: 40,
                }}
            >
                {displayName || city}
            </Text>

            <TouchableOpacity
                onPress={() =>
                    navigation.navigate(
                        'WeatherForecast',
                        {
                            city,
                            displayName: displayName || city,
                        }
                    )
                }

                style={{
                    backgroundColor: '#1f6d8c',
                    paddingVertical: 15,
                    paddingHorizontal: 30,
                    borderRadius: 12,
                }}
            >
                <Text
                    style={{
                        color: '#fff',
                        fontSize: 18,
                        fontWeight: 'bold',
                    }}
                >
                    Pokaż prognozę
                </Text>
            </TouchableOpacity>

        </View>
    );
}