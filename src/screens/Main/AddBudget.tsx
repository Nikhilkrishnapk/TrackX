import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  LayoutChangeEvent,
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
import { useAppData } from '../../context/AppDataContext';
import { addTransaction } from '../../services/firebase/transactions';import { getCategoriesForType, getCategory } from '../../constants/categories';
import { useToast } from '../../components/Toast';
import { CategoryId, TransactionType } from '../../types';
import { formatCurrency, parseAmountToMinor } from '../../utils/money';
import type { TabScreenProps } from '../../navigation/types';

const { width } = Dimensions.get('window');

const TABS: { key: TransactionType; label: string }[] = [
  { key: 'expense', label: 'Expense' },
  { key: 'income', label: 'Income' },
];

const defaultCategory = (type: TransactionType): CategoryId =>
  getCategoriesForType(type)[0].id;

const AddBudget = ({ navigation, route }: TabScreenProps<'AddBudget'>) => {
  const { user } = useAppData();
  const toast = useToast();
  const [mode, setMode] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [amountError, setAmountError] = useState('');
  const [note, setNote] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>(
    defaultCategory('expense'),
  );
  const [headerHeight, setHeaderHeight] = useState(0);

  const scrollViewRef = useRef<ScrollView>(null);

  const changeMode = (nextMode: TransactionType) => {
    setMode(nextMode);
    // Categories differ per type, so pick a valid one for the new type.
    setSelectedCategory(defaultCategory(nextMode));
  };

  // "Add Money" on Home opens this screen with { mode: 'income' }.
  const requestedMode = route.params?.mode;
  useEffect(() => {
    if (requestedMode) {
      setMode(requestedMode);
      setSelectedCategory(defaultCategory(requestedMode));
      navigation.setParams({ mode: undefined });
    }
  }, [requestedMode, navigation]);

  const handleAmountChange = (text: string) => {
    setAmount(text);
    if (amountError) {
      setAmountError('');
    }
  };

  const handleSubmit = () => {
    const parsed = parseAmountToMinor(amount);
    if (!parsed.ok) {
      setAmountError(parsed.error);
      return;
    }

    const { committed } = addTransaction(user.uid, {
      type: mode,
      amountMinor: parsed.amountMinor,
      category: selectedCategory,
      note,
      transactionDate: new Date(),
    });

    // Firestore has already applied the write locally, so every screen is
    // updated. Clearing the form right away also blocks a double submit
    // (an empty amount fails validation).
    setAmount('');
    setNote('');
    toast.success(
      mode === 'expense' ? 'Expense saved' : 'Income added',
      `${formatCurrency(parsed.amountMinor)} · ${getCategory(selectedCategory)?.name ?? ''}`,
    );

    committed.catch(e => {
      console.warn('Saving transaction failed', e);
      toast.error('Could not save transaction', 'The server rejected it. Please try again.');
    });
  };

  const onHeaderLayout = (e: LayoutChangeEvent) => {
    setHeaderHeight(e.nativeEvent.layout.height);
  };

  const handleNoteFocus = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View onLayout={onHeaderLayout}>
        <Header isBackButton={false} title="Add Transaction" />
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
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
                    onPress={() => changeMode(tab.key)}
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
                    onChangeText={handleAmountChange}
                    placeholder="0.00"
                    placeholderTextColor="#1E1B2E"
                    keyboardType="decimal-pad"
                    selectionColor="#B51235"
                    cursorColor="#B51235"
                  />
                </View>
              </View>
              {amountError ? (
                <Text style={styles.errorText}>{amountError}</Text>
              ) : null}
            </View>

            {/* category selector */}
            <CategoryPicker
              categories={getCategoriesForType(mode)}
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
                onFocus={handleNoteFocus}
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
  errorText: {
    marginTop: 6,
    marginLeft: 8,
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 13,
    color: '#C4213A',
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