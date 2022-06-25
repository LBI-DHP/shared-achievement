import React, { useState, useEffect } from "react";
import { View, Text, Keyboard, Platform } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { style } from "../constants/Styles";
import dataManager from "../components/DataManager";
import configJSON from "../config.json";
import * as WebBrowser from "expo-web-browser";

export default function ConnectToGoogleFit({ setIsConnectedToGoogleFit }) {
  const [authorizationCode, setAuthorizationCode] = useState("");
  const [error, setError] = useState("");
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardOpen(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardOpen(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const redirectToGoogleLogin = async () => {
    WebBrowser.openBrowserAsync(
      "https://accounts.google.com/o/oauth2/v2/auth?scope=" +
        configJSON.googleConfig.scope +
        "&access_type=offline&response_type=code&redirect_uri=" +
        configJSON.googleConfig.redirectUri +
        "&client_id=" +
        configJSON.googleConfig.clientID
    );
  };

  const getFirstToken = async () => {
    try {
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        body: JSON.stringify({
          code: authorizationCode,
          client_id: configJSON.googleConfig.clientID,
          client_secret: configJSON.googleConfig.clientSecret,
          grant_type: "authorization_code",
          redirect_uri: configJSON.googleConfig.redirectUri,
        }),
      });
      const tokenResponseJSON = await tokenResponse.json();
      const tokenResponseStatus = await tokenResponse.status;
      if (tokenResponseStatus === 200) {
        const dateNow = new Date();
        const newAuthInfo = {
          ...tokenResponseJSON,
          requested_at_timestamp: dateNow.valueOf(),
        };
        dataManager.setGoogleAuthInfo(newAuthInfo);
        setIsConnectedToGoogleFit(true);
      } else {
        setError(
          "🚨 Error: Could not connect to Google Fit. Please try again or contact the administrator."
        );
        console.log("get first token response status: ", tokenResponseStatus);
      }
    } catch (error) {
      setError(
        "🚨 Error: Could not connect to Google Fit. Please check your internet connection."
      );
      console.log("error on get first token:" + error);
    } finally {
      console.log("done with get first token request");
    }
  };

  return (
    <View style={style.containerPaddingTop}>
      {!(isKeyboardOpen && Platform.OS === "ios") && (
        <>
          <Text style={style.heading}>Enable Step Count</Text>
          <Text style={style.subheading}>
            Please login with your Google Account and grant access to your
            Google Fit data on physical activity.
          </Text>
          <Button
            mode="contained"
            onPress={() => {
              redirectToGoogleLogin();
            }}
            style={{ marginBottom: 10 }}
          >
            Login to Google
          </Button>
        </>
      )}
      <Text style={style.subheading}>
        Copy the authorization code, you will receive after login, and paste it
        here:
      </Text>
      <TextInput
        value={authorizationCode}
        multiline={false}
        placeholder="Authorization Code"
        autoComplete={false}
        onChangeText={(input) => setAuthorizationCode(input)}
      />
      <Button
        disabled={authorizationCode.length < 1}
        mode="contained"
        onPress={() => {
          setError("");
          getFirstToken();
        }}
      >
        Save Authorization Code
      </Button>
      {error.length > 0 && <Text style={{ marginTop: 2 }}>{error}</Text>}
    </View>
  );
}
