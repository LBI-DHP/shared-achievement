import React, { useState } from "react";
import { View, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { style } from "../constants/Styles";
import dataManager from "../components/DataManager";
import * as Google from "expo-auth-session/providers/google";
import configJSON from "../config.json";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function ConnectToGoogleFit({ setIsConnectedToGoogleFit }) {
  const [authorizationCode, setAuthorizationCode] = useState("");
  const [googleAuthInfo, setGoogleAuthInfo] = useState({
    access_token: null,
    expires_in: null,
    id_token: null,
    refresh_token: null,
    scope: null,
    token_type: null,
    requested_at_timestamp: null,
  });

  const [authRequest, authResponse, authPromptAsync] = Google.useAuthRequest({
    androidClientId: configJSON.googleConfig.clientID,
    expoClientId: configJSON.googleConfig.clientID,
    clientId: configJSON.googleConfig.clientID,
    redirectUri: configJSON.googleConfig.redirectUri,
    responseType: "code",
    scopes: configJSON.googleConfig.scopes,
  });

  const getFirstToken = async () => {
    try {
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        body: JSON.stringify({
          code: authorizationCode,
          client_id: configJSON.googleConfig.clientID,
          grant_type: "authorization_code",
          code_verifier: authRequest.codeVerifier,
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
        setGoogleAuthInfo(newAuthInfo);
        dataManager.setGoogleAuthInfo(newAuthInfo);
        setIsConnectedToGoogleFit(true);
      } else {
        console.log("get first token response status: ", tokenResponseStatus);
      }
    } catch (error) {
      console.log("error on get first token:" + error);
    } finally {
      console.log("done with get first token request");
    }
  };

  return (
    <View style={style.containerPaddingTop}>
      <Text style={style.heading}>Enable Step Count</Text>
      <Text style={style.subheading}>
        Please login with your Google Account and grant access to your Google
        Fit data on physical activity.
      </Text>
      <Button
        mode="contained"
        disabled={!authRequest}
        onPress={() => {
          authPromptAsync();
        }}
        style={{ marginBottom: 10 }}
      >
        Login to Google
      </Button>
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
        mode="contained"
        onPress={() => {
          getFirstToken();
        }}
      >
        Save Authorization Code
      </Button>
    </View>
  );
}
