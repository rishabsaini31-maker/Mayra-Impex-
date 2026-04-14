import React, { useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, FONTS, SPACING, RADIUS } from "../../constants";

const ProductCard = ({
  product,
  onPress,
  onAddToCart,
  showAddButton = true,
  minOrderQty = 5,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.95}
      >
        <View style={styles.imageContainer}>
          <Image
            source={
              product.image_url
                ? { uri: product.image_url }
                : { uri: "https://via.placeholder.com/300x300?text=Product" }
            }
            style={styles.image}
            resizeMode="cover"
          />

          {/* Gradient overlay */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.05)"]}
            style={styles.imageGradient}
          />

          {!product.is_active && (
            <View style={styles.inactiveBadge}>
              <Text style={styles.inactiveBadgeText}>⚠️ Unavailable</Text>
            </View>
          )}

          {product.is_active !== false && (
            <LinearGradient
              colors={["#FFD700", "#FFC300"]} // Gold gradient
              style={styles.minOrderBadge}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text
                style={[
                  styles.minOrderText,
                  { color: "#7a5c00", fontWeight: "bold" },
                ]}
              >
                ✨ Min. {minOrderQty} pcs
              </Text>
            </LinearGradient>
          )}

          {/* Premium badge for high-value items */}
          {product.price > 1000 && product.is_active !== false && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>💎</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>

          {product.description && (
            <Text style={styles.description} numberOfLines={1}>
              {product.description}
            </Text>
          )}

          {product.serial_number && (
            <Text style={styles.sku}>SKU: {product.serial_number}</Text>
          )}

          <View style={styles.footer}>
            <View style={styles.priceInfoWrap}>
              <View style={styles.priceContainer}>
                <Text style={styles.currency}>₹</Text>
                <Text style={styles.price}>{product.price.toFixed(0)}</Text>
                <Text style={styles.perUnit}>/pc</Text>
              </View>
              {/* Bulk discount hint */}
              <Text style={styles.bulkHint}>💰 Best prices for bulk</Text>
            </View>
          </View>

          {showAddButton && product.is_active !== false && (
            <TouchableOpacity
              style={styles.addButtonWrapper}
              onPress={onAddToCart}
              activeOpacity={0.8}
            >
              <View style={styles.addButton}>
                <Text style={styles.addText}>Add to Cart</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB", // subtle gray border
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    paddingBottom: SPACING.md,
  },
  imageContainer: {
    position: "relative",
    backgroundColor: COLORS.lightGray,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 180,
  },
  imageGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
  },
  content: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
  },
  name: {
    fontSize: FONTS.sizes.md,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.xs,
    minHeight: 40,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  description: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
    lineHeight: 16,
  },
  sku: {
    fontSize: 11,
    color: COLORS.mediumGray,
    marginBottom: SPACING.sm,
    fontFamily: "monospace",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: SPACING.sm,
  },
  priceInfoWrap: {
    flex: 1,
    minWidth: 0,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  currency: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.black,
    marginRight: 2,
    marginTop: 2,
  },
  price: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.black,
    letterSpacing: -0.5,
  },
  perUnit: {
    fontSize: FONTS.sizes.xs,
    fontWeight: "600",
    color: COLORS.textLight,
    marginLeft: 2,
    marginTop: 8,
  },
  bulkHint: {
    fontSize: 10,
    color: COLORS.success,
    marginTop: 2,
    fontWeight: "600",
  },
  addButtonWrapper: {
    marginTop: SPACING.md,
    width: "100%",
  },
  addButton: {
    width: "100%",
    height: 46,
    borderRadius: 14,
    paddingHorizontal: SPACING.md,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111", // solid black
    borderWidth: 1,
    borderColor: "#222",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  addText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  inactiveBadge: {
    position: "absolute",
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.error,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  inactiveBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  minOrderBadge: {
    position: "absolute",
    top: SPACING.sm,
    left: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    shadowColor: COLORS.info, // Blue shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },
  minOrderText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  premiumBadge: {
    position: "absolute",
    top: SPACING.sm,
    right: SPACING.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  premiumText: {
    fontSize: 16,
  },
});

export default ProductCard;
