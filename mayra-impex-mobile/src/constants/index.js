// Colors
export const COLORS = {
  // Primary Colors (Navy/Dark Blue Theme)
  primary: "#1e3a8a",
  primaryDark: "#1e293b",
  primaryLight: "#3b82f6",

  // Secondary Colors
  secondary: "#64748b",
  secondaryLight: "#94a3b8",

  // Accent Colors
  accent: "#f59e0b",
  accentLight: "#fbbf24",

  // Status Colors
  success: "#10b981",
  error: "#ef4444",
  warning: "#f59e0b",
  info: "#3b82f6",

  // Neutral Colors
  white: "#ffffff",
  black: "#000000",
  gray: "#6b7280",
  lightGray: "#f3f4f6",
  darkGray: "#374151",
  lightBlue: "#3b82f6",

  // Background Colors
  background: "#ffffff",
  backgroundDark: "#1f2937",
  cardBackground: "#f9fafb",

  // Text Colors
  text: "#111827",
  textLight: "#6b7280",
  textDark: "#030712",

  // Border Colors
  border: "#e5e7eb",
  borderDark: "#374151",
};

// Typography
export const FONTS = {
  regular: "System",
  medium: "System",
  bold: "System",
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border Radius
export const RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Shadows
export const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Order Status
export const ORDER_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const ORDER_STATUS_COLORS = {
  pending: COLORS.warning,
  approved: COLORS.success,
  rejected: COLORS.error,
};

export const ORDER_STATUS_LABELS = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

// User Roles
export const USER_ROLES = {
  ADMIN: "admin",
  CUSTOMER: "customer",
};

// API Configuration
export const API_CONFIG = {
  timeout: 30000,
  retries: 3,
};

// Pagination
export const PAGINATION = {
  defaultLimit: 20,
  defaultPage: 1,
};
