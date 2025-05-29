import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { COLORS } from "@/util/constant";
interface SupportItemProps {
  icon: React.ReactNode;     
  title: string;         
  description: string;    
  url: string;            
}

const SupportItem = ({ icon, title, description, url }: SupportItemProps) => {
  const handlePress = async () => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      alert("Không thể mở liên kết này: " + url);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      {icon}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <AntDesign name="right" size={24} color={COLORS.ITEM_TEXT} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: COLORS.ITEM_BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.ITEM_BORDER,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.ITEM_TEXT,
  },
  description: {
    fontSize: 13,
    color: COLORS.ITEM_TEXT,
  },
});

export default SupportItem;
