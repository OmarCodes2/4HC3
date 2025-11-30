import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { PlaceDetailsScreen } from '../screens/PlaceDetailsScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { PreferencesScreen } from '../screens/PreferencesScreen';
import { colors } from '../theme/colors';

export type RootStackParamList = {
  Home: undefined;
  PlaceDetails: { placeId: string };
};

export type RootTabParamList = {
  HomeTab: undefined;
  FavoritesTab: undefined;
  PreferencesTab: undefined;
};

export type FavoritesStackParamList = {
  Favorites: undefined;
  PlaceDetails: { placeId: string };
};

const HomeStackNavigator = createNativeStackNavigator<RootStackParamList>();
const FavoritesStackNavigator = createNativeStackNavigator<FavoritesStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const HomeStack = () => {
  return (
    <HomeStackNavigator.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          color: colors.primaryMaroon,
          fontWeight: '600',
        },
        headerTintColor: colors.primaryMaroon,
      }}
    >
      <HomeStackNavigator.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStackNavigator.Screen
        name="PlaceDetails"
        component={PlaceDetailsScreen}
        options={{
          title: 'Place Details',
          headerShown: true,
        }}
      />
    </HomeStackNavigator.Navigator>
  );
};

const FavoritesStack = () => {
  return (
    <FavoritesStackNavigator.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          color: colors.primaryMaroon,
          fontWeight: '600',
        },
        headerTintColor: colors.primaryMaroon,
      }}
    >
      <FavoritesStackNavigator.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ headerShown: false }}
      />
      <FavoritesStackNavigator.Screen
        name="PlaceDetails"
        component={PlaceDetailsScreen}
        options={{
          title: 'Place Details',
          headerShown: true,
        }}
      />
    </FavoritesStackNavigator.Navigator>
  );
};

export const RootNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primaryMaroon,
        tabBarInactiveTintColor: colors.textGrey,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          color: colors.primaryMaroon,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          title: 'Home',
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesStack}
        options={{
          title: 'Favourites',
          headerShown: false,
          tabBarLabel: 'Favourites',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="PreferencesTab"
        component={PreferencesScreen}
        options={{
          title: 'Preferences',
          tabBarLabel: 'Preferences',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

