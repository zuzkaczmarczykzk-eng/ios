import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import Home from './Home';
import { getCurrentWeather } from '../services/WeatherService';

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

const mockResponse = (name, temp, country, condition = 'Clear') => ({
  cod: 200,
  name,
  main: { temp, humidity: 60, temp_min: 10, temp_max: 20 },
  sys: { country },
  weather: [{ main: condition, description: 'test', icon: '01d' }],
  wind: { speed: 3.5 },
  visibility: 10000,
});

const cityResponses = {
  Prague: mockResponse('Prague', 20, 'CZ'),
  London: mockResponse('London', 15, 'GB', 'Clouds'),
  Tokyo: mockResponse('Tokyo', 25, 'JP'),
  Paris: mockResponse('Paris', 18, 'FR', 'Rain'),
  Warsaw: mockResponse('Warsaw', 12, 'PL', 'Clouds'),
  Berlin: mockResponse('Berlin', 14, 'DE'),
  Madrid: mockResponse('Madrid', 30, 'ES'),
};

const mockNavigation = { navigate: jest.fn() };

beforeEach(() => {
  jest.clearAllMocks();
  getCurrentWeather.mockImplementation((city) =>
    Promise.resolve(cityResponses[city])
  );
});

describe('Home', () => {
  it('renders title, subtitle and search input', () => {
    render(<Home navigation={mockNavigation} />);
    expect(screen.getByText('Pogoda')).toBeTruthy();
    expect(screen.getByText('Znajdź swoje miasto')).toBeTruthy();
    expect(screen.getByPlaceholderText('Szukaj...')).toBeTruthy();
  });

  it('fetches weather for all 7 cities on mount', async () => {
    render(<Home navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getCurrentWeather).toHaveBeenCalledTimes(7);
    });
  });

  it('shows all city names, temperatures and country codes', async () => {
    render(<Home navigation={mockNavigation} />);
    await waitFor(() => {
      expect(screen.getByText('Warszawa')).toBeTruthy();
    });
    expect(screen.getByText('Praga')).toBeTruthy();
    expect(screen.getByText('Madryt')).toBeTruthy();
    expect(screen.getByText('30°')).toBeTruthy();
    expect(screen.getByText('12°')).toBeTruthy();
    expect(screen.getByText('PL')).toBeTruthy();
    expect(screen.getByText('GB')).toBeTruthy();
  });

  it('filters cities by search text (case-insensitive)', async () => {
    render(<Home navigation={mockNavigation} />);
    await waitFor(() => expect(screen.getByText('Praga')).toBeTruthy());

    fireEvent.changeText(screen.getByPlaceholderText('Szukaj...'), 'WAR');

    expect(screen.getByText('Warszawa')).toBeTruthy();
    expect(screen.queryByText('Praga')).toBeNull();
    expect(screen.queryByText('Londyn')).toBeNull();
  });

  it('shows all cities again after clearing the search', async () => {
    render(<Home navigation={mockNavigation} />);
    await waitFor(() => expect(screen.getByText('Praga')).toBeTruthy());

    fireEvent.changeText(screen.getByPlaceholderText('Szukaj...'), 'war');
    expect(screen.queryByText('Praga')).toBeNull();

    fireEvent.changeText(screen.getByPlaceholderText('Szukaj...'), '');
    expect(screen.getByText('Praga')).toBeTruthy();
    expect(screen.getByText('Londyn')).toBeTruthy();
  });

  it('navigates to CityWeatherDetails with city and displayName on card press', async () => {
    render(<Home navigation={mockNavigation} />);
    await waitFor(() => expect(screen.getByText('Warszawa')).toBeTruthy());

    fireEvent.press(screen.getByText('Warszawa'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('CityWeatherDetails', {
      city: 'Warsaw',
      displayName: 'Warszawa',
    });
  });
});
