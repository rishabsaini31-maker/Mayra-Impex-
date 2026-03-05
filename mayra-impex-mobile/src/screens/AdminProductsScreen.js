import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const AdminProductsScreen = ({ navigation }) => {
  const [products, setProducts] = useState([
    { id: 1, name: "Gift Box 1", price: 499 },
    { id: 2, name: "Gift Box 2", price: 699 },
    { id: 3, name: "Premium Hamper", price: 999 },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");

  const handleAddProduct = () => {
    if (!productName || !productPrice) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const newProduct = {
      id: Math.random(),
      name: productName,
      price: parseFloat(productPrice),
    };

    setProducts([...products, newProduct]);
    setProductName("");
    setProductPrice("");
    setShowForm(false);
    Alert.alert("Success", "Product added successfully");
  };

  const handleDeleteProduct = (id) => {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Delete",
        onPress: () => {
          setProducts(products.filter((p) => p.id !== id));
          Alert.alert("Success", "Product deleted");
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
        <Text style={styles.title}>Manage Products</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content}>
        {!showForm && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowForm(true)}
          >
            <Ionicons name="add-circle" size={24} color="#FFF" />
            <Text style={styles.addButtonText}>Add New Product</Text>
          </TouchableOpacity>
        )}

        {showForm && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Add Product</Text>
            <TextInput
              style={styles.input}
              placeholder="Product Name"
              value={productName}
              onChangeText={setProductName}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              placeholder="Product Price"
              value={productPrice}
              onChangeText={setProductPrice}
              keyboardType="decimal-pad"
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
                onPress={handleAddProduct}
              >
                <Text style={styles.formButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Text style={styles.listTitle}>Products ({products.length})</Text>
        {products.map((product) => (
          <View key={product.id} style={styles.productItem}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>₹{product.price}</Text>
            </View>
            <View style={styles.productActions}>
              <TouchableOpacity style={styles.editButton}>
                <Ionicons name="pencil" size={18} color="#FF8C50" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteProduct(product.id)}
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
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  productPrice: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  productActions: {
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

export default AdminProductsScreen;
