import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './view/Home';
import SecWindow from './view/SecWindow';

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
          name="SecWindow"
          component={SecWindow}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}