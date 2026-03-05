import React, { useState, useMemo, useCallback } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import BottomNavigation from "../components/BottomNavigation";

// Import screens
import LoginScreenModern from "../screens/LoginScreenModern";
import HomeScreenModern from "../screens/HomeScreenModern";
import SearchScreenModern from "../screens/SearchScreenModern";
import ProductsScreenModern from "../screens/ProductsScreenModern";
import NotificationsScreenModern from "../screens/NotificationsScreenModern";
import ProfileScreenModern from "../screens/ProfileScreenModern";
import ProductDetailScreenModern from "../screens/ProductDetailScreenModern";
import AdminDashboardOld from "../screens/AdminDashboardOld";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Client Tab Navigator - wrapped in useMemo
const ClientTabNavigator = React.memo(({ onLogout }) => {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNavigation {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreenModern} />
      <Tab.Screen name="Search" component={SearchScreenModern} />
      <Tab.Screen name="Products" component={ProductsScreenModern} />
      <Tab.Screen name="Notifications" component={NotificationsScreenModern} />
      <Tab.Screen name="Profile">
        {(props) => <ProfileScreenModern {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
});

ClientTabNavigator.displayName = "ClientTabNavigator";

// Client Stack Navigator
const ClientNavigator = React.memo(({ onLogout }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ClientTabs" options={{ animationEnabled: false }}>
        {(props) => <ClientTabNavigator {...props} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreenModern}
      />
    </Stack.Navigator>
  );
});

ClientNavigator.displayName = "ClientNavigator";

// Admin Stack Navigator
const AdminNavigator = React.memo(({ onLogout }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboard" options={{ animationEnabled: false }}>
        {(props) => <AdminDashboardOld {...props} onLogout={onLogout} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
});

AdminNavigator.displayName = "AdminNavigator";

// Root Navigator
const ModernNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // "admin" or "client"

  const handleLoginSuccess = useCallback((role, email = "") => {
    console.log("Login Success - Role:", role);
    setIsLoggedIn(true);
    setUserRole(role);
  }, []);

  const handleLogout = useCallback(() => {
    console.log("Logout");
    setIsLoggedIn(false);
    setUserRole(null);
  }, []);

  console.log(
    "Navigation State - isLoggedIn:",
    isLoggedIn,
    "userRole:",
    userRole,
  );

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen
            name="AuthStack"
            options={{
              animationEnabled: false,
              headerShown: false,
            }}
          >
            {(props) => (
              <LoginScreenModern
                {...props}
                onLoginSuccess={handleLoginSuccess}
              />
            )}
          </Stack.Screen>
        ) : userRole === "admin" ? (
          <Stack.Screen
            name="AdminStack"
            options={{
              animationEnabled: false,
              headerShown: false,
            }}
          >
            {() => {
              console.log("Rendering Admin Navigator");
              return <AdminNavigator onLogout={handleLogout} />;
            }}
          </Stack.Screen>
        ) : (
          <Stack.Screen
            name="ClientStack"
            options={{
              animationEnabled: false,
              headerShown: false,
            }}
          >
            {() => {
              console.log("Rendering Client Navigator");
              return <ClientNavigator onLogout={handleLogout} />;
            }}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ModernNavigator;
