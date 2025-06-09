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
  ImageBackground,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { callFetchAccount, callLogin } from "@/config/api";
import Toast from "react-native-toast-message";
import { IAccount, IGetAccount } from "@/types/backend";
import { useAppContext } from "@/context/AppContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

const image = {
  facebook: require("@/assets/images/auth/Facebook.png"),
  google: require("@/assets/images/auth/Google.png"),
  logo: require("@/assets/images/auth/logo.jpg"),
  background: require("@/assets/images/auth/background.jpg"),
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
  const { setUser } = useAppContext();

  const handleLogin = async () => {
    if (!email) {
      setEmailError("Email không được để trống");
    }
    if (!password) {
      setPasswordError("Password không được để trống");
    }
    const res = await callLogin(email, password);
    if (res.data) {
      Toast.show({
        type: 'success',
        text1: 'Login success',
      });
      const token = res.data.access_token;
      await AsyncStorage.setItem("access_token", token); 
      const getAccount: IGetAccount = {
        user: res.data.user,
      }
      setUser(getAccount);
      if(res.data.user.role?.name.toLowerCase() === 'admin'){
        router.replace("/(admin)/dashboard");
      } else {
            router.replace("/(user)/home");
          }
    } else {
      Toast.show({
        type: 'error',
        text1: `Tài khoản hoặc mật khẩu không chính xác`,
      });
    }
  }
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
    <ImageBackground source={image.background} style={{ flex: 1 }}>
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
                  error={emailError} 
                  textStyle={{color: COLORS.BLACK}}/>
                  
                <ShareTextInput
                  title="Password"
                  isPassword={true}
                  value={password}
                  onChangeText={handlePasswordChange}
                  error={passwordError} 
                  textStyle={{color: COLORS.BLACK}}/>
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
    </ImageBackground>

  );
};

export default SignInScreen;
