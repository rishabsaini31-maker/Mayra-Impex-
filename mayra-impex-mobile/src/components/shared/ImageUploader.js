import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadAPI } from "../../api";

const ImageUploader = ({ folder = "products", onUploaded }) => {
  const [pickedImage, setPickedImage] = useState(null);
  const [uploaded, setUploaded] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow photo library access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.85,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    setUploaded(null);
    setPickedImage(result.assets[0]);
  };

  const uploadPickedImage = async () => {
    if (!pickedImage?.uri) {
      Alert.alert("No image", "Pick an image before uploading.");
      return;
    }

    setUploading(true);
    try {
      const extension = pickedImage.uri?.split(".")?.pop() || "jpg";
      const formData = new FormData();
      formData.append("image", {
        uri: pickedImage.uri,
        name: `mobile_${Date.now()}.${extension}`,
        type: pickedImage.mimeType || "image/jpeg",
      });

      const response = await uploadAPI.uploadImage(formData, folder);
      setUploaded(response);
      onUploaded?.(response);
      Alert.alert("Uploaded", "Image uploaded successfully.");
    } catch (error) {
      Alert.alert(
        "Upload failed",
        error?.response?.data?.error || error.message || "Please try again.",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick Image</Text>
      </TouchableOpacity>

      {pickedImage?.uri ? (
        <Image source={{ uri: pickedImage.uri }} style={styles.image} />
      ) : null}

      <TouchableOpacity
        style={[
          styles.button,
          styles.uploadButton,
          uploading && styles.buttonDisabled,
        ]}
        onPress={uploadPickedImage}
        disabled={uploading || !pickedImage}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Upload to Backend</Text>
        )}
      </TouchableOpacity>

      {uploaded?.url ? (
        <View style={styles.uploadResult}>
          <Text style={styles.resultTitle}>Uploaded Preview</Text>
          <Image source={{ uri: uploaded.url }} style={styles.image} />
          <Text numberOfLines={1} style={styles.publicIdText}>
            {uploaded.public_id}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  uploadButton: {
    backgroundColor: "#111827",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    backgroundColor: "#e5e7eb",
  },
  uploadResult: {
    gap: 8,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  publicIdText: {
    fontSize: 12,
    color: "#6b7280",
  },
});

export default ImageUploader;
