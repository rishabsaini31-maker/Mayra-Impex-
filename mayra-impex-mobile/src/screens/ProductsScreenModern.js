import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import ProductCardModern from "../components/ProductCardModern";
import CategoryCard from "../components/CategoryCard";
import HeroBanner from "../components/HeroBanner";

// Categories
const CATEGORIES = [
  { id: 0, name: "All", icon: "grid" },
  { id: 1, name: "Gift Boxes", icon: "gift" },
  { id: 2, name: "Hampers", icon: "basket" },
  { id: 3, name: "Corporate", icon: "briefcase" },
  { id: 4, name: "Festival", icon: "star" },
  { id: 5, name: "Wedding", icon: "heart" },
];

// More products for the Products screen
const ALL_PRODUCTS = [
  {
    id: 1,
    name: "Premium Gift Box",
    price: 1299,
    image_url:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Luxury Hamper",
    price: 2499,
    image_url:
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=300&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Elegant Gift Set",
    price: 1899,
    image_url:
      "https://images.unsplash.com/photo-1549887534-1541e9326642?w=300&h=300&fit=crop",
  },
  {
    id: 4,
    name: "Corporate Gift Pack",
    price: 3499,
    image_url:
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=300&h=300&fit=crop",
  },
  {
    id: 5,
    name: "Festival Special",
    price: 1799,
    image_url:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&h=300&fit=crop",
  },
  {
    id: 6,
    name: "Wedding Gift Box",
    price: 2199,
    image_url:
      "https://images.unsplash.com/photo-1549887534-1541e9326642?w=300&h=300&fit=crop",
  },
  {
    id: 7,
    name: "Birthday Special",
    price: 1599,
    image_url:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&h=300&fit=crop",
  },
  {
    id: 8,
    name: "Anniversary Pack",
    price: 2899,
    image_url:
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=300&h=300&fit=crop",
  },
];

const ProductsScreenModern = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const insets = useSafeAreaInsets();

  const handleProductPress = (product) => {
    console.log("Product pressed:", product.name);
    navigation.navigate("ProductDetail", { product });
  };

  const handleCategoryPress = (category) => {
    console.log("Category pressed:", category.name);
    setSelectedCategory(category.id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top + 12, 20),
            paddingBottom: 16,
          },
        ]}
      >
        <Text style={styles.headerTitle}>Products</Text>
      </View>

      <FlatList
        data={ALL_PRODUCTS}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productWrapper}>
            <ProductCardModern
              product={item}
              onPress={() => handleProductPress(item)}
            />
          </View>
        )}
        ListHeaderComponent={
          <View>
            {/* Hero Banner */}
            <HeroBanner />

            {/* Categories Section */}
            <View style={styles.categoriesSection}>
              <Text style={styles.categoriesTitle}>Categories</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryList}
              >
                {CATEGORIES.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onPress={() => handleCategoryPress(category)}
                  />
                ))}
              </ScrollView>
            </View>

            <Text style={styles.allProductsTitle}>All Products</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FF8C50",
    letterSpacing: 0.5,
  },
  listContent: {
    padding: 10,
    paddingBottom: 100,
  },
  productWrapper: {
    width: "50%",
    padding: 10,
  },
  categoriesSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  categoriesTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D2D2D",
    marginLeft: 20,
    marginBottom: 12,
  },
  categoryList: {
    paddingHorizontal: 20,
  },
  allProductsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D2D2D",
    marginLeft: 20,
    marginTop: 16,
    marginBottom: 8,
  },
});

export default ProductsScreenModern;
