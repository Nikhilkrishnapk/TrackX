import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from '@react-native-firebase/auth';
import { ActivityIndicator, View } from 'react-native';
import AuthNavigator from '../AuthNavigator';
import HomeNavigator from '../HomeNavigator';
import { auth } from '../../services/firebase/client';
import { AppDataProvider } from '../../context/AppDataContext';

export default function LoginManager() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, u => {
      setUser(u);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
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
}
