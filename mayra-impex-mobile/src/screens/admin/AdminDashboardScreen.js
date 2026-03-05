import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  FlatList,
  RefreshControl,
  TextInput,
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import {
  orderAPI,
  userAPI,
  productAPI,
  categoryAPI,
  activityAPI,
  notesAPI,
  bannerAPI,
} from "../../api";
import useAuthStore from "../../store/authStore";
import useThemeStore from "../../store/themeStore";
import LoadingSpinner from "../../components/LoadingSpinner";
import Button from "../../components/Button";
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from "../../constants";
import {
  SearchBar,
  FilterBar,
  SortOptions,
  CustomerNotesModal,
  CustomerSegments,
  ExportButton,
} from "../../components/AdminFeatures";

const { width } = Dimensions.get("window");
const SIDEBAR_WIDTH = 280;

const AdminDashboardScreen = ({ navigation }) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const allThemes = useThemeStore((state) => state.getAllThemes());
  const [activeTab, setActiveTab] = useState("customers");
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Auto-close sidebar when switching tabs
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [activeTab]);

  const {
    data: stats,
    isLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: orderAPI.getDashboardStats,
    retry: 0,
    staleTime: 60000,
  });

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => logout(),
      },
    ]);
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "grid-outline",
      color: "#3b82f6",
    },
    {
      id: "orders",
      label: "Orders",
      icon: "receipt-outline",
      color: "#10b981",
    },
    {
      id: "customers",
      label: "Customers",
      icon: "people-outline",
      color: "#8b5cf6",
    },
    {
      id: "products",
      label: "Manage Products",
      icon: "cube-outline",
      color: "#f59e0b",
    },
    {
      id: "addproducts",
      label: "Add New Product",
      icon: "add-circle-outline",
      color: "#ec4899",
    },
    {
      id: "categories",
      label: "Manage Categories",
      icon: "pricetags-outline",
      color: "#06b6d4",
    },
    {
      id: "banners",
      label: "Slider Images",
      icon: "images-outline",
      color: "#0ea5e9",
    },
    {
      id: "activity",
      label: "Activity Log",
      icon: "time-outline",
      color: "#8b5cf6",
    },
    {
      id: "segments",
      label: "Customer Segments",
      icon: "git-network-outline",
      color: "#06b6d4",
    },
    {
      id: "profile",
      label: "My Profile",
      icon: "person-circle-outline",
      color: "#14b8a6",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: "bar-chart-outline",
      color: "#06b6d4",
    },
    {
      id: "settings",
      label: "Customize App",
      icon: "settings-outline",
      color: "#ef4444",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return <ProductsContent />;
      case "addproducts":
        return <ProductsContent />;
      case "categories":
        return <CategoriesContent />;
      case "banners":
        return <BannersContent />;
      case "customers":
        return <CustomersContent />;
      case "orders":
        return <OrdersContent />;
      case "activity":
        return <ActivityLogContent />;
      case "segments":
        return <CustomerSegmentsContent />;
      case "profile":
        return <ProfileContent user={user} currentTheme={currentTheme} />;
      case "settings":
        return (
          <View>
            <Text style={styles.settingsTitle}>Choose Theme</Text>
            <View style={styles.themesGrid}>
              {allThemes.map((theme) => (
                <TouchableOpacity
                  key={theme.id}
                  style={[
                    styles.themeCard,
                    currentTheme.id === theme.id && styles.themeCardActive,
                  ]}
                  onPress={() => setTheme(theme.id)}
                >
                  <View
                    style={[
                      styles.themeSwatch,
                      {
                        backgroundColor: theme.primary,
                        borderColor:
                          currentTheme.id === theme.id ? "#000" : "#ddd",
                        borderWidth: currentTheme.id === theme.id ? 3 : 1,
                      },
                    ]}
                  />
                  <Text style={[styles.themeName, { marginTop: SPACING.sm }]}>
                    {theme.icon}
                  </Text>
                  <Text
                    style={[styles.themeName, { fontSize: FONTS.sizes.xs }]}
                  >
                    {theme.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case "analytics":
        return <AnalyticsContent stats={stats} refetch={refetchStats} />;
      default:
        if (isLoading) {
          return (
            <View style={styles.emptyContainer}>
              <Text style={{ color: currentTheme.text }}>
                Loading dashboard...
              </Text>
            </View>
          );
        }
        if (statsError) {
          return (
            <View style={styles.emptyContainer}>
              <Text style={{ fontSize: 48, marginBottom: SPACING.md }}>⚠️</Text>
              <Text style={[styles.emptyText, { color: currentTheme.text }]}>
                Failed to load dashboard
              </Text>
              <Text
                style={[styles.emptySubtext, { color: currentTheme.textLight }]}
              >
                {statsError.message ||
                  "Please check your connection and try again"}
              </Text>
              <TouchableOpacity
                onPress={() => refetchStats()}
                style={[
                  styles.retryButton,
                  { backgroundColor: currentTheme.primary },
                ]}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          );
        }
        return stats ? (
          <DashboardContent stats={stats} refetch={refetchStats} />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 48, marginBottom: SPACING.md }}>📊</Text>
            <Text style={[styles.emptyText, { color: currentTheme.text }]}>
              Dashboard data unavailable
            </Text>
            <Text
              style={[styles.emptySubtext, { color: currentTheme.textLight }]}
            >
              Try navigating to another tab and coming back
            </Text>
          </View>
        );
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      {/* Overlay Background when sidebar is open */}
      {isSidebarOpen && (
        <TouchableOpacity
          style={styles.sidebarOverlay}
          onPress={() => setIsSidebarOpen(false)}
          activeOpacity={0.5}
        />
      )}
      {/* Sidebar */}
      {isSidebarOpen && (
        <LinearGradient
          colors={[currentTheme.primary, currentTheme.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.sidebar}
        >
          <ScrollView
            style={styles.sidebarContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Logo Area */}
            <View style={styles.logoArea}>
              <View style={styles.adminIconWrap}>
                <Ionicons name="shield-checkmark" size={30} color="white" />
              </View>
              <Text style={styles.adminName}>{user?.name}</Text>
              <Text style={styles.adminRole}>Admin Panel</Text>
            </View>

            {/* Menu Items */}
            <View style={styles.menuContainer}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuItem,
                    activeTab === item.id && styles.menuItemActive,
                  ]}
                  onPress={() => setActiveTab(item.id)}
                >
                  <View style={styles.menuIconWrap}>
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={
                        activeTab === item.id
                          ? "#ffffff"
                          : "rgba(255,255,255,0.85)"
                      }
                    />
                  </View>
                  <Text
                    style={[
                      styles.menuLabel,
                      activeTab === item.id && styles.menuLabelActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              style={styles.logoutMenuButton}
              onPress={handleLogout}
            >
              <View style={styles.menuIconWrap}>
                <Ionicons
                  name="log-out-outline"
                  size={20}
                  color="rgba(255,255,255,0.85)"
                />
              </View>
              <Text style={styles.logoutMenuLabel}>Logout</Text>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
      )}
      {/* Main Content */}
      <View
        style={[
          styles.mainContent,
          { backgroundColor: currentTheme.background },
        ]}
      >
        <View
          style={[
            styles.header,
            { backgroundColor: currentTheme.cardBackground },
          ]}
        >
          <TouchableOpacity
            onPress={() => setIsSidebarOpen(!isSidebarOpen)}
            style={styles.toggleButton}
          >
            <Ionicons
              name={isSidebarOpen ? "close" : "menu"}
              size={22}
              color={COLORS.text}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: currentTheme.text }]}>
            {menuItems.find((m) => m.id === activeTab)?.label}
          </Text>
        </View>

        <View
          style={[
            styles.contentContainer,
            { backgroundColor: currentTheme.cardBackground },
          ]}
        >
          {renderContent()}
        </View>
      </View>
    </View>
  );
};

// Profile Content Component
const ProfileContent = ({ user, currentTheme }) => {
  return (
    <View>
      <View style={styles.profileHeader}>
        <View style={styles.profileAvatar}>
          <Text style={styles.avatarLetter}>
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: currentTheme.text }]}>
            {user?.name}
          </Text>
          <Text style={[styles.profileRole, { color: currentTheme.textLight }]}>
            {user?.role === "admin" ? "Administrator" : "User"}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.profileCard,
          { backgroundColor: currentTheme.cardBackground },
        ]}
      >
        <Text style={[styles.profileLabel, { color: currentTheme.textLight }]}>
          Email Address
        </Text>
        <Text style={[styles.profileValue, { color: currentTheme.text }]}>
          {user?.email}
        </Text>
      </View>

      <View
        style={[
          styles.profileCard,
          { backgroundColor: currentTheme.cardBackground },
        ]}
      >
        <Text style={[styles.profileLabel, { color: currentTheme.textLight }]}>
          Account Type
        </Text>
        <Text style={[styles.profileValue, { color: currentTheme.text }]}>
          {user?.role === "admin" ? "Admin Account" : "Customer Account"}
        </Text>
      </View>

      <View
        style={[
          styles.profileCard,
          { backgroundColor: currentTheme.cardBackground },
        ]}
      >
        <Text style={[styles.profileLabel, { color: currentTheme.textLight }]}>
          Full Name
        </Text>
        <Text style={[styles.profileValue, { color: currentTheme.text }]}>
          {user?.name}
        </Text>
      </View>

      <TouchableOpacity style={styles.actionCard}>
        <Text style={styles.editButtonText}>✏️ Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

// Categories Content Component
const CategoriesContent = () => {
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });
  const [isAdding, setIsAdding] = useState(false);

  const {
    data: categoriesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allCategories"],
    queryFn: categoryAPI.getAll,
    retry: 0,
    staleTime: 60000,
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name || "",
      description: category.description || "",
    });
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingCategory(null);
    setNewCategory({ name: "", description: "" });
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      Alert.alert("Validation Error", "Category name is required");
      return;
    }

    setIsAdding(true);
    try {
      if (editingCategory) {
        // Update category - Note: API might need update method
        await categoryAPI.create({
          ...newCategory,
          id: editingCategory.id,
        });
        Alert.alert("Success", "Category updated successfully!");
      } else {
        await categoryAPI.create(newCategory);
        Alert.alert("Success", "Category added successfully!");
      }
      handleCloseModal();
      refetch();
    } catch (err) {
      Alert.alert(
        "Error",
        err.message ||
          `Failed to ${editingCategory ? "update" : "add"} category`,
      );
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteCategory = (categoryId) => {
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await categoryAPI.delete(categoryId);
              Alert.alert("Success", "Category deleted successfully!");
              refetch();
            } catch (err) {
              Alert.alert("Error", err.message || "Failed to delete category");
            }
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: currentTheme.text }}>Loading categories...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={{ fontSize: 48, marginBottom: SPACING.md }}>⚠️</Text>
        <Text style={[styles.emptyText, { color: currentTheme.text }]}>
          Failed to load categories
        </Text>
        <Text style={[styles.emptySubtext, { color: currentTheme.textLight }]}>
          {error.message || "Please check your connection and try again"}
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          style={[
            styles.retryButton,
            { backgroundColor: currentTheme.primary },
          ]}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const categories = categoriesData?.categories || categoriesData?.data || [];

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: SPACING.lg,
          paddingVertical: SPACING.md,
          borderBottomWidth: 1,
          borderBottomColor: currentTheme.border,
        }}
      >
        <Text
          style={[styles.productsTitle, { color: currentTheme.text, flex: 1 }]}
        >
          All Categories ({categories.length})
        </Text>
        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          style={[styles.addButton, { backgroundColor: currentTheme.primary }]}
        >
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>

      {categories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={{ fontSize: 48, marginBottom: SPACING.md }}>🏷️</Text>
          <Text style={[styles.emptyText, { color: currentTheme.text }]}>
            No categories found
          </Text>
          <Text
            style={[styles.emptySubtext, { color: currentTheme.textLight }]}
          >
            Click the + button above to add categories
          </Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[currentTheme.primary]}
              tintColor={currentTheme.primary}
            />
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.productCard,
                { backgroundColor: currentTheme.cardBackground },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={[styles.productName, { color: currentTheme.text }]}
                >
                  {item.name}
                </Text>
                {item.description && (
                  <Text
                    style={[
                      styles.productDescription,
                      { color: currentTheme.textLight },
                    ]}
                  >
                    {item.description}
                  </Text>
                )}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  gap: SPACING.lg,
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => handleEditCategory(item)}
                  style={[styles.iconButton, { backgroundColor: "#3b82f6" }]}
                >
                  <Ionicons name="create-outline" size={18} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteCategory(item.id)}
                  style={[styles.iconButton, { backgroundColor: "#ef4444" }]}
                >
                  <Ionicons name="trash-outline" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingHorizontal: SPACING.lg }}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: currentTheme.background },
          ]}
        >
          <View
            style={[
              styles.modalHeader,
              { borderBottomColor: currentTheme.border },
            ]}
          >
            <TouchableOpacity onPress={handleCloseModal}>
              <Text style={{ fontSize: 20 }}>✕</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: currentTheme.text }]}>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </Text>
            <View style={{ width: 30 }} />
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: SPACING.lg }}
          >
            <View style={{ marginBottom: SPACING.lg }}>
              <Text style={[styles.inputLabel, { color: currentTheme.text }]}>
                Category Name *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: currentTheme.cardBackground,
                    color: currentTheme.text,
                    borderColor: currentTheme.border,
                  },
                ]}
                placeholder="Enter category name"
                placeholderTextColor={currentTheme.textLight}
                value={newCategory.name}
                onChangeText={(text) =>
                  setNewCategory({ ...newCategory, name: text })
                }
              />
            </View>

            <View style={{ marginBottom: SPACING.lg }}>
              <Text style={[styles.inputLabel, { color: currentTheme.text }]}>
                Description
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: currentTheme.cardBackground,
                    color: currentTheme.text,
                    borderColor: currentTheme.border,
                    minHeight: 80,
                  },
                ]}
                placeholder="Enter category description"
                placeholderTextColor={currentTheme.textLight}
                multiline
                numberOfLines={4}
                value={newCategory.description}
                onChangeText={(text) =>
                  setNewCategory({ ...newCategory, description: text })
                }
              />
            </View>
          </ScrollView>

          <View
            style={[
              styles.modalFooter,
              { borderTopColor: currentTheme.border },
            ]}
          >
            <TouchableOpacity
              onPress={handleCloseModal}
              style={[
                styles.modalButton,
                { backgroundColor: currentTheme.border },
              ]}
            >
              <Text style={{ color: currentTheme.text, fontWeight: "600" }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleAddCategory}
              disabled={isAdding}
              style={[
                styles.modalButton,
                { backgroundColor: currentTheme.primary },
              ]}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "600",
                }}
              >
                {isAdding ? "Saving..." : editingCategory ? "Update" : "Add"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Banner Images Content Component
const BannersContent = () => {
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const [isUploading, setIsUploading] = useState(false);

  const {
    data: bannersData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["homeBannersAdmin"],
    queryFn: bannerAPI.getAdminAll,
    retry: 0,
    staleTime: 60000,
  });

  const banners = bannersData?.banners || [];

  const uploadBannerImage = async (imageAsset) => {
    const formData = new FormData();
    const extension = imageAsset.uri?.split(".")?.pop() || "jpg";
    formData.append("image", {
      uri: imageAsset.uri,
      name: `banner_${Date.now()}.${extension}`,
      type: imageAsset.mimeType || "image/jpeg",
    });

    const data = await bannerAPI.uploadImage(formData);
    return data?.image_url || "";
  };

  const handleAddBanner = async () => {
    const remainingSlots = 8 - banners.length;

    if (remainingSlots <= 0) {
      Alert.alert("Limit reached", "You can upload maximum 8 slider images.");
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow photo access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.9,
      allowsMultipleSelection: true,
      selectionLimit: remainingSlots,
    });

    if (result.canceled || !result.assets?.length) return;

    try {
      setIsUploading(true);

      // Upload all selected images
      let successCount = 0;
      let failedCount = 0;

      for (const asset of result.assets) {
        try {
          const imageUrl = await uploadBannerImage(asset);
          if (!imageUrl) {
            failedCount++;
            continue;
          }

          await bannerAPI.create({ image_url: imageUrl, is_active: true });
          successCount++;
        } catch (err) {
          console.error("Failed to add banner:", err);
          failedCount++;
        }
      }

      refetch();

      if (successCount > 0 && failedCount === 0) {
        Alert.alert(
          "Success",
          `${successCount} slider image${successCount > 1 ? "s" : ""} added successfully`,
        );
      } else if (successCount > 0 && failedCount > 0) {
        Alert.alert(
          "Partial Success",
          `${successCount} image${successCount > 1 ? "s" : ""} uploaded, ${failedCount} failed`,
        );
      } else {
        Alert.alert("Error", "Failed to add slider images");
      }
    } catch (err) {
      Alert.alert(
        "Error",
        err?.response?.data?.error ||
          err.message ||
          "Failed to add slider image",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteBanner = (bannerId) => {
    Alert.alert("Remove image", "Do you want to remove this slider image?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            await bannerAPI.delete(bannerId);
            refetch();
          } catch (err) {
            Alert.alert(
              "Error",
              err?.response?.data?.error || "Failed to remove image",
            );
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: currentTheme.text }}>
          Loading slider images...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={{ color: currentTheme.text }}>
          Failed to load slider images.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: SPACING.lg,
          paddingVertical: SPACING.md,
          borderBottomWidth: 1,
          borderBottomColor: currentTheme.border,
        }}
      >
        <View>
          <Text style={[styles.productsTitle, { color: currentTheme.text }]}>
            Slider Images
          </Text>
          <Text
            style={{ color: currentTheme.textLight, fontSize: FONTS.sizes.sm }}
          >
            Add 4 to 8 images for homepage slider
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleAddBanner}
          disabled={isUploading || banners.length >= 8}
          style={[
            styles.addButton,
            {
              backgroundColor:
                isUploading || banners.length >= 8
                  ? currentTheme.textLight
                  : currentTheme.primary,
            },
          ]}
        >
          {isUploading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Ionicons name="add" size={22} color="white" />
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={banners}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: currentTheme.text }]}>
              No slider images yet
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.productCard,
              {
                backgroundColor: currentTheme.cardBackground,
                alignItems: "center",
              },
            ]}
          >
            <Image
              source={{ uri: item.image_url }}
              style={{
                width: 110,
                height: 80,
                borderRadius: RADIUS.md,
                marginRight: SPACING.md,
                backgroundColor: "#e5e7eb",
              }}
              resizeMode="cover"
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.productName, { color: currentTheme.text }]}>
                Image {index + 1}
              </Text>
              <Text
                style={{
                  color: currentTheme.textLight,
                  fontSize: FONTS.sizes.sm,
                }}
              >
                Display order: {item.display_order}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleDeleteBanner(item.id)}
              style={[styles.iconButton, { backgroundColor: "#ef4444" }]}
            >
              <Ionicons name="trash-outline" size={18} color="white" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

// Customers Content Component
// Orders Content Component
const OrdersContent = () => {
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allOrders"],
    queryFn: orderAPI.getAllOrders,
    retry: 0,
    staleTime: 60000,
  });

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: currentTheme.text }}>Loading orders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={{ fontSize: 48, marginBottom: SPACING.md }}>⚠️</Text>
        <Text style={[styles.emptyText, { color: currentTheme.text }]}>
          Failed to load orders
        </Text>
        <Text style={[styles.emptySubtext, { color: currentTheme.textLight }]}>
          {error.message || "Please check your connection and try again"}
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          style={[
            styles.retryButton,
            { backgroundColor: currentTheme.primary },
          ]}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const orders = ordersData?.orders || [];

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.users?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.includes(searchQuery);
      const matchesStatus =
        filterStatus === "all" || order.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "recent")
        return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === "oldest")
        return new Date(a.created_at) - new Date(b.created_at);
      return 0;
    });

  if (filteredOrders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={{ fontSize: 48, marginBottom: SPACING.md }}>📋</Text>
        <Text style={[styles.emptyText, { color: currentTheme.text }]}>
          {searchQuery || filterStatus !== "all"
            ? "No orders match"
            : "No orders found"}
        </Text>
        <Text style={[styles.emptySubtext, { color: currentTheme.textLight }]}>
          {searchQuery || filterStatus !== "all"
            ? "Try adjusting your search or filters"
            : "Orders will appear here once customers place them"}
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          style={[
            styles.retryButton,
            { backgroundColor: currentTheme.primary, marginTop: SPACING.md },
          ]}
        >
          <Text style={styles.retryButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "#10b981";
      case "rejected":
        return "#ef4444";
      case "pending":
        return "#f59e0b";
      default:
        return currentTheme.textLight;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleExportOrders = async () => {
    const response = await orderAPI.exportOrders();
    if (response?.emailSent) {
      Alert.alert("Export Sent", "Orders CSV has been emailed to admin.");
    } else {
      Alert.alert(
        "Export Complete",
        response?.emailWarning
          ? `CSV prepared but email failed: ${response.emailWarning}`
          : "CSV prepared successfully.",
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: SPACING.lg,
          paddingVertical: SPACING.md,
          borderBottomWidth: 1,
          borderBottomColor: currentTheme.border,
        }}
      >
        <Text
          style={[
            styles.ordersTitle,
            {
              color: currentTheme.text,
              flex: 1,
            },
          ]}
        >
          All Orders ({filteredOrders.length})
        </Text>
        <ExportButton
          data={filteredOrders}
          filename="orders"
          theme={currentTheme}
          onExport={handleExportOrders}
        />
      </View>

      {/* Search, Filter, and Sort */}
      <View
        style={{ paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md }}
      >
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by customer name or order ID..."
          theme={currentTheme}
        />
        <View style={{ marginTop: SPACING.md }}>
          <FilterBar
            filters={[
              { id: "all", label: "All Orders" },
              { id: "pending", label: "⏳ Pending" },
              { id: "approved", label: "✅ Approved" },
              { id: "rejected", label: "❌ Rejected" },
            ]}
            activeFilter={filterStatus}
            onSelectFilter={setFilterStatus}
            theme={currentTheme}
          />
        </View>
        <View style={{ marginTop: SPACING.md }}>
          <SortOptions
            value={sortBy}
            onSelect={setSortBy}
            options={[
              { value: "recent", label: "Recent First" },
              { value: "oldest", label: "Oldest First" },
            ]}
            theme={currentTheme}
          />
        </View>
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[currentTheme.primary]}
            tintColor={currentTheme.primary}
          />
        }
        renderItem={({ item }) => {
          // Calculate total amount from order items
          const totalAmount =
            item.order_items?.reduce((sum, orderItem) => {
              return (
                sum + orderItem.quantity * (orderItem.products?.price || 0)
              );
            }, 0) || 0;

          return (
            <View
              style={[
                styles.orderCard,
                { backgroundColor: currentTheme.cardBackground },
              ]}
            >
              <View style={styles.orderHeader}>
                <View>
                  <Text style={[styles.orderId, { color: currentTheme.text }]}>
                    Order #{item.id.substring(0, 8)}
                  </Text>
                  <Text
                    style={[
                      styles.orderDate,
                      { color: currentTheme.textLight },
                    ]}
                  >
                    {formatDate(item.created_at)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(item.status) + "20" },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(item.status) },
                    ]}
                  >
                    {item.status.toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={styles.orderDetails}>
                <View style={styles.orderRow}>
                  <Text
                    style={[
                      styles.orderLabel,
                      { color: currentTheme.textLight },
                    ]}
                  >
                    Customer:
                  </Text>
                  <View>
                    <Text
                      style={[styles.orderValue, { color: currentTheme.text }]}
                    >
                      {item.users?.name || "Unknown Customer"}
                    </Text>
                    {item.users?.phone && (
                      <Text
                        style={[
                          styles.orderLabel,
                          { color: currentTheme.textLight, fontSize: 12 },
                        ]}
                      >
                        📱 {item.users.phone}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.orderRow}>
                  <Text
                    style={[
                      styles.orderLabel,
                      { color: currentTheme.textLight },
                    ]}
                  >
                    Total Amount:
                  </Text>
                  <Text
                    style={[styles.orderTotal, { color: currentTheme.primary }]}
                  >
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </Text>
                </View>
                <View style={styles.orderRow}>
                  <Text
                    style={[
                      styles.orderLabel,
                      { color: currentTheme.textLight },
                    ]}
                  >
                    Items:
                  </Text>
                  <Text
                    style={[styles.orderValue, { color: currentTheme.text }]}
                  >
                    {item.order_items?.length || 0} products
                  </Text>
                </View>
                {item.order_items?.length > 0 && (
                  <View style={{ marginTop: SPACING.xs }}>
                    {item.order_items.map((orderItem) => (
                      <Text
                        key={orderItem.id}
                        style={[
                          styles.orderLabel,
                          {
                            color: currentTheme.textLight,
                            fontSize: 12,
                            marginBottom: 2,
                          },
                        ]}
                      >
                        • {orderItem.products?.name} × {orderItem.quantity}
                        {orderItem.products?.serial_number
                          ? ` (SKU: ${orderItem.products.serial_number})`
                          : ""}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

// Products Content Component
const ProductsContent = () => {
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    image_url: "",
    serial_number: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const {
    data: productsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allProducts"],
    queryFn: productAPI.getAll,
    retry: 0,
    staleTime: 60000,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryAPI.getAll,
    retry: 0,
    staleTime: 60000,
  });

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedProducts, setSelectedProducts] = useState(new Set());

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleExportProducts = async () => {
    const response = await productAPI.exportProducts();
    if (response?.emailSent) {
      Alert.alert("Export Sent", "Products CSV has been emailed to admin.");
    } else {
      Alert.alert(
        "Export Complete",
        response?.emailWarning
          ? `CSV prepared but email failed: ${response.emailWarning}`
          : "CSV prepared successfully.",
      );
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Please allow photo library access to upload product images.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 8,
    });

    if (!result.canceled && result.assets) {
      setSelectedImages([...selectedImages, ...result.assets]);
    }
  };

  const uploadImageToSupabase = async (imageAsset) => {
    try {
      const formData = new FormData();
      const extension = imageAsset.uri?.split(".")?.pop() || "jpg";
      formData.append("image", {
        uri: imageAsset.uri,
        name: `product_${Date.now()}_${Math.random().toString(36).substring(7)}.${extension}`,
        type: imageAsset.mimeType || "image/jpeg",
      });

      const data = await productAPI.uploadImage(formData);
      return data?.image_url || "";
    } catch (err) {
      console.error("Upload error:", err);
      return null;
    }
  };

  const uploadAllImages = async () => {
    if (selectedImages.length === 0) return [];

    setImageUploading(true);
    try {
      const uploadPromises = selectedImages.map((img) =>
        uploadImageToSupabase(img),
      );
      const uploadedUrls = await Promise.all(uploadPromises);
      return uploadedUrls.filter((url) => url !== null);
    } catch (err) {
      Alert.alert("Upload Error", "Failed to upload some images");
      return [];
    } finally {
      setImageUploading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      category_id: product.category_id || "",
      image_url: product.image_url || "",
      serial_number: product.serial_number || "",
    });
    // Parse existing image(s) if editing
    if (product.image_url) {
      try {
        const existingUrls = JSON.parse(product.image_url);
        if (Array.isArray(existingUrls)) {
          // Already array format, keep as is for display
        }
      } catch {
        // Single URL, keep as is
      }
    }
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingProduct(null);
    setSelectedImages([]);
    setNewProduct({
      name: "",
      description: "",
      price: "",
      category_id: "",
      image_url: "",
      serial_number: "",
    });
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category_id) {
      Alert.alert("Missing Fields", "Please fill all required fields");
      return;
    }

    setIsAdding(true);
    try {
      let imageUrls = [];

      // Upload new images if any selected
      if (selectedImages.length > 0) {
        imageUrls = await uploadAllImages();
        if (imageUrls.length === 0) {
          Alert.alert(
            "Upload Failed",
            "Failed to upload images. Please try again.",
          );
          setIsAdding(false);
          return;
        }
      }

      // For editing: merge with existing image_url if present
      let finalImageUrl = "";
      if (
        editingProduct &&
        newProduct.image_url &&
        selectedImages.length === 0
      ) {
        // Keep existing if no new images
        finalImageUrl = newProduct.image_url;
      } else if (imageUrls.length > 0) {
        // Store as JSON array if multiple, single string if one
        finalImageUrl =
          imageUrls.length === 1 ? imageUrls[0] : JSON.stringify(imageUrls);
      }

      if (editingProduct) {
        await productAPI.update(editingProduct.id, {
          ...newProduct,
          price: parseFloat(newProduct.price),
          image_url: finalImageUrl,
        });
        Alert.alert("Success", "Product updated successfully!");
      } else {
        await productAPI.create({
          ...newProduct,
          price: parseFloat(newProduct.price),
          image_url: finalImageUrl,
        });
        Alert.alert("Success", "Product added successfully!");
      }

      handleCloseModal();
      refetch();
    } catch (err) {
      const serverError = err?.response?.data;
      Alert.alert(
        "Error",
        serverError?.error ||
          err.message ||
          `Failed to ${editingProduct ? "update" : "add"} product`,
      );
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: currentTheme.text }}>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={{ fontSize: 48, marginBottom: SPACING.md }}>⚠️</Text>
        <Text style={[styles.emptyText, { color: currentTheme.text }]}>
          Failed to load products
        </Text>
        <Text style={[styles.emptySubtext, { color: currentTheme.textLight }]}>
          {error.message || "Please check your connection and try again"}
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          style={[
            styles.retryButton,
            { backgroundColor: currentTheme.primary },
          ]}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const products = productsData?.products || productsData?.data || [];
  const categories = categoriesData?.categories || categoriesData?.data || [];

  // Filter and sort products
  const filteredProducts = products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.categories?.name &&
          p.categories.name.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: SPACING.lg,
          paddingVertical: SPACING.md,
          borderBottomWidth: 1,
          borderBottomColor: currentTheme.border,
        }}
      >
        <Text
          style={[styles.productsTitle, { color: currentTheme.text, flex: 1 }]}
        >
          All Products ({filteredProducts.length})
        </Text>
        <ExportButton
          data={filteredProducts}
          filename="products"
          theme={currentTheme}
          onExport={handleExportProducts}
        />
        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          style={[
            styles.addButton,
            { backgroundColor: currentTheme.primary, marginLeft: SPACING.md },
          ]}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
            +
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search and Sort */}
      <View
        style={{ paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md }}
      >
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search products..."
          theme={currentTheme}
        />
        <View style={{ marginTop: SPACING.md }}>
          <SortOptions
            value={sortBy}
            onSelect={setSortBy}
            options={[
              { value: "recent", label: "📅 Recent" },
              { value: "price-asc", label: "💲 Low to High" },
              { value: "price-desc", label: "💲 High to Low" },
              { value: "name", label: "🔤 A to Z" },
            ]}
            theme={currentTheme}
          />
        </View>
      </View>

      {filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={{ fontSize: 48, marginBottom: SPACING.md }}>📦</Text>
          <Text style={[styles.emptyText, { color: currentTheme.text }]}>
            {searchQuery
              ? "No products match your search"
              : "No products found"}
          </Text>
          <Text
            style={[styles.emptySubtext, { color: currentTheme.textLight }]}
          >
            {searchQuery
              ? "Try adjusting your search terms"
              : "Click the + button above to add products"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[currentTheme.primary]}
              tintColor={currentTheme.primary}
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleEditProduct(item)}
              style={[
                styles.productCard,
                { backgroundColor: currentTheme.cardBackground },
              ]}
            >
              {item.image_url ? (
                <Image
                  source={{
                    uri: (() => {
                      try {
                        // Try parsing as JSON array first
                        const parsed = JSON.parse(item.image_url);
                        return Array.isArray(parsed)
                          ? parsed[0]
                          : item.image_url;
                      } catch {
                        // Not JSON, use as single URL
                        return item.image_url;
                      }
                    })(),
                  }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.productImagePlaceholder}>
                  <Text style={styles.productImageText}>
                    {item.name?.charAt(0)?.toUpperCase() || "P"}
                  </Text>
                </View>
              )}
              <View style={styles.productInfo}>
                <Text
                  style={[styles.productName, { color: currentTheme.text }]}
                  numberOfLines={2}
                >
                  {item.name}
                </Text>
                <Text
                  style={[
                    styles.productCategory,
                    { color: currentTheme.textLight },
                  ]}
                >
                  {item.categories?.name || "Uncategorized"}
                  {item.serial_number && (
                    <Text
                      style={[
                        styles.productCategory,
                        { color: currentTheme.textLight, fontSize: 12 },
                      ]}
                    >
                      {" • SKU: " + item.serial_number}
                    </Text>
                  )}
                </Text>
                <View style={styles.productFooter}>
                  <Text
                    style={[
                      styles.productPrice,
                      { color: currentTheme.primary },
                    ]}
                  >
                    ₹{item.price?.toLocaleString("en-IN") || "0"}
                  </Text>
                  <View
                    style={[
                      styles.activeIndicator,
                      {
                        backgroundColor: item.is_active ? "#10b981" : "#ef4444",
                      },
                    ]}
                  >
                    <Text style={styles.activeText}>
                      {item.is_active ? "Active" : "Inactive"}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.editIconContainer}>
                <Ionicons name="create-outline" size={16} color={COLORS.text} />
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <View
            style={{
              backgroundColor: currentTheme.cardBackground,
              borderRadius: RADIUS.lg,
              padding: SPACING.md,
              width: "92%",
              maxWidth: 520,
              alignSelf: "center",
              maxHeight: "96%",
              minHeight: "82%",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: currentTheme.text,
                marginBottom: SPACING.md,
              }}
            >
              {editingProduct ? "Edit Product" : "Add New Product"}
            </Text>
            <ScrollView>
              <View style={{ marginBottom: SPACING.md }}>
                <Text
                  style={{ color: currentTheme.textLight, marginBottom: 5 }}
                >
                  Product Name*
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: currentTheme.border,
                    borderRadius: RADIUS.md,
                    padding: SPACING.md,
                    color: currentTheme.text,
                  }}
                  placeholder="Enter product name"
                  placeholderTextColor={currentTheme.placeholder}
                  value={newProduct.name}
                  onChangeText={(text) =>
                    setNewProduct({ ...newProduct, name: text })
                  }
                />
              </View>

              <View style={{ marginBottom: SPACING.md }}>
                <Text
                  style={{ color: currentTheme.textLight, marginBottom: 5 }}
                >
                  Category*
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: SPACING.sm }}
                >
                  {categories.map((category) => {
                    const isSelected = newProduct.category_id === category.id;
                    return (
                      <TouchableOpacity
                        key={category.id}
                        onPress={() =>
                          setNewProduct({
                            ...newProduct,
                            category_id: category.id,
                          })
                        }
                        style={{
                          paddingHorizontal: SPACING.md,
                          paddingVertical: SPACING.sm,
                          borderRadius: RADIUS.md,
                          borderWidth: 1,
                          borderColor: isSelected
                            ? currentTheme.primary
                            : currentTheme.border,
                          backgroundColor: isSelected
                            ? currentTheme.primary + "20"
                            : currentTheme.cardBackground,
                        }}
                      >
                        <Text
                          style={{
                            color: isSelected
                              ? currentTheme.primary
                              : currentTheme.text,
                            fontWeight: isSelected ? "700" : "500",
                          }}
                        >
                          {category.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
                {categories.length === 0 && (
                  <Text
                    style={{
                      color: currentTheme.textLight,
                      marginTop: SPACING.xs,
                      fontSize: FONTS.sizes.xs,
                    }}
                  >
                    No categories found. Please add categories first.
                  </Text>
                )}
              </View>

              <View style={{ marginBottom: SPACING.md }}>
                <Text
                  style={{ color: currentTheme.textLight, marginBottom: 5 }}
                >
                  Price (₹)*
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: currentTheme.border,
                    borderRadius: RADIUS.md,
                    padding: SPACING.md,
                    color: currentTheme.text,
                  }}
                  placeholder="Enter price"
                  placeholderTextColor={currentTheme.placeholder}
                  value={newProduct.price}
                  onChangeText={(text) =>
                    setNewProduct({ ...newProduct, price: text })
                  }
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={{ marginBottom: SPACING.md }}>
                <Text
                  style={{ color: currentTheme.textLight, marginBottom: 5 }}
                >
                  Serial Number (SKU)
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: currentTheme.border,
                    borderRadius: RADIUS.md,
                    padding: SPACING.md,
                    color: currentTheme.text,
                  }}
                  placeholder="Enter product serial number or SKU"
                  placeholderTextColor={currentTheme.placeholder}
                  value={newProduct.serial_number}
                  onChangeText={(text) =>
                    setNewProduct({ ...newProduct, serial_number: text })
                  }
                />
              </View>

              <View style={{ marginBottom: SPACING.lg }}>
                <Text
                  style={{ color: currentTheme.textLight, marginBottom: 5 }}
                >
                  Description
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: currentTheme.border,
                    borderRadius: RADIUS.md,
                    padding: SPACING.md,
                    color: currentTheme.text,
                    minHeight: 80,
                    textAlignVertical: "top",
                  }}
                  placeholder="Enter description (optional)"
                  placeholderTextColor={currentTheme.placeholder}
                  value={newProduct.description}
                  onChangeText={(text) =>
                    setNewProduct({ ...newProduct, description: text })
                  }
                  multiline
                />
              </View>

              {/* Image Upload Section */}
              <View style={{ marginBottom: SPACING.lg }}>
                <Text
                  style={{ color: currentTheme.textLight, marginBottom: 8 }}
                >
                  Product Images (Optional - up to 8)
                </Text>

                {/* Display selected images in grid */}
                {selectedImages.length > 0 && (
                  <View style={{ marginBottom: SPACING.md }}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ gap: SPACING.sm }}
                    >
                      {selectedImages.map((img, index) => (
                        <View key={index} style={{ position: "relative" }}>
                          <Image
                            source={{ uri: img.uri }}
                            style={{
                              width: 100,
                              height: 100,
                              borderRadius: RADIUS.md,
                            }}
                          />
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedImages(
                                selectedImages.filter((_, i) => i !== index),
                              );
                            }}
                            style={{
                              position: "absolute",
                              top: -5,
                              right: -5,
                              backgroundColor: "#ef4444",
                              borderRadius: 12,
                              width: 24,
                              height: 24,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              style={{
                                color: "white",
                                fontSize: 14,
                                fontWeight: "bold",
                              }}
                            >
                              ×
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {/* Existing image preview for edit mode */}
                {editingProduct &&
                  newProduct.image_url &&
                  selectedImages.length === 0 && (
                    <View style={{ marginBottom: SPACING.md }}>
                      {(() => {
                        try {
                          const parsed = JSON.parse(newProduct.image_url);
                          if (Array.isArray(parsed) && parsed.length > 0) {
                            // Multiple images - show as grid
                            return (
                              <>
                                <Text
                                  style={{
                                    color: currentTheme.textLight,
                                    marginBottom: SPACING.sm,
                                    fontSize: FONTS.sizes.sm,
                                  }}
                                >
                                  Current Images ({parsed.length})
                                </Text>
                                <ScrollView
                                  horizontal
                                  showsHorizontalScrollIndicator={false}
                                  contentContainerStyle={{ gap: SPACING.sm }}
                                >
                                  {parsed.map((url, index) => (
                                    <Image
                                      key={index}
                                      source={{ uri: url }}
                                      style={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: RADIUS.md,
                                      }}
                                    />
                                  ))}
                                </ScrollView>
                              </>
                            );
                          }
                        } catch {
                          // Single URL - show single image
                        }
                        return (
                          <>
                            <Text
                              style={{
                                color: currentTheme.textLight,
                                marginBottom: SPACING.sm,
                                fontSize: FONTS.sizes.sm,
                              }}
                            >
                              Current Image
                            </Text>
                            <Image
                              source={{ uri: newProduct.image_url }}
                              style={{
                                width: "100%",
                                height: 200,
                                borderRadius: RADIUS.md,
                              }}
                            />
                          </>
                        );
                      })()}
                      <TouchableOpacity
                        onPress={() => {
                          setNewProduct({ ...newProduct, image_url: "" });
                        }}
                        style={{
                          backgroundColor: "#ef4444",
                          paddingVertical: SPACING.sm,
                          borderRadius: RADIUS.md,
                          marginTop: SPACING.md,
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            textAlign: "center",
                            fontWeight: "600",
                          }}
                        >
                          Remove All Existing Images
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                {/* Add images button */}
                {selectedImages.length < 8 && (
                  <TouchableOpacity
                    onPress={handlePickImage}
                    disabled={isAdding || imageUploading}
                    style={{
                      borderWidth: 2,
                      borderColor: currentTheme.primary,
                      borderStyle: "dashed",
                      borderRadius: RADIUS.md,
                      paddingVertical: SPACING.lg,
                      paddingHorizontal: SPACING.md,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: currentTheme.primary + "10",
                    }}
                  >
                    {imageUploading ? (
                      <ActivityIndicator
                        color={currentTheme.primary}
                        size="large"
                      />
                    ) : (
                      <>
                        <Text
                          style={{
                            fontSize: 32,
                            marginBottom: SPACING.sm,
                          }}
                        >
                          📷
                        </Text>
                        <Text
                          style={{
                            color: currentTheme.primary,
                            fontWeight: "600",
                            fontSize: FONTS.sizes.md,
                          }}
                        >
                          {selectedImages.length > 0
                            ? "Add More Images"
                            : "Tap to select images"}
                        </Text>
                        <Text
                          style={{
                            color: currentTheme.textLight,
                            fontSize: FONTS.sizes.xs,
                            marginTop: SPACING.xs,
                          }}
                        >
                          {selectedImages.length}/8 selected • JPG, PNG
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </View>

              <View style={{ flexDirection: "row", gap: SPACING.md }}>
                <TouchableOpacity
                  onPress={handleCloseModal}
                  disabled={isAdding}
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: currentTheme.primary,
                    borderRadius: RADIUS.md,
                    paddingVertical: SPACING.md,
                  }}
                >
                  <Text
                    style={{
                      color: currentTheme.primary,
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleAddProduct}
                  disabled={isAdding || imageUploading}
                  style={{
                    flex: 1,
                    backgroundColor:
                      isAdding || imageUploading
                        ? currentTheme.primary + "80"
                        : currentTheme.primary,
                    borderRadius: RADIUS.md,
                    paddingVertical: SPACING.md,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: SPACING.sm,
                  }}
                >
                  {isAdding || imageUploading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : null}
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {isAdding
                      ? editingProduct
                        ? "Updating..."
                        : "Adding..."
                      : imageUploading
                        ? "Uploading..."
                        : editingProduct
                          ? "Update Product"
                          : "Add Product"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};

const CustomersContent = () => {
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const {
    data: customersData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: userAPI.getAllCustomers,
    retry: 0,
    staleTime: 60000,
  });

  const [refreshing, setRefreshing] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [isBlockingCustomer, setIsBlockingCustomer] = useState(false);
  const [customerTab, setCustomerTab] = useState("active"); // "active" or "blocked"
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotesModal, setShowNotesModal] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleExportCustomers = async () => {
    const response = await userAPI.exportCustomers();
    if (response?.emailSent) {
      Alert.alert("Export Sent", "Customers CSV has been emailed to admin.");
    } else {
      Alert.alert(
        "Export Complete",
        response?.emailWarning
          ? `CSV prepared but email failed: ${response.emailWarning}`
          : "CSV prepared successfully.",
      );
    }
  };

  const handleBlockCustomer = async () => {
    try {
      setIsBlockingCustomer(true);
      await userAPI.blockCustomer(selectedCustomer.id);

      // Update local state immediately
      const updatedCustomer = { ...selectedCustomer, is_blocked: true };
      setSelectedCustomer(updatedCustomer);

      // Close modal and refetch
      setShowCustomerModal(false);
      await refetch(); // Wait for refetch to complete

      Alert.alert("Success", "Customer blocked successfully");
    } catch (err) {
      console.error("Block error:", err);
      Alert.alert("Error", err.message || "Failed to block customer");
    } finally {
      setIsBlockingCustomer(false);
    }
  };

  const handleUnblockCustomer = async () => {
    try {
      setIsBlockingCustomer(true);
      await userAPI.unblockCustomer(selectedCustomer.id);

      // Update local state immediately
      const updatedCustomer = { ...selectedCustomer, is_blocked: false };
      setSelectedCustomer(updatedCustomer);

      // Close modal and refetch
      setShowCustomerModal(false);
      await refetch(); // Wait for refetch to complete

      Alert.alert("Success", "Customer unblocked successfully");
    } catch (err) {
      console.error("Unblock error:", err);
      Alert.alert("Error", err.message || "Failed to unblock customer");
    } finally {
      setIsBlockingCustomer(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: currentTheme.text }}>Loading customers...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={{ fontSize: 48, marginBottom: SPACING.md }}>⚠️</Text>
        <Text style={[styles.emptyText, { color: currentTheme.text }]}>
          Failed to load customers
        </Text>
        <Text style={[styles.emptySubtext, { color: currentTheme.textLight }]}>
          {error.message || "Please check your connection and try again"}
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          style={[
            styles.retryButton,
            { backgroundColor: currentTheme.primary },
          ]}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const customers = customersData?.data || [];

  // Separate active and blocked customers - strict comparison
  let activeCustomers = customers.filter((c) => c.is_blocked !== true);
  let blockedCustomers = customers.filter((c) => c.is_blocked === true);

  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    activeCustomers = activeCustomers.filter(
      (c) =>
        c.name?.toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query),
    );
    blockedCustomers = blockedCustomers.filter(
      (c) =>
        c.name?.toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query),
    );
  }

  if (customers.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={{ fontSize: 48, marginBottom: SPACING.md }}>👥</Text>
        <Text style={[styles.emptyText, { color: currentTheme.text }]}>
          No customers found
        </Text>
      </View>
    );
  }

  const renderCustomerList = (customerList, isBlocked = false) => {
    if (customerList.length === 0) {
      return (
        <View
          style={{
            paddingVertical: SPACING.lg,
            paddingHorizontal: SPACING.md,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: currentTheme.textLight,
              fontSize: FONTS.sizes.sm,
              fontStyle: "italic",
            }}
          >
            {isBlocked ? "No blocked customers" : "No active customers"}
          </Text>
        </View>
      );
    }

    return customerList.map((customer) => (
      <TouchableOpacity
        key={customer.id}
        onPress={() => {
          setSelectedCustomer(customer);
          setShowCustomerModal(true);
        }}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={["#f3f4f6", "#e5e7eb"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.customerCard,
            {
              backgroundColor: currentTheme.cardBackground,
              opacity: customer.is_blocked ? 0.5 : 1,
            },
          ]}
        >
          <View style={styles.customerCardContent}>
            <View style={styles.customerAvatar}>
              <Text style={styles.avatarText}>
                {customer.name?.charAt(0)?.toUpperCase() || "C"}
              </Text>
            </View>
            <View style={styles.customerInfo}>
              <Text style={[styles.customerName, { color: currentTheme.text }]}>
                {customer.name}
              </Text>
              <Text
                style={[
                  styles.customerEmail,
                  { color: currentTheme.textLight },
                ]}
              >
                {customer.email}
              </Text>
              {customer.phone && (
                <Text
                  style={[
                    styles.customerPhone,
                    { color: currentTheme.textLight },
                  ]}
                >
                  📱 {customer.phone}
                </Text>
              )}
              <Text style={[styles.customerRole, { color: "#6366f1" }]}>
                {customer.role === "admin" ? "Admin" : "Customer"}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Search Bar */}
      <View
        style={{
          paddingHorizontal: SPACING.lg,
          paddingVertical: SPACING.md,
          borderBottomWidth: 1,
          borderBottomColor: currentTheme.border,
        }}
      >
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search customers..."
          theme={currentTheme}
        />
      </View>

      {/* Tab Bar */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: currentTheme.cardBackground,
          borderBottomWidth: 1,
          borderBottomColor: currentTheme.border,
          paddingHorizontal: SPACING.sm,
          paddingVertical: SPACING.sm,
          gap: SPACING.sm,
        }}
      >
        <TouchableOpacity
          onPress={() => setCustomerTab("active")}
          style={[
            {
              flex: 1,
              paddingVertical: SPACING.md,
              paddingHorizontal: SPACING.md,
              borderRadius: RADIUS.md,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                customerTab === "active" ? currentTheme.primary : "transparent",
            },
          ]}
        >
          <Text
            style={{
              color:
                customerTab === "active" ? "white" : currentTheme.textLight,
              fontWeight: customerTab === "active" ? "700" : "600",
              fontSize: FONTS.sizes.md,
            }}
          >
            ✅ Active ({activeCustomers.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCustomerTab("blocked")}
          style={[
            {
              flex: 1,
              paddingVertical: SPACING.md,
              paddingHorizontal: SPACING.md,
              borderRadius: RADIUS.md,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                customerTab === "blocked" ? "#ef4444" : "transparent",
            },
          ]}
        >
          <Text
            style={{
              color:
                customerTab === "blocked" ? "white" : currentTheme.textLight,
              fontWeight: customerTab === "blocked" ? "700" : "600",
              fontSize: FONTS.sizes.md,
            }}
          >
            🚫 Blocked ({blockedCustomers.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Export Button */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingHorizontal: SPACING.lg,
          paddingVertical: SPACING.md,
          borderBottomWidth: 1,
          borderBottomColor: currentTheme.border,
        }}
      >
        <ExportButton
          data={customerTab === "active" ? activeCustomers : blockedCustomers}
          filename={`customers_${customerTab}`}
          theme={currentTheme}
          onExport={handleExportCustomers}
        />
      </View>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[currentTheme.primary]}
            tintColor={currentTheme.primary}
          />
        }
      >
        {customerTab === "active" ? (
          <View style={{ paddingVertical: SPACING.md }}>
            {activeCustomers.length === 0 ? (
              <View
                style={{
                  alignItems: "center",
                  paddingVertical: SPACING.xl,
                }}
              >
                <Text
                  style={{
                    color: currentTheme.textLight,
                    fontSize: FONTS.sizes.md,
                  }}
                >
                  No active customers
                </Text>
              </View>
            ) : (
              renderCustomerList(activeCustomers, false)
            )}
          </View>
        ) : (
          <View style={{ paddingVertical: SPACING.md }}>
            {blockedCustomers.length === 0 ? (
              <View
                style={{
                  alignItems: "center",
                  paddingVertical: SPACING.xl,
                }}
              >
                <Text
                  style={{
                    color: currentTheme.textLight,
                    fontSize: FONTS.sizes.md,
                  }}
                >
                  No blocked customers
                </Text>
              </View>
            ) : (
              renderCustomerList(blockedCustomers, true)
            )}
          </View>
        )}
      </ScrollView>

      {/* Customer Detail Modal */}
      <Modal
        visible={showCustomerModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCustomerModal(false)}
      >
        <View
          style={[
            styles.modalOverlay,
            { backgroundColor: "rgba(0, 0, 0, 0.5)" },
          ]}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: currentTheme.cardBackground,
                borderTopLeftRadius: RADIUS.xl,
                borderTopRightRadius: RADIUS.xl,
              },
            ]}
          >
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setShowCustomerModal(false)}
              style={styles.modalCloseButton}
            >
              <Text style={{ fontSize: 24 }}>✕</Text>
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Customer Avatar and Name */}
              <View style={{ alignItems: "center", marginBottom: SPACING.lg }}>
                <View
                  style={[
                    styles.customerAvatar,
                    { width: 80, height: 80, marginBottom: SPACING.md },
                  ]}
                >
                  <Text
                    style={[
                      styles.avatarText,
                      { fontSize: 32, fontWeight: "bold" },
                    ]}
                  >
                    {selectedCustomer?.name?.charAt(0)?.toUpperCase() || "C"}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.modalTitle,
                    { color: currentTheme.text, textAlign: "center" },
                  ]}
                >
                  {selectedCustomer?.name}
                </Text>
                {selectedCustomer?.is_blocked && (
                  <Text style={{ color: "#ef4444", marginTop: SPACING.sm }}>
                    🚫 This customer is blocked
                  </Text>
                )}
              </View>

              {/* Customer Details */}
              <View
                style={[
                  styles.customerDetailCard,
                  { backgroundColor: currentTheme.background },
                ]}
              >
                <View style={styles.detailRow}>
                  <Text
                    style={[
                      styles.detailLabel,
                      { color: currentTheme.textLight },
                    ]}
                  >
                    Email
                  </Text>
                  <Text
                    style={[styles.detailValue, { color: currentTheme.text }]}
                  >
                    {selectedCustomer?.email}
                  </Text>
                </View>

                {selectedCustomer?.phone && (
                  <View style={styles.detailRow}>
                    <Text
                      style={[
                        styles.detailLabel,
                        { color: currentTheme.textLight },
                      ]}
                    >
                      Phone
                    </Text>
                    <Text
                      style={[styles.detailValue, { color: currentTheme.text }]}
                    >
                      {selectedCustomer.phone}
                    </Text>
                  </View>
                )}

                <View style={styles.detailRow}>
                  <Text
                    style={[
                      styles.detailLabel,
                      { color: currentTheme.textLight },
                    ]}
                  >
                    Role
                  </Text>
                  <Text
                    style={[
                      styles.detailValue,
                      {
                        color:
                          selectedCustomer?.role === "admin"
                            ? "#3b82f6"
                            : "#10b981",
                      },
                    ]}
                  >
                    {selectedCustomer?.role === "admin"
                      ? "Administrator"
                      : "Customer"}
                  </Text>
                </View>
              </View>

              {/* Customer Notes */}
              <View
                style={{ marginTop: SPACING.lg, paddingHorizontal: SPACING.md }}
              >
                <TouchableOpacity
                  onPress={() => setShowNotesModal(true)}
                  style={[
                    styles.actionButtonBlock,
                    {
                      backgroundColor: currentTheme.primary,
                      paddingVertical: SPACING.md,
                      borderRadius: RADIUS.lg,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    📝 View Notes
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Action Buttons */}
              {selectedCustomer?.role !== "admin" && (
                <View style={{ gap: SPACING.md, marginTop: SPACING.lg }}>
                  {selectedCustomer?.is_blocked ? (
                    <TouchableOpacity
                      onPress={handleUnblockCustomer}
                      disabled={isBlockingCustomer}
                      style={[
                        styles.actionButtonUnblock,
                        {
                          backgroundColor: "#10b981",
                          opacity: isBlockingCustomer ? 0.6 : 1,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "600",
                          fontSize: FONTS.sizes.md,
                        }}
                      >
                        {isBlockingCustomer
                          ? "Unblocking..."
                          : "✅ Unblock Customer"}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(
                          "Block Customer",
                          `Are you sure you want to block ${selectedCustomer?.name}?`,
                          [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Block",
                              style: "destructive",
                              onPress: handleBlockCustomer,
                            },
                          ],
                        );
                      }}
                      disabled={isBlockingCustomer}
                      style={[
                        styles.actionButtonBlock,
                        {
                          backgroundColor: "#ef4444",
                          opacity: isBlockingCustomer ? 0.6 : 1,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "600",
                          fontSize: FONTS.sizes.md,
                        }}
                      >
                        {isBlockingCustomer
                          ? "Blocking..."
                          : "🚫 Block Customer"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Customer Notes Modal */}
      {selectedCustomer && (
        <CustomerNotesModal
          visible={showNotesModal}
          customerId={selectedCustomer.id}
          onClose={() => setShowNotesModal(false)}
          theme={currentTheme}
          notesAPI={notesAPI}
        />
      )}
    </View>
  );
};

// Analytics Content Component
const AnalyticsContent = ({ stats, refetch }) => {
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[currentTheme.primary]}
          tintColor={currentTheme.primary}
        />
      }
    >
      <Text style={[styles.analyticsTitle, { color: currentTheme.text }]}>
        📊 Sales & Orders Analytics
      </Text>

      <View
        style={[
          styles.analyticsCard,
          { backgroundColor: currentTheme.cardBackground },
        ]}
      >
        <Text
          style={[styles.analyticsLabel, { color: currentTheme.textLight }]}
        >
          Total Sales (Estimated)
        </Text>
        <Text style={[styles.analyticsBigValue, { color: "#10b981" }]}>
          ₹
          {stats?.stats?.totalSales
            ? stats.stats.totalSales.toLocaleString()
            : "0"}
        </Text>
      </View>

      <View style={styles.analyticsGrid}>
        <View
          style={[
            styles.analyticsSmallCard,
            { backgroundColor: currentTheme.cardBackground },
          ]}
        >
          <Text
            style={[styles.analyticsLabel, { color: currentTheme.textLight }]}
          >
            Pending
          </Text>
          <Text style={[styles.analyticsValue, { color: "#f59e0b" }]}>
            {stats?.stats?.pendingOrders || 0}
          </Text>
        </View>
        <View
          style={[
            styles.analyticsSmallCard,
            { backgroundColor: currentTheme.cardBackground },
          ]}
        >
          <Text
            style={[styles.analyticsLabel, { color: currentTheme.textLight }]}
          >
            Delivered
          </Text>
          <Text style={[styles.analyticsValue, { color: "#3b82f6" }]}>
            {(stats?.stats?.totalOrders || 0) -
              (stats?.stats?.pendingOrders || 0)}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.analyticsCard,
          { backgroundColor: currentTheme.cardBackground },
        ]}
      >
        <Text
          style={[styles.analyticsLabel, { color: currentTheme.textLight }]}
        >
          Average Order Value
        </Text>
        <Text style={[styles.analyticsBigValue, { color: "#8b5cf6" }]}>
          ₹
          {stats?.stats?.totalSales && stats?.stats?.totalOrders
            ? (stats.stats.totalSales / stats.stats.totalOrders).toFixed(0)
            : "0"}
        </Text>
      </View>

      <View
        style={[
          styles.analyticsCard,
          { backgroundColor: currentTheme.cardBackground },
        ]}
      >
        <Text
          style={[styles.analyticsLabel, { color: currentTheme.textLight }]}
        >
          📈 Business Summary
        </Text>
        <View style={styles.summaryRow}>
          <Text
            style={{
              color: currentTheme.text,
              marginBottom: SPACING.md,
              fontWeight: "600",
            }}
          >
            📋 Total Orders: {stats?.stats?.totalOrders || 0}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text
            style={{
              color: currentTheme.text,
              marginBottom: SPACING.md,
              fontWeight: "600",
            }}
          >
            👥 Total Customers: {stats?.stats?.totalCustomers || 0}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={{ color: currentTheme.text, fontWeight: "600" }}>
            📦 Total Products: {stats?.stats?.totalProducts || 0}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};
// Dashboard Content Component
const DashboardContent = ({ stats, refetch }) => {
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const statCards = [
    {
      title: "Total Products",
      value: stats?.stats?.totalProducts || 0,
      color: "#3b82f6",
      icon: "📦",
    },
    {
      title: "Total Orders",
      value: stats?.stats?.totalOrders || 0,
      color: "#10b981",
      icon: "📋",
    },
    {
      title: "Pending Orders",
      value: stats?.stats?.pendingOrders || 0,
      color: "#f59e0b",
      icon: "⏳",
    },
    {
      title: "Total Customers",
      value: stats?.stats?.totalCustomers || 0,
      color: "#8b5cf6",
      icon: "👥",
    },
  ];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[currentTheme.primary]}
          tintColor={currentTheme.primary}
        />
      }
    >
      <Text style={[styles.statsTitle, { color: currentTheme.text }]}>
        Overview
      </Text>
      <View style={styles.statsGrid}>
        {statCards.map((stat, index) => (
          <LinearGradient
            key={index}
            colors={[stat.color + "20", stat.color + "05"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.statCard,
              {
                borderColor: stat.color,
                backgroundColor: currentTheme.cardBackground,
              },
            ]}
          >
            <Text style={styles.statIcon}>{stat.icon}</Text>
            <Text style={[styles.statValue, { color: stat.color }]}>
              {stat.value}
            </Text>
            <Text style={[styles.statTitle, { color: currentTheme.textLight }]}>
              {stat.title}
            </Text>
          </LinearGradient>
        ))}
      </View>
    </ScrollView>
  );
};

// Activity Log Content Component
const ActivityLogContent = () => {
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const {
    data: logsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["activityLogs"],
    queryFn: () => activityAPI.getActivityLogs({ limit: 100 }),
    retry: 0,
    staleTime: 60000,
  });

  const logs = logsData?.logs || logsData?.data || [];
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          paddingHorizontal: SPACING.lg,
          paddingVertical: SPACING.md,
          borderBottomWidth: 1,
          borderBottomColor: currentTheme.border,
        }}
      >
        <Text style={[styles.productsTitle, { color: currentTheme.text }]}>
          📜 Activity Logs
        </Text>
        <Text
          style={{
            color: currentTheme.textLight,
            fontSize: FONTS.sizes.sm,
            marginTop: SPACING.sm,
          }}
        >
          Total Activities: {logs.length}
        </Text>
      </View>
      <FlatList
        data={logs}
        keyExtractor={(item, idx) => `${item.id}-${idx}`}
        renderItem={({ item }) => (
          <View
            style={[
              styles.orderCard,
              {
                backgroundColor: currentTheme.cardBackground,
                marginHorizontal: SPACING.lg,
                marginVertical: SPACING.sm,
              },
            ]}
          >
            <Text style={[styles.orderId, { color: currentTheme.text }]}>
              {item.action} • {item.entity_type}
            </Text>
            <Text style={[styles.orderDate, { color: currentTheme.textLight }]}>
              👤 {item.performed_by}
            </Text>
            <Text
              style={{
                color: currentTheme.textLight,
                fontSize: FONTS.sizes.xs,
                marginTop: SPACING.sm,
              }}
            >
              🕐 {formatDate(item.created_at)}
            </Text>
            {item.description && (
              <Text
                style={{
                  color: currentTheme.textLight,
                  fontSize: FONTS.sizes.sm,
                  marginTop: SPACING.sm,
                }}
              >
                {item.description}
              </Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ color: currentTheme.text }}>
              No activity logs yet
            </Text>
          </View>
        }
      />
    </View>
  );
};

// Customer Segments Content Component
const CustomerSegmentsContent = () => {
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const { data: segmentsData, isLoading } = useQuery({
    queryKey: ["customerSegments"],
    queryFn: userAPI.getCustomerSegments,
    retry: 0,
    staleTime: 60000,
  });

  const segments = segmentsData?.segments ||
    segmentsData?.data || [
      {
        id: 1,
        name: "VIP Customers",
        icon: "👑",
        count: 0,
        description: "High-value customers",
      },
      {
        id: 2,
        name: "High Spenders",
        icon: "💰",
        count: 0,
        description: "Top spenders this month",
      },
      {
        id: 3,
        name: "Inactive Customers",
        icon: "😴",
        count: 0,
        description: "No recent orders",
      },
      {
        id: 4,
        name: "New Customers",
        icon: "🆕",
        count: 0,
        description: "Joined recently",
      },
    ];

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          paddingHorizontal: SPACING.lg,
          paddingVertical: SPACING.md,
          borderBottomWidth: 1,
          borderBottomColor: currentTheme.border,
        }}
      >
        <Text style={[styles.productsTitle, { color: currentTheme.text }]}>
          👥 Customer Segments
        </Text>
        <Text
          style={{
            color: currentTheme.textLight,
            fontSize: FONTS.sizes.sm,
            marginTop: SPACING.sm,
          }}
        >
          Manage and view customer segments
        </Text>
      </View>
      <FlatList
        data={segments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.productCard,
              {
                backgroundColor: currentTheme.cardBackground,
                marginHorizontal: SPACING.lg,
                marginVertical: SPACING.sm,
              },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={[styles.productName, { color: currentTheme.text }]}
                >
                  {item.icon} {item.name}
                </Text>
                <Text
                  style={{
                    color: currentTheme.textLight,
                    fontSize: FONTS.sizes.sm,
                  }}
                >
                  {item.description}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: currentTheme.primary + "20",
                  paddingHorizontal: SPACING.md,
                  paddingVertical: SPACING.sm,
                  borderRadius: RADIUS.md,
                }}
              >
                <Text
                  style={{
                    color: currentTheme.primary,
                    fontWeight: "bold",
                    fontSize: FONTS.sizes.md,
                  }}
                >
                  {item.count}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  sidebarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 10,
  },
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    paddingTop: SPACING.lg,
    zIndex: 20,
  },
  sidebarContent: {
    flex: 1,
  },
  logoArea: {
    alignItems: "center",
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
    marginBottom: SPACING.md,
  },
  adminIcon: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  adminIconWrap: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.sm,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  adminName: {
    fontSize: FONTS.sizes.md,
    fontWeight: "700",
    color: COLORS.white,
  },
  adminRole: {
    fontSize: FONTS.sizes.xs,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  menuContainer: {
    marginBottom: SPACING.xl,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    marginHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.xs,
  },
  menuItemActive: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  menuIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  menuIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  menuLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
  },
  menuLabelActive: {
    color: COLORS.white,
    fontWeight: "700",
  },
  logoutMenuButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    marginHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  logoutMenuLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
  },
  mainContent: {
    flex: 1,
    width: width,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  toggleButton: {
    padding: SPACING.md,
    marginRight: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  toggleIcon: {
    fontSize: FONTS.sizes.xl,
    fontWeight: "700",
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: "800",
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: SPACING.lg,
  },
  statsTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: "700",
    marginBottom: SPACING.md,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: SPACING.md,
    width: "100%",
  },
  statCard: {
    width: "47%",
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    ...SHADOWS.small,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: "800",
    marginBottom: SPACING.xs,
  },
  statTitle: {
    fontSize: FONTS.sizes.xs,
    fontWeight: "600",
  },
  actionCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  actionCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: {
    fontSize: 40,
    marginRight: SPACING.md,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  actionSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
  },
  settingsTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  themesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: SPACING.md,
  },
  themeCard: {
    width: "22%",
    alignItems: "center",
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  themeCardActive: {
    ...SHADOWS.medium,
  },
  themeSwatch: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.md,
  },
  themeName: {
    fontSize: FONTS.sizes.sm,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
  },
  // Orders Styles
  ordersTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: "700",
    marginBottom: SPACING.md,
  },
  orderCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  orderId: {
    fontSize: FONTS.sizes.md,
    fontWeight: "700",
    marginBottom: SPACING.xs,
  },
  orderDate: {
    fontSize: FONTS.sizes.xs,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  statusText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: "700",
  },
  orderDetails: {
    gap: SPACING.sm,
  },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderLabel: {
    fontSize: FONTS.sizes.sm,
  },
  orderValue: {
    fontSize: FONTS.sizes.sm,
    fontWeight: "600",
  },
  orderTotal: {
    fontSize: FONTS.sizes.md,
    fontWeight: "700",
  },
  // Products Styles
  productsTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: "700",
    marginBottom: SPACING.md,
  },
  productCard: {
    flexDirection: "row",
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  productImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.md,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  productImageText: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: "700",
    color: "#6b7280",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.md,
    marginRight: SPACING.md,
    backgroundColor: "#e5e7eb",
  },
  productInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  editIconContainer: {
    position: "absolute",
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: RADIUS.sm,
    padding: SPACING.xs,
    ...SHADOWS.small,
  },
  editIcon: {
    fontSize: 18,
  },
  productName: {
    fontSize: FONTS.sizes.md,
    fontWeight: "700",
    marginBottom: SPACING.xs,
  },
  productCategory: {
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.xs,
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    fontSize: FONTS.sizes.lg,
    fontWeight: "700",
  },
  activeIndicator: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  activeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: "600",
    color: COLORS.white,
  },
  emptySubtext: {
    fontSize: FONTS.sizes.sm,
    marginTop: SPACING.xs,
  },
  customersTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: "700",
    marginBottom: SPACING.md,
  },
  customerCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  customerCardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  customerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: "700",
    color: COLORS.white,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: FONTS.sizes.md,
    fontWeight: "700",
    marginBottom: SPACING.xs,
  },
  customerEmail: {
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.xs,
  },
  customerPhone: {
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.xs,
  },
  customerRole: {
    fontSize: FONTS.sizes.xs,
    fontWeight: "600",
    marginTop: SPACING.xs,
  },
  loadingContainer: {
    padding: SPACING.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: FONTS.sizes.md,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: FONTS.sizes.sm,
    marginTop: SPACING.xs,
  },
  retryButton: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: "center",
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: "700",
    marginBottom: SPACING.md,
  },
  placeholderText: {
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  formSkeleton: {
    gap: SPACING.md,
  },
  skeletonInput: {
    height: 45,
    borderRadius: RADIUS.md,
    opacity: 0.5,
  },
  skeletonButton: {
    height: 50,
    borderRadius: RADIUS.md,
    marginTop: SPACING.md,
    opacity: 0.6,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: RADIUS.lg,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  },
  profileAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.lg,
  },
  avatarLetter: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: "700",
    color: COLORS.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: "700",
    marginBottom: SPACING.xs,
  },
  profileRole: {
    fontSize: FONTS.sizes.sm,
    fontWeight: "600",
  },
  profileCard: {
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: RADIUS.lg,
    ...SHADOWS.small,
  },
  profileLabel: {
    fontSize: FONTS.sizes.xs,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: SPACING.xs,
    letterSpacing: 0.5,
  },
  profileValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: "600",
  },
  editButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
  },
  // Analytics Styles
  analyticsTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: "800",
    marginBottom: SPACING.lg,
    marginTop: SPACING.md,
  },
  analyticsCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  analyticsLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: SPACING.sm,
    letterSpacing: 0.5,
  },
  analyticsBigValue: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: "800",
  },
  analyticsValue: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: "700",
  },
  analyticsGrid: {
    flexDirection: "row",
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  analyticsSmallCard: {
    flex: 1,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.small,
    alignItems: "center",
  },
  summaryRow: {
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: SPACING.md,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    maxHeight: "90%",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
  },
  modalCloseButton: {
    alignSelf: "flex-end",
    padding: SPACING.md,
    marginRight: -SPACING.md,
    marginTop: -SPACING.md,
  },
  modalTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: "800",
    marginBottom: SPACING.md,
  },
  customerDetailCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  detailLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: "600",
    maxWidth: "60%",
    textAlign: "right",
  },
  actionButtonUnblock: {
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.small,
  },
  actionButtonBlock: {
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.small,
  },
});

export default AdminDashboardScreen;
