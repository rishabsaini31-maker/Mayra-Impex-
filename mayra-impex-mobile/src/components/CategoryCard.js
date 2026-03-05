import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CategoryCard = ({ category, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Ionicons name={category.icon} size={28} color="#FF8C50" />
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 90,
    alignItems: "center",
    marginRight: 16,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: "#FFF5F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#FFE8DC",
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2D2D2D",
    textAlign: "center",
  },
});

export default CategoryCard;
