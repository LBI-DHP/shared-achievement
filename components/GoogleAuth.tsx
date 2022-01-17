import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { Button } from "react-native";
import { TextInput } from "react-native-paper";
import configJSON from "../config.json";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [authorizationCode, setAuthorizationCode] = React.useState("");
  const [googleInfo, setGoogleInfo] = React.useState({ access_token: null });

  const [authRequest, authResponse, authPromptAsync] = Google.useAuthRequest({
    androidClientId: configJSON.googleConfig.clientID,
    expoClientId: configJSON.googleConfig.clientID,
    clientId: configJSON.googleConfig.clientID,
    redirectUri: configJSON.googleConfig.redirectUri,
    responseType: "code",
    scopes: configJSON.googleConfig.scopes,
  });

  const getToken = async () => {
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
      console.log(tokenResponseJSON);
      setGoogleInfo(tokenResponseJSON);
    } catch (error) {
      console.log("error on get token:" + error);
    } finally {
      console.log("done with get token request");
    }
  };

  const getSteps = async () => {
    const newDate = new Date();

    try {
      const stepsResponse = await fetch(
        "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer" + " " + googleInfo.access_token,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            aggregateBy: [
              {
                dataTypeName: "com.google.step_count.delta",
                dataSourceId:
                  "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
              },
            ],
            bucketByTime: { durationMillis: 86400000 },
            startTimeMillis: newDate.valueOf() - 1000 * 24 * 60 * 60,
            endTimeMillis: newDate.valueOf(),
          }),
        }
      );
      const stepsResponseJSON = await stepsResponse.json();
      const steps =
        stepsResponseJSON.bucket[0].dataset[0].point[0].value[0].intVal;
      console.log("steps", steps);
    } catch (error) {
      console.log("error on get steps from google fit:" + error);
    } finally {
      console.log("done with get steps from google fit");
    }
  };

  return (
    <>
      <Button
        disabled={!authRequest}
        title="Login"
        onPress={() => {
          console.log("codeVerifier", authRequest.codeVerifier);
          authPromptAsync();
        }}
      />
      <TextInput
        value={authorizationCode}
        multiline={false}
        placeholder="Authorization Code"
        autoComplete={false}
        onChangeText={(input) => setAuthorizationCode(input)}
      />
      <Button
        title="Save Authorization Code"
        onPress={() => {
          getToken();
        }}
      />
      <Button
        title="Get Steps"
        onPress={() => {
          getSteps();
        }}
      />
    </>
  );
}
