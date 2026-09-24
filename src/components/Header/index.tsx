import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from '../../assets/images/backbutton.svg';
import Logo from '../../assets/images/trackXlogo.svg';
import { CommonStyles } from '../../utils/commonStyles';

const { width, height } = Dimensions.get('window');

type HeaderProps = {
  isBackButton: boolean;
  title?: string;
};

const Header = ({ isBackButton, title }: HeaderProps) => {
  return (
    <LinearGradient
      colors={['#C4213A', '#3A1230', '#1A0E24']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.headerTitleContainer}>
        {/* back button "optional" */}
        {isBackButton && (
          <TouchableOpacity style={styles.backButton}>
            <BackButton />
          </TouchableOpacity>
        )}
        {/* header title */}

        {title && <Text style={styles.title}>{title}</Text>}
      </View>

      <View>
        {/* logo */}
        <Logo width={width * 0.2} height={width * 0.2} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    width: width,
    height: height * 0.065,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 7,
  },

  headerTitleContainer: {
    flexDirection: 'row',
  }
,
  title: {
    color: 'white',
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: width * CommonStyles.header,
    marginLeft: 10,
  },

  backButton: {
    backgroundColor: 'white',
    width: width * 0.07,
    height: width * 0.07,
    borderRadius: (width * 0.1) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Header;
