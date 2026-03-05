import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Old navigation (with auth, login, etc.)
// import Navigation from "./src/navigation/AppNavigator";

// NEW MODERN UI - Premium gift shopping design
import ModernNavigator from "./src/navigation/ModernNavigator";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        {/* Using Modern UI */}
        <ModernNavigator />

        {/* To switch back to old UI, uncomment below and comment ModernNavigator above */}
        {/* <Navigation /> */}

        <StatusBar style="auto" />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
