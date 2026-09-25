import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { signOutUser } from '../../services/firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import ProfileCard from '../../components/ProfileCard';
import LogoutIcon from '../../assets/images/logout-icon.svg';
import { CommonStyles } from '../../utils/commonStyles';

const { height, width } = Dimensions.get('window');

const Profile = () => {
  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch (error: any) {
      console.error('Logout failed', error);
    }
  };
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header isBackButton={false} title="Profile" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* screen container */}
        <View
          style={{
            paddingHorizontal: width * 0.025,
            paddingVertical: width * 0.025,
          }}
        >
          <ProfileCard />



          <TouchableOpacity onPress={handleLogout} style={styles.signInButton}>
            <LogoutIcon width={width * 0.07} height={width * 0.07} />

            <Text style={styles.signInText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontFamily: 'PlusJakartaSans-Regular',
  },
  signInButton: {
    marginTop: width * 0.025,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2caa2',
    flexDirection: 'row',
    gap: 8,
  },
  signInText: {
    color: '#C4213A',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
    letterSpacing: 1,
  },
});

export default Profile;
