/**
 * TrackX
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginManager from './src/navigation/LoginManager/LoginManager';
import { ToastProvider } from './src/components/Toast';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ToastProvider>
        <NavigationContainer>
          <LoginManager />
        </NavigationContainer>
      </ToastProvider>
    </SafeAreaProvider>
  );
}

export default App;
