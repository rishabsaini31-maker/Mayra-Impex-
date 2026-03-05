import { create } from "zustand";
import { COLORS } from "../constants";

// Theme configurations
export const THEMES = {
  light: {
    id: "light",
    name: "Light",
    primary: "#1e3a8a",
    primaryLight: "#3b82f6",
    secondary: "#64748b",
    background: "#ffffff",
    cardBackground: "#f9fafb",
    text: "#111827",
    textLight: "#6b7280",
    border: "#e5e7eb",
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    icon: "☀️",
  },
  dark: {
    id: "dark",
    name: "Dark",
    primary: "#1e293b",
    primaryLight: "#0f172a",
    secondary: "#94a3b8",
    background: "#0f172a",
    cardBackground: "#1e293b",
    text: "#f8fafc",
    textLight: "#cbd5e1",
    border: "#334155",
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    icon: "🌙",
  },
  blue: {
    id: "blue",
    name: "Blue",
    primary: "#0369a1",
    primaryLight: "#0284c7",
    secondary: "#06b6d4",
    background: "#e0f2fe",
    cardBackground: "#f0f9ff",
    text: "#0c2d6b",
    textLight: "#0c4a6e",
    border: "#bae6fd",
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    icon: "🔵",
  },
  purple: {
    id: "purple",
    name: "Purple",
    primary: "#7c3aed",
    primaryLight: "#8b5cf6",
    secondary: "#a855f7",
    background: "#faf5ff",
    cardBackground: "#fef3c7",
    text: "#5b21b6",
    textLight: "#7c3aed",
    border: "#ddd6fe",
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    icon: "💜",
  },
};

const useThemeStore = create((set, get) => ({
  currentTheme: THEMES.light,

  setTheme: (themeId) => {
    const theme = THEMES[themeId];
    if (theme) {
      set({ currentTheme: theme });
    }
  },

  getTheme: () => {
    return get().currentTheme;
  },

  getAllThemes: () => {
    return Object.values(THEMES);
  },
}));

export default useThemeStore;
