import DividerWithText from "@/components/DividerWithText";
import ShareButton from "@/components/ShareButton";
import ShareTextInput from "@/components/ShareTextInput";
import { COLORS } from "@/util/constant";
import { router, useNavigation } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import axios from "axios";

const image = {
  facebook: require("@/assets/images/Facebook.png"),
  google: require("@/assets/images/Google.png"),
  logo: require("@/assets/images/logo.jpg"),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageStyle: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
  },
  inputContainer: {
    padding: 10,
  },
  groupButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  textFooter: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});

const SignInScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  
  const handleLogin = () => {
    if (!email) {
      setEmailError("Email không được để trống");
    }
    if (!password) {
      setPasswordError("Password không được để trống");
    }
    console.log(email, password);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text.length > 0) {  
      setEmailError("");
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (text.length > 0) {
      setPasswordError("");
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Back Button */}
            {navigation.canGoBack() && (
              <ShareButton
              title=""
              onPress={() => router.back()}
              btnStyle={{
                backgroundColor: "transparent",
                alignItems: "flex-start",
                alignSelf: "flex-start",
              }}
              textStyle={{
                color: COLORS.BLACK,
              }}
              logo={
                <Ionicons name="arrow-back" size={28} color="black" />
              }
            />
            )}


            {/* Logo */}
            <View style={styles.imageContainer}>
              <Image source={image.logo} style={styles.imageStyle} />
            </View>

            {/* Header */}
            <View style={styles.headerContainer}>
              <Text style={styles.header}>Login</Text>
            </View>

            {/* Inputs */}
            <View style={styles.inputContainer}>
              <ShareTextInput 
                title="Email" 
                value={email} 
                onChangeText={handleEmailChange} 
                error={emailError} />
              <ShareTextInput 
                title="Password" 
                isPassword={true} 
                value={password} 
                onChangeText={handlePasswordChange} 
                error={passwordError} />
            </View>

            {/* Login Button */}
            <ShareButton
              title="Login"
              onPress={handleLogin}
              btnStyle={{
                backgroundColor: COLORS.BLACK,
                padding: 20,
                marginTop: 10,
              }}
            />

            {/* Footer */}
            <View style={styles.textFooter}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ color: "black" }}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => router.push("/SignUpScreen")}>
                  <Text style={{ textDecorationLine: "underline", color: "black", marginLeft: 5 }}>
                    Sign up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Divider */}
            <DividerWithText
              text="Sign in with"
              textStyle={{ color: COLORS.BLACK, fontSize: 14 }}
              containerStyle={{ marginTop: 30, paddingHorizontal: 20 }}
            />

            {/* Social Buttons */}
            <View style={styles.groupButton}>
              <ShareButton
                title="Facebook"
                onPress={() => alert("click me")}
                btnStyle={{
                  backgroundColor: COLORS.GREY,
                  borderRadius: 30,
                  borderColor: COLORS.BLACK,
                  borderWidth: 1,
                  width: 160,
                }}
                textStyle={{ color: COLORS.BLACK }}
                logo={
                  <Image
                    source={image.facebook}
                    style={{ width: 30, height: 30 }}
                  />
                }
              />
              <ShareButton
                title="Google"
                onPress={() => alert("click me")}
                btnStyle={{
                  backgroundColor: COLORS.GREY,
                  borderRadius: 30,
                  borderColor: COLORS.BLACK,
                  borderWidth: 1,
                  width: 160,
                }}
                textStyle={{ color: COLORS.BLACK }}
                logo={
                  <Image
                    source={image.google}
                    style={{ width: 30, height: 30 }}
                  />
                }
              />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;
