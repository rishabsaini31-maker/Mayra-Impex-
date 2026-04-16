import React from "react";
import { useRoute } from "@react-navigation/native";
import ProductSwipeWrapper from "../../components/ProductSwipeWrapper";

/**
 * This screen wraps ProductSwipeWrapper for navigation.
 * Expects route.params: { productList, initialIndex }
 */
const ProductDetailSwipeScreen = () => {
  const route = useRoute();
  const { productList = [], initialIndex = 0 } = route.params || {};
  return (
    <ProductSwipeWrapper
      productList={productList}
      initialIndex={initialIndex}
    />
  );
};

export default ProductDetailSwipeScreen;
