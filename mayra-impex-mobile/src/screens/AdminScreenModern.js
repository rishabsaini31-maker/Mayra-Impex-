import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const AdminScreenModern = ({ navigation, onLogout }) => {
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => {
          if (onLogout) {
            onLogout();
          }
        },
        style: "destructive",
      },
    ]);
  };
  const adminOptions = [
    {
      id: 1,
      title: "Manage Products",
      description: "Add, edit, or delete products",
      icon: "cube",
      color: "#FF8C50",
      route: "AdminProducts",
    },
    {
      id: 2,
      title: "Manage Categories",
      description: "Add, edit, or delete categories",
      icon: "list",
      color: "#FFBE99",
      route: "AdminCategories",
    },
    {
      id: 3,
      title: "Manage Hero Banners",
      description: "Add or edit home page banners",
      icon: "image",
      color: "#FFD4B8",
      route: "AdminHeroBanners",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Admin Panel</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {adminOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[styles.optionCard, { borderLeftColor: option.color }]}
            onPress={() => navigation.navigate(option.route)}
            activeOpacity={0.7}
          >
            <View
              style={[styles.iconContainer, { backgroundColor: option.color }]}
            >
              <Ionicons name={option.icon} size={32} color="#FFFFFF" />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>

            <Ionicons name="chevron-forward" size={24} color="#CCC" />
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FF8C50",
    letterSpacing: 0.5,
  },
  logoutButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  optionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: "#999",
    lineHeight: 20,
  },
});

export default AdminScreenModern;
