import { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
} from 'react-native';

import { TouchableOpacity } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { LinearGradient } from 'expo-linear-gradient';

import styles from './styles/HomeStyle';

import {getWeatherIcon,cities,} from '../utils/WeatherUtils';
import {getCurrentWeather,} from '../services/WeatherService';

export default function Home({ navigation }) {
  const [weatherData, setWeatherData] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      const responses = await Promise.all(
        cities.map((city) =>
          getCurrentWeather(city.query)
        )
      );

      const mappedData = responses.map((item) => {
        const matchedCity = cities.find(
          (city) => city.query === item.name
        );

        return {
          ...item,
          displayName:
            matchedCity?.label || item.name,
        };
      });

      setWeatherData(mappedData);

    } catch (error) {
      console.log(error);
    }
  };

  const filteredCities = weatherData.filter((item) =>
    item.displayName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <LinearGradient
      colors={['#1f6d8c', '#61b481', '#e1d677']}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <Text style={styles.title}>
        Pogoda
      </Text>

      <Text style={styles.subtitle}>
        Znajdź swoje miasto
      </Text>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={24}
          color="#666"
        />
        <TextInput
          placeholder="Szukaj..."
          placeholderTextColor="#b8b8b8"
          style={styles.input}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <FlatList
        data={filteredCities}

        keyExtractor={(item) =>
          item.name
        }

        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                'CityWeatherDetails',
                {
                  city: item.name,
                  displayName:
                    item.displayName,
                }
              )
            }
          >
            <LinearGradient
              colors={[
                'rgba(255,255,255,0.2)',
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
                    {item.displayName}
                  </Text>

                  <Text style={styles.country}>
                    {item.sys?.country}
                  </Text>
                </View>
              </View>

              <Text style={styles.temp}>
                {Math.round(item.main?.temp)}°
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      />
    </LinearGradient>
  );
}