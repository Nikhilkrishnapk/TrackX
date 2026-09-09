import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Main/Home';
import { colorStyles } from '../constants/colors';

const homeNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colorStyles.secondary } }}>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
};

export default homeNavigator;
