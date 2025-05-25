import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ViewStyle, TextStyle } from "react-native";
import { COLORS } from "@/util/constant";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";

interface IProps {
  title: string;
  backPress?: () => void;
  addPress?: () => void;
  showBack?: boolean;
  showAdd?: boolean;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  backgroundColor?: string;
}

const HeaderList = ({
  title,
  backPress,
  addPress,
  showBack = true,
  showAdd = true,
  containerStyle,
  titleStyle,
  backgroundColor = COLORS.BACKGROUND,
}: IProps) => {
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <View style={[styles.headerContainer, containerStyle]}>
        {showBack ? (
          <TouchableOpacity onPress={backPress} style={styles.iconButton}>
            <AntDesign name="arrowleft" size={24} color={COLORS.ITEM_TEXT} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}

        <Text style={[styles.headerText, titleStyle]} numberOfLines={1}>{title}</Text>

        {showAdd ? (
          <TouchableOpacity onPress={addPress} style={styles.iconButton}>
            <Entypo name="add-to-list" size={24} color={COLORS.ITEM_TEXT} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    width: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.ITEM_TEXT,
    flex: 1,
    textAlign: "center",
  },
  iconButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  iconPlaceholder: {
    width: 32,
    height: 32,
  },
});

export default HeaderList;
