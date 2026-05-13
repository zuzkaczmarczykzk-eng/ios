export const cities = [
  {
    id: 1,
    label: 'Praga',
    query: 'Prague',
  },
  {
    id: 2,
    label: 'Londyn',
    query: 'London',
  },
  {
    id: 3,
    label: 'Tokio',
    query: 'Tokyo',
  },
  {
    id: 4,
    label: 'Paryż',
    query: 'Paris',
  },
  {
    id: 5,
    label: 'Warszawa',
    query: 'Warsaw',
  },
  {
    id: 6,
    label: 'Berlin',
    query: 'Berlin',
  },
  {
    id: 7,
    label: 'Madryt',
    query: 'Madrid',
  },
];

export const getWeatherIcon = (condition) => {
  switch (condition) {
    case 'Clouds':
      return 'https://cdn-icons-png.flaticon.com/512/414/414825.png';

    case 'Rain':
      return 'https://cdn-icons-png.flaticon.com/512/3351/3351979.png';

    case 'Clear':
      return 'https://cdn-icons-png.flaticon.com/512/869/869869.png';

    default:
      return 'https://cdn-icons-png.flaticon.com/512/414/414825.png';
  }
};

export const getDayName = (date) => {
  const days = [
    'Niedziela',
    'Poniedziałek',
    'Wtorek',
    'Środa',
    'Czwartek',
    'Piątek',
    'Sobota',
  ];

  return days[new Date(date).getDay()];
};