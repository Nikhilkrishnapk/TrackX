import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import TotalMonthlyEnvelop from '../../components/TotalMonthlyEnvelop';
import BudgetScale from '../../components/BudgetScale';
import CategoryPicker from '../../components/CategoryPicker';
import FormModal, { formModalStyles } from '../../components/FormModal';
import { EXPENSE_CATEGORIES, getCategory } from '../../constants/categories';
import { useAppData } from '../../context/AppDataContext';
import { deleteBudget, saveBudget } from '../../services/firebase/budgets';
import { ExpenseCategoryId } from '../../types';
import { CommonStyles } from '../../utils/commonStyles';
import { remainingDaysInMonth } from '../../utils/date';
import {
  calculateBudgetProgress,
  expensesByCategory,
  transactionsInMonth,
} from '../../utils/finance';
import { formatCurrency, parseAmountToMinor } from '../../utils/money';
import { useToast } from '../../components/Toast';

const { width } = Dimensions.get('window');

type EditorState = {
  category: ExpenseCategoryId;
  isNew: boolean;
} | null;

const Budget = () => {
  const { user, budgets, recentTransactions, loading } = useAppData();
  const toast = useToast();
  const [editor, setEditor] = useState<EditorState>(null);
  const [limitInput, setLimitInput] = useState('');
  const [limitError, setLimitError] = useState('');

  const now = new Date();
  const remainingDays = remainingDaysInMonth(now);

  const progress = useMemo(() => {
    const monthExpenses = expensesByCategory(transactionsInMonth(recentTransactions, new Date()));
    const order = EXPENSE_CATEGORIES.map(c => c.id);
    return calculateBudgetProgress(budgets, monthExpenses).sort(
      (a, b) => order.indexOf(a.budget.category) - order.indexOf(b.budget.category),
    );
  }, [budgets, recentTransactions]);

  const totalLimitMinor = progress.reduce((sum, p) => sum + p.budget.limitMinor, 0);
  const totalSpentMinor = progress.reduce((sum, p) => sum + p.spentMinor, 0);

  const unbudgetedCategories = EXPENSE_CATEGORIES.filter(
    c => !budgets.some(b => b.category === c.id),
  );

  const openNewBudget = () => {
    setEditor({ category: unbudgetedCategories[0].id, isNew: true });
    setLimitInput('');
    setLimitError('');
  };

  const openEditBudget = (category: ExpenseCategoryId, limitMinor: number) => {
    setEditor({ category, isNew: false });
    setLimitInput((limitMinor / 100).toFixed(2));
    setLimitError('');
  };

  const closeEditor = () => setEditor(null);

  const handleSave = () => {
    if (!editor) {
      return;
    }
    const parsed = parseAmountToMinor(limitInput);
    if (!parsed.ok) {
      setLimitError(parsed.error);
      return;
    }
    saveBudget(user.uid, editor.category, parsed.amountMinor, editor.isNew).catch(e => {
      console.warn('Saving budget failed', e);
      toast.error('Could not save budget', 'Please try again.');
    });
    toast.success(
      editor.isNew ? 'Budget created' : 'Budget updated',
      `${getCategory(editor.category)?.name} · ${formatCurrency(parsed.amountMinor)} / month`,
    );
    closeEditor();
  };

  // Remove straight away and offer Undo, instead of a confirm dialog.
  const handleRemove = () => {
    if (!editor) {
      return;
    }
    const { category } = editor;
    const removed = budgets.find(b => b.category === category);
    closeEditor();

    deleteBudget(user.uid, category).catch(e => {
      console.warn('Removing budget failed', e);
      toast.error('Could not remove budget', 'Please try again.');
    });

    toast.show({
      type: 'info',
      title: 'Budget removed',
      message: `${getCategory(category)?.name} is no longer tracked`,
      actionLabel: removed ? 'Undo' : undefined,
      onAction: () => {
        if (removed) {
          saveBudget(user.uid, category, removed.limitMinor, true).catch(e => {
            console.warn('Undo remove budget failed', e);
            toast.error('Could not restore budget', 'Please set it again.');
          });
        }
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header isBackButton={false} title="Budgets" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* screen container */}
        <View
          style={{
            paddingHorizontal: width * 0.025,
            paddingVertical: width * 0.025,
          }}
        >
          {loading ? (
            <ActivityIndicator style={styles.loader} size="large" color="#C4213A" />
          ) : (
            <>
              {/* monthly envelope */}
              <TotalMonthlyEnvelop
                totalMinor={totalLimitMinor}
                spentMinor={totalSpentMinor}
                remainingDays={remainingDays}
              />

              {progress.length === 0 ? (
                <Text style={styles.emptyText}>
                  No budgets yet. Set a monthly limit for a category to track your spending.
                </Text>
              ) : null}

              {/* one scale per budget */}
              {progress.map(p => {
                const category = getCategory(p.budget.category);
                const Icon = category?.Icon;
                return (
                  <BudgetScale
                    key={p.budget.id}
                    title={category?.name ?? p.budget.category}
                    spentMinor={p.spentMinor}
                    limitMinor={p.budget.limitMinor}
                    scaleColor={category?.color ?? '#7C768A'}
                    remainingDays={remainingDays}
                    icon={Icon ? <Icon width={30} height={30} /> : <Text>{category?.emoji}</Text>}
                    onPress={() => openEditBudget(p.budget.category, p.budget.limitMinor)}
                  />
                );
              })}

              {unbudgetedCategories.length > 0 ? (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={openNewBudget}
                  activeOpacity={0.85}
                >
                  <Text style={styles.addButtonText}>＋  Set a budget</Text>
                </TouchableOpacity>
              ) : null}

              {progress.length > 0 ? (
                <Text style={styles.hint}>Tap a budget to edit or remove it.</Text>
              ) : null}
            </>
          )}
        </View>
      </ScrollView>

      <FormModal
        visible={editor !== null}
        title={editor?.isNew ? 'New monthly budget' : `Edit ${getCategory(editor?.category ?? '')?.name ?? ''} budget`}
        submitLabel="Save Budget"
        onSubmit={handleSave}
        onClose={closeEditor}
        dangerLabel={editor && !editor.isNew ? 'Remove budget' : undefined}
        onDanger={handleRemove}
      >
        {editor?.isNew ? (
          <CategoryPicker
            categories={unbudgetedCategories}
            selectedCategory={editor.category}
            onSelect={category => setEditor({ category, isNew: true })}
          />
        ) : null}

        <Text style={formModalStyles.label}>Monthly limit (₹)</Text>
        <TextInput
          style={formModalStyles.input}
          value={limitInput}
          onChangeText={text => {
            setLimitInput(text);
            setLimitError('');
          }}
          placeholder="0.00"
          placeholderTextColor="#B0A8B9"
          keyboardType="decimal-pad"
          selectionColor="#B51235"
          cursorColor="#B51235"
          autoFocus
        />
        {limitError ? <Text style={formModalStyles.errorText}>{limitError}</Text> : null}
      </FormModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingBottom: 30,
  },

  loader: {
    marginTop: 60,
  },

  emptyText: {
    marginTop: width * 0.04,
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: width * 0.034,
    color: '#654F54',
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  addButton: {
    marginTop: width * 0.04,
    height: 56,
    borderRadius: CommonStyles.borderRadius,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#C4213A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 15,
    color: '#C4213A',
  },

  hint: {
    marginTop: 10,
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#7C768A',
    textAlign: 'center',
  },
});

export default Budget;
