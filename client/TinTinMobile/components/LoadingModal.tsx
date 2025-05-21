import React from "react";
import { Modal, View, ActivityIndicator, StyleSheet } from "react-native";
import { useLoading } from "@/context/LoadingContext";

const LoadingModal = () => {
  const { loading } = useLoading();

  return (
    <Modal transparent animationType="fade" visible={loading}>
      <View style={styles.overlay}>
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "#00000088",
        justifyContent: "center",
        alignItems: "center",
      },
      loaderBox: {
        padding: 20,
        backgroundColor: "#222",
        borderRadius: 16,
      },
});

export default LoadingModal;