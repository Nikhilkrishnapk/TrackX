import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Svg, { Path, Circle } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

import Home from '../screens/Main/Home';
import Activity from '../screens/Main/Activity';
import AddBudget from '../screens/Main/AddBudget';
import Budget from '../screens/Main/Budget';
import Profile from '../screens/Main/Profile';

const ACTIVE = '#C4213A';
const INACTIVE = '#3D2A2A';
const ADD_SIZE = 68;

function HomeIcon({ color }: { color: string }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1v-9.5z" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
      <Path d="M9 21V13h6v8" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
    </Svg>
  );
}

function ActivityIcon({ color }: { color: string }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path d="M5 3h14a1 1 0 011 1v16a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z" stroke={color} strokeWidth={1.7} />
      <Path d="M8 8h3M8 12h8M8 16h5" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
      <Path d="M13 8h3" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

function BudgetIcon({ color }: { color: string }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.7} />
      <Path d="M12 3v9h9" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
      <Path d="M12 12L5.5 18.5" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

function ProfileIcon({ color }: { color: string }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={7} r={4} stroke={color} strokeWidth={1.7} />
      <Path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

const REGULAR_TABS = [
  { name: 'Home',     label: 'Home',     Icon: HomeIcon },
  { name: 'Activity', label: 'Activity', Icon: ActivityIcon },
  { name: 'Budget',   label: 'Budgets',  Icon: BudgetIcon },
  { name: 'Profile',  label: 'Profile',  Icon: ProfileIcon },
];

function CustomTabBar({ state, navigation }: any) {
  const addRoute = state.routes.find((r: any) => r.name === 'AddBudget');

  return (
    <View style={styles.container}>
      {/* Floating + button absolutely centered at top */}
      <TouchableOpacity
        style={styles.addWrapper}
        onPress={() => navigation.navigate(addRoute.name)}
        activeOpacity={0.85}>
        <LinearGradient
          colors={['#C4213A', '#3A1230', '#1A0E24']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.addButton}>
          <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
            <Path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" />
          </Svg>
        </LinearGradient>
      </TouchableOpacity>

      {/* Tab bar with 4 evenly spaced tabs */}
      <View style={styles.tabBar}>
        {REGULAR_TABS.map((tab) => {
          const route = state.routes.find((r: any) => r.name === tab.name);
          const isFocused = route && state.routes[state.index]?.name === tab.name;
          const color = isFocused ? ACTIVE : INACTIVE;

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabItem}
              onPress={() => { if (!isFocused) navigation.navigate(tab.name); }}
              activeOpacity={0.7}>
              <tab.Icon color={color} />
              <Text style={[styles.tabLabel, { color }]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Activity" component={Activity} />
      <Tab.Screen name="AddBudget" component={AddBudget} />
      <Tab.Screen name="Budget" component={Budget} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0EEF0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 12,
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: ADD_SIZE / 3,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  tabLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  addWrapper: {
    position: 'absolute',
    top: -(ADD_SIZE / 2),
    alignSelf: 'center',
    left: '50%',
    marginLeft: -(ADD_SIZE / 2),
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addGlow: {
    position: 'absolute',
    width: ADD_SIZE + 22,
    height: ADD_SIZE + 22,
    borderRadius: (ADD_SIZE + 22) / 2,
    backgroundColor: '#C4213A',
    opacity: 0.13,
  },
  addButton: {
    width: ADD_SIZE,
    height: ADD_SIZE,
    borderRadius: ADD_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#C4213A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
  },
});
