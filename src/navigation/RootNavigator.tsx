import React, { useEffect, useState, useContext } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingNavigator } from './OnboardingNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { colors } from '../../theme';
import { ProfileContext } from '../context/ProfileContext';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const { profile, plan, settings, isLoading } = useContext(ProfileContext);

  if (isLoading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const onboardingDone = !!(profile && plan);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {onboardingDone ? (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
            <Stack.Screen name="Main" component={MainTabNavigator} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
});
