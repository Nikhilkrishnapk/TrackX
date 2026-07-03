import AuthNavigator from '../authNavigator';
import HomeNavigator from '../homeNavigator';

const LoginManager = () => {


  return (
    <>
      { 
        <AuthNavigator />
        // <HomeNavigator />
      }
    </>
  );
};

export default LoginManager;