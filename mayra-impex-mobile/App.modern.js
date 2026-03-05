import React from "react";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Choose your navigation:
// Option 1: Use the existing complex navigation with auth
import Navigation from "./src/navigation/AppNavigator";

// Option 2: Use the new modern UI (uncomment to use)
// import ModernNavigator from "./src/navigation/ModernNavigator";

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
    <QueryClientProvider client={queryClient}>
      {/* Use existing navigation */}
      <Navigation />

      {/* OR use modern navigation (uncomment below and comment above) */}
      {/* <ModernNavigator /> */}

      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}
