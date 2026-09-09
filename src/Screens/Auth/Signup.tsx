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

const { width } = Dimensions.get('window');

function Signup() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState <string> ('');
  const [username, setUsername] = useState <string> ('');
  const [password, setPassword] = useState <string> ('');
  const [showPassword, setShowPassword] = useState(false);

  const isEmailValid = email.length > 0 && email.includes('@');

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
              onChangeText={setUsername}
              placeholder="eg: jack"
              placeholderTextColor="#9C9CA6"
              keyboardType="default"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {isEmailValid && (
              <VerifiedIcon width={width * 0.05} height={width * 0.05} />
            )}
          </View>
          <View style={styles.divider} />

          {/* Email field */}
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
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
          <View style={styles.divider} />

          {/* Password field */}
          <Text style={[styles.label, styles.fieldSpacing]}>Password</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#9C9CA6"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
              <EyeIcon width={width * 0.05} height={width * 0.05} />
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />

          {/* Sign in button */}
          <TouchableOpacity activeOpacity={0.85}>
            <LinearGradient
              colors={['#C4213A', '#3A1230', '#1A0E24']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.signInButton}
            >
              <Text style={styles.signInText}>SIGN UP</Text>
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
    fontWeight: '700',
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
    fontWeight: '600',
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
    paddingVertical: 0,
  },
  divider: {
    height: 1,
    backgroundColor: '#E1E1E6',
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
    fontWeight: '700',
    letterSpacing: 1,
  },
  signupWrap: {
    marginTop: 'auto',
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
