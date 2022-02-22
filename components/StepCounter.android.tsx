import React, { useEffect, useState, useContext } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { StyleSheet, View } from "react-native";
import { Surface, Button } from "react-native-paper";
import configJSON from "../config.json";
import { Text } from "../components/Themed";
import dataManager from "./DataManager";
import { UserDataContext } from "./UserDataProvider";
import StepsBarChart from "./StepsBarChart";

WebBrowser.maybeCompleteAuthSession();

export default function StepCounter() {
  const [googleAuthInfo, setGoogleAuthInfo] = useState({
    access_token: null,
    expires_in: null,
    id_token: null,
    refresh_token: null,
    scope: null,
    token_type: null,
    requested_at_timestamp: null,
  });
  const [stepCountToday, setStepCountToday] = useState(0);
  const [contributedSteps, setContributedSteps] = useState(0);
  const [newSteps, setNewSteps] = useState(0);
  const { userData, updated, setUpdated } = useContext(UserDataContext);
  const [error, setError] = useState(false);

  useEffect(() => {
    dataManager.getGoogleAuthInfo().then((authInfo) => {
      if (authInfo != null) setGoogleAuthInfo(authInfo);
    });
  }, []);

  useEffect(() => {
    getSteps();
  }, [googleAuthInfo]);

  useEffect(() => {
    let mounted = true;
    dataManager.getUserStepCountOfToday(userData.id).then((userStepCount) => {
      if (mounted) {
        setNewSteps(stepCountToday - userStepCount);
        setContributedSteps(userStepCount);
      }
    });
    return () => {
      mounted = false;
    };
  }, [stepCountToday]);

  const [authRequest, authResponse, authPromptAsync] = Google.useAuthRequest({
    androidClientId: configJSON.googleConfig.clientID,
    expoClientId: configJSON.googleConfig.clientID,
    clientId: configJSON.googleConfig.clientID,
    redirectUri: configJSON.googleConfig.redirectUri,
    responseType: "code",
    scopes: configJSON.googleConfig.scopes,
  });

  const resetStepsAfterContribution = () => {
    setContributedSteps(stepCountToday);
    setNewSteps(0);
    setUpdated(!updated);
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
    const end = new Date();
    const start = new Date();
    start.setHours(0, 0, 0, 0);

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
            startTimeMillis: start.valueOf(),
            endTimeMillis: end.valueOf(),
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
        console.log(stepsResponseJSON);
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
      <Surface style={styles.surface}>
        <StepsBarChart
          goalSteps={1000}
          contributedSteps={contributedSteps}
          newSteps={newSteps}
        />

        <Button
          disabled={newSteps === 0}
          style={{ alignSelf: "stretch" }}
          mode="contained"
          onPress={() => {
            if (newSteps === stepCountToday) {
              dataManager
                .pushStepCountofToday({
                  personId: userData.id,
                  steps: stepCountToday,
                })
                .then((responseStatus) => {
                  if (responseStatus === 201 || responseStatus === 200)
                    resetStepsAfterContribution();
                  else setError(true);
                });
            } else {
              const newDate = new Date();
              let month = (newDate.getMonth() + 1).toString();
              if (month.length === 1) month = "0" + month;
              let day = newDate.getDate().toString();
              if (day.length === 1) day = "0" + day;
              const dateString =
                newDate.getFullYear() + "-" + month + "-" + day;
              console.log("dateString", dateString);

              dataManager
                .updateStepCount({
                  day: dateString,
                  personId: userData.id,
                  steps: stepCountToday,
                })
                .then((responseStatus) => {
                  if (responseStatus === 201 || responseStatus === 200)
                    resetStepsAfterContribution();
                  else setError(true);
                });
            }
          }}
        >
          Contribute new steps
        </Button>
      </Surface>
    </>
  );
}

const styles = StyleSheet.create({
  viewWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  wrapper: {
    padding: 15,
    alignItems: "center",
    width: "33.33%",
  },
  header: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    width: "100%",
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#3f5c7c",
    color: "white",
    padding: 10,
    textAlign: "center",
  },
  headerText: { fontSize: 20, fontWeight: "bold" },
  labelText: { textAlign: "center" },
  surface: {
    elevation: 4,
    borderRadius: 5,
    marginBottom: 10,
  },
});
