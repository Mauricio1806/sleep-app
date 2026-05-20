import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { HomeScreen } from '../screens/HomeScreen';
import { SoundPlayerScreen } from '../screens/SoundPlayerScreen';
import { SleepTrackerScreen } from '../screens/SleepTrackerScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../../theme';

const Tab = createBottomTabNavigator();

function HomeIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M3 12L12 4L21 12V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V12Z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function SoundIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18V5L21 3V16" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={6} cy={18} r={3} stroke={color} strokeWidth={1.8} />
      <Circle cx={18} cy={16} r={3} stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

function MoonIcon({ color }: { color: string }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path d="M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79Z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ChartIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={12} width={4} height={9} rx={1} stroke={color} strokeWidth={1.8} />
      <Rect x={10} y={7} width={4} height={14} rx={1} stroke={color} strokeWidth={1.8} />
      <Rect x={17} y={3} width={4} height={18} rx={1} stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

function PersonIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={7} r={4} stroke={color} strokeWidth={1.8} />
      <Path d="M4 21C4 17.134 7.582 14 12 14C16.418 14 20 17.134 20 21" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.bgCard, borderTopColor: colors.border, height: 60 },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ color }) => <HomeIcon color={color} /> }} />
      <Tab.Screen name="Sons" component={SoundPlayerScreen} options={{ tabBarIcon: ({ color }) => <SoundIcon color={color} /> }} />
      <Tab.Screen
        name="Registrar"
        component={SleepTrackerScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.centerTab}>
              <MoonIcon color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen name="Histórico" component={HistoryScreen} options={{ tabBarIcon: ({ color }) => <ChartIcon color={color} /> }} />
      <Tab.Screen name="Perfil" component={ProfileScreen} options={{ tabBarIcon: ({ color }) => <PersonIcon color={color} /> }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  centerTab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});
