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
import VerifiedIcon from '../../assets/images/tick.svg';
import EyeIcon from '../../assets/images/eyebtn.svg';

import {
  isValidEmail,
  SignupFormErrors,
  validateSignupForm,
} from '../../utils/validators';
import { mapAuthError } from '../../utils/authErrors';
import { signUp } from '../../services/firebase/auth';

const { width } = Dimensions.get('window');

function Signup() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState('');

  const isEmailValid = isValidEmail(email);

  const handleSubmit = async () => {
    const validationErrors = validateSignupForm({ username, email, password });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      setLoading(true);
      setSignupError('');
      await signUp(email, password, username);
    } catch (error: any) {
      setSignupError(mapAuthError(error.code));
    } finally {
      setLoading(false);
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
        <Text style={styles.headerTitle}>Create{'\n'}Your account</Text>
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
          {/* Username field */}
          <Text style={styles.label}>Fullname</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (errors.username) {
                  setErrors((prev) => ({ ...prev, username: undefined }));
                }
              }}
              placeholder="eg: jack"
              placeholderTextColor="#9C9CA6"
              keyboardType="default"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {errors.username && (
            <Text style={styles.errorText}>{errors.username}</Text>
          )}
          <View
            style={[styles.divider, errors.username && styles.dividerError]}
          />

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

          {/* Sign in button */}
          {signupError ? (
            <Text style={styles.errorText}>{signupError}</Text>
          ) : null}
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
                <Text style={styles.signInText}>SIGN UP</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
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
    fontSize: 34,
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
  forgotWrap: {
    alignSelf: 'flex-end',
    marginTop: 20,
  },
  forgotText: {
    fontSize: 14,
    color: '#1A1A1F',
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
  },
  signupLink: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1F',
    marginTop: 2,
  },
});

export default Signup;
