import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { SleepProfileScreen } from '../screens/SleepProfileScreen';
import { GoalsScreen } from '../screens/GoalsScreen';
import { AIPlanScreen } from '../screens/AIPlanScreen';

const Stack = createNativeStackNavigator();

export function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SleepProfile" component={SleepProfileScreen} />
      <Stack.Screen name="Goals" component={GoalsScreen} />
      <Stack.Screen name="AIPlan" component={AIPlanScreen} options={{ gestureEnabled: false }} />
    </Stack.Navigator>
  );
}
