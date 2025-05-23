import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "@/util/constant";

const ConfirmDialog = ({ visible, onConfirm, onCancel, title, message }: {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttons}>
            <TouchableOpacity onPress={onCancel} style={[styles.button, styles.cancel]}>
              <Text style={styles.buttonText}>Huỷ</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={[styles.button, styles.confirm]}>
              <Text style={styles.buttonText}>Đồng ý</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmDialog;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    width: "80%",
    backgroundColor: COLORS.ITEM_BACKGROUND,
    padding: 20,
    borderRadius: 12,
    borderColor: COLORS.ITEM_BORDER,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    color: COLORS.ITEM_TEXT,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: COLORS.ITEM_TEXT,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  cancel: {
    backgroundColor: COLORS.ITEM_BORDER,
  },
  confirm: {
    backgroundColor: "#FF4D4D",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
