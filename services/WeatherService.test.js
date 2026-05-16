import { getCurrentWeather, getForecastWeather, getWeatherForecastDetails } from './WeatherService';

const mockFetch = (data) => {
  global.fetch = jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue(data),
  });
};

const makeForecastItem = (dtTxt, overrides = {}) => ({
  dt: new Date(dtTxt.replace(' ', 'T')).getTime() / 1000,
  dt_txt: dtTxt,
  main: {
    temp: 15.6,
    feels_like: 13.2,
    temp_min: 12.0,
    temp_max: 18.0,
    humidity: 70,
    ...overrides.main,
  },
  wind: { speed: 4.5, ...overrides.wind },
  weather: [{ main: 'Clouds', description: 'scattered clouds', icon: '03d' }],
  visibility: 10000,
  ...overrides,
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('getCurrentWeather', () => {
  const mockSuccess = {
    cod: 200,
    name: 'Warsaw',
    main: { temp: 15, humidity: 60 },
    wind: { speed: 3.5 },
    weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
    visibility: 10000,
  };

  test('calls fetch with correct URL', async () => {
    mockFetch(mockSuccess);
    await getCurrentWeather('Warsaw');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/weather?q=Warsaw')
    );
  });

  test('includes metric units in the URL', async () => {
    mockFetch(mockSuccess);
    await getCurrentWeather('Warsaw');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('units=metric')
    );
  });

  test('returns data on success', async () => {
    mockFetch(mockSuccess);
    const result = await getCurrentWeather('Warsaw');
    expect(result).toEqual(mockSuccess);
  });

  test('throws an error when cod is not 200', async () => {
    mockFetch({ cod: 404, message: 'city not found' });
    await expect(getCurrentWeather('InvalidCity')).rejects.toThrow('city not found');
  });

  test('throws an error when cod is "404" (string)', async () => {
    mockFetch({ cod: '404', message: 'city not found' });
    await expect(getCurrentWeather('InvalidCity')).rejects.toThrow('city not found');
  });
});

describe('getForecastWeather', () => {
  const makeList = (times) => times.map(makeForecastItem);

  const mockSuccess = (list) => ({
    cod: '200',
    list,
  });

  test('calls fetch with correct URL', async () => {
    mockFetch(mockSuccess([]));
    await getForecastWeather('London');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/forecast?q=London')
    );
  });

  test('includes metric units in the URL', async () => {
    mockFetch(mockSuccess([]));
    await getForecastWeather('London');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('units=metric')
    );
  });

  test('returns only items with time 12:00:00', async () => {
    const list = makeList([
      '2024-06-10 09:00:00',
      '2024-06-10 12:00:00',
      '2024-06-10 15:00:00',
      '2024-06-11 12:00:00',
    ]);
    mockFetch(mockSuccess(list));

    const result = await getForecastWeather('London');
    expect(result).toHaveLength(2);
    result.forEach((item) => {
      expect(item.dt_txt).toContain('12:00:00');
    });
  });

  test('returns empty array when no items match 12:00:00', async () => {
    const list = makeList(['2024-06-10 09:00:00', '2024-06-10 15:00:00']);
    mockFetch(mockSuccess(list));

    const result = await getForecastWeather('London');
    expect(result).toHaveLength(0);
  });

  test('throws an error when cod is not "200"', async () => {
    mockFetch({ cod: '404', message: 'city not found' });
    await expect(getForecastWeather('InvalidCity')).rejects.toThrow('city not found');
  });
});

describe('getWeatherForecastDetails', () => {
  const inFuture = (daysOffset, hour = '12:00:00') => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    const dateStr = d.toISOString().split('T')[0];
    return `${dateStr} ${hour}`;
  };

  const mockSuccess = (list) => ({ cod: '200', list });

  test('calls fetch with correct URL', async () => {
    mockFetch(mockSuccess([]));
    await getWeatherForecastDetails('Paris');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/forecast?q=Paris')
    );
  });

  test('maps items to correct shape', async () => {
    const dtTxt = inFuture(1);
    mockFetch(mockSuccess([makeForecastItem(dtTxt)]));

    const result = await getWeatherForecastDetails('Paris');
    expect(result[0]).toMatchObject({
      dateTime:    dtTxt,
      date:        dtTxt.split(' ')[0],
      time:        dtTxt.split(' ')[1].slice(0, 5),
      temp:        16,   // Math.round(15.6)
      feelsLike:   13,   // Math.round(13.2)
      tempMin:     12,
      tempMax:     18,
      humidity:    70,
      windSpeed:   4.5,
      condition:   'Clouds',
      description: 'scattered clouds',
      icon:        '03d',
      visibility:  10000,
    });
  });

  test('rounds temperature values', async () => {
    const item = makeForecastItem(inFuture(1), {
      main: { temp: 15.4, feels_like: 13.6, temp_min: 11.5, temp_max: 18.9, humidity: 70 },
    });
    mockFetch(mockSuccess([item]));

    const [result] = await getWeatherForecastDetails('Paris');
    expect(result.temp).toBe(15);
    expect(result.feelsLike).toBe(14);
    expect(result.tempMin).toBe(12);
    expect(result.tempMax).toBe(19);
  });

  test('excludes items before today', async () => {
    const past = new Date();
    past.setDate(past.getDate() - 1);
    const pastStr = `${past.toISOString().split('T')[0]} 12:00:00`;

    mockFetch(mockSuccess([makeForecastItem(pastStr)]));
    const result = await getWeatherForecastDetails('Paris');
    expect(result).toHaveLength(0);
  });

  test('excludes items on or after cutoff (today + 4 days)', async () => {
    mockFetch(mockSuccess([makeForecastItem(inFuture(4))]));
    const result = await getWeatherForecastDetails('Paris');
    expect(result).toHaveLength(0);
  });

  test('includes items within the next 4 days', async () => {
    const list = [
      makeForecastItem(inFuture(0)),
      makeForecastItem(inFuture(1)),
      makeForecastItem(inFuture(2)),
      makeForecastItem(inFuture(3)),
    ];
    mockFetch(mockSuccess(list));

    const result = await getWeatherForecastDetails('Paris');
    expect(result).toHaveLength(4);
  });

  test('sets visibility to null when missing from API response', async () => {
    const item = makeForecastItem(inFuture(1));
    delete item.visibility;
    mockFetch(mockSuccess([item]));

    const [result] = await getWeatherForecastDetails('Paris');
    expect(result.visibility).toBeNull();
  });

  test('throws an error when cod is not "200"', async () => {
    mockFetch({ cod: '404', message: 'city not found' });
    await expect(getWeatherForecastDetails('InvalidCity')).rejects.toThrow('city not found');
  });
});