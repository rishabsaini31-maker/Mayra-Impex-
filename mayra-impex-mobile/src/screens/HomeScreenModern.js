import React from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  StatusBar,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import ProductCardModern from "../components/ProductCardModern";
import TagItem from "../components/TagItem";
import CategoryCard from "../components/CategoryCard";
import HeroBanner from "../components/HeroBanner";

// Sample product data
const SAMPLE_PRODUCTS = [
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
];

// Categories
const CATEGORIES = [
  { id: 1, name: "Gift Boxes", icon: "gift" },
  { id: 2, name: "Hampers", icon: "basket" },
  { id: 3, name: "Corporate", icon: "briefcase" },
  { id: 4, name: "Festival", icon: "star" },
  { id: 5, name: "Wedding", icon: "heart" },
];

// Feature tags
const FEATURE_TAGS = [
  { id: 1, label: "Carbon tone", color: "#8B7355" },
  { id: 2, label: "Lack aromatics", color: "#FF8C50" },
  { id: 3, label: "Click nut community", color: "#D4A574" },
  { id: 4, label: "Soft blush", color: "#FFB5A7" },
];

const HomeScreenModern = ({ navigation }) => {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const handleSearchPress = () => {
    // Navigate to search screen
    navigation.navigate("Search");
  };

  const handleProductPress = (product) => {
    console.log("Product pressed:", product.name);
    navigation.navigate("ProductDetail", { product });
  };

  const handleCategoryPress = (category) => {
    console.log("Category pressed:", category.name);
    // Navigate to category products
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <SafeAreaView style={styles.safeArea}>
        <Header onSearchPress={handleSearchPress} />
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Banner */}
        <HeroBanner />

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>

          <FlatList
            data={CATEGORIES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <CategoryCard
                category={item}
                onPress={() => handleCategoryPress(item)}
              />
            )}
            contentContainerStyle={styles.categoryList}
          />
        </View>

        {/* Product Catalog Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gift Product Catalog</Text>

          <FlatList
            data={SAMPLE_PRODUCTS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ProductCardModern
                product={item}
                onPress={() => handleProductPress(item)}
              />
            )}
            contentContainerStyle={styles.productList}
          />
        </View>

        {/* Feature Tags Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium Features</Text>

          <View style={styles.tagsContainer}>
            {FEATURE_TAGS.map((tag) => (
              <TagItem key={tag.id} label={tag.label} color={tag.color} />
            ))}
          </View>
        </View>

        {/* Featured Products Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Products</Text>

          <FlatList
            data={SAMPLE_PRODUCTS.slice(0, 4)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ProductCardModern
                product={item}
                onPress={() => handleProductPress(item)}
              />
            )}
            contentContainerStyle={styles.productList}
          />
        </View>

        {/* Bottom spacing for navigation */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  safeArea: {
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  section: {
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
    marginHorizontal: 20,
    letterSpacing: 0.3,
  },
  productList: {
    paddingHorizontal: 20,
  },
  categoryList: {
    paddingHorizontal: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
  },
});

export default HomeScreenModern;
