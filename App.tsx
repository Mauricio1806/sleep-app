import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LocaleProvider } from './src/context/LocaleContext';
import { ProfileProvider } from './src/context/ProfileContext';
import { AuthProvider } from './src/context/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LocaleProvider>
        <ProfileProvider>
          <AuthProvider>
            <RootNavigator />
          </AuthProvider>
        </ProfileProvider>
      </LocaleProvider>
    </GestureHandlerRootView>
  );
}
