import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authStorage } from "../utils/authStorage";
import useAuthStore from "../store/authStore";

const API_URL = "http://10.47.11.159:5001/api";

const LoginScreenModern = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showAdminOption, setShowAdminOption] = useState(false);
  const [logoTaps, setLogoTaps] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Secret admin access - triple tap on logo
  const handleLogoPress = () => {
    setLogoTaps(logoTaps + 1);
    if (logoTaps + 1 === 3) {
      setShowAdminOption(!showAdminOption);
      setLogoTaps(0);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Login Error", data.error || "Login failed");
        setIsLoading(false);
        return;
      }

      // Validate response has required fields
      if (!data.token || !data.user) {
        console.error("Invalid response structure:", data);
        Alert.alert("Error", "Invalid server response. Please try again.");
        setIsLoading(false);
        return;
      }

      // Store token and user using the auth store (handles both SecureStore and app state)
      await useAuthStore.getState().setAuth(data.user, data.token);

      // Keep AsyncStorage for backward compatibility
      await AsyncStorage.setItem("userToken", data.token);
      await AsyncStorage.setItem("userRole", data.user.role || "customer");
      await AsyncStorage.setItem("userEmail", data.user.email || "");
      await AsyncStorage.setItem("userName", data.user.name || "");

      console.log("Login successful:", {
        email: data.user.email,
        role: data.user.role,
        token: data.token ? "stored" : "missing",
      });

      // Call onLoginSuccess with appropriate role
      onLoginSuccess(data.user.role || "customer", data.user.email);

      setEmail("");
      setPassword("");
      setShowAdminOption(false);
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email: email.toLowerCase().trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Signup Error", data.error || "Signup failed");
        setIsLoading(false);
        return;
      }

      // Validate response has required fields
      if (!data.token || !data.user) {
        console.error("Invalid response structure:", data);
        Alert.alert("Error", "Invalid server response. Please try again.");
        setIsLoading(false);
        return;
      }

      // Store token and user using the auth store (handles both SecureStore and app state)
      await useAuthStore.getState().setAuth(data.user, data.token);

      // Keep AsyncStorage for backward compatibility
      await AsyncStorage.setItem("userToken", data.token);
      await AsyncStorage.setItem("userRole", data.user.role || "customer");
      await AsyncStorage.setItem("userEmail", data.user.email || "");
      await AsyncStorage.setItem("userName", data.user.name || "");

      console.log("Signup successful:", {
        email: data.user.email,
        role: data.user.role,
        token: data.token ? "stored" : "missing",
      });

      // Automatically log in after signup
      onLoginSuccess(data.user.role || "customer", data.user.email);

      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setIsSignUp(false);
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    Alert.alert(`${provider} Login`, `Connecting to ${provider}...`);
    // Implement actual social login later
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <TouchableOpacity
            style={styles.logoSection}
            onPress={handleLogoPress}
            activeOpacity={0.7}
          >
            <View style={styles.logoContainer}>
              <Ionicons name="gift" size={60} color="#FFFFFF" />
            </View>
            <Text style={styles.appName}>Mayra Impex</Text>
            <Text style={styles.tagline}>Premium Gift Shopping</Text>
          </TouchableOpacity>

          {/* Form Title */}
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>
              {isSignUp ? "Create Account" : "Welcome Back"}
            </Text>
            <Text style={styles.formSubtitle}>
              {isSignUp ? "Join us today" : "Sign in to your account"}
            </Text>
          </View>

          {/* Login/SignUp Form */}
          <View style={styles.formSection}>
            {isSignUp && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person" size={20} color="#FF8C50" />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    value={fullName}
                    onChangeText={setFullName}
                    placeholderTextColor="#CCC"
                  />
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail" size={20} color="#FF8C50" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
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
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#CCC"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye" : "eye-off"}
                    size={20}
                    color="#CCC"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {isSignUp && !showAdminOption && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed" size={20} color="#FF8C50" />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    placeholderTextColor="#CCC"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons
                      name={showConfirmPassword ? "eye" : "eye-off"}
                      size={20}
                      color="#CCC"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.submitButton,
                isLoading && styles.submitButtonDisabled,
              ]}
              onPress={isSignUp ? handleSignUp : handleLogin}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons
                    name={isSignUp ? "checkmark-done" : "log-in"}
                    size={20}
                    color="#FFFFFF"
                  />
                  <Text style={styles.submitButtonText}>
                    {isSignUp ? "Create Account" : "Login"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Social Login - Only for Client Login/SignUp */}
          <>
            <View style={styles.dividerSection}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialSection}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin("Google")}
              >
                <Ionicons name="logo-google" size={24} color="#FF8C50" />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin("Facebook")}
              >
                <Ionicons name="logo-facebook" size={24} color="#FF8C50" />
                <Text style={styles.socialButtonText}>Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin("Apple")}
              >
                <Ionicons name="logo-apple" size={24} color="#FF8C50" />
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity>
            </View>
          </>

          {/* Toggle Login/SignUp */}
          <View style={styles.toggleSection}>
            <Text style={styles.toggleText}>
              {isSignUp
                ? "Already have an account? "
                : "Don't have an account? "}
            </Text>
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
              <Text style={styles.toggleLink}>
                {isSignUp ? "Login" : "Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 25,
    backgroundColor: "#FF8C50",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: "#999",
  },
  formHeader: {
    marginBottom: 32,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 14,
    color: "#999",
  },
  formSection: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
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
  submitButton: {
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
  submitButtonDisabled: {
    backgroundColor: "#FFB380",
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  dividerSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    fontSize: 13,
    color: "#999",
    marginHorizontal: 12,
  },
  socialSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 12,
  },
  socialButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    flexDirection: "row",
    gap: 6,
  },
  socialButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  toggleSection: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  toggleText: {
    fontSize: 14,
    color: "#666",
  },
  toggleLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FF8C50",
  },
});

export default LoginScreenModern;
