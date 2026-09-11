import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Dimensions,
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

import VerifiedIcon from '../../assets/images/tick.svg';

import { isValidEmail } from '../../utils/validators';
import { resetPassword } from '../../services/firebase/auth';
import { mapAuthError } from '../../utils/authErrors';

const { width } = Dimensions.get('window');

function ForgetPassword() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [resetError, setResetError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const isEmailValid = isValidEmail(email);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }
    if (!isEmailValid) {
      setEmailError('Enter a valid email address');
      return;
    }

    try {
      setEmailError('');
      setResetError('');
      setLoading(true);
      await resetPassword(email);
      setSent(true);
    } catch (error: any) {
      setResetError(mapAuthError(error.code));
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
        <Text style={styles.headerTitle}>Forgot{'\n'}password?</Text>
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
          {sent ? (
            <>
              <Text style={styles.confirmTitle}>Check your email</Text>
              <Text style={styles.confirmSubtitle}>
                We've sent a password reset link to {email}. Follow the link
                to set a new password, then come back and sign in.
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#C4213A', '#3A1230', '#1A0E24']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.signInButton}
                >
                  <Text style={styles.signInText}>BACK TO SIGN IN</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.instructions}>
                Enter the email linked to your account and we'll send you a
                link to reset your password.
              </Text>

              {/* Email field */}
              <Text style={[styles.label, styles.fieldSpacing]}>Email</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) setEmailError('');
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
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
              <View
                style={[styles.divider, emailError && styles.dividerError]}
              />

              <TouchableOpacity onPress={handleSubmit} activeOpacity={0.85}>
                <LinearGradient
                  colors={['#C4213A', '#3A1230', '#1A0E24']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.signInButton}
                >
                  {loading ? (
                    <Text style={styles.signInText}>SENDING...</Text>
                  ) : (
                    <Text style={styles.signInText}>SEND RESET LINK</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
              {resetError ? (
                <Text style={styles.loginErrorText}>{resetError}</Text>
              ) : null}

              <View style={styles.signupWrap}>
                <Text style={styles.signupPrompt}>
                  Remembered your password?
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.signupLink}>Sign in</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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
  instructions: {
    fontSize: 14,
    color: '#5C5C66',
    fontFamily: 'PlusJakartaSans-Regular',
    lineHeight: 20,
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
    marginTop: 10,
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
  confirmTitle: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#1A1A1F',
    marginTop: 12,
    marginBottom: 12,
  },
  confirmSubtitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#5C5C66',
    lineHeight: 20,
    marginBottom: 32,
  },
});

export default ForgetPassword;