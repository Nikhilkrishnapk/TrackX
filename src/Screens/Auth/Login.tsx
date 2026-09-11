import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// icon/images
import Logo from '../../assets/images/trackXlogo.svg';
import VerifiedIcon from '../../assets/images/tick.svg';
import EyeIcon from '../../assets/images/eyebtn.svg';

import {
  isValidEmail,
  LoginFormErrors,
  validateLoginForm,
} from '../../utils/validators';
import { signIn } from '../../services/firebase/auth';
import { mapAuthError } from '../../utils/authErrors';

const { width } = Dimensions.get('window');

function Login() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [loginError, setLoginError] = useState('');
  const [loading, setloading] = useState(false);

  const isEmailValid = isValidEmail(email);

  const handleSubmit = async () => {
    const validationErrors = validateLoginForm({ email, password });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      setLoginError('');
      setloading(true);
      await signIn(email, password);
    } catch (error: any) {
      console.log('error ',error);
      console.log('error code',error.code);
      setLoginError(mapAuthError(error.code));
    } finally {
      setloading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#C4213A', '#3A1230', '#1A0E24']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.menuDots}></TouchableOpacity>
        <Text style={styles.headerTitle}>Hello{'\n'}Sign in!</Text>
      </LinearGradient>

      {/* Form card */}
      <KeyboardAvoidingView
        style={styles.cardWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.card}
          contentContainerStyle={styles.cardContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Email field */}
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              placeholder="you@email.com"
              placeholderTextColor="#9C9CA6"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {isEmailValid && (
              <VerifiedIcon width={width * 0.05} height={width * 0.05} />
            )}
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          <View style={[styles.divider, errors.email && styles.dividerError]} />

          {/* Password field */}
          <Text style={[styles.label, styles.fieldSpacing]}>Password</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              placeholder="Enter your password"
              placeholderTextColor="#9C9CA6"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
              <EyeIcon width={18} height={18} />
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
          <View
            style={[styles.divider, errors.password && styles.dividerError]}
          />

          <TouchableOpacity style={styles.forgotWrap}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Sign in button */}
     
          <TouchableOpacity onPress={handleSubmit} activeOpacity={0.85}>
            <LinearGradient
              colors={['#C4213A', '#3A1230', '#1A0E24']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.signInButton}
            >
              {loading ? (
                <Text style={styles.signInText}>LOADING...</Text>
              ) : (
                <Text style={styles.signInText}>SIGN IN</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
          { loginError ? (
            <Text style={styles.loginErrorText}>{loginError}</Text>
          ) : null}

          <View style={styles.signupWrap}>
            <Text style={styles.signupPrompt}>Don't have account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C4213A',
  },
  header: {
    height: width * 0.85,
    paddingTop: width * 0.16,
    paddingHorizontal: 24,
  },
  menuDots: {
    position: 'absolute',
    top: width * 0.16,
    right: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 32,
    fontFamily: 'PlusJakartaSans-Bold',
    lineHeight: 40,
  },

  cardWrapper: {
    flex: 1,
    marginTop: -width * 0.42,
  },
  card: {
    flex: 1,
    backgroundColor: '#F7F7F9',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  cardContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    flexGrow: 1,
  },
  label: {
    color: '#B0243E',
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-SemiBold',
    marginBottom: 8,
  },
  fieldSpacing: {
    marginTop: 28,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1F',
    fontFamily: 'PlusJakartaSans-Regular',
    paddingVertical: 0,
  },
  divider: {
    height: 1,
    backgroundColor: '#E1E1E6',
  },
  dividerError: {
    backgroundColor: '#C4213A',
  },
  errorText: {
    fontSize: 12,
    color: '#C4213A',
    fontFamily: 'PlusJakartaSans-Regular',
    marginTop: -4,
    marginBottom: 8,
  },
  loginErrorText: {
    fontSize: 12,
    color: '#C4213A',
    fontFamily: 'PlusJakartaSans-Regular',
    textAlign: 'center',
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
      },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginTop: 20,
  },
  forgotText: {
    fontSize: 14,
    color: '#1A1A1F',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  signInButton: {
    marginTop: 48,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
    letterSpacing: 1,
  },
  signupWrap: {
    marginTop: 40,
    paddingTop: 40,
    alignItems: 'flex-end',
  },
  signupPrompt: {
    fontSize: 13,
    color: '#8C8C96',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  signupLink: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#1A1A1F',
    marginTop: 2,
  },
});

export default Login;
