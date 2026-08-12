import React from 'react';
import AuthNavigator from '../authNavigator';
import HomeNavigator from '../homeNavigator';

const LoginManager = () => {
  
  const isLoggedIn: Boolean = false;

  return <>{isLoggedIn ? <HomeNavigator /> : <AuthNavigator />}</>;
};

export default LoginManager;
