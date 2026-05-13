import styles from './styles/HomeStyle';
import { useEffect, useState } from 'react';

import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

const API_KEY = 'dfa2c93b677c9ff12e6dd7828c4c7d60';

export default function WeatherForecast({ route }) {

  const { city } = route.params;

  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForecast();
  }, []);

  const fetchForecast = async () => {
    try {

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );

      const data = await response.json();

      const dailyData = data.list.filter((item) =>
        item.dt_txt.includes('12:00:00')
      );

      setForecast(dailyData);

    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false);
    }
  };

  const getDayName = (date) => {

    const days = [
      'Niedziela',
      'Poniedziałek',
      'Wtorek',
      'Środa',
      'Czwartek',
      'Piątek',
      'Sobota',
    ];

    return days[new Date(date).getDay()];
  };

  const getWeatherIcon = (condition) => {

    switch (condition) {

      case 'Clouds':
        return 'https://cdn-icons-png.flaticon.com/512/414/414825.png';

      case 'Rain':
        return 'https://cdn-icons-png.flaticon.com/512/3351/3351979.png';

      case 'Clear':
        return 'https://cdn-icons-png.flaticon.com/512/869/869869.png';

      default:
        return 'https://cdn-icons-png.flaticon.com/512/414/414825.png';
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }
return (
  <LinearGradient
    colors={['#1f6d8c', '#61b481', '#e1d677']}
    start={{ x: 0, y: 1 }}
    end={{ x: 1, y: 0 }}
    style={styles.container}
  >

    <Text style={styles.title}>
      Pogoda 7-dniowa
    </Text>

    <Text style={styles.subtitle}>
      {city}
    </Text>

    <FlatList
      data={forecast}

      keyExtractor={(item) =>
        item.dt.toString()
      }

      contentContainerStyle={{
        paddingBottom: 40,
      }}

      renderItem={({ item }) => (

        <LinearGradient
          colors={[
            'rgba(255,255,255,0.20)',
            'rgba(255,255,255,0.05)',
          ]}

          style={styles.card}
        >

          <View style={styles.leftSection}>

            <Image
              source={{
                uri: getWeatherIcon(
                  item.weather?.[0]?.main
                ),
              }}

              style={styles.weatherIcon}
            />

            <View style={styles.textContainer}>

              <Text style={styles.city}>
                {getDayName(item.dt_txt)}
              </Text>

              <Text style={styles.country}>
                {item.dt_txt.slice(0, 10)}
              </Text>

            </View>
          </View>

          <View
            style={{
              alignItems: 'flex-end',
            }}
          >

            <Text style={styles.temp}>
              {Math.round(item.main?.temp)}°
            </Text>

            <Text
              style={{
                color: '#fff',
                fontSize: 12,
              }}
            >
              min {Math.round(item.main?.temp_min)}°
            </Text>

            <Text
              style={{
                color: '#fff',
                fontSize: 12,
              }}
            >
              max {Math.round(item.main?.temp_max)}°
            </Text>

          </View>

        </LinearGradient>
      )}
    />
  </LinearGradient>
);
}