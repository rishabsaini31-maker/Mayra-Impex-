import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const AdminProductsScreenModern = ({ navigation }) => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("");

  const handleAddProduct = async () => {
    if (!productName || !productPrice || !productCategory) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: productName,
            price: parseFloat(productPrice),
            description: productDescription,
            category: productCategory,
          }),
        },
      );

      if (response.ok) {
        Alert.alert("Success", "Product added successfully!");
        setProductName("");
        setProductPrice("");
        setProductDescription("");
        setProductCategory("");
      } else {
        Alert.alert("Error", "Failed to add product");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#FF8C50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Product</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.label}>Product Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter product name"
            value={productName}
            onChangeText={setProductName}
            placeholderTextColor="#CCC"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Price (₹) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter price"
            value={productPrice}
            onChangeText={setProductPrice}
            keyboardType="decimal-pad"
            placeholderTextColor="#CCC"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Category *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Gift Boxes, Hampers, Corporate"
            value={productCategory}
            onChangeText={setProductCategory}
            placeholderTextColor="#CCC"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter product description"
            value={productDescription}
            onChangeText={setProductDescription}
            multiline
            numberOfLines={4}
            placeholderTextColor="#CCC"
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleAddProduct}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>Add Product</Text>
        </TouchableOpacity>

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
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
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
  textArea: {
    paddingVertical: 12,
    textAlignVertical: "top",
    minHeight: 100,
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
});

export default AdminProductsScreenModern;
