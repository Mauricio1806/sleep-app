import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from '../i18n';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { HomeScreen } from '../screens/HomeScreen';
import { SoundPlayerScreen } from '../screens/SoundPlayerScreen';
import { SleepTrackerScreen } from '../screens/SleepTrackerScreen';
import { MemoryScreen } from '../screens/MemoryScreen';
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

function BrainIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M12 4C10.07 4 8.43 5.19 7.75 6.87C6.27 6.28 4.5 7.28 4.5 9C4.5 9.55 4.67 10.05 4.96 10.47C4.18 10.94 3.5 11.86 3.5 13C3.5 14.66 4.84 16 6.5 16V18H17.5V16C19.16 16 20.5 14.66 20.5 13C20.5 11.86 19.82 10.94 19.04 10.47C19.33 10.05 19.5 9.55 19.5 9C19.5 7.28 17.73 6.28 16.25 6.87C15.57 5.19 13.93 4 12 4Z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1={12} y1={4} x2={12} y2={18} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
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
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.bgCard, borderTopColor: colors.border, height: 68 },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 10, marginBottom: 4 },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: t('tabs.home'), tabBarIcon: ({ color }) => <HomeIcon color={color} /> }} />
      <Tab.Screen name="Sons" component={SoundPlayerScreen} options={{ tabBarLabel: t('tabs.sounds'), tabBarIcon: ({ color }) => <SoundIcon color={color} /> }} />
      <Tab.Screen
        name="Registrar"
        component={SleepTrackerScreen}
        options={{
          tabBarLabel: t('tabs.tracker'),
          tabBarIcon: ({ color }) => (
            <View style={styles.centerTab}>
              <MoonIcon color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen name="Memória" component={MemoryScreen} options={{ tabBarLabel: t('tabs.memory'), tabBarIcon: ({ color }) => <BrainIcon color={color} /> }} />
      <Tab.Screen name="Perfil" component={ProfileScreen} options={{ tabBarLabel: t('tabs.profile'), tabBarIcon: ({ color }) => <PersonIcon color={color} /> }} />
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
