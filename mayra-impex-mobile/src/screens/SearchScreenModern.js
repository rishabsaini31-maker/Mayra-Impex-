import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const SearchScreenModern = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="search" size={64} color="#FF8C50" />
        <Text style={styles.title}>Search</Text>
        <Text style={styles.subtitle}>Find your perfect gift</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    marginTop: 8,
  },
});

export default SearchScreenModern;
