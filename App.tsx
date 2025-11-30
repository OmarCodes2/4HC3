import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StudyPlacesProvider } from './src/context/StudyPlacesContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ResponsiveWrapper } from './src/components/ResponsiveWrapper';

export default function App() {
  return (
    <ResponsiveWrapper>
      <StudyPlacesProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </StudyPlacesProvider>
    </ResponsiveWrapper>
  );
}
