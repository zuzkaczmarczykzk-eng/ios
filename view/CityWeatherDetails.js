import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/CityWeatherDetailsStyle';
import { getCurrentWeather, getWeatherForecastDetails } from '../services/WeatherService';
import { cities, getWeatherIcon } from '../utils/WeatherUtils';

export default function CityWeatherDetails({ route, navigation }) {
  const { city, displayName } = route.params;

  const [current,      setCurrent]      = useState(null);
  const [hourly,       setHourly]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);

  useEffect(() => {
    if (!city) return;

    setLoading(true);
    setError(null);

    Promise.all([
      getCurrentWeather(city),
      getWeatherForecastDetails(city),
    ])
      .then(([currentData, forecastEntries]) => {
        setCurrent(currentData);
        setHourly(forecastEntries.slice(0, 9));
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [city]);

  if (error) {
    return (
      <LinearGradient
        colors={['#1f6d8c', '#61b481', '#e1d677']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[styles.gradient, { justifyContent: 'center', alignItems: 'center' }]}
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>{error}</Text>
      </LinearGradient>
    );
  }

  if (loading || !current) {
    return (
      <LinearGradient
        colors={['#1f6d8c', '#61b481', '#e1d677']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[styles.gradient, { justifyContent: 'center', alignItems: 'center' }]}
      >
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  const source = selectedHour ?? {
    humidity:   current.main.humidity,
    windSpeed:  current.wind.speed,
    visibility: current.visibility,
  };

  const visibilityLabel = typeof source.visibility === 'number'
    ? `${(source.visibility / 1000).toFixed(1)} km`
    : '—';

  const STATS = [
    { icon: '💧', label: 'Wilgotność',   value: `${source.humidity}%` },
    { icon: '💨', label: 'Wiatr',       value: `${source.windSpeed} m/s` },
    { icon: '👁️', label: 'Widoczność', value: visibilityLabel },
  ];

  const condition = current.weather[0].main;
  const temp      = Math.round(current.main.temp);

  return (
    <LinearGradient
      colors={['#1f6d8c', '#61b481', '#e1d677']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.gradient}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <Text style={styles.header}>{displayName}</Text>
        <Image
          source={{ uri: getWeatherIcon(condition) }}
          style={styles.mainIcon}
        />
        <Text style={styles.temperature}>{temp}°</Text>

        {hourly.length > 0 && (
          <View style={styles.hourlyCard}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hourlyScroll}
            >
              {hourly.map((item) => (
                <TouchableOpacity
                  key={item.dateTime}
                  onPress={() =>
                    setSelectedHour(
                      selectedHour?.dateTime === item.dateTime ? null : item
                    )
                  }
                  style={[
                    styles.hourlyItem,
                    selectedHour?.dateTime === item.dateTime && styles.hourlyItemSelected,
                  ]}
                >
                  <Text style={styles.hourlyTime}>{item.time}</Text>
                  <Image
                    source={{ uri: getWeatherIcon(item.condition) }}
                    style={styles.hourlyIcon}
                  />
                  <Text style={styles.hourlyTemp}>{item.temp}°</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.statsGrid}>
          {STATS.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <View style={styles.statRow}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.weeklyBtn}
          onPress={() => navigation.navigate(
            'WeatherForecast',
            {
                city,
                displayName: displayName || city,
            }
        )}
          activeOpacity={0.75}
        >
          <Text style={styles.weeklyBtnText}>Prognoza na tydzień</Text>
          <Text style={styles.weeklyBtnArrow}>›</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}