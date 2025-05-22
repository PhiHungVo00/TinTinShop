
import ShareButton from "@/components/ShareButton";
import { Text, View, StyleSheet, Image, ImageBackground, TouchableOpacity } from "react-native";
import { COLORS } from "@/util/constant";
import DividerWithText from "@/components/DividerWithText";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

const image = {
  facebook: require("@/assets/images/auth/Facebook.png"),
  google: require("@/assets/images/auth/Google.png"),
  background: require("@/assets/images/auth/background.jpg"),
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  welcomeText: {
    flex: 0.6,
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 20,
  },
  welcomeButton: {
    flex: 0.4,
  },
  welcomeTextTitle: {
    fontSize: 40,
    fontWeight: "bold",
  },
  welcomeTextSubtitle: {
    fontSize: 30,
    color: "#808080",
    fontWeight: "normal",
    marginVertical: 10,
  },
  welcomeTextDescription: {
    fontSize: 12,
    fontWeight: "normal",
  },
  btnSocialGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textFooter: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  }

});

const WelcomeScreen = () => {

  const handleSignIn = () => {
    router.push("/(auth)/SignInScreen")
  }

  return (
    <ImageBackground source={image.background} style={{ flex: 1 }}>
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeTextTitle}>Welcome to</Text>
            <Text style={styles.welcomeTextSubtitle}>TinTinShop</Text>
            <Text style={styles.welcomeTextDescription}>Refresh Your Day, Every Sip Your Way</Text>
          </View>
          <View style={styles.welcomeButton}>
            <DividerWithText
              text="Sign in with"
              containerStyle={{ margin: 20 }}
              textStyle={{ color: "white" }} />
            <View style={styles.btnSocialGroup}>
              <ShareButton
                title="Facebook"
                onPress={() => alert("click me")}
                btnStyle={{
                  backgroundColor: COLORS.GREY,
                  borderRadius: 30,
                  borderColor: COLORS.BLACK,
                  borderWidth: 1,
                  width: 160
                }}
                textStyle={{ color: COLORS.BLACK }}
                logo={<Image source={image.facebook}
                  style={{ width: 30, height: 30 }} />}
              />
              <ShareButton
                title="Google"
                onPress={() => alert("click me")}
                btnStyle={{
                  backgroundColor: COLORS.GREY,
                  borderRadius: 30,
                  borderColor: COLORS.BLACK,
                  borderWidth: 1,
                  width: 160
                }}
                textStyle={{ color: COLORS.BLACK }}
                logo={<Image source={image.google}
                  style={{ width: 30, height: 30 }} />}
              />

            </View>
            <View>
              <ShareButton
                title="Start with your email"
                onPress={handleSignIn}
                btnStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: 30,
                  borderColor: COLORS.BLACK,
                  borderWidth: 1,
                  padding: 20
                }}
                textStyle={{ color: "white" }}
              />
            </View>
            <View style={styles.textFooter}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ color: "white" }}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => router.push("/SignUpScreen")}>
                  <Text style={{ textDecorationLine: "underline", color: "white", marginLeft: 5 }}>
                    Sign up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </View>
      </LinearGradient>

    </ImageBackground>
  );
};

export default WelcomeScreen;
// import SignInScreen from "./(auth)/SignInScreen";
// export default SignInScreen;
