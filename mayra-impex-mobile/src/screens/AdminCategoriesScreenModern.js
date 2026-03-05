import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const ICON_OPTIONS = ["gift", "basket", "briefcase", "star", "heart", "cube"];

const AdminCategoriesScreenModern = ({ navigation }) => {
  const [categoryName, setCategoryName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("gift");
  const [categories, setCategories] = useState([
    { id: 1, name: "Gift Boxes", icon: "gift" },
    { id: 2, name: "Hampers", icon: "basket" },
  ]);

  const handleAddCategory = async () => {
    if (!categoryName) {
      Alert.alert("Error", "Please enter category name");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: categoryName,
            icon: selectedIcon,
          }),
        },
      );

      if (response.ok) {
        const newCategory = await response.json();
        setCategories([...categories, newCategory]);
        Alert.alert("Success", "Category added successfully!");
        setCategoryName("");
        setSelectedIcon("gift");
      } else {
        Alert.alert("Error", "Failed to add category");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleDeleteCategory = (id) => {
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category?",
      [
        { text: "Cancel", onPress: () => null },
        {
          text: "Delete",
          onPress: () => {
            setCategories(categories.filter((cat) => cat.id !== id));
            Alert.alert("Success", "Category deleted");
          },
          style: "destructive",
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#FF8C50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Categories</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add New Category</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter category name"
              value={categoryName}
              onChangeText={setCategoryName}
              placeholderTextColor="#CCC"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Select Icon</Text>
            <View style={styles.iconGrid}>
              {ICON_OPTIONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconOption,
                    selectedIcon === icon && styles.iconOptionSelected,
                  ]}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Ionicons
                    name={icon}
                    size={24}
                    color={selectedIcon === icon ? "#FF8C50" : "#DDD"}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleAddCategory}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Add Category</Text>
          </TouchableOpacity>
        </View>

        {/* Existing Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Existing Categories</Text>

          {categories.length === 0 ? (
            <Text style={styles.emptyText}>No categories yet</Text>
          ) : (
            <FlatList
              data={categories}
              scrollEnabled={false}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.categoryItem}>
                  <View style={styles.categoryInfo}>
                    <Ionicons name={item.icon} size={24} color="#FF8C50" />
                    <Text style={styles.categoryName}>{item.name}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteCategory(item.id)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash" size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
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
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
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
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  iconOption: {
    width: "30%",
    aspectRatio: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#F0F0F0",
  },
  iconOptionSelected: {
    borderColor: "#FF8C50",
    backgroundColor: "#FFF5F0",
  },
  submitButton: {
    backgroundColor: "#FF8C50",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  categoryItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 12,
  },
  deleteButton: {
    padding: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginVertical: 16,
  },
});

export default AdminCategoriesScreenModern;
