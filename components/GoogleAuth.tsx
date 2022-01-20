import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { Button } from "react-native";
import { TextInput } from "react-native-paper";
import configJSON from "../config.json";
import { Text } from "../components/Themed";
import { style } from "../constants/Styles";
import dataManager from "./DataManager";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [authorizationCode, setAuthorizationCode] = React.useState("");
  const [googleAuthInfo, setGoogleAuthInfo] = React.useState({
    access_token: null,
    expires_in: null,
    id_token: null,
    refresh_token: null,
    scope: null,
    token_type: null,
    requested_at_timestamp: null,
  });

  React.useEffect(() => {
    dataManager.getGoogleAuthInfo().then((authInfo) => {
      if (authInfo != null) setGoogleAuthInfo(authInfo);
    });
  }, []);

  React.useEffect(() => {
    getSteps();
  }, [googleAuthInfo]);

  const [stepCountToday, setStepCountToday] = React.useState(0);

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
      } else {
        console.log("get first token response status: ", tokenResponseStatus);
      }
    } catch (error) {
      console.log("error on get first token:" + error);
    } finally {
      console.log("done with get first token request");
    }
  };

  const getNewToken = async () => {
    try {
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        body: JSON.stringify({
          refresh_token: googleAuthInfo.refresh_token,
          client_id: configJSON.googleConfig.clientID,
          grant_type: "refresh_token",
          redirect_uri: configJSON.googleConfig.redirectUri,
        }),
      });
      const tokenResponseJSON = await tokenResponse.json();
      const tokenResponseStatus = await tokenResponse.status;
      if (tokenResponseStatus === 200) {
        const dateNow = new Date();
        const newAuthInfo = {
          ...tokenResponseJSON,
          refresh_token: googleAuthInfo.refresh_token,
          requested_at_timestamp: dateNow.valueOf(),
        };
        setGoogleAuthInfo(newAuthInfo);
        dataManager.setGoogleAuthInfo(newAuthInfo);
      } else {
        console.log("get new token response status: ", tokenResponseStatus);
      }
    } catch (error) {
      console.log("error on get new token:" + error);
    } finally {
      console.log("done with get new token request");
    }
  };

  const getTokenInfo = async () => {
    const tokenInfoResponse = await fetch(
      "https://oauth2.googleapis.com/tokeninfo",
      {
        method: "POST",
        body: JSON.stringify({
          access_token: googleAuthInfo.access_token,
        }),
      }
    );
    const tokenInfoJSON = await tokenInfoResponse.json();
    console.log(tokenInfoJSON);
  };

  const getSteps = async () => {
    const dateNow = new Date();
    const secondsPassed =
      (dateNow.valueOf() - googleAuthInfo.requested_at_timestamp) / 1000;
    const isTokenValid = secondsPassed + 5 < googleAuthInfo.expires_in;

    if (!isTokenValid) await getNewToken();

    const newDate = new Date();

    try {
      const stepsResponse = await fetch(
        "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer" + " " + googleAuthInfo.access_token,
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

      const stepsResponseStatus = await stepsResponse.status;

      if (stepsResponseStatus === 200) {
        const stepsResponseJSON = await stepsResponse.json();
        const steps = stepsResponseJSON.bucket[0].dataset[0].point[0].value[0]
          .intVal
          ? stepsResponseJSON.bucket[0].dataset[0].point[0].value[0].intVal
          : 0;
        setStepCountToday(steps);
      } else {
        console.log("Steps response status: ", stepsResponseStatus);
      }
    } catch (error) {
      console.log("error on get steps from google fit:" + error);
    } finally {
      console.log("done with get steps from google fit");
    }
  };

  return (
    <>
      {googleAuthInfo.access_token === null && (
        <>
          <Button
            disabled={!authRequest}
            title="Login"
            onPress={() => {
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
              getFirstToken();
            }}
          />
        </>
      )}
      <Button
        title="Get Token Info"
        onPress={() => {
          getTokenInfo();
        }}
      />
      <Text style={{ paddingBottom: 10 }}>
        Total steps taken today:{" "}
        <Text style={style.subheading}>{stepCountToday}</Text>
      </Text>
    </>
  );
}
