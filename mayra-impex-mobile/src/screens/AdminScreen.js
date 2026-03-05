import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const AdminScreen = ({ navigation, onLogout }) => {
  const adminOptions = [
    {
      id: 1,
      title: "Manage Products",
      route: "AdminProducts",
      icon: "cube",
    },
    {
      id: 2,
      title: "Manage Categories",
      route: "AdminCategories",
      icon: "list",
    },
    {
      id: 3,
      title: "Manage Hero Banners",
      route: "AdminHeroBanners",
      icon: "image",
    },
  ];

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity
          style={styles.logoutIconButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={24} color="#FF0000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {adminOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.optionButton}
            onPress={() => navigation.navigate(option.route)}
          >
            <Ionicons name={option.icon} size={28} color="#FF8C50" />
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>{option.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  logoutIconButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  optionText: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});

export default AdminScreen;
