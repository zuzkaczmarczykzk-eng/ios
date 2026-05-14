import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './view/Home';
import CityWeatherDetails from './view/CityWeatherDetails';
import WeatherForecast from './view/WeatherForecast';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Home"
          component={Home}
        />

        <Stack.Screen
          name="CityWeatherDetails"
          component={CityWeatherDetails}
        />

        <Stack.Screen
          name="WeatherForecast"
          component={WeatherForecast}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}