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