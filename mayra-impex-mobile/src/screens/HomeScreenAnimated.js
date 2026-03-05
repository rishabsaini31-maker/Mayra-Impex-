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
import HeaderAnimated from "../components/HeaderAnimated";
import ProductCardAnimated from "../components/ProductCardAnimated";
import TagItem from "../components/TagItem";
import OrderCard from "../components/OrderCard";
import { SAMPLE_PRODUCTS, RECENT_ORDERS, FEATURE_TAGS } from "../data/mockData";

const HomeScreenAnimated = ({ navigation }) => {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const handleMenuPress = () => {
    console.log("Menu pressed");
  };

  const handleSearchPress = () => {
    navigation.navigate("Search");
  };

  const handleProductPress = (product) => {
    console.log("Product pressed:", product.name);
    // Navigate to product detail
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <HeaderAnimated
        onMenuPress={handleMenuPress}
        onSearchPress={handleSearchPress}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      >
        {/* Product Catalog Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gift Product Catalog</Text>

          <FlatList
            data={SAMPLE_PRODUCTS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <ProductCardAnimated
                product={item}
                index={index}
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

        {/* Order Tracking Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Tracking</Text>

          <View style={styles.ordersContainer}>
            {RECENT_ORDERS.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </View>
        </View>

        {/* Promotional Banner */}
        <View style={styles.promoBanner}>
          <Text style={styles.promoTitle}>Special Offers</Text>
          <Text style={styles.promoText}>Get up to 30% off on bulk orders</Text>
        </View>

        {/* Bottom spacing for navigation */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
  },
  ordersContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  promoBanner: {
    marginHorizontal: 20,
    marginTop: 32,
    marginBottom: 24,
    padding: 24,
    backgroundColor: "#FFF2EB",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#FFE5D6",
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FF8C50",
    marginBottom: 8,
  },
  promoText: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
});

export default HomeScreenAnimated;
