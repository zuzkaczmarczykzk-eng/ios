import { useEffect, useState } from 'react';

import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import styles from './styles/HomeStyle';

import { getWeatherIcon, getDayName, } from '../utils/WeatherUtils';
import { getForecastWeather, } from '../services/WeatherService';

import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WeatherForecast({ route, navigation, }) {
  const { city, displayName, } = route.params;

  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForecast();
  }, []);

  const fetchForecast = async () => {
    try {
      const data =
        await getForecastWeather(city);

      setForecast(data);
    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false);
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
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          top: 60,
          left: 20,
          zIndex: 10,
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: 20,
          padding: 8,
        }}
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color="#fff"
        />
      </TouchableOpacity>
      <Text
        style={[
          styles.title,
          {
            marginTop: 40,
          },
        ]}
      >
        Pogoda 7-dniowa
      </Text>

      <Text style={styles.subtitle}>
        {displayName}
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

            style={styles.card}>
            <View style={styles.leftSection}>
              <Image
                source={{
                  uri: getWeatherIcon(
                    item.weather?.[0]?.main
                  ),
                }}

                style={styles.weatherIcon} />

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
                min{' '}
                {Math.round(
                  item.main?.temp_min
                )}
                °
              </Text>

              <Text
                style={{
                  color: '#fff',
                  fontSize: 12,
                }}
              >
                max{' '}
                {Math.round(
                  item.main?.temp_max
                )}
                °
              </Text>
            </View>
          </LinearGradient>
        )}
      />
    </LinearGradient>
  );
}