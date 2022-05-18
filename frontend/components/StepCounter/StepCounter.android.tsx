import React, { useEffect, useState, useContext } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { Surface, Button } from "react-native-paper";
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

  const [stepCountToday, setStepCountToday] = useState(0);
  const [contributedSteps, setContributedSteps] = useState(0);
  const [newSteps, setNewSteps] = useState(0);
  const { userData, updated, setUpdated, mode } = useContext(UserDataContext);
  const [googleFitConnectionError, setGoogleFitConnectionError] =
    useState(false);
  const [internetConnectionError, setInternetConnectionError] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(true);
  const [isGoogleFitLoading, setIsGoogleFitLoading] = useState(true);
  const [isGoogleTokenExpectedToBeValid, setIsGoogleTokenExpectedToBeValid] =
    useState(true);
  const [getNewTokenFailed, setGetNewTokenFailed] = useState(false);
  const [goalSteps, setGoalSteps] = useState(null);

  useEffect(() => {
    let mounted = true;

    dataManager.getGoogleAuthInfo().then((authInfo) => {
      if (authInfo != null) {
        if (mounted) setGoogleAuthInfo(authInfo);
        getSteps(mounted);
      } else {
        //reconnect to google Fit
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    if (
      !isGoogleTokenExpectedToBeValid &&
      googleAuthInfo.access_token &&
      !getNewTokenFailed
    ) {
      setIsGoogleFitLoading(true);
      getNewToken(mounted);
    } else if (isGoogleTokenExpectedToBeValid && googleAuthInfo.access_token) {
      setIsGoogleFitLoading(true);
      getSteps(mounted);
    }
    return () => {
      mounted = false;
    };
  }, [
    googleAuthInfo,
    updated,
    getNewTokenFailed,
    isGoogleTokenExpectedToBeValid,
  ]);

  useEffect(() => {
    let mounted = true;
    if (stepCountToday !== null) {
      setIsApiLoading(true);
      dataManager.getUserChallengeData(userData.id).then((data) => {
        if (mounted) {
          let userStepCount = data.total_steps;
          if (userStepCount === undefined) userStepCount = 0;
          const stepsNew = stepCountToday - userStepCount;
          if (stepsNew > 0) setNewSteps(stepCountToday - userStepCount);
          setContributedSteps(userStepCount);
          if (data.goal) setGoalSteps(data.goal);
          setIsApiLoading(false);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [stepCountToday]);

  const getNewToken = async (mounted) => {
    try {
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        body: JSON.stringify({
          client_id: configJSON.googleConfig.clientID,
          client_secret: configJSON.googleConfig.clientSecret,
          grant_type: "refresh_token",
          refresh_token: googleAuthInfo.refresh_token,
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
        if (mounted) {
          setGoogleFitConnectionError(false);
          setGoogleAuthInfo(newAuthInfo);
          dataManager.setGoogleAuthInfo(newAuthInfo);
          setIsGoogleTokenExpectedToBeValid(true);
          setGetNewTokenFailed(false);
        }
      } else {
        setIsGoogleFitLoading(false);
        setGetNewTokenFailed(true);
        setGoogleFitConnectionError(true);
      }
    } catch (error) {
      setIsGoogleFitLoading(false);
      setGetNewTokenFailed(true);
      setInternetConnectionError(true);
    } finally {
      console.log("done with get new token request");
    }
  };

  const getSteps = async (mounted) => {
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
        setGoogleFitConnectionError(false);
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
          if (mounted) {
            setStepCountToday(
              stepsResponseJSON.bucket[0].dataset[0].point[0].value[0].intVal
            );
            setIsGoogleFitLoading(false);
          }
        }
      } else {
        if (mounted) {
          setIsGoogleTokenExpectedToBeValid(false);
        }
      }
    } catch (error) {
      setIsGoogleFitLoading(false);
      setInternetConnectionError(true);
    }
  };

  const resetStepsAfterContribution = () => {
    setContributedSteps(stepCountToday);
    setNewSteps(0);
    setUpdated(!updated);
  };

  if (!mode || isGoogleFitLoading || isApiLoading) {
    return (
      <>
        <Surface style={stepCounterStyles.surface}>
          <Text style={style.cardHeader}>Personal Contribution</Text>
          <CenteredActivityIndicator height={100} />
        </Surface>
        <ContributeButton
          isLoadingStepCounter={isApiLoading || isGoogleFitLoading}
          newSteps={newSteps}
          resetStepsAfterContribution={() => resetStepsAfterContribution()}
        />
      </>
    );
  }

  if (internetConnectionError) {
    return (
      <>
        <Surface style={stepCounterStyles.surface}>
          <Text style={style.cardHeader}>Personal Contribution</Text>
          {/* To-Do Action Button */}
          <Text>internetConnectionError</Text>
        </Surface>
        <ContributeButton
          isLoadingStepCounter={true}
          newSteps={newSteps}
          resetStepsAfterContribution={() => resetStepsAfterContribution()}
        />
      </>
    );
  }

  if (googleFitConnectionError) {
    return (
      <>
        <Surface style={stepCounterStyles.surface}>
          <Text style={style.cardHeader}>Personal Contribution</Text>
          {/* To-Do Action Button */}
          <Text>googleFitConnectionError</Text>
          <Button
            style={{ marginTop: 10 }}
            mode="contained"
            onPress={() => {
              setGetNewTokenFailed(false);
            }}
          >
            Retry
          </Button>
          <Button
            style={{ marginTop: 10 }}
            mode="contained"
            onPress={() => {
              dataManager.deleteGoogleAuthInfo();
            }}
          >
            Reconnect App to Google Fit
          </Button>
        </Surface>
        <ContributeButton
          isLoadingStepCounter={true}
          newSteps={newSteps}
          resetStepsAfterContribution={() => resetStepsAfterContribution()}
        />
      </>
    );
  }

  if (mode === "RELATIVE") {
    return (
      <>
        <Surface style={stepCounterStyles.surface}>
          <Text style={style.cardHeader}>Personal Contribution</Text>
          <StepsBarChart
            goalSteps={goalSteps}
            contributedSteps={contributedSteps}
            newSteps={newSteps}
          />
        </Surface>
        <ContributeButton
          isLoadingStepCounter={isApiLoading || isGoogleFitLoading}
          newSteps={newSteps}
          resetStepsAfterContribution={() => resetStepsAfterContribution()}
        />
      </>
    );
  } else if (mode === "ABSOLUTE") {
    return (
      <>
        <Surface style={stepCounterStyles.surface}>
          <Text style={style.cardHeader}>Personal Contribution</Text>
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
        </Surface>
        <ContributeButton
          isLoadingStepCounter={isApiLoading || isGoogleFitLoading}
          newSteps={newSteps}
          resetStepsAfterContribution={() => resetStepsAfterContribution()}
        />
      </>
    );
  }
  return null;
}
