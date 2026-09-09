import React from 'react';
import AuthNavigator from '../AuthNavigator';
import HomeNavigator from '../HomeNavigator';

const LoginManager = () => {
  
  const isLoggedIn: Boolean = false;

  return <>{isLoggedIn ? <HomeNavigator /> : <AuthNavigator />}</>;
};

export default LoginManager;
