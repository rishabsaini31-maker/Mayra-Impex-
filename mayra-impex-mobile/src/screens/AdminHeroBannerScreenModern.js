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

const AdminHeroBannerScreenModern = ({ navigation }) => {
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubtitle, setBannerSubtitle] = useState("");
  const [bannerImageUrl, setBannerImageUrl] = useState("");

  const handleAddBanner = async () => {
    if (!bannerTitle || !bannerImageUrl) {
      Alert.alert("Error", "Please fill in title and image URL");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/banners`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: bannerTitle,
            subtitle: bannerSubtitle,
            imageUrl: bannerImageUrl,
          }),
        },
      );

      if (response.ok) {
        Alert.alert("Success", "Hero banner added successfully!");
        setBannerTitle("");
        setBannerSubtitle("");
        setBannerImageUrl("");
      } else {
        Alert.alert("Error", "Failed to add banner");
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
        <Text style={styles.headerTitle}>Hero Banners</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add New Hero Banner</Text>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color="#FF8C50" />
            <Text style={styles.infoText}>
              Hero banners are displayed at the top of the home page
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Banner Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Premium Gifts"
              value={bannerTitle}
              onChangeText={setBannerTitle}
              placeholderTextColor="#CCC"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Banner Subtitle</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., For Every Occasion"
              value={bannerSubtitle}
              onChangeText={setBannerSubtitle}
              placeholderTextColor="#CCC"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Image URL *</Text>
            <TextInput
              style={[styles.input, styles.longInput]}
              placeholder="https://images.unsplash.com/photo-..."
              value={bannerImageUrl}
              onChangeText={setBannerImageUrl}
              multiline
              numberOfLines={3}
              placeholderTextColor="#CCC"
            />
            <Text style={styles.helperText}>
              Use unsplash.com or similar service to get image URLs
            </Text>
          </View>

          {bannerImageUrl && (
            <View style={styles.previewSection}>
              <Text style={styles.previewLabel}>Preview</Text>
              <View style={styles.previewContainer}>
                <Text style={styles.previewTitle}>{bannerTitle}</Text>
                <Text style={styles.previewSubtitle}>{bannerSubtitle}</Text>
                <Text style={styles.previewImageUrl} numberOfLines={2}>
                  Image: {bannerImageUrl}
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleAddBanner}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Add Hero Banner</Text>
          </TouchableOpacity>
        </View>

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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: "#FFF5F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 12,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  longInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  helperText: {
    fontSize: 12,
    color: "#999",
    marginTop: 6,
  },
  previewSection: {
    marginBottom: 20,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  previewContainer: {
    backgroundColor: "#FFF2EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#FFE5D6",
  },
  previewTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FF8C50",
    marginBottom: 8,
  },
  previewSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  previewImageUrl: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
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

export default AdminHeroBannerScreenModern;
