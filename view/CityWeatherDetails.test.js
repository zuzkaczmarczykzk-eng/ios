import React from 'react';
import { TouchableOpacity } from 'react-native';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import CityWeatherDetails from './CityWeatherDetails';
import { getCurrentWeather, getWeatherForecastDetails } from '../services/WeatherService';

jest.mock('../services/WeatherService');

jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    LinearGradient: ({ children, style }) => React.createElement(View, { style }, children),
  };
});

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

const mockCurrentWeather = {
  cod: 200,
  name: 'Warsaw',
  main: { temp: 22.4, humidity: 65, temp_min: 18, temp_max: 26 },
  sys: { country: 'PL' },
  weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
  wind: { speed: 4.2 },
  visibility: 9000,
};

const makeHourly = (time, temp, humidity, windSpeed, visibility, condition = 'Clear') => ({
  dateTime: `2026-05-17 ${time}:00`,
  date: '2026-05-17',
  time,
  temp,
  humidity,
  windSpeed,
  condition,
  description: 'test',
  icon: '01d',
  visibility,
});

const mockHourly = [
  makeHourly('12:00', 19, 60, 3.0, 8000),
  makeHourly('15:00', 24, 55, 5.5, 7000, 'Clouds'),
  makeHourly('18:00', 17, 80, 6.0, 5000, 'Rain'),
];

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
const mockRoute = { params: { city: 'Warsaw', displayName: 'Warszawa' } };

beforeEach(() => {
  jest.clearAllMocks();
  getCurrentWeather.mockResolvedValue(mockCurrentWeather);
  getWeatherForecastDetails.mockResolvedValue(mockHourly);
});

describe('CityWeatherDetails', () => {
  describe('loading state', () => {
    it('does not show city name or stats while loading', () => {
      getCurrentWeather.mockReturnValue(new Promise(() => {}));
      getWeatherForecastDetails.mockReturnValue(new Promise(() => {}));

      render(<CityWeatherDetails route={mockRoute} navigation={mockNavigation} />);

      expect(screen.queryByText('Warszawa')).toBeNull();
      expect(screen.queryByText('Humidity')).toBeNull();
      expect(screen.queryByText('Prognoza na tydzień')).toBeNull();
    });
  });

  describe('loaded state', () => {
    it('shows city name, temperature, stats and forecast button', async () => {
      render(<CityWeatherDetails route={mockRoute} navigation={mockNavigation} />);

      await waitFor(() => expect(screen.getByText('Warszawa')).toBeTruthy());

      expect(screen.getByText('22°')).toBeTruthy();
      expect(screen.getByText('Humidity')).toBeTruthy();
      expect(screen.getByText('65%')).toBeTruthy();
      expect(screen.getByText('4.2 m/s')).toBeTruthy();
      expect(screen.getByText('9.0 km')).toBeTruthy();
      expect(screen.getByText('Prognoza na tydzień')).toBeTruthy();
    });

    it('shows hourly forecast entries', async () => {
      render(<CityWeatherDetails route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => expect(screen.getByText('12:00')).toBeTruthy());

      expect(screen.getByText('15:00')).toBeTruthy();
      expect(screen.getByText('18:00')).toBeTruthy();
      expect(screen.getByText('24°')).toBeTruthy();
    });
  });

  describe('hourly selection', () => {
    it('updates stats to the selected hour', async () => {
      render(<CityWeatherDetails route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => expect(screen.getByText('15:00')).toBeTruthy());

      fireEvent.press(screen.getByText('15:00'));

      expect(screen.getByText('55%')).toBeTruthy();
      expect(screen.getByText('5.5 m/s')).toBeTruthy();
      expect(screen.getByText('7.0 km')).toBeTruthy();
    });

    it('reverts stats to current weather when the same hour is tapped again', async () => {
      render(<CityWeatherDetails route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => expect(screen.getByText('15:00')).toBeTruthy());

      fireEvent.press(screen.getByText('15:00'));
      expect(screen.getByText('55%')).toBeTruthy();

      fireEvent.press(screen.getByText('15:00'));
      expect(screen.getByText('65%')).toBeTruthy();
      expect(screen.getByText('4.2 m/s')).toBeTruthy();
    });
  });

  describe('error state', () => {
    it('shows the error message when the fetch fails', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      getCurrentWeather.mockRejectedValue(new Error('Network request failed'));
      getWeatherForecastDetails.mockRejectedValue(new Error('Network request failed'));

      render(<CityWeatherDetails route={mockRoute} navigation={mockNavigation} />);

      await waitFor(() =>
        expect(screen.getByText('Network request failed')).toBeTruthy()
      );

      expect(screen.queryByText('Warszawa')).toBeNull();
      expect(screen.queryByText('Prognoza na tydzień')).toBeNull();

      console.error.mockRestore();
    });
  });

  describe('navigation', () => {
    it('calls navigation.goBack when the back button is pressed', async () => {
      render(<CityWeatherDetails route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => expect(screen.getByText('Warszawa')).toBeTruthy());

      fireEvent.press(screen.UNSAFE_getAllByType(TouchableOpacity)[0]);

      expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
    });

    it('navigates to WeatherForecast with city and displayName', async () => {
      render(<CityWeatherDetails route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => expect(screen.getByText('Prognoza na tydzień')).toBeTruthy());

      fireEvent.press(screen.getByText('Prognoza na tydzień'));

      expect(mockNavigation.navigate).toHaveBeenCalledWith('WeatherForecast', {
        city: 'Warsaw',
        displayName: 'Warszawa',
      });
    });
  });
});
