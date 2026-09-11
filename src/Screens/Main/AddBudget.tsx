import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { signOutUser } from '../../services/firebase/auth';

const AddBudget = () => {

  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch (error: any) {
      console.error('Logout failed', error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Add budget Screen</Text>
    
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

export default AddBudget;
