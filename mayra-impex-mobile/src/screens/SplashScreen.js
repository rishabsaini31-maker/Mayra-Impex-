import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { COLORS, FONTS, SPACING } from "../constants";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logoText}>🛍️</Text>
        <Text style={styles.brandName}>MAYRA IMPEX</Text>
        <Text style={styles.subtitle}>B2B Wholesale Ordering</Text>

        <ActivityIndicator
          size="large"
          color={COLORS.white}
          style={styles.loader}
        />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 80,
    marginBottom: SPACING.md,
  },
  brandName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: SPACING.xs,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.lightBlue,
    marginBottom: SPACING.xl,
  },
  loader: {
    marginTop: SPACING.lg,
  },
  loadingText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.sm,
    marginTop: SPACING.md,
    opacity: 0.7,
  },
});

export default SplashScreen;
