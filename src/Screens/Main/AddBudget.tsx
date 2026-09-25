import React, { useState } from 'react';
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
import Header from '../../components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryPicker from '../../components/CategoryPicker';
import NoteIcon from '../../assets/images/note-icon.svg';

const { height, width } = Dimensions.get('window');

type Filter = 'expense' | 'income';

const TABS: { key: Filter; label: string }[] = [
  { key: 'expense', label: 'Expense' },
  { key: 'income', label: 'Income' },
];

type CategoryType = 'food' | 'bills' | 'shopping';

const AddBudget = () => {
  const [mode, setMode] = useState<Filter>('expense');
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType>('food');
  const handleSubmit = () => {
    console.log('Transaction saved:', { mode, amount, note, selectedCategory });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header isBackButton={false} title="Add Transaction" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* screen container */}
          <View
            style={{
              paddingHorizontal: width * 0.025,
              paddingVertical: width * 0.025,
            }}
          >
            {/* select exp type */}
            <View style={styles.segment}>
              {TABS.map((tab) => {
                const active = mode === tab.key;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    activeOpacity={0.8}
                    onPress={() => setMode(tab.key)}
                    style={styles.segmentItem}
                  >
                    {active ? (
                      <LinearGradient
                        colors={['#C4213A', '#3A1230', '#1A0E24']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.segmentActive}
                      >
                        <Text
                          style={[styles.segmentText, styles.segmentTextActive]}
                        >
                          {tab.label}
                        </Text>
                      </LinearGradient>
                    ) : (
                      <Text style={styles.segmentText}>{tab.label}</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* input box for add exp or inc */}
            {/* Amount input */}
            <View>
              <View style={styles.amountCard}>
                <View style={styles.amountHeader}>
                  <Text style={styles.label}>
                    Amount {mode === 'expense' ? 'Spent' : 'Received'}
                  </Text>
                </View>

                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencySymbol}>₹</Text>

                  <TextInput
                    style={styles.amountInput}
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="0.00"
                    placeholderTextColor="#1E1B2E"
                    keyboardType="decimal-pad"
                    selectionColor="#B51235"
                    cursorColor="#B51235"
                  />
                </View>
              </View>
            </View>

            {/* category selector */}
            <CategoryPicker
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />

            {/* note / memo section */}
            <View style={styles.noteCard}>
              <View style={styles.noteIconWrapper}>
                <NoteIcon width={width * 0.04} height={width * 0.04} />
                <Text style={styles.noteLabel}>Note</Text>
              </View>
              <TextInput
                style={styles.noteInput}
                value={note}
                onChangeText={setNote}
                placeholder="Add a memo..."
                placeholderTextColor="#B0A8B9"
                selectionColor="#B51235"
                cursorColor="#B51235"
                maxLength={50}
              />
            </View>

            {/* button for saving the transaction */}

            <TouchableOpacity onPress={handleSubmit} activeOpacity={0.85}>
              <LinearGradient
                colors={['#C4213A', '#3A1230', '#1A0E24']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.saveButton}
              >
                <Text style={styles.saveButtonText}>Save Transaction</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  segment: {
    flexDirection: 'row',
    backgroundColor: '#EEE9F3',
    borderRadius: 30,
    padding: 5,
    marginTop: 16,
    marginBottom: 16,
  },
  segmentItem: {
    flex: 1,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    flex: 1,
    width: '100%',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    elevation: 2,
  },
  segmentText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 15,
    color: '#6B6478',
  },
  segmentTextActive: {
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#FFFFFF',
  },
  amountCard: {
    width: '100%',
    height: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 32,
    paddingBottom: 18,
  },
  amountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 14,
    color: '#654F54',
    letterSpacing: 0.5,
  },
  amountInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  currencySymbol: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 52,
    color: '#B51235',
    lineHeight: 60,
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    height: 95,
    padding: 0,
    margin: 0,
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 52,
    lineHeight: 60,
    color: '#1E1B2E',
    alignItems: 'center',
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginTop: width * 0.025,
    gap: 10,
  },
  noteIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  noteLabel: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 13,
    color: '#B51235',
  },
  noteInput: {
    flex: 1,
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 14,
    color: '#1E1B2E',
    padding: 0,
    margin: 0,
    borderLeftWidth: 1,
    borderLeftColor: '#EEE9F3',
    paddingLeft: 10,
  },

  // save button
  saveButton: {
    marginTop: width * 0.025,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
    letterSpacing: 1,
  },
});

export default AddBudget;
