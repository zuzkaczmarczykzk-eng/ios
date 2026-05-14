import { API_KEY, BASE_URL } from '../constants/api';

export const getCurrentWeather = async (city) => {
  const response = await fetch(
    `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
  );

  const data = await response.json();

  if (data.cod !== 200) {
    throw new Error(data.message);
  }

  return data;
};

export const getForecastWeather = async (city) => {
  const response = await fetch(
    `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
  );

  const data = await response.json();

  if (data.cod !== '200') {
    throw new Error(data.message);
  }

  return data.list.filter((item) =>
    item.dt_txt.includes('12:00:00')
  );
};

export const getWeatherForecastDetails = async (city) => {
  const response = await fetch(
    `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
  );

  const data = await response.json();

  if (data.cod !== '200') {
    throw new Error(data.message);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cutoff = new Date(today);
  cutoff.setDate(today.getDate() + 4);

  return data.list
    .filter((item) => {
      const itemDate = new Date(item.dt * 1000);
      return itemDate >= today && itemDate < cutoff;
    })
    .map((item) => ({
      dateTime:  item.dt_txt,
      date:      item.dt_txt.split(' ')[0],
      time:      item.dt_txt.split(' ')[1].slice(0, 5),
      temp:      Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      tempMin:   Math.round(item.main.temp_min),
      tempMax:   Math.round(item.main.temp_max),
      humidity:  item.main.humidity,
      windSpeed: item.wind.speed,
      condition: item.weather[0].main,
      description: item.weather[0].description,
      icon:      item.weather[0].icon,
      visibility: item.visibility ?? null,
    }));
};

