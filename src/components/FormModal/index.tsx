import React from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { CommonStyles } from '../../utils/commonStyles';

const { width } = Dimensions.get('window');

type FormModalProps = {
  visible: boolean;
  title: string;
  submitLabel: string;
  onSubmit: () => void;
  onClose: () => void;
  children: React.ReactNode;
  // Optional secondary destructive action, e.g. "Remove budget".
  dangerLabel?: string;
  onDanger?: () => void;
};

// Bottom-sheet style modal shared by the small edit forms in the app.
const FormModal = ({
  visible,
  title,
  submitLabel,
  onSubmit,
  onClose,
  children,
  dangerLabel,
  onDanger,
}: FormModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>

          {children}

          <TouchableOpacity onPress={onSubmit} activeOpacity={0.85}>
            <LinearGradient
              colors={['#C4213A', '#3A1230', '#1A0E24']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.submitButton}
            >
              <Text style={styles.submitText}>{submitLabel}</Text>
            </LinearGradient>
          </TouchableOpacity>

          {dangerLabel && onDanger ? (
            <TouchableOpacity onPress={onDanger} style={styles.dangerButton}>
              <Text style={styles.dangerText}>{dangerLabel}</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export const formModalStyles = StyleSheet.create({
  label: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 14,
    color: '#654F54',
    marginTop: 16,
  },
  input: {
    marginTop: 8,
    backgroundColor: '#F5EAF7',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 18,
    color: '#1E1B2E',
  },
  errorText: {
    marginTop: 6,
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 13,
    color: '#C4213A',
  },
});

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(26, 14, 36, 0.45)',
  },
  sheet: {
    backgroundColor: '#FDF6FF',
    borderTopLeftRadius: CommonStyles.borderRadius,
    borderTopRightRadius: CommonStyles.borderRadius,
    padding: CommonStyles.padding,
    paddingBottom: 36,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D8C9D0',
    marginBottom: 14,
  },
  title: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: width * CommonStyles.header,
    color: '#201B20',
  },
  submitButton: {
    marginTop: 24,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
    letterSpacing: 1,
  },
  dangerButton: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 8,
  },
  dangerText: {
    color: '#C4213A',
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 15,
  },
  cancelButton: {
    marginTop: 4,
    alignItems: 'center',
    paddingVertical: 8,
  },
  cancelText: {
    color: '#654F54',
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 15,
  },
});

export default FormModal;
