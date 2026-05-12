import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles/HomeStyle';

const API_KEY = 'dfa2c93b677c9ff12e6dd7828c4c7d60';

export default function Home() {
  const cities = ['Prague', 'London', 'Tokyo', 'Paris', 'Warsaw', 'Berlin', 'Madrid'];
  const [weatherData, setWeatherData] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      const responses = await Promise.all(
        cities.map(async (city) => {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
          return response.json();
        })
      );
      setWeatherData(responses.filter((data) => data.cod === 200));
    } catch (error) {
      console.log(error);
    }
  };


  const filteredCities = weatherData.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Clouds': return 'https://cdn-icons-png.flaticon.com/512/414/414825.png';
      case 'Rain': return 'https://cdn-icons-png.flaticon.com/512/3351/3351979.png';
      case 'Clear': return 'https://cdn-icons-png.flaticon.com/512/869/869869.png';
      default: return 'https://cdn-icons-png.flaticon.com/512/414/414825.png';
    }
  };

  return (
    <LinearGradient
      colors={['#1f6d8c', '#61b481', '#e1d677']}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <Text style={styles.title}>Pogoda</Text>
      <Text style={styles.subtitle}>Znajdź swoje miasto</Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="#666" />
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
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.05)']}
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.leftSection}>
              <Image
                source={{ uri: getWeatherIcon(item.weather[0].main) }}
                style={styles.weatherIcon}
              />
              <View style={styles.textContainer}>
                <Text style={styles.city}>{item.name}</Text>
                <View style={styles.countryRow}>
                  <Image
                    source={require('../assets/location.png')}
                    style={styles.locationIcon}
                  />
                  <Text style={styles.country}>
                    {item.sys.country}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.temp}>{Math.round(item.main.temp)}°</Text>
          </LinearGradient>
        )}
      />
    </LinearGradient>
  );
}