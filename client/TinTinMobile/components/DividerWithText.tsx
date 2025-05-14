import { View, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from "react-native";

interface DividerWithTextProps {
  text: string;
  textStyle?: StyleProp<TextStyle>;
  lineStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

const DividerWithText = ({ text, textStyle, lineStyle, containerStyle }: DividerWithTextProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.line, lineStyle]} />
      <Text style={[styles.text, textStyle]}>{text}</Text>
      <View style={[styles.line, lineStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#aaa",
    opacity: 0.5,
  },
  text: {
    marginHorizontal: 12,
    color: "#fff",
    fontSize: 16,
  },
});

export default DividerWithText;
