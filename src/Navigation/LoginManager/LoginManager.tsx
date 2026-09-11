// import React from 'react';
// import AuthNavigator from '../AuthNavigator';
// import HomeNavigator from '../HomeNavigator';

// const LoginManager = () => {

//   const isLoggedIn: Boolean = false;

//   return <>{isLoggedIn ? <HomeNavigator /> : <AuthNavigator />}</>;
// };

// export default LoginManager;

import React, { useEffect, useState } from 'react';
import { getApp } from '@react-native-firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  FirebaseAuthTypes,
} from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import AuthNavigator from '../AuthNavigator';
import HomeNavigator from '../HomeNavigator';

const auth = getAuth(getApp());

export default function LoginManager() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (initializing) setInitializing(false);
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

  return <>{user ? <HomeNavigator /> : <AuthNavigator />}</>;
}
