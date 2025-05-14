import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextStyle,
  StyleProp,
  ViewStyle,
} from "react-native";

interface ShareButtonProps {
  onPress: () => void;
  title: string;
  logo?: React.ReactNode;
  textStyle?: StyleProp<TextStyle>;
  btnStyle?: StyleProp<ViewStyle>;
  logoContainerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  onPress,
  title,
  logo,
  textStyle,
  btnStyle,
  logoContainerStyle,
  contentStyle,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        btnStyle,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.content, contentStyle]}>
        {logo && (
          <View style={[styles.logoContainer, logoContainerStyle]}>
            {logo}
          </View>
        )}
        <Text
          style={[styles.text, textStyle]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    margin: 10,
    borderRadius: 20,
    backgroundColor: "blue",
  },
  pressed: {
    opacity: 0.5,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    marginRight: 10,
  },
  text: {
    flexShrink: 1,
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ShareButton;
