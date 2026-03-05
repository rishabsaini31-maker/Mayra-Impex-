import { create } from "zustand";
import { authStorage } from "../utils/authStorage";

const now = () => Date.now();

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  lastActivityAt: null,
  adminBiometricUnlocked: false,

  // Set auth data
  setAuth: async (user, token) => {
    await authStorage.saveUser(user);
    await authStorage.saveToken(token);
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
      lastActivityAt: now(),
      adminBiometricUnlocked: user?.role !== "admin",
    });
  },

  // Load auth from storage
  loadAuth: async () => {
    try {
      const user = await authStorage.getUser();
      const token = await authStorage.getToken();

      if (user && token) {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          lastActivityAt: now(),
          adminBiometricUnlocked: user?.role !== "admin",
        });
      } else {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          lastActivityAt: null,
          adminBiometricUnlocked: false,
        });
      }
    } catch (error) {
      console.error("Error loading auth:", error);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        lastActivityAt: null,
        adminBiometricUnlocked: false,
      });
    }
  },

  // Logout
  logout: async () => {
    await authStorage.clearAuth();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      lastActivityAt: null,
      adminBiometricUnlocked: false,
    });
  },

  // Update user
  updateUser: async (user) => {
    await authStorage.saveUser(user);
    set({
      user,
      adminBiometricUnlocked: user?.role !== "admin",
    });
  },

  markActivity: () => set({ lastActivityAt: now() }),

  setAdminBiometricUnlocked: (value) =>
    set({ adminBiometricUnlocked: Boolean(value) }),
}));

export default useAuthStore;
