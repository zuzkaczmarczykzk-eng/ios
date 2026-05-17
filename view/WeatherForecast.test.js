import React from 'react';
import { TouchableOpacity } from 'react-native';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import WeatherForecast from './WeatherForecast';
import { getForecastWeather } from '../services/WeatherService';
import { getDayName } from '../utils/WeatherUtils';

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

const makeForecastItem = (dtTxt, temp, tempMin, tempMax, condition = 'Clear') => ({
  dt: new Date(dtTxt.replace(' ', 'T')).getTime() / 1000,
  dt_txt: dtTxt,
  main: { temp, temp_min: tempMin, temp_max: tempMax },
  weather: [{ main: condition, icon: '01d' }],
});

const mockForecast = [
  makeForecastItem('2026-05-17 12:00:00', 20, 15, 25, 'Clear'),
  makeForecastItem('2026-05-18 12:00:00', 18, 13, 22, 'Clouds'),
  makeForecastItem('2026-05-19 12:00:00', 23, 17, 27, 'Rain'),
];

const mockNavigation = { goBack: jest.fn() };
const mockRoute = { params: { city: 'Warsaw', displayName: 'Warszawa' } };

beforeEach(() => {
  jest.clearAllMocks();
  getForecastWeather.mockResolvedValue(mockForecast);
});

describe('WeatherForecast', () => {
  describe('loading state', () => {
    it('does not show title or forecast cards while loading', () => {
      getForecastWeather.mockReturnValue(new Promise(() => {}));

      render(<WeatherForecast route={mockRoute} navigation={mockNavigation} />);

      expect(screen.queryByText('Pogoda 7-dniowa')).toBeNull();
      expect(screen.queryByText('2026-05-17')).toBeNull();
    });
  });

  describe('loaded state', () => {
    it('shows title and city displayName', async () => {
      render(<WeatherForecast route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(screen.getByText('Pogoda 7-dniowa')).toBeTruthy();
      });
      expect(screen.getByText('Warszawa')).toBeTruthy();
    });

    it('fetches forecast for the city from route params', async () => {
      render(<WeatherForecast route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => expect(screen.getByText('Pogoda 7-dniowa')).toBeTruthy());
      expect(getForecastWeather).toHaveBeenCalledWith('Warsaw');
    });

    it('shows date, day name, temperature, min and max for each item', async () => {
      render(<WeatherForecast route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => expect(screen.getByText('2026-05-17')).toBeTruthy());

      expect(screen.getByText('2026-05-18')).toBeTruthy();
      expect(screen.getByText('2026-05-19')).toBeTruthy();

      expect(screen.getByText(getDayName('2026-05-17 12:00:00'))).toBeTruthy();

      expect(screen.getByText('20°')).toBeTruthy();
      expect(screen.getByText('18°')).toBeTruthy();
      expect(screen.getByText('23°')).toBeTruthy();

      expect(screen.getByText('min 15°')).toBeTruthy();
      expect(screen.getByText('max 25°')).toBeTruthy();
      expect(screen.getByText('min 17°')).toBeTruthy();
      expect(screen.getByText('max 27°')).toBeTruthy();
    });

    it('renders no forecast cards when the list is empty', async () => {
      getForecastWeather.mockResolvedValue([]);
      render(<WeatherForecast route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => expect(screen.getByText('Pogoda 7-dniowa')).toBeTruthy());

      expect(screen.queryByText('2026-05-17')).toBeNull();
    });
  });

  describe('navigation', () => {
    it('calls navigation.goBack when the back button is pressed', async () => {
      render(<WeatherForecast route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => expect(screen.getByText('Pogoda 7-dniowa')).toBeTruthy());

      fireEvent.press(screen.UNSAFE_getAllByType(TouchableOpacity)[0]);

      expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
    });
  });
});
