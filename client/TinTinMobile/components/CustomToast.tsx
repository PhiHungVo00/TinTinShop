// components/CustomToast.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BaseToastProps } from "react-native-toast-message";

const CustomToast = ({ text1, type }: BaseToastProps & { type: string }) => {
  const icon = type === "success" ? "checkmark-circle" : "close-circle";
  const iconColor = "#fff";

  return (
    <View style={[styles.container, type === "success" ? styles.success : styles.error]}>
      <Ionicons
        name={icon as any}
        size={24}
        color={iconColor}
        style={styles.icon}
      />
      <Text style={styles.text}>{text1}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  success: {
    backgroundColor: "#28a745", // xanh lá cây
  },
  error: {
    backgroundColor: "#dc3545", // đỏ
  },
  icon: {
    marginRight: 10,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    flexShrink: 1,
  },
});

export default CustomToast;
