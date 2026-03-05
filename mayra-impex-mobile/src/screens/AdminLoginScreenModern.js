import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AdminLoginScreenModern = ({ navigation }) => {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleAdminLogin = () => {
    const correctEmail = "rishabsainiupw165@gmail.com";
    const correctPassword = "Rishab@3112";

    if (!adminEmail || !adminPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (adminEmail === correctEmail && adminPassword === correctPassword) {
      setAdminEmail("");
      setAdminPassword("");
      Alert.alert("Success", "Welcome to Admin Panel");
      navigation.navigate("Admin");
    } else {
      Alert.alert("Error", "Invalid email or password");
      setAdminEmail("");
      setAdminPassword("");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#FF8C50" />
          </TouchableOpacity>
        </View>

        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="shield" size={48} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Admin Portal</Text>
          <Text style={styles.subtitle}>Manage Mayra Impex</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={20} color="#FF8C50" />
              <TextInput
                style={styles.input}
                placeholder="Enter admin email"
                value={adminEmail}
                onChangeText={setAdminEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#CCC"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color="#FF8C50" />
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                value={adminPassword}
                onChangeText={setAdminPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#CCC"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#CCC"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleAdminLogin}
            activeOpacity={0.8}
          >
            <Ionicons name="log-in" size={20} color="#FFFFFF" />
            <Text style={styles.loginButtonText}>Login to Admin Panel</Text>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color="#FF8C50" />
            <Text style={styles.infoText}>
              This is a restricted area. Only authorized administrators can
              access.
            </Text>
          </View>
        </View>

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
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 20,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#FF8C50",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
  },
  formSection: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    marginHorizontal: 12,
    paddingVertical: 0,
  },
  loginButton: {
    backgroundColor: "#FF8C50",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    shadowColor: "#FF8C50",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  infoSection: {
    marginTop: 20,
  },
  infoCard: {
    backgroundColor: "#FFF5F0",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFE5D6",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});

export default AdminLoginScreenModern;
