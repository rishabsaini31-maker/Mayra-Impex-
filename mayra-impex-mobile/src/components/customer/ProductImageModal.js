import React from "react";
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { COLORS } from "../../constants";

const { width, height } = Dimensions.get("window");

const ProductImageModal = ({ visible, imageUrl, onClose }) => {
  if (!imageUrl) return null;
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.background}
          onPress={onClose}
          activeOpacity={1}
        />
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  imageContainer: {
    width: width * 0.9,
    height: height * 0.7,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: COLORS.white,
    elevation: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default ProductImageModal;
