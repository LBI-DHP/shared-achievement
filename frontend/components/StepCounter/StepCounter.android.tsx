import React, { useEffect, useState, useContext } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { Surface } from "react-native-paper";
import { View } from "react-native";
import configJSON from "../../config.json";
import { Text } from "../Themed";
import dataManager from "../DataManager";
import { UserDataContext } from "../UserDataProvider";
import StepsBarChart from "./StepsBarChartRelative";
import { style } from "../../constants/Styles";
import { style as stepCounterStyles } from "./StepCounterStyles";
import ContributeButton from "./ContributeButton";
import CenteredActivityIndicator from "../CenteredActivityIndicator";

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
  const [stepCountToday, setStepCountToday] = useState(null);
  const [contributedSteps, setContributedSteps] = useState(0);
  const [newSteps, setNewSteps] = useState(0);
  const { userData, updated, setUpdated, mode } = useContext(UserDataContext);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGoogleTokenValid, setIsGoogleTokenValid] = useState(false);

  useEffect(() => {
    dataManager.getGoogleAuthInfo().then((authInfo) => {
      if (authInfo != null) setGoogleAuthInfo(authInfo);
    });
  }, []);

  useEffect(() => {
    if (googleAuthInfo.access_token) {
      isTokenValid().then((isValid) => {
        if (isValid) setIsGoogleTokenValid(true);
        else {
          getNewToken();
        }
      });
    }
  }, [googleAuthInfo]);

  useEffect(() => {
    let mounted = true;
    if (stepCountToday !== null) {
      dataManager.getUserChallengeData(userData.id).then((data) => {
        if (mounted) {
          let userStepCount = data.total_steps;
          if (userStepCount === undefined) userStepCount = 0;
          setNewSteps(stepCountToday - userStepCount);
          setContributedSteps(userStepCount);
          setIsLoading(false);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [stepCountToday]);

  useEffect(() => {
    if (isGoogleTokenValid && googleAuthInfo) {
      getSteps();
    }
  }, [isGoogleTokenValid, updated]);

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
      const tokenResponseStatus = await tokenResponse.status;

      if (tokenResponseStatus === 200) {
        const tokenResponseJSON = await tokenResponse.json();
        const dateNow = new Date();
        const newAuthInfo = {
          ...tokenResponseJSON,
          refresh_token: googleAuthInfo.refresh_token,
          requested_at_timestamp: dateNow.valueOf(),
        };
        setGoogleAuthInfo(newAuthInfo);
        dataManager.setGoogleAuthInfo(newAuthInfo);
        setIsGoogleTokenValid(true);
      } else {
        setError(
          "🚨 Error (1): Get new Google Fit token request failed. Response status: " +
            tokenResponseStatus
        );
      }
    } catch (error) {
      setError(
        "🚨 Error (2): Get new Google Fit token request failed. Please check your internet connection. Error info: " +
          error
      );
    } finally {
      console.log("done with get new token request");
    }
  };

  const isTokenValid = async () => {
    try {
      const tokenInfoResponse = await fetch(
        "https://oauth2.googleapis.com/tokeninfo",
        {
          method: "POST",
          body: JSON.stringify({
            access_token: googleAuthInfo.access_token,
          }),
        }
      );

      const tokenInfoResponseStatus = await tokenInfoResponse.status;

      if (tokenInfoResponseStatus === 200) {
        const tokenInfoJSON = await tokenInfoResponse.json();
        if (tokenInfoJSON.expires_in && tokenInfoJSON.expires_in >= 10) {
          return true;
        }
      }
      return false;
    } catch (error) {
      setError(
        "🚨 Error (3): Validate Google Fit token request failed. Please check your internet connection. Error info: " +
          error
      );
      return false;
    }
  };

  const getSteps = async () => {
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
        if (
          stepsResponseJSON &&
          stepsResponseJSON.bucket &&
          stepsResponseJSON.bucket.length !== 0 &&
          stepsResponseJSON.bucket[0].dataset &&
          stepsResponseJSON.bucket[0].dataset.length !== 0 &&
          stepsResponseJSON.bucket[0].dataset[0].point &&
          stepsResponseJSON.bucket[0].dataset[0].point.length !== 0 &&
          stepsResponseJSON.bucket[0].dataset[0].point[0].value &&
          stepsResponseJSON.bucket[0].dataset[0].point[0].value.length !== 0 &&
          stepsResponseJSON.bucket[0].dataset[0].point[0].value[0].intVal
        ) {
          console.log("jaaaaaaaaaaajaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
          console.log(
            stepsResponseJSON.bucket[0].dataset[0].point[0].value[0].intVal
          );

          setStepCountToday(
            stepsResponseJSON.bucket[0].dataset[0].point[0].value[0].intVal
          );
        } else setIsLoading(false);
      } else {
        setError(
          "🚨 Error (4): Fetch steps from Google Fit request failed. Response status: " +
            stepsResponseStatus
        );
      }
    } catch (error) {
      setError(
        "🚨 Error (5): Fetch steps from Google Fit request failed. Please check your internet connection. Error info: " +
          error
      );
    }
  };

  if (mode === "RELATIVE") {
    return (
      <>
        <Surface style={stepCounterStyles.surface}>
          <Text style={style.cardHeader}>Personal Contribution</Text>
          {isLoading && error.length === 0 ? (
            <CenteredActivityIndicator height={100} />
          ) : error.length > 0 ? (
            <Text style={{ margin: 10 }}>{error}</Text>
          ) : (
            <StepsBarChart
              goalSteps={1000}
              contributedSteps={contributedSteps}
              newSteps={newSteps}
            />
          )}
        </Surface>
        <ContributeButton
          isLoadingStepCounter={isLoading}
          newSteps={newSteps}
          resetStepsAfterContribution={() => resetStepsAfterContribution()}
        />
      </>
    );
  } else {
    return (
      <>
        <Surface style={stepCounterStyles.surface}>
          <Text style={style.cardHeader}>Personal Contribution</Text>
          {isLoading && error.length === 0 ? (
            <CenteredActivityIndicator height={100} />
          ) : error.length > 0 ? (
            <Text style={{ margin: 10 }}>{error}</Text>
          ) : (
            <View style={{ padding: 10 }}>
              <Text>
                <Text style={stepCounterStyles.stepsContributed}>
                  {contributedSteps}
                </Text>{" "}
                steps already contributed
              </Text>
              <Text>
                <Text style={stepCounterStyles.stepsNew}>{newSteps}</Text> new
                steps since last contribution
              </Text>
            </View>
          )}
        </Surface>
        <ContributeButton
          isLoadingStepCounter={isLoading}
          newSteps={newSteps}
          resetStepsAfterContribution={() => resetStepsAfterContribution()}
        />
      </>
    );
  }
}
