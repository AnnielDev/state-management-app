import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import BaseScreen from "@/containers/BaseScreen";
import Icons from "@/constants/Icons";
import { SvgXml } from "react-native-svg";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen() {
  const [userInfo, setUserInfo] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_WEB_ID,
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_ID,
    iosClientId: process.env.EXPO_PUBLIC_IOS_ID,
  });
  useEffect(() => {
    handleSignIn();
  }, [response]);

  async function handleSignIn() {
    const user = await AsyncStorage.getItem("@user");
    if (!user) {
      if (response?.type === "success") {
        const { authentication } = response;
        getUserInfo(authentication?.accessToken ?? "");
      } else if (response?.type === "dismiss") {
        console.log("Authentication flow dismissed by the user.");
      }
    } else {
      setUserInfo(JSON.parse(user));
    }
  }

  async function getUserInfo(token: string) {
    if (!token) return;
    try {
      const data = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await data.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(userInfo);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <BaseScreen>
      <View style={styles.container}>
        <Text style={styles.signInText}>Sign in with:</Text>
        <TouchableOpacity
          onPress={() => promptAsync()}
          style={styles.googleButton}
        >
          <SvgXml xml={Icons.googleIcon} />
          <Text style={styles.googleButtonText}>Sign In with Google</Text>
        </TouchableOpacity>
      </View>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  signInText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 100,
  },
  googleButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
