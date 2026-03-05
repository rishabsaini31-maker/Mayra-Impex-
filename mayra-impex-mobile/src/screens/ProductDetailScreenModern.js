import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const ProductDetailScreenModern = ({ route, navigation }) => {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleAddToCart = () => {
    Alert.alert("Success", `Added ${quantity} item(s) to cart`);
  };

  const handleBuyNow = () => {
    Alert.alert("Checkout", `Proceeding to checkout with ${quantity} item(s)`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#FF8C50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity onPress={() => setIsFavorited(!isFavorited)}>
          <Ionicons
            name={isFavorited ? "heart" : "heart-outline"}
            size={28}
            color={isFavorited ? "#FF6B6B" : "#999"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image_url }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>₹{product.price}</Text>
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          <Text style={styles.productName}>{product.name}</Text>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Ionicons
                  key={i}
                  name={i <= 4 ? "star" : "star-outline"}
                  size={16}
                  color="#FFB800"
                />
              ))}
            </View>
            <Text style={styles.ratingText}>(128 reviews)</Text>
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            This is a premium quality gift item perfect for any occasion.
            Beautifully packaged and ready to give. Made with high-quality
            materials and attention to detail.
          </Text>

          {/* Features */}
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#FF8C50" />
              <Text style={styles.featureText}>Premium Quality</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#FF8C50" />
              <Text style={styles.featureText}>Free Shipping</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#FF8C50" />
              <Text style={styles.featureText}>Easy Returns</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#FF8C50" />
              <Text style={styles.featureText}>Gift Wrapped</Text>
            </View>
          </View>

          {/* Quantity Selector */}
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantitySelector}>
            <TouchableOpacity
              onPress={() => quantity > 1 && setQuantity(quantity - 1)}
              style={styles.quantityButton}
            >
              <Ionicons name="remove" size={20} color="#FF8C50" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              onPress={() => setQuantity(quantity + 1)}
              style={styles.quantityButton}
            >
              <Ionicons name="add" size={20} color="#FF8C50" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
          activeOpacity={0.8}
        >
          <Ionicons name="cart" size={20} color="#FF8C50" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buyNowButton}
          onPress={handleBuyNow}
          activeOpacity={0.8}
        >
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 300,
    backgroundColor: "#FFFFFF",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  priceBadge: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#FF8C50",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  priceBadgeText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  infoSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  stars: {
    flexDirection: "row",
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: "#999",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginTop: 20,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
  featuresList: {
    gap: 10,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 12,
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginHorizontal: 16,
  },
  footer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
    flexDirection: "row",
    gap: 12,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: "#FFF5F0",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFE5D6",
  },
  addToCartText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FF8C50",
    marginLeft: 8,
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: "#FF8C50",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buyNowText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default ProductDetailScreenModern;
