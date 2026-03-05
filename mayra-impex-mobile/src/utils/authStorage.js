import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "authToken";
const USER_KEY = "user_meta";

const pickUserMetadata = (user) => {
  if (!user || typeof user !== "object") return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const authStorage = {
  // Save auth token
  saveToken: async (token) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token, {
        keychainService: "mayra-impex-auth",
      });
    } catch (error) {
      console.error("Error saving token:", error);
      throw error;
    }
  },

  // Get auth token
  getToken: async () => {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY, {
        keychainService: "mayra-impex-auth",
      });
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  },

  // Remove auth token
  removeToken: async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY, {
        keychainService: "mayra-impex-auth",
      });
    } catch (error) {
      console.error("Error removing token:", error);
    }
  },

  // Save user data
  saveUser: async (user) => {
    try {
      const userMeta = pickUserMetadata(user);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userMeta));
    } catch (error) {
      console.error("Error saving user:", error);
      throw error;
    }
  },

  // Get user data
  getUser: async () => {
    try {
      const user = await AsyncStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  },

  // Remove user data
  removeUser: async () => {
    try {
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error("Error removing user:", error);
    }
  },

  // Clear all auth data
  clearAuth: async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY, {
        keychainService: "mayra-impex-auth",
      });
      await AsyncStorage.multiRemove([USER_KEY]);
    } catch (error) {
      console.error("Error clearing auth:", error);
    }
  },
};
