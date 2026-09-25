import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {CommonStyles} from '../../utils/commonStyles';
import FOODICON from '../../assets/images/food-icon.svg';
import BILLICON from '../../assets/images/bill-icon.svg';
import SHOPPINGICON from '../../assets/images/shopping-icon.svg';

const {width} = Dimensions.get('window');

type CategoryType = 'food' | 'bills' | 'shopping';

interface Category {
  id: CategoryType;
  name: string;
  Icon: React.FC<{ width: number; height: number; color?: string }>;
}

const categories: Category[] = [
  { id: 'food',     name: 'Food & Dining',    Icon: FOODICON },
  { id: 'bills',    name: 'Bills & Utilities', Icon: BILLICON },
  { id: 'shopping', name: 'Shopping',          Icon: SHOPPINGICON },
];

interface CategoryPickerProps {
  selectedCategory: CategoryType;
  onSelect: (category: CategoryType) => void;
}

const CategoryPicker = ({ selectedCategory, onSelect }: CategoryPickerProps) => {
  const handleCategorySelect = (category: CategoryType) => {
    onSelect(category);
  };

  const selectedCategoryData = categories.find(
    category => category.id === selectedCategory,
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Category</Text>

          {/* Selected category */}
          <View style={styles.selectedCategoryBadge}>
            <Text style={styles.selectedCategoryText}>
              {selectedCategoryData?.name}
            </Text>
          </View>
        </View>

        <Text style={styles.tapText}>Tap to pick</Text>
      </View>

      {/* Categories */}
      <View style={styles.categoryContainer}>
        {categories.map(category => {
          const isSelected = selectedCategory === category.id;

          return (
            <TouchableOpacity
              key={category.id}
              activeOpacity={0.8}
              onPress={() => handleCategorySelect(category.id)}
              style={styles.categoryItem}>
              
              {/* Icon */}
              <View
                style={[
                  styles.iconContainer,
                  isSelected && styles.selectedIconContainer,
                ]}>
                <category.Icon
                  width={width * 0.065}
                  height={width * 0.065}
                  color={isSelected ? '#FFFFFF' : '#654F54'}
                />
              </View>

              {/* Name */}
              <Text
                numberOfLines={1}
                style={[
                  styles.categoryName,
                  isSelected && styles.selectedCategoryName,
                ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: CommonStyles.borderRadius,
    padding: CommonStyles.padding,
    marginTop: width * 0.025,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  title: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: width * 0.055,
    color: '#201B20',
  },

  selectedCategoryBadge: {
    backgroundColor: '#EED8F5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: 8,
    maxWidth: width * 0.38,
  },

  selectedCategoryText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: width * 0.032,
    color: '#6B5968',
  },

  tapText: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: width * 0.032,
    color: '#654F54',
  },

  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: width * 0.045,
  },

  categoryItem: {
    width: '30%',
    alignItems: 'center',
  },

  iconContainer: {
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: width * 0.04,
    backgroundColor: '#F5EAF7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedIconContainer: {
    backgroundColor: '#C51F3A',
  },

  categoryName: {
    marginTop: 8,
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: width * 0.032,
    color: '#654F54',
    textAlign: 'center',
  },

  selectedCategoryName: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#C51F3A',
  },
});

export default CategoryPicker;