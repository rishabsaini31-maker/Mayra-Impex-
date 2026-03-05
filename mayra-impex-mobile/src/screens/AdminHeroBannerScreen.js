import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const AdminHeroBannerScreen = ({ navigation }) => {
  const [banners, setBanners] = useState([
    { id: 1, title: "Summer Sale", description: "50% off on all items" },
    {
      id: 2,
      title: "New Arrivals",
      description: "Check out our latest collection",
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerDesc, setBannerDesc] = useState("");

  const handleAddBanner = () => {
    if (!bannerTitle || !bannerDesc) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const newBanner = {
      id: Math.random(),
      title: bannerTitle,
      description: bannerDesc,
    };

    setBanners([...banners, newBanner]);
    setBannerTitle("");
    setBannerDesc("");
    setShowForm(false);
    Alert.alert("Success", "Banner added successfully");
  };

  const handleDeleteBanner = (id) => {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Delete",
        onPress: () => {
          setBanners(banners.filter((b) => b.id !== id));
          Alert.alert("Success", "Banner deleted");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Manage Hero Banners</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content}>
        {!showForm && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowForm(true)}
          >
            <Ionicons name="add-circle" size={24} color="#FFF" />
            <Text style={styles.addButtonText}>Add New Banner</Text>
          </TouchableOpacity>
        )}

        {showForm && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Add Banner</Text>
            <TextInput
              style={styles.input}
              placeholder="Banner Title"
              value={bannerTitle}
              onChangeText={setBannerTitle}
              placeholderTextColor="#999"
            />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Banner Description"
              value={bannerDesc}
              onChangeText={setBannerDesc}
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.formButton, styles.cancelButton]}
                onPress={() => setShowForm(false)}
              >
                <Text style={styles.formButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.formButton, styles.saveButton]}
                onPress={handleAddBanner}
              >
                <Text style={styles.formButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Text style={styles.listTitle}>Banners ({banners.length})</Text>
        {banners.map((banner) => (
          <View key={banner.id} style={styles.bannerItem}>
            <View style={styles.bannerPreview}>
              <Ionicons name="image" size={40} color="#CCC" />
            </View>
            <View style={styles.bannerInfo}>
              <Text style={styles.bannerTitle}>{banner.title}</Text>
              <Text style={styles.bannerDesc} numberOfLines={2}>
                {banner.description}
              </Text>
            </View>
            <View style={styles.bannerActions}>
              <TouchableOpacity style={styles.editButton}>
                <Ionicons name="pencil" size={18} color="#FF8C50" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteBanner(banner.id)}
              >
                <Ionicons name="trash" size={18} color="#FF0000" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#FF8C50",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  formContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
    color: "#333",
  },
  multilineInput: {
    textAlignVertical: "top",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
  },
  formButton: {
    flex: 1,
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#DDD",
  },
  saveButton: {
    backgroundColor: "#FF8C50",
  },
  formButtonText: {
    fontWeight: "600",
    color: "#FFF",
  },
  listTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 12,
  },
  bannerItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  bannerPreview: {
    width: 60,
    height: 60,
    backgroundColor: "#F5F5F5",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  bannerInfo: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  bannerDesc: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  bannerActions: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    padding: 6,
  },
  deleteButton: {
    padding: 6,
  },
});

export default AdminHeroBannerScreen;
