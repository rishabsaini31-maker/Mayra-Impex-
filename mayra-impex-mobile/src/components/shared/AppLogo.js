import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const AppLogo = ({ size = "medium", showText = true }) => {
  const sizes = {
    small: { container: 32, text: 16, icon: 20 },
    medium: { container: 40, text: 18, icon: 24 },
    large: { container: 60, text: 24, icon: 36 },
  };
  const currentSize = sizes[size];
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.logoContainer,
          {
            width: currentSize.container,
            height: currentSize.container,
            borderRadius: currentSize.container / 2,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Text
          style={[
            styles.logoIcon,
            { fontSize: currentSize.icon, color: "#000" },
          ]}
        >
          🎁
        </Text>
      </View>
      {showText && (
        <View style={styles.textBlock}>
          <Text
            style={[
              styles.cursiveText,
              {
                fontSize: currentSize.text + 6,
                color: "#fff",
                textShadowColor: "#000",
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 6,
              },
            ]}
          >
            Mayra Impex
          </Text>
          <View style={[styles.underline, { backgroundColor: "#fff" }]} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  textBlock: {
    marginLeft: 12,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  cursiveText: {
    fontFamily: "SnellRoundhand-Regular",
    color: "#fff",
    fontStyle: "italic",
    fontWeight: "600",
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  underline: {
    height: 4,
    borderRadius: 2,
    width: 90,
    marginTop: -4,
    marginLeft: 2,
    marginBottom: 2,
    opacity: 0.7,
  },
  logoIcon: {
    color: "#fff",
  },
});

export default AppLogo;
