import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MissionsScreen from '../screens/MissionsScreen';
import CollectionsScreen from '../screens/CollectionsScreen';
import CollectionDetailScreen from '../screens/CollectionDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Screen parameter types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  CollectionDetail: { collectionId: number };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Missions: undefined;
  Collections: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#757575',
      }}>
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Tableau de bord',
        }}
      />
      <Tab.Screen 
        name="Missions" 
        component={MissionsScreen}
        options={{
          tabBarLabel: 'Missions',
        }}
      />
      <Tab.Screen 
        name="Collections" 
        component={CollectionsScreen}
        options={{
          tabBarLabel: 'Collectes',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // You could show a loading screen here
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen 
              name="CollectionDetail" 
              component={CollectionDetailScreen}
              options={{ 
                headerShown: true,
                title: 'Détails de collecte',
                headerBackTitle: 'Retour'
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;