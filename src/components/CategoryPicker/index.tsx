import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {CommonStyles} from '../../utils/commonStyles';
import {CategoryDefinition} from '../../constants/categories';

const {width} = Dimensions.get('window');

interface CategoryPickerProps<Id extends string> {
  categories: CategoryDefinition[];
  selectedCategory: Id;
  onSelect: (category: Id) => void;
}

const CategoryPicker = <Id extends string>({
  categories,
  selectedCategory,
  onSelect,
}: CategoryPickerProps<Id>) => {
  const handleCategorySelect = (category: Id) => {
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
              onPress={() => handleCategorySelect(category.id as Id)}
              style={styles.categoryItem}>

              {/* Icon (falls back to the emoji when there is no svg) */}
              <View
                style={[
                  styles.iconContainer,
                  isSelected && styles.selectedIconContainer,
                ]}>
                {category.Icon ? (
                  <category.Icon
                    width={width * 0.065}
                    height={width * 0.065}
                    color={isSelected ? '#FFFFFF' : '#654F54'}
                  />
                ) : (
                  <Text style={styles.emoji}>{category.emoji}</Text>
                )}
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

  emoji: {
    fontSize: width * 0.06,
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