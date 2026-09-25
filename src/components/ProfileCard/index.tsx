import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { CommonStyles } from '../../utils/commonStyles';
import VerificationIcon from '../../assets/images/verification-icon.svg';
import ProfileIcon from '../../assets/images/profile-icon.svg';

const { width } = Dimensions.get('window');

const ProfileCard = () => {
  return (
    <LinearGradient
      colors={['#C4213A', '#3A1230', '#1A0E24']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
        <ProfileIcon width={width * 0.1} height={ width * 0.1}/>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>ACCOUNT USRNAME</Text>
          <Text style={styles.mailTxt}>username@gmail.com</Text>

          <View style={styles.verifyContainer}>
            <VerificationIcon width={width * 0.07} height={width * 0.07} />
            <Text style={styles.appNameTitle}>TRACKX ACCOUNT</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: width * 0.5,
    padding: CommonStyles.padding,
    overflow: 'hidden',
    borderRadius: CommonStyles.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: width * 0.03,
  },

  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: width * 0.045,
  },
  mailTxt: {
    color: 'grey',
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: width * 0.035,
  },
  verifyContainer: {
    marginTop: width * 0.03,
    width: '80%',
    minHeight: width * 0.1,
    borderRadius: width * 0.08,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 0.02,
  },

  appNameTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: width * 0.025,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

export default ProfileCard;
