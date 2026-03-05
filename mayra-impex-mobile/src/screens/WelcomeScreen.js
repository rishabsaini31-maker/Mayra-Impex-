import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, FONTS, SPACING } from "../constants";

const WelcomeScreen = ({ navigation }) => {
  useEffect(() => {
    // Auto-navigate to login after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  const handleGetStarted = () => {
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Brand */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>🛍️</Text>
        </View>

        {/* Welcome Text */}
        <Text style={styles.title}>Welcome to</Text>
        <Text style={styles.brandName}>MAYRA IMPEX</Text>
        <Text style={styles.subtitle}>B2B Wholesale Ordering</Text>

        {/* Description */}
        <Text style={styles.description}>
          Your trusted platform for bulk orders and{"\n"}wholesale pricing.
        </Text>

        {/* Get Started Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        {/* Auto-navigate hint */}
        <Text style={styles.hint}>Redirecting in 3 seconds...</Text>
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
    paddingHorizontal: SPACING.lg,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: SPACING.xl,
  },
  logoText: {
    fontSize: 80,
    textAlign: "center",
  },
  title: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.white,
    fontWeight: "300",
    marginBottom: SPACING.sm,
    letterSpacing: 2,
  },
  brandName: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: SPACING.sm,
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.lightBlue,
    fontWeight: "500",
    marginBottom: SPACING.xl,
  },
  description: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.white,
    textAlign: "center",
    marginBottom: SPACING.xxl,
    lineHeight: 24,
    opacity: 0.9,
  },
  button: {
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 12,
    marginBottom: SPACING.xl,
    minWidth: 200,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.md,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  hint: {
    color: COLORS.white,
    fontSize: FONTS.sizes.xs,
    opacity: 0.7,
    marginTop: SPACING.md,
  },
});

export default WelcomeScreen;
