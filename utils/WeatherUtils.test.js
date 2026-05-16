import { cities, getWeatherIcon, getDayName } from './WeatherUtils';

describe('getWeatherIcon', () => {
  test('returns cloud icon for "Clouds"', () => {
    expect(getWeatherIcon('Clouds')).toBe(
      'https://cdn-icons-png.flaticon.com/512/414/414825.png'
    );
  });

  test('returns rain icon for "Rain"', () => {
    expect(getWeatherIcon('Rain')).toBe(
      'https://cdn-icons-png.flaticon.com/512/3351/3351979.png'
    );
  });

  test('returns sun icon for "Clear"', () => {
    expect(getWeatherIcon('Clear')).toBe(
      'https://cdn-icons-png.flaticon.com/512/869/869869.png'
    );
  });

  test('returns default icon for unknown condition', () => {
    expect(getWeatherIcon('Snow')).toBe(
      'https://cdn-icons-png.flaticon.com/512/414/414825.png'
    );
  });

  test('returns default icon for undefined', () => {
    expect(getWeatherIcon(undefined)).toBe(
      'https://cdn-icons-png.flaticon.com/512/414/414825.png'
    );
  });

  test('returns default icon for empty string', () => {
    expect(getWeatherIcon('')).toBe(
      'https://cdn-icons-png.flaticon.com/512/414/414825.png'
    );
  });
});

describe('getDayName', () => {
  test('returns "Poniedziałek" for Monday (2024-01-01)', () => {
    expect(getDayName('2024-01-01')).toBe('Poniedziałek');
  });

  test('returns "Wtorek" for Tuesday (2024-01-02)', () => {
    expect(getDayName('2024-01-02')).toBe('Wtorek');
  });

  test('returns "Środa" for Wednesday (2024-01-03)', () => {
    expect(getDayName('2024-01-03')).toBe('Środa');
  });

  test('returns "Czwartek" for Thursday (2024-01-04)', () => {
    expect(getDayName('2024-01-04')).toBe('Czwartek');
  });

  test('returns "Piątek" for Friday (2024-01-05)', () => {
    expect(getDayName('2024-01-05')).toBe('Piątek');
  });

  test('returns "Sobota" for Saturday (2024-01-06)', () => {
    expect(getDayName('2024-01-06')).toBe('Sobota');
  });

  test('returns "Niedziela" for Sunday (2024-01-07)', () => {
    expect(getDayName('2024-01-07')).toBe('Niedziela');
  });
});