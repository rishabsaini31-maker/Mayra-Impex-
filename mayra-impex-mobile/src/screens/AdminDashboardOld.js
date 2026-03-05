import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  TextInput,
  Modal,
  Dimensions,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const API_URL = "http://10.47.11.159:5001/api";

const AdminDashboardOld = ({ navigation, onLogout }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    sku: "",
    image: null,
    imageUri: null,
  });
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });

  // Pick Image
  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setNewProduct({ ...newProduct, imageUri });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  // Reset Product Form
  const resetProductForm = () => {
    setNewProduct({
      name: "",
      description: "",
      price: "",
      category_id: "",
      sku: "",
      image: null,
      imageUri: null,
    });
  };

  // Handle Logout
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Logout",
        onPress: () => {
          if (onLogout) onLogout();
        },
        style: "destructive",
      },
    ]);
  };

  // Fetch data from API
  useEffect(() => {
    const getTokenAndFetchData = async () => {
      try {
        const AsyncStorage =
          require("@react-native-async-storage/async-storage").default;
        const storedToken = await AsyncStorage.getItem("userToken");
        const userRole = await AsyncStorage.getItem("userRole");

        if (storedToken) {
          console.log("Token found, role:", userRole);
          setToken(storedToken);
          // Add small delay to prevent rate limiting
          setTimeout(() => fetchAllData(storedToken), 500);
        } else {
          console.warn("No token found");
          setLoading(false);
        }
      } catch (err) {
        console.warn("Failed to get token:", err);
        setLoading(false);
      }
    };
    getTokenAndFetchData();
  }, []);

  const fetchAllData = async (authToken) => {
    if (!authToken) {
      console.warn("No auth token provided");
      return;
    }
    setLoading(true);
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      };

      // Fetch products
      const productsRes = await fetch(`${API_URL}/products`, { headers });
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        const productsArray = Array.isArray(productsData) ? productsData : [];
        setProducts(productsArray);
        setStats((prev) => ({ ...prev, totalProducts: productsArray.length }));
      } else {
        setProducts([]);
        console.warn("Failed to fetch products:", productsRes.status);
      }

      // Add delay between requests
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Fetch orders - use /orders/all endpoint with admin token
      const ordersRes = await fetch(`${API_URL}/orders/all`, { headers });
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        const ordersArray = Array.isArray(ordersData) ? ordersData : [];
        setOrders(ordersArray);
        setStats((prev) => ({
          ...prev,
          totalOrders: ordersArray.length,
          totalRevenue: ordersArray.reduce(
            (sum, o) => sum + (o.total || o.amount || 0),
            0,
          ),
        }));
      } else {
        setOrders([]);
        console.warn(
          "Failed to fetch orders:",
          ordersRes.status,
          ordersRes.statusText,
        );
      }

      // Add delay between requests
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Fetch categories
      try {
        const categoriesRes = await fetch(`${API_URL}/categories`, { headers });
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          const categoriesArray = Array.isArray(categoriesData)
            ? categoriesData
            : [];
          setCategories(categoriesArray);
        } else {
          setCategories([]);
          console.warn("Failed to fetch categories:", categoriesRes.status);
        }
      } catch (categoryError) {
        console.warn("Error fetching categories:", categoryError);
        setCategories([]);
      }

      // Add delay between requests
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Fetch customers - try /customers first, then /auth/customers
      let customersRes = await fetch(`${API_URL}/customers`, { headers });
      if (customersRes.status === 404) {
        console.log("Trying /auth/customers endpoint...");
        customersRes = await fetch(`${API_URL}/auth/customers`, { headers });
      }

      if (customersRes.ok) {
        const customersData = await customersRes.json();
        const customersArray = Array.isArray(customersData)
          ? customersData
          : [];
        setCustomers(customersArray);
        setStats((prev) => ({
          ...prev,
          totalCustomers: customersArray.length,
        }));
      } else {
        setCustomers([]);
        console.warn(
          "Failed to fetch customers:",
          customersRes.status,
          customersRes.statusText,
        );
      }

      // Add delay between requests
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Fetch banners
      try {
        const bannersRes = await fetch(`${API_URL}/banners`, { headers });
        if (bannersRes.ok) {
          const bannersData = await bannersRes.json();
          const bannersArray = Array.isArray(bannersData) ? bannersData : [];
          setBanners(bannersArray);
        } else {
          setBanners([]);
          console.warn("Failed to fetch banners:", bannersRes.status);
        }
      } catch (bannerError) {
        console.warn("Error fetching banners:", bannerError);
        setBanners([]);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      // Set defaults on error
      setProducts([]);
      setOrders([]);
      setCustomers([]);
      setCategories([]);
      setBanners([]);
    }
    setLoading(false);
  };

  const statsArray = [
    { label: "Total Orders", value: stats.totalOrders, icon: "receipt" },
    { label: "Total Revenue", value: `₹${stats.totalRevenue}`, icon: "cash" },
    { label: "Total Customers", value: stats.totalCustomers, icon: "people" },
    { label: "Active Products", value: stats.totalProducts, icon: "cube" },
  ];

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "grid" },
    { id: "analytics", label: "Analytics", icon: "bar-chart" },
    { id: "customers", label: "Customers", icon: "people" },
    { id: "products", label: "Products", icon: "cube" },
    { id: "categories", label: "Categories", icon: "list" },
    { id: "orders", label: "Orders", icon: "receipt" },
    { id: "inventory", label: "Inventory", icon: "layers" },
    { id: "banners", label: "Banners", icon: "image" },
  ];

  // Add Product
  const handleAddProduct = async () => {
    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.category_id ||
      !newProduct.sku
    ) {
      Alert.alert(
        "Error",
        "Please fill all required fields (Name, Price, Category, SKU)",
      );
      return;
    }

    if (!token) {
      Alert.alert("Error", "Not authenticated");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("price", parseFloat(newProduct.price));
      formData.append("category_id", newProduct.category_id);
      formData.append("sku", newProduct.sku);

      if (newProduct.imageUri) {
        formData.append("image", {
          uri: newProduct.imageUri,
          type: "image/jpeg",
          name: `product-${Date.now()}.jpg`,
        });
      }

      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        Alert.alert("Success", "Product added successfully");
        setModalVisible(false);
        resetProductForm();
        setTimeout(() => fetchAllData(token), 500);
      } else {
        Alert.alert("Error", `Failed to add: ${res.status}`);
      }
    } catch (error) {
      Alert.alert("Error", `Add failed: ${error.message}`);
    }
  };

  // Update Product
  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    if (!token) {
      Alert.alert("Error", "Not authenticated");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", editingProduct.name);
      formData.append("description", editingProduct.description || "");
      formData.append("price", parseFloat(editingProduct.price || 0));
      formData.append("category_id", editingProduct.category_id || "");
      formData.append("sku", editingProduct.sku || "");

      if (editingProduct.imageUri) {
        formData.append("image", {
          uri: editingProduct.imageUri,
          type: "image/jpeg",
          name: `product-${Date.now()}.jpg`,
        });
      }

      const res = await fetch(`${API_URL}/products/${editingProduct.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        Alert.alert("Success", "Product updated successfully");
        setEditingProduct(null);
        setModalVisible(false);
        setTimeout(() => fetchAllData(token), 500);
      } else {
        Alert.alert("Error", `Failed to update: ${res.status}`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update product");
    }
  };

  // Delete Product
  const handleDeleteProduct = (productId) => {
    Alert.alert("Delete Product", "Are you sure?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Delete",
        onPress: async () => {
          try {
            if (!token) {
              Alert.alert("Error", "Not authenticated");
              return;
            }
            const res = await fetch(`${API_URL}/products/${productId}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });

            if (res.ok) {
              Alert.alert("Success", "Product deleted successfully");
              // Refresh data with delay
              setTimeout(() => fetchAllData(token), 500);
            } else {
              Alert.alert("Error", `Failed to delete: ${res.status}`);
            }
          } catch (error) {
            Alert.alert("Error", `Delete failed: ${error.message}`);
          }
        },
        style: "destructive",
      },
    ]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab stats={statsArray} />;
      case "analytics":
        return <AnalyticsTab stats={stats} orders={orders} />;
      case "customers":
        return <CustomersTab customers={customers} navigation={navigation} />;
      case "products":
        return (
          <ProductsTab
            products={products}
            onEdit={(product) => {
              setEditingProduct(product);
              setModalVisible(true);
            }}
            onDelete={handleDeleteProduct}
            onAdd={() => {
              setEditingProduct(null);
              setNewProduct({
                name: "",
                description: "",
                price: "",
              });
              setModalVisible(true);
            }}
          />
        );
      case "categories":
        return (
          <CategoriesTab
            categories={categories}
            token={token}
            onRefresh={() => fetchAllData(token)}
            navigation={navigation}
          />
        );
      case "orders":
        return <OrdersTab orders={orders} navigation={navigation} />;
      case "inventory":
        return <InventoryTab products={products} navigation={navigation} />;
      case "banners":
        return <BannersTab banners={banners} navigation={navigation} />;
      default:
        return <DashboardTab stats={statsArray} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuToggle}
          onPress={() => setSidebarVisible(!sidebarVisible)}
        >
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Mayra Impex</Text>
          <Text style={styles.headerSubtitle}>Admin Panel</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color="#FF0000" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Sidebar Menu - Overlay */}
        {sidebarVisible && (
          <View style={styles.sidebarOverlay}>
            <View style={styles.sidebar}>
              <TouchableOpacity
                style={styles.closeSidebarButton}
                onPress={() => setSidebarVisible(false)}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
              <ScrollView showsVerticalScrollIndicator={false}>
                {menuItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.menuItem,
                      activeTab === item.id && styles.menuItemActive,
                    ]}
                    onPress={() => {
                      setActiveTab(item.id);
                      setSidebarVisible(false);
                    }}
                  >
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={activeTab === item.id ? "#FF8C50" : "#333"}
                    />
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
              </ScrollView>
            </View>
          </View>
        )}

        {/* Main Content */}
        <View style={styles.mainContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderContent()}
          </ScrollView>
        </View>
      </View>

      {/* Product Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingProduct ? "Edit Product" : "Add Product"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <TextInput
                style={styles.input}
                placeholder="Product Name"
                value={editingProduct ? editingProduct.name : newProduct.name}
                onChangeText={(text) =>
                  editingProduct
                    ? setEditingProduct({ ...editingProduct, name: text })
                    : setNewProduct({ ...newProduct, name: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Description"
                value={
                  editingProduct
                    ? editingProduct.description || ""
                    : newProduct.description
                }
                multiline
                onChangeText={(text) =>
                  editingProduct
                    ? setEditingProduct({
                        ...editingProduct,
                        description: text,
                      })
                    : setNewProduct({ ...newProduct, description: text })
                }
              />

              {/* Category Selection */}
              <Text style={styles.inputLabel}>Category *</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScrollContainer}
              >
                {categories.map((category) => {
                  const isSelected = editingProduct
                    ? editingProduct.category_id === category.id
                    : newProduct.category_id === category.id;
                  return (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryChip,
                        isSelected && styles.categoryChipSelected,
                      ]}
                      onPress={() =>
                        editingProduct
                          ? setEditingProduct({
                              ...editingProduct,
                              category_id: category.id,
                            })
                          : setNewProduct({
                              ...newProduct,
                              category_id: category.id,
                            })
                      }
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          isSelected && styles.categoryChipTextSelected,
                        ]}
                      >
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              {categories.length === 0 && (
                <Text style={styles.noCategoriesText}>
                  No categories found. Please add categories first.
                </Text>
              )}

              <TextInput
                style={styles.input}
                placeholder="Price"
                keyboardType="numeric"
                value={
                  editingProduct
                    ? editingProduct.price?.toString()
                    : newProduct.price
                }
                onChangeText={(text) =>
                  editingProduct
                    ? setEditingProduct({ ...editingProduct, price: text })
                    : setNewProduct({ ...newProduct, price: text })
                }
              />

              <TextInput
                style={styles.input}
                placeholder="SKU (Required)"
                value={
                  editingProduct ? editingProduct.sku || "" : newProduct.sku
                }
                onChangeText={(text) =>
                  editingProduct
                    ? setEditingProduct({ ...editingProduct, sku: text })
                    : setNewProduct({ ...newProduct, sku: text })
                }
              />

              {/* Image Preview */}
              {(editingProduct?.imageUri || newProduct.imageUri) && (
                <View style={styles.imagePreviewContainer}>
                  <Image
                    source={{
                      uri: editingProduct?.imageUri || newProduct.imageUri,
                    }}
                    style={styles.imagePreview}
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() =>
                      editingProduct
                        ? setEditingProduct({
                            ...editingProduct,
                            imageUri: null,
                          })
                        : setNewProduct({ ...newProduct, imageUri: null })
                    }
                  >
                    <Ionicons name="close-circle" size={24} color="#FF0000" />
                  </TouchableOpacity>
                </View>
              )}

              {/* Image Upload Button */}
              <TouchableOpacity
                style={styles.imageUploadButton}
                onPress={handlePickImage}
              >
                <Ionicons name="image" size={20} color="#FFF" />
                <Text style={styles.imageUploadButtonText}>
                  {editingProduct?.imageUri || newProduct.imageUri
                    ? "Change Image"
                    : "Upload Image"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={
                  editingProduct ? handleUpdateProduct : handleAddProduct
                }
              >
                <Text style={styles.submitButtonText}>
                  {editingProduct ? "Update Product" : "Add Product"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

// Dashboard Tab
const DashboardTab = ({ stats }) => (
  <View style={styles.tabContent}>
    <Text style={styles.tabTitle}>Dashboard Overview</Text>
    <View style={styles.statsGrid}>
      {stats.map((stat, idx) => (
        <View key={idx} style={styles.statCard}>
          <Ionicons name={stat.icon} size={32} color="#FF8C50" />
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
        </View>
      ))}
    </View>
  </View>
);

// Customers Tab
const CustomersTab = ({ customers = [] }) => {
  // Ensure customers is always an array
  const customersList = Array.isArray(customers) ? customers : [];

  return (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Manage Customers</Text>
      </View>

      {customersList.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="people" size={48} color="#CCC" />
          <Text style={styles.emptyStateText}>No customers yet</Text>
        </View>
      ) : (
        customersList.map((customer) => (
          <View key={customer.id} style={styles.listItem}>
            <View style={styles.listItemContent}>
              <Text style={styles.listItemTitle}>{customer.name || "N/A"}</Text>
              <Text style={styles.listItemSubtext}>
                {customer.email || "N/A"}
              </Text>
              <Text
                style={[
                  styles.listItemStatus,
                  customer.status === "active" && styles.statusActive,
                  customer.status === "blocked" && styles.statusBlocked,
                ]}
              >
                {(customer.status || "active").toUpperCase()}
              </Text>
            </View>
            <View style={styles.listItemActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="trash" size={18} color="#FF0000" />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  );
};

// Products Tab
const ProductsTab = ({ products = [], onEdit, onDelete, onAdd }) => {
  // Ensure products is always an array
  const productsList = Array.isArray(products) ? products : [];

  return (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Manage Products</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAdd}>
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {productsList.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="cube" size={48} color="#CCC" />
          <Text style={styles.emptyStateText}>No products yet</Text>
        </View>
      ) : (
        productsList.map((product) => (
          <View key={product.id} style={styles.listItem}>
            <View style={styles.listItemContent}>
              <Text style={styles.listItemTitle}>{product.name || "N/A"}</Text>
              <View style={styles.productInfo}>
                <Text style={styles.productPrice}>₹{product.price || "0"}</Text>
                <Text
                  style={[
                    styles.productStock,
                    parseInt(product.stock || 0) === 0 && styles.stockZero,
                  ]}
                >
                  Stock: {product.stock || "0"}
                </Text>
              </View>
            </View>
            <View style={styles.listItemActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onEdit(product)}
              >
                <Ionicons name="pencil" size={18} color="#FF8C50" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onDelete(product.id)}
              >
                <Ionicons name="trash" size={18} color="#FF0000" />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  );
};

// Analytics Tab
const AnalyticsTab = ({ stats, orders = [] }) => {
  // Ensure orders is always an array
  const ordersList = Array.isArray(orders) ? orders : [];
  const monthlyRevenue = [
    { month: "Jan", revenue: 45000 },
    { month: "Feb", revenue: 52000 },
    { month: "Mar", revenue: 48000 },
    { month: "Apr", revenue: 61000 },
    { month: "May", revenue: 55000 },
  ];

  const orderStatus = {
    pending: ordersList.filter((o) => o.status === "pending").length,
    approved: ordersList.filter((o) => o.status === "approved").length,
    delivered: ordersList.filter((o) => o.status === "delivered").length,
  };

  return (
    <View style={styles.analyticsContainer}>
      <Text style={styles.analyticsTitle}>Sales Analytics</Text>

      {/* Key Metrics */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Total Revenue</Text>
          <Text style={styles.metricValue}>₹{stats.totalRevenue}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Total Orders</Text>
          <Text style={styles.metricValue}>{stats.totalOrders}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Total Customers</Text>
          <Text style={styles.metricValue}>{stats.totalCustomers}</Text>
        </View>
      </View>

      {/* Order Status Breakdown */}
      <View style={styles.analyticsSection}>
        <Text style={styles.sectionTitle}>Order Status Distribution</Text>
        <View style={styles.statusBreakdown}>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: "#FFF3E0" }]} />
            <Text style={styles.statusLabel}>
              Pending: {orderStatus.pending}
            </Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: "#E8F5E9" }]} />
            <Text style={styles.statusLabel}>
              Approved: {orderStatus.approved}
            </Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: "#E3F2FD" }]} />
            <Text style={styles.statusLabel}>
              Delivered: {orderStatus.delivered}
            </Text>
          </View>
        </View>
      </View>

      {/* Monthly Revenue */}
      <View style={styles.analyticsSection}>
        <Text style={styles.sectionTitle}>Monthly Revenue Trend</Text>
        {monthlyRevenue.map((item, idx) => {
          const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue));
          const percentage = (item.revenue / maxRevenue) * 100;

          return (
            <View key={idx} style={styles.revenueItem}>
              <Text style={styles.revenueMonth}>{item.month}</Text>
              <View style={styles.revenueBarContainer}>
                <View
                  style={[styles.revenueBar, { width: `${percentage}%` }]}
                />
              </View>
              <Text style={styles.revenueAmount}>₹{item.revenue}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

// Categories Tab
const CategoriesTab = ({ categories = [], token, onRefresh, navigation }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Ensure categories is always an array
  const categoriesList = Array.isArray(categories) ? categories : [];

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert("Error", "Category name is required");
      return;
    }

    if (!token) {
      Alert.alert("Error", "Not authenticated");
      return;
    }

    setIsAdding(true);
    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Success", "Category added successfully");
        setShowAddModal(false);
        setNewCategoryName("");
        if (onRefresh) onRefresh();
      } else {
        Alert.alert("Error", data.error || "Failed to add category");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to add category");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
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
              const res = await fetch(`${API_URL}/categories/${categoryId}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              });

              if (res.ok) {
                Alert.alert("Success", "Category deleted successfully");
                if (onRefresh) onRefresh();
              } else {
                const data = await res.json();
                Alert.alert("Error", data.error || "Failed to delete category");
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete category");
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Manage Categories</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {categoriesList.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="list" size={48} color="#CCC" />
          <Text style={styles.emptyStateText}>No categories yet</Text>
        </View>
      ) : (
        categoriesList.map((category) => (
          <View key={category.id} style={styles.listItem}>
            <View style={styles.listItemContent}>
              <Text style={styles.listItemTitle}>{category.name}</Text>
            </View>
            <View style={styles.listItemActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDeleteCategory(category.id)}
              >
                <Ionicons name="trash" size={18} color="#FF0000" />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      {/* Add Category Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Category</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <TextInput
                style={styles.input}
                placeholder="Category Name"
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                autoFocus
              />

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isAdding && styles.submitButtonDisabled,
                ]}
                onPress={handleAddCategory}
                disabled={isAdding}
              >
                <Text style={styles.submitButtonText}>
                  {isAdding ? "Adding..." : "Add Category"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Orders Tab
const OrdersTab = ({ orders = [] }) => {
  // Ensure orders is always an array
  const ordersList = Array.isArray(orders) ? orders : [];

  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Manage Orders</Text>

      {ordersList.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="receipt" size={48} color="#CCC" />
          <Text style={styles.emptyStateText}>No orders yet</Text>
        </View>
      ) : (
        ordersList.map((order) => (
          <View key={order.id} style={styles.listItem}>
            <View style={styles.listItemContent}>
              <Text style={styles.listItemTitle}>{order.id || "N/A"}</Text>
              <Text style={styles.listItemSubtext}>
                {order.customer_name || order.email || "N/A"}
              </Text>
              <View style={styles.orderInfo}>
                <Text style={styles.orderAmount}>
                  ₹{order.total || order.amount || "0"}
                </Text>
                <Text
                  style={[
                    styles.orderStatus,
                    order.status === "pending" && styles.statusPending,
                    order.status === "approved" && styles.statusApproved,
                    order.status === "delivered" && styles.statusDelivered,
                  ]}
                >
                  {(order.status || "pending").toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={styles.listItemActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="eye" size={18} color="#FF8C50" />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  );
};

// Inventory Tab
const InventoryTab = ({ products = [], navigation }) => (
  <View style={styles.tabContent}>
    <Text style={styles.tabTitle}>Inventory Management</Text>
    {!products || products.length === 0 ? (
      <View style={styles.emptyState}>
        <Ionicons name="layers" size={48} color="#CCC" />
        <Text style={styles.emptyStateText}>No inventory items</Text>
      </View>
    ) : (
      products.map((product) => (
        <View key={product.id} style={styles.listItem}>
          <View style={styles.listItemContent}>
            <Text style={styles.listItemTitle}>{product.name || "N/A"}</Text>
            <View style={styles.productInfo}>
              <Text style={styles.productStock}>
                Stock: {product.stock || "0"}
              </Text>
              <Text style={styles.productPrice}>₹{product.price || "0"}</Text>
            </View>
            {product.description && (
              <Text style={styles.listItemSubtext}>
                {product.description.substring(0, 60)}...
              </Text>
            )}
          </View>
          <View style={styles.listItemActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="pencil" size={18} color="#FF8C50" />
            </TouchableOpacity>
          </View>
        </View>
      ))
    )}
  </View>
);

// Banners Tab
const BannersTab = ({ banners = [], navigation }) => (
  <View style={styles.tabContent}>
    <View style={styles.tabHeader}>
      <Text style={styles.tabTitle}>Manage Banners</Text>
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={20} color="#FFF" />
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
    {!banners || banners.length === 0 ? (
      <View style={styles.emptyState}>
        <Ionicons name="image" size={48} color="#CCC" />
        <Text style={styles.emptyStateText}>No banners yet</Text>
      </View>
    ) : (
      banners.map((banner) => (
        <View key={banner.id} style={styles.bannerCard}>
          <View style={styles.bannerInfo}>
            <Text style={styles.bannerTitle}>{banner.title || "Banner"}</Text>
            <Text style={styles.bannerSubtext}>
              {banner.description || "No description"}
            </Text>
            {banner.image_url && (
              <Text style={styles.bannerImageUrl}>
                Image: {banner.image_url.substring(0, 50)}...
              </Text>
            )}
          </View>
          <View style={styles.listItemActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="pencil" size={18} color="#FF8C50" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="trash" size={18} color="#FF0000" />
            </TouchableOpacity>
          </View>
        </View>
      ))
    )}
  </View>
);

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
    backgroundColor: "#F9F9F9",
  },
  menuToggle: {
    padding: 8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  sidebarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    flexDirection: "row",
  },
  sidebar: {
    width: 200,
    backgroundColor: "#F5F5F5",
    borderRightWidth: 1,
    borderRightColor: "#DDD",
    paddingVertical: 8,
  },
  closeSidebarButton: {
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
  },
  menuItemActive: {
    backgroundColor: "#FFF5F0",
    borderLeftColor: "#FF8C50",
  },
  menuLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 12,
  },
  menuLabelActive: {
    color: "#FF8C50",
    fontWeight: "600",
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tabContent: {
    paddingBottom: 20,
  },
  tabHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  tabTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#FF8C50",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    gap: 4,
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "48%",
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  listItemSubtext: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  listItemStatus: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  statusActive: {
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
  },
  statusBlocked: {
    backgroundColor: "#FFEBEE",
    color: "#C62828",
  },
  statusPending: {
    backgroundColor: "#FFF3E0",
    color: "#E65100",
  },
  statusApproved: {
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
  },
  statusDelivered: {
    backgroundColor: "#E3F2FD",
    color: "#1565C0",
  },
  listItemActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 6,
  },
  productInfo: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
  },
  productPrice: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FF8C50",
  },
  productStock: {
    fontSize: 12,
    color: "#666",
  },
  stockZero: {
    color: "#FF0000",
    fontWeight: "600",
  },
  orderInfo: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
  },
  orderAmount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  orderStatus: {
    fontSize: 11,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bannerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
  },
  bannerInfo: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  bannerSubtext: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  bannerImageUrl: {
    fontSize: 11,
    color: "#666",
    marginTop: 6,
    fontStyle: "italic",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#999",
    marginTop: 12,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalBody: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#FF8C50",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 16,
  },
  submitButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  submitButtonDisabled: {
    backgroundColor: "#CCC",
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    width: "90%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  imageUploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF8C50",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 12,
    gap: 8,
  },
  imageUploadButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
  imagePreviewContainer: {
    position: "relative",
    marginBottom: 12,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 6,
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 4,
  },
  // Analytics Styles
  analyticsContainer: {
    paddingBottom: 20,
  },
  analyticsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    minWidth: "48%",
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 12,
    color: "#999",
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF8C50",
    marginTop: 8,
  },
  analyticsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  statusBreakdown: {
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusLabel: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  revenueItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  revenueMonth: {
    width: 40,
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  revenueBarContainer: {
    flex: 1,
    height: 24,
    backgroundColor: "#EEE",
    borderRadius: 4,
    overflow: "hidden",
  },
  revenueBar: {
    height: "100%",
    backgroundColor: "#FF8C50",
  },
  revenueAmount: {
    width: 70,
    textAlign: "right",
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  // Category Selection Styles
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 4,
  },
  categoryScrollContainer: {
    marginBottom: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDD",
    backgroundColor: "#FFF",
    marginRight: 8,
  },
  categoryChipSelected: {
    backgroundColor: "#FF8C50",
    borderColor: "#FF8C50",
  },
  categoryChipText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  categoryChipTextSelected: {
    color: "#FFF",
    fontWeight: "600",
  },
  noCategoriesText: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
    marginBottom: 12,
    textAlign: "center",
  },
});

export default AdminDashboardOld;
