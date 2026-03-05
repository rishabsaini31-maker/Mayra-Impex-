import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const AdminCategoriesScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Gift Boxes" },
    { id: 2, name: "Hampers" },
    { id: 3, name: "Personalized" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  const handleAddCategory = () => {
    if (!categoryName) {
      Alert.alert("Error", "Please enter category name");
      return;
    }

    const newCategory = {
      id: Math.random(),
      name: categoryName,
    };

    setCategories([...categories, newCategory]);
    setCategoryName("");
    setShowForm(false);
    Alert.alert("Success", "Category added successfully");
  };

  const handleDeleteCategory = (id) => {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Delete",
        onPress: () => {
          setCategories(categories.filter((c) => c.id !== id));
          Alert.alert("Success", "Category deleted");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Manage Categories</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content}>
        {!showForm && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowForm(true)}
          >
            <Ionicons name="add-circle" size={24} color="#FFF" />
            <Text style={styles.addButtonText}>Add New Category</Text>
          </TouchableOpacity>
        )}

        {showForm && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Add Category</Text>
            <TextInput
              style={styles.input}
              placeholder="Category Name"
              value={categoryName}
              onChangeText={setCategoryName}
              placeholderTextColor="#999"
            />
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.formButton, styles.cancelButton]}
                onPress={() => setShowForm(false)}
              >
                <Text style={styles.formButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.formButton, styles.saveButton]}
                onPress={handleAddCategory}
              >
                <Text style={styles.formButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Text style={styles.listTitle}>Categories ({categories.length})</Text>
        {categories.map((category) => (
          <View key={category.id} style={styles.categoryItem}>
            <View style={styles.categoryInfo}>
              <Ionicons name="folder" size={20} color="#FF8C50" />
              <Text style={styles.categoryName}>{category.name}</Text>
            </View>
            <View style={styles.categoryActions}>
              <TouchableOpacity style={styles.editButton}>
                <Ionicons name="pencil" size={18} color="#FF8C50" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteCategory(category.id)}
              >
                <Ionicons name="trash" size={18} color="#FF0000" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#FF8C50",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  formContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
    color: "#333",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
  },
  formButton: {
    flex: 1,
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#DDD",
  },
  saveButton: {
    backgroundColor: "#FF8C50",
  },
  formButtonText: {
    fontWeight: "600",
    color: "#FFF",
  },
  listTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 12,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
  },
  categoryInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginLeft: 12,
  },
  categoryActions: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    padding: 6,
  },
  deleteButton: {
    padding: 6,
  },
});

export default AdminCategoriesScreen;
