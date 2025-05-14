import { useState } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  StyleProp,
  TextStyle,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface IProp extends TextInputProps {
  title?: string;
  inputStyle?: StyleProp<TextStyle>;
  textStyle?: StyleProp<TextStyle>;
  isPassword?: boolean;
  error?: string;
}

const ShareTextInput = ({
  title,
  inputStyle,
  textStyle,
  isPassword = false,
  error = "",
  ...rest
}: IProp) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      {title && (
        <Text
          style={[
            styles.label,
            textStyle,
            { color: isFocused ? "#000" : "#666" },
          ]}
        >
          {title}
        </Text>
      )}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            inputStyle,
            {
              borderColor: error ? "red" : isFocused ? "#000" : "#ccc",
            },
          ]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !isPasswordVisible}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Ionicons
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={22}
              color="gray"
            />
          </TouchableOpacity>
        )}
      </View>
      {error !== "" && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  inputWrapper: {
    position: "relative",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingRight: 45, 
    fontSize: 16,
    color: "#000",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 12, 
  },
  error: {
    color: "red",
    fontSize: 13,
    marginTop: 4,
  },
});

export default ShareTextInput;
