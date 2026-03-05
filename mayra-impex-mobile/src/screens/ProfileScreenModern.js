import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://10.47.11.159:5001/api";

const ProfileScreenModern = ({ navigation, onLogout }) => {
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState(null);

  // Fetch user data on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("userToken");
      setToken(storedToken);

      if (!storedToken) {
        Alert.alert("Error", "No authentication token found");
        setLoading(false);
        return;
      }

      // Fetch profile
      const profileRes = await fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setUserData(profileData);
      }

      // Fetch orders
      const ordersRes = await fetch(`${API_URL}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(
          Array.isArray(ordersData) ? ordersData : ordersData.data || [],
        );
      }

      // Load wishlist from storage
      const wishlistData = await AsyncStorage.getItem("wishlist");
      setWishlist(wishlistData ? JSON.parse(wishlistData) : []);

      setLoading(false);
    } catch (error) {
      console.log("Error fetching user data:", error);
      setLoading(false);
      Alert.alert("Error", "Failed to load profile data");
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: oldPassword,
          newPassword: newPassword,
        }),
      });

      if (res.ok) {
        Alert.alert("Success", "Password changed successfully");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordChange(false);
      } else {
        Alert.alert("Error", "Failed to change password");
      }
    } catch (error) {
      Alert.alert("Error", "Error changing password");
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("userToken");
            await AsyncStorage.removeItem("userRole");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setShowPasswordChange(false);
            if (onLogout) {
              onLogout();
            }
          } catch (error) {
            console.log("Error during logout:", error);
          }
        },
        style: "destructive",
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF8C50" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Ionicons name="person-circle" size={80} color="#FF8C50" />
          <Text style={styles.title}>My Profile</Text>
          <Text style={styles.subtitle}>Manage your account</Text>
        </View>

        {/* User Info Section */}
        {userData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Information</Text>

            {/* Email */}
            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="mail" size={24} color="#FF8C50" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email Address</Text>
                <Text style={styles.infoValue}>{userData.email || "N/A"}</Text>
              </View>
            </View>

            {/* Name if available */}
            {userData.name && (
              <View style={styles.infoCard}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="person" size={24} color="#FF8C50" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Full Name</Text>
                  <Text style={styles.infoValue}>{userData.name}</Text>
                </View>
              </View>
            )}

            {/* Phone if available */}
            {userData.phone && (
              <View style={styles.infoCard}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="call" size={24} color="#FF8C50" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{userData.phone}</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Change Password Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => setShowPasswordChange(!showPasswordChange)}
            activeOpacity={0.7}
          >
            <View
              style={[styles.iconContainer, { backgroundColor: "#FFE5D6" }]}
            >
              <Ionicons name="key" size={24} color="#FF8C50" />
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Change Password</Text>
              <Text style={styles.optionDesc}>Update your password</Text>
            </View>
            <Ionicons
              name={showPasswordChange ? "chevron-up" : "chevron-down"}
              size={24}
              color="#CCC"
            />
          </TouchableOpacity>

          {showPasswordChange && (
            <View style={styles.passwordForm}>
              <TextInput
                style={styles.input}
                placeholder="Current Password"
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry
                placeholderTextColor="#CCC"
              />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholderTextColor="#CCC"
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholderTextColor="#CCC"
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleChangePassword}
              >
                <Text style={styles.submitButtonText}>Update Password</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* My Orders Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => setShowOrders(!showOrders)}
            activeOpacity={0.7}
          >
            <View
              style={[styles.iconContainer, { backgroundColor: "#FFF5F0" }]}
            >
              <Ionicons name="cart" size={24} color="#FF8C50" />
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>My Orders</Text>
              <Text style={styles.optionDesc}>View your order history</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{orders.length}</Text>
            </View>
            <Ionicons
              name={showOrders ? "chevron-up" : "chevron-down"}
              size={24}
              color="#CCC"
            />
          </TouchableOpacity>

          {showOrders && (
            <View style={styles.expandedContent}>
              {orders.length === 0 ? (
                <Text style={styles.emptyText}>No orders found</Text>
              ) : (
                <FlatList
                  scrollEnabled={false}
                  data={orders}
                  keyExtractor={(item) => item.id?.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.orderItem}>
                      <Text style={styles.orderId}>
                        Order: {item.id || item.order_id || "N/A"}
                      </Text>
                      <Text style={styles.orderText}>
                        Total: ₹{item.total || item.amount || "0"}
                      </Text>
                      <Text style={styles.orderStatus}>
                        Status: {(item.status || "pending").toUpperCase()}
                      </Text>
                      <Text style={styles.orderDate}>
                        Date:{" "}
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString()
                          : "N/A"}
                      </Text>
                    </View>
                  )}
                />
              )}
            </View>
          )}
        </View>

        {/* Wishlist Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => setShowWishlist(!showWishlist)}
            activeOpacity={0.7}
          >
            <View
              style={[styles.iconContainer, { backgroundColor: "#FFE5D6" }]}
            >
              <Ionicons name="heart" size={24} color="#FF8C50" />
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Wishlist</Text>
              <Text style={styles.optionDesc}>Your saved items</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{wishlist.length}</Text>
            </View>
            <Ionicons
              name={showWishlist ? "chevron-up" : "chevron-down"}
              size={24}
              color="#CCC"
            />
          </TouchableOpacity>

          {showWishlist && (
            <View style={styles.expandedContent}>
              {wishlist.length === 0 ? (
                <Text style={styles.emptyText}>No items in wishlist</Text>
              ) : (
                <FlatList
                  scrollEnabled={false}
                  data={wishlist}
                  keyExtractor={(item) => item.id?.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.wishlistItem}>
                      <Text style={styles.wishlistName}>
                        {item.name || "Product"}
                      </Text>
                      <Text style={styles.wishlistPrice}>
                        ₹{item.price || "0"}
                      </Text>
                    </View>
                  )}
                />
              )}
            </View>
          )}
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out" size={20} color="#FFFFFF" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
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
  profileHeader: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#FFF5F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: "#999",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  optionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 13,
    color: "#999",
  },
  badge: {
    backgroundColor: "#FF8C50",
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  expandedContent: {
    backgroundColor: "#FFF5F0",
    borderRadius: 12,
    padding: 12,
    marginTop: -8,
    marginBottom: 12,
  },
  orderItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FF8C50",
  },
  wishlistItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },
  orderText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  orderStatus: {
    fontSize: 12,
    color: "#FF8C50",
    fontWeight: "600",
    marginTop: 4,
  },
  orderDate: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },
  wishlistName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  wishlistPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FF8C50",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  passwordForm: {
    backgroundColor: "#FFF5F0",
    borderRadius: 12,
    padding: 16,
    marginTop: -8,
    marginBottom: 12,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#FFE5D6",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: "#FF8C50",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  logoutButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 8,
  },
});

export default ProfileScreenModern;
