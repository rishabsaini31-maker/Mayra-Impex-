import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { productAPI, categoryAPI, bannerAPI } from "../../api";
import useCartStore from "../../store/cartStore";
import useAuthStore from "../../store/authStore";
import ProductCard from "../../components/ProductCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import SearchBar from "../../components/SearchBar";
import HeroBanner from "../../components/HeroBanner";
import CategoryCard from "../../components/CategoryCard";
import AppLogo from "../../components/AppLogo";
import CartToast from "../../components/CartToast";
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from "../../constants";

// Icon mapping for categories
const CATEGORY_ICONS = {
  "Birthday Gifts": "🎂",
  "Valentine's Gifts": "💝",
  "Anniversary Gifts": "💍",
  "Corporate Gifts": "💼",
  "Wedding Gifts": "💐",
  "Personalized Gifts": "✨",
  "Luxury Gifts": "👑",
  "Baby Shower Gifts": "👶",
};

const HomeBannerCarousel = ({ sliderImages, width }) => {
  const bannerListRef = useRef(null);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  useEffect(() => {
    if (sliderImages.length <= 1) return;

    const interval = setInterval(() => {
      setActiveBannerIndex((prev) => {
        const next = (prev + 1) % sliderImages.length;
        bannerListRef.current?.scrollTo({
          x: next * width,
          y: 0,
          animated: true,
        });
        return next;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [sliderImages.length, width]);

  return (
    <>
      <ScrollView
        ref={bannerListRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setActiveBannerIndex(index);
        }}
      >
        {sliderImages.map((item, index) => (
          <View
            key={item.id}
            style={{
              width,
              paddingHorizontal: SPACING.lg,
            }}
          >
            <Image
              source={{
                uri: `${item.image_url}${item.image_url.includes("?") ? "&" : "?"}v=${item.id}_${item.created_at || index}`,
              }}
              style={[styles.sliderImage, { width: width - SPACING.lg * 2 }]}
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>
      <View style={styles.sliderDotsRow}>
        {sliderImages.map((img, index) => (
          <View
            key={img.id}
            style={[
              styles.sliderDot,
              index === activeBannerIndex && styles.sliderDotActive,
            ]}
          />
        ))}
      </View>
    </>
  );
};

const HomeScreen = ({ navigation, route }) => {
  const { width } = Dimensions.get("window");
  const isProductsTab =
    route?.name === "Products" || route?.params?.mode === "products";
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const addItem = useCartStore((state) => state.addItem);
  const cartItemsCount = useCartStore((state) => state.getTotalItems());
  const user = useAuthStore((state) => state.user);

  // Fetch categories from API
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryAPI.getAll,
  });

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["products", page, selectedCategoryId],
    queryFn: () =>
      productAPI.getAll({
        page,
        limit: 20,
        is_active: true,
        ...(selectedCategoryId && { category_id: selectedCategoryId }),
      }),
  });

  const { data: bannersData } = useQuery({
    queryKey: ["homeBanners"],
    queryFn: bannerAPI.getAll,
  });

  const sliderImages = (bannersData?.banners || []).slice(0, 8);

  const handleAddToCart = (product) => {
    const minQty = useCartStore.getState().minOrderQuantity;
    addItem(product, minQty);
    setToastMessage(`${minQty} x ${product.name} added to cart`);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 2200);
  };

  const handleProductPress = (product) => {
    navigation.navigate("ProductDetail", { productId: product.id });
  };

  const handleCategoryPress = (category) => {
    // Toggle category selection
    if (selectedCategoryId === category.id) {
      setSelectedCategoryId(null); // Deselect to show all products
    } else {
      setSelectedCategoryId(category.id);
    }
    setPage(1); // Reset to first page when filtering
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      Alert.alert("Search", `Searching for: ${searchQuery}`);
      // TODO: Implement search functionality
    }
  };

  const filteredProducts =
    data?.products?.filter((product) =>
      searchQuery
        ? product.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true,
    ) || [];

  const renderProduct = ({ item }) => (
    <View style={styles.productItem}>
      <ProductCard
        product={item}
        onPress={() => handleProductPress(item)}
        onAddToCart={() => handleAddToCart(item)}
      />
    </View>
  );

  const renderCategory = ({ item }) => {
    const isSelected = selectedCategoryId === item.id;
    const icon = CATEGORY_ICONS[item.name] || "🎁";

    return (
      <CategoryCard
        category={item.name}
        icon={icon}
        onPress={() => handleCategoryPress(item)}
        isSelected={isSelected}
      />
    );
  };

  // Prepare categories with "All" option
  const categories = [
    { id: null, name: "All" },
    ...(categoriesData?.categories || []),
  ];

  const ListHeaderComponent = () => (
    <View>
      {!isProductsTab && (
        <>
          {/* Hero Banner */}
          <HeroBanner
            title="Wholesale Gift Products in Bulk"
            subtitle="Premium Gifts for Every Occasion • Bulk Orders Welcome"
            onPress={() => {}}
          />

          {/* Categories Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Browse by Category</Text>
            <FlatList
              data={categories}
              renderItem={renderCategory}
              keyExtractor={(item) => item.id?.toString() || "all"}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContent}
            />
          </View>

          {/* Sliding Image Panel */}
          <View style={styles.sliderSection}>
            <View style={styles.sliderHeaderRow}>
              <Text style={styles.sliderTitle}>Featured Offers</Text>
              <Text style={styles.sliderCount}>
                {sliderImages.length > 0
                  ? `${sliderImages.length}/8 images`
                  : "Add 4-8 images from Admin"}
              </Text>
            </View>

            {sliderImages.length > 0 ? (
              <HomeBannerCarousel sliderImages={sliderImages} width={width} />
            ) : (
              <View style={styles.sliderPlaceholder}>
                <Text style={styles.sliderPlaceholderText}>
                  No slider images yet. Admin can upload 4-8 images.
                </Text>
              </View>
            )}
          </View>
        </>
      )}

      {/* Products Section */}
      <View style={[styles.section, styles.productsHeader]}>
        <Text style={styles.sectionTitle}>
          {isProductsTab
            ? "All Products"
            : selectedCategoryId
              ? categories.find((c) => c.id === selectedCategoryId)?.name
              : "Wholesale Catalog"}
        </Text>
        <Text style={styles.productCount}>
          {filteredProducts.length} products
        </Text>
      </View>
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <AppLogo size="medium" showText={true} />
        </View>
      </View>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSearch={handleSearch}
      />

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={ListHeaderComponent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? "No products found" : "No products available"}
            </Text>
            {searchQuery && (
              <Text style={styles.emptySubtext}>Try adjusting your search</Text>
            )}
          </View>
        }
      />

      <CartToast
        visible={toastVisible}
        message={toastMessage}
        onViewCart={() => {
          setToastVisible(false);
          navigation.navigate("Cart");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    backgroundColor: "transparent",
    paddingTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
  },
  sliderSection: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
  },
  sliderHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  sliderTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: "700",
    color: COLORS.text,
  },
  sliderCount: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
    fontWeight: "600",
  },
  sliderImage: {
    height: 170,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.lightGray,
  },
  sliderDotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SPACING.sm,
    gap: SPACING.xs,
  },
  sliderDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
  },
  sliderDotActive: {
    width: 16,
    backgroundColor: COLORS.primary,
  },
  sliderPlaceholder: {
    marginHorizontal: SPACING.lg,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    minHeight: 110,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.md,
  },
  sliderPlaceholderText: {
    color: COLORS.textLight,
    fontSize: FONTS.sizes.sm,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: "800",
    color: COLORS.text,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  categoriesContent: {
    paddingHorizontal: SPACING.lg,
  },
  productsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  productCount: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: SPACING.xl,
    paddingTop: SPACING.sm,
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  productItem: {
    width: "48%",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: SPACING.xxl * 2,
    paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.white,
    marginTop: SPACING.md,
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.text,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: SPACING.xs,
  },
  emptySubtext: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    textAlign: "center",
  },
});

export default HomeScreen;
