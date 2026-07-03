import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Login from "../Screens/Auth/Login"

const authNavigator = () => {
    const Stack = createNativeStackNavigator() 

    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={Login}/>
        </Stack.Navigator>
    )
}

export default authNavigator;