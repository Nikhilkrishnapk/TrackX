import React, { useCallback, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from '@react-native-firebase/auth';
import { StyleSheet, View } from 'react-native';
import AuthNavigator from '../AuthNavigator';
import HomeNavigator from '../HomeNavigator';
import { auth } from '../../services/firebase/client';
import { AppDataProvider } from '../../context/AppDataContext';
import SplashScreen from '../../components/SplashScreen';

export default function LoginManager() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, u => {
      setUser(u);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  const hideSplash = useCallback(() => setShowSplash(false), []);

  const renderContent = () => {
    // The splash covers the screen until auth state is known.
    if (initializing) {
      return null;
    }
    if (!user) {
      return <AuthNavigator />;
    }
    // key={uid}: a different account gets a fresh provider with no stale data.
    return (
      <AppDataProvider key={user.uid} user={user}>
        <HomeNavigator />
      </AppDataProvider>
    );
  };

  return (
    <View style={styles.container}>
      {renderContent()}
      {showSplash ? <SplashScreen ready={!initializing} onFinish={hideSplash} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
