import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Home from "../Screens/Main/Home";

const homeNavigator = () => {
    const Stack = createNativeStackNavigator();

    return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={Home}/>
    </Stack.Navigator>        
    )
}

export default homeNavigator;