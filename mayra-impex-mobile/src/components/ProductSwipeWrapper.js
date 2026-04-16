// ProductSwipeWrapper.js

import React, { useRef, useState, useEffect } from "react";
import {
  View,
  FlatList,
  Dimensions,
  Animated,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import ProductDetailScreen from "../screens/customer/ProductDetailScreen";
const { width: screenWidth } = Dimensions.get("window");
const ANIMATION_DURATION = 200;
const ANIMATION_VISIBLE = 800;
const ProductSwipeWrapper = ({ productList = [], initialIndex = 0 }) => {
  // Handle edge cases
  const safeList = Array.isArray(productList) ? productList : [];
  const total = safeList.length;
  // Use normal order for default swipe (LEFT → next, RIGHT → previous)
  const normalList = safeList;
  const startIndex =
    total > 0 ? Math.min(Math.max(initialIndex, 0), total - 1) : 0;
  // Extract category name for animation (support both .category and .categories.name)
  const getCategoryName = (item) => {
    if (!item) return "";
    if (typeof item.category === "string") return item.category;
    if (item.categories && typeof item.categories.name === "string")
      return item.categories.name;
    return "";
  };
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [category, setCategory] = useState(
    total > 0 ? getCategoryName(normalList[startIndex]) : "",
  );
  const [showCategory, setShowCategory] = useState(false);

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const animTimeout = useRef();

  // Show animated category label
  const triggerCategoryAnimation = (newCategory) => {
    setCategory(newCategory);
    setShowCategory(true);
    fadeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.delay(ANIMATION_VISIBLE),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => setShowCategory(false));
  };

  // On swipe end
  const onMomentumScrollEnd = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const idx = Math.round(offsetX / screenWidth);
    if (idx !== currentIndex && idx >= 0 && idx < total) {
      setCurrentIndex(idx);
      const newCategory = getCategoryName(safeList[idx]);
      if (newCategory !== category) {
        triggerCategoryAnimation(newCategory);
      }
    }
  };

  // On mount, show initial category
  useEffect(() => {
    if (total > 0) {
      triggerCategoryAnimation(getCategoryName(normalList[startIndex]));
    }
    // Cleanup animation timeout on unmount
    return () => {
      if (animTimeout.current) clearTimeout(animTimeout.current);
    };
    // eslint-disable-next-line
  }, []);

  // FlatList getItemLayout
  const getItemLayout = (_, index) => ({
    length: screenWidth,
    offset: screenWidth * index,
    index,
  });

  // Render item using the full ProductDetailScreen UI, passing product as route param and dummy navigation
  const renderItem = ({ item }) => (
    <View style={{ width: screenWidth, flex: 1 }}>
      <ProductDetailScreenWrapper product={item} />
    </View>
  );

  // Wrapper to provide route and navigation props to ProductDetailScreen
  function ProductDetailScreenWrapper({ product }) {
    // Dummy navigation with only goBack and navigate
    const navigation = {
      goBack: () => {},
      navigate: () => {},
    };
    const route = { params: { product } };
    return <ProductDetailScreen route={route} navigation={navigation} />;
  }

  // Index indicator
  // Index indicator
  const realIndex = total > 0 ? currentIndex : 0;

  // Handle empty/single product
  if (total === 0) {
    return (
      <View style={styles.centered}>
        <Text>No products available.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Animated Category Label */}
      {showCategory && (
        <Animated.View style={[styles.categoryLabel, { opacity: fadeAnim }]}>
          <Text style={styles.categoryText}>Now viewing {category}</Text>
        </Animated.View>
      )}

      {/* FlatList */}
      <FlatList
        data={normalList}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={startIndex}
        getItemLayout={getItemLayout}
        windowSize={3}
        initialNumToRender={3}
        renderItem={renderItem}
        keyExtractor={(_, idx) => idx.toString()}
        onMomentumScrollEnd={onMomentumScrollEnd}
        extraData={currentIndex}
      />

      {/* Index Indicator - moved to top right */}
      <View style={styles.indexIndicatorTopRight}>
        <Text style={styles.indexText}>
          {realIndex + 1} / {total}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryLabel: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  categoryText: {
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    fontSize: 16,
    overflow: "hidden",
  },
  indexIndicatorTopRight: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    zIndex: 20,
  },
  indexText: {
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 15,
    overflow: "hidden",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProductSwipeWrapper;
