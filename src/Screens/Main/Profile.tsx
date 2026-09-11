import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { signOutUser } from '../../services/firebase/auth';

const Profile = () => {
  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch (error: any) {
      console.error('Logout failed', error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Screen</Text>
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          backgroundColor: '#000',
          padding: 14,
          borderRadius: 8,
          marginTop: 20,
        }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'PlusJakartaSans-Regular',
  },
});

export default Profile;
