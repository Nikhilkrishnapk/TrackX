import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { signOutUser } from '../../services/firebase/auth';
import { updateUsername } from '../../services/firebase/user';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import ProfileCard from '../../components/ProfileCard';
import FormModal, { formModalStyles } from '../../components/FormModal';
import { useToast } from '../../components/Toast';
import LogoutIcon from '../../assets/images/logout-icon.svg';
import { useAppData } from '../../context/AppDataContext';

const { width } = Dimensions.get('window');

const MAX_NAME_LENGTH = 50;

const Profile = () => {
  const { user, profile } = useAppData();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [nameError, setNameError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  const name = profile?.username || user.displayName || 'TrackX User';
  const email = profile?.email || user.email || '';

  const openEditor = () => {
    setNameInput(name);
    setNameError('');
    setEditing(true);
  };

  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setNameError('Name is required');
      return;
    }
    if (trimmed.length > MAX_NAME_LENGTH) {
      setNameError(`Name must be at most ${MAX_NAME_LENGTH} characters`);
      return;
    }
    updateUsername(user.uid, trimmed).catch(e => {
      console.warn('Updating name failed', e);
      toast.error('Could not update name', 'Check your connection and try again.');
    });
    setEditing(false);
    toast.success('Profile updated', `You're now ${trimmed}`);
  };

  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }
    try {
      setLoggingOut(true);
      // On success LoginManager switches to the auth screens and this
      // screen unmounts, so there is nothing else to do here.
      await signOutUser();
    } catch (error) {
      console.error('Logout failed', error);
      setLoggingOut(false);
      toast.error('Logout failed', 'Please try again.');
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
          <ProfileCard name={name} email={email} />

          <TouchableOpacity onPress={openEditor} style={styles.editButton}>
            <Text style={styles.editText}>Edit Name</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            disabled={loggingOut}
            style={styles.signInButton}
          >
            <LogoutIcon width={width * 0.07} height={width * 0.07} />

            <Text style={styles.signInText}>{loggingOut ? 'Logging out…' : 'Log Out'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <FormModal
        visible={editing}
        title="Edit name"
        submitLabel="Save"
        onSubmit={handleSaveName}
        onClose={() => setEditing(false)}
      >
        <Text style={formModalStyles.label}>Full name</Text>
        <TextInput
          style={formModalStyles.input}
          value={nameInput}
          onChangeText={text => {
            setNameInput(text);
            setNameError('');
          }}
          placeholder="Your name"
          placeholderTextColor="#B0A8B9"
          maxLength={MAX_NAME_LENGTH}
          selectionColor="#B51235"
          cursorColor="#B51235"
          autoFocus
        />
        {nameError ? <Text style={formModalStyles.errorText}>{nameError}</Text> : null}
      </FormModal>
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
  editButton: {
    marginTop: width * 0.025,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  editText: {
    color: '#201B20',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
    letterSpacing: 1,
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
