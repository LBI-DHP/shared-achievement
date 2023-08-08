import React, { useEffect, useState, useContext } from "react";
import { Feather } from "@expo/vector-icons";
import { View, TouchableOpacity } from "react-native";
import { Text } from "../Themed";
import dataManager from "../DataManager";
import { UserDataContext } from "../../providers/UserDataProvider";
import { TeamDataContext } from "../../providers/TeamDataProvider";
import { UpdateContext } from "../../providers/UpdateProvider";
import StepsBarChart from "./StepsBarChartRelative";
import ContributeButton from "./ContributeButton";
import { Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import GoogleFitInfoDialog from "./GoogleFitInfoDialog";

export default function StepCounterGoogleFit({ singleUser = false }) {
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
  const { userData, setIsConnectedToGoogleFit } = useContext(UserDataContext);
  const { mode } = useContext(TeamDataContext);
  const {
    stepsPushedIndicator,
    setStepsPushedIndicator,
    midnightIndicator,
    appHasComeToForeground,
  } = useContext(UpdateContext);

  const [googleFitConnectionError, setGoogleFitConnectionError] =
    useState(false);
  const [internetConnectionError, setInternetConnectionError] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(true);
  const [isGoogleFitLoading, setIsGoogleFitLoading] = useState(true);
  const [tryToGetNewToken, setTryToGetNewToken] = useState(false);
  const [goalSteps, setGoalSteps] = useState(null);

  const [refetchStepsTimer, setRefetchStepsTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isGoogleInfoPopUpVisible, setIsGoogleInfoPopUpVisible] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    dataManager.getGoogleAuthInfo().then((authInfo) => {
      if (authInfo != null && authInfo.access_token) {
        if (mounted) setGoogleAuthInfo(authInfo);
      } else {
        setIsConnectedToGoogleFit(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (isTimerRunning) {
      let mounted = true;
      let interval = setInterval(() => {
        setRefetchStepsTimer((lastTimerCount) => {
          if (lastTimerCount <= 1) {
            if (googleAuthInfo.access_token !== null)
              syncStepsFromGoogleFit(mounted);
            clearInterval(interval);
            return 60;
          } else {
            return lastTimerCount - 1;
          }
        });
      }, 1000);
      return () => {
        clearInterval(interval);
        mounted = false;
      };
    }
  }, [isTimerRunning]);

  useEffect(() => {
    let mounted = true;
    if (googleAuthInfo.access_token !== null) syncStepsFromGoogleFit(mounted);
    return () => {
      mounted = false;
    };
  }, [googleAuthInfo, midnightIndicator]);

  useEffect(() => {
    let mounted = true;
    const currentDateTime = new Date();
    const isShortlyAfterMidnight =
      currentDateTime.getHours() === 0 && currentDateTime.getMinutes() === 0;

    if (
      appHasComeToForeground &&
      googleAuthInfo.access_token !== null &&
      isShortlyAfterMidnight
    )
      syncStepsFromGoogleFit(mounted);
    return () => {
      mounted = false;
    };
  }, [appHasComeToForeground]);

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
    setTryToGetNewToken(false);
    if (googleAuthInfo.refresh_token) {
      try {
        const tokenResponse = await fetch(
          "https://oauth2.googleapis.com/token",
          {
            method: "POST",
            body: JSON.stringify({
              client_id: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
              client_secret: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET,
              grant_type: "refresh_token",
              refresh_token: googleAuthInfo.refresh_token,
            }),
          }
        );
        const tokenResponseStatus = await tokenResponse.status;

        if (tokenResponseStatus === 200) {
          console.log("Could get new token: " + tokenResponseStatus);
          const tokenResponseJSON = await tokenResponse.json();
          const googleAuthFromStorage = await dataManager.getGoogleAuthInfo();
          console.log("Response:");
          console.log(tokenResponseJSON);
          const newAuthInfo = {
            ...tokenResponseJSON,
            refresh_token: googleAuthFromStorage.refresh_token,
            requested_at_timestamp: new Date().valueOf(),
          };
          console.log("NewAuthData:");
          console.log(newAuthInfo);
          if (mounted) {
            setGoogleAuthInfo(newAuthInfo);
            dataManager.setGoogleAuthInfo(newAuthInfo);
          }
        } else {
          console.log("Could not get new token: " + tokenResponseStatus);
          setGoogleFitConnectionError(true);
          setIsGoogleFitLoading(false);
        }
      } catch (error) {
        setInternetConnectionError(true);
        setIsGoogleFitLoading(false);
      }
    } else {
      console.log("no refresh token");
      setGoogleFitConnectionError(true);
      setIsGoogleFitLoading(false);
    }
  };

  const syncStepsFromGoogleFit = async (mounted) => {
    if (mounted) {
      setIsTimerRunning(false);
      setIsGoogleFitLoading(true);
      setGoogleFitConnectionError(false);
      setInternetConnectionError(false);
    }
    const isTokenValid =
      googleAuthInfo.requested_at_timestamp +
        googleAuthInfo.expires_in * 1000 -
        new Date().valueOf() >
      2000;

    if (!isTokenValid || tryToGetNewToken) getNewToken(mounted);
    else getSteps(mounted);
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
        console.log("Could fetch new steps: " + stepsResponseStatus);
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
          stepsResponseJSON.bucket[0].dataset[0].point[0].value[0].intVal &&
          mounted
        ) {
          setStepCountToday(
            stepsResponseJSON.bucket[0].dataset[0].point[0].value[0].intVal
          );
          setGoogleFitConnectionError(false);
          setInternetConnectionError(false);
        }
        if (mounted) {
          setIsTimerRunning(true);
        }
      } else {
        console.log("Could not fetch new steps: " + stepsResponseStatus);
        if (mounted) {
          setGoogleFitConnectionError(true);
        }
      }
    } catch (error) {
      if (mounted) {
        setInternetConnectionError(true);
      }
    } finally {
      setIsGoogleFitLoading(false);
    }
  };

  const resetStepsAfterContribution = () => {
    setContributedSteps(stepCountToday);
    setNewSteps(0);
    setStepsPushedIndicator(!stepsPushedIndicator);
  };

  // TODO/To-do/TO-DO Changes for single User here
  if (singleUser || mode === "ABSOLUTE") {
    return (
      <>
        <ContributeButton
          isErrorStepCounter={
            googleFitConnectionError || internetConnectionError
          }
          isLoadingStepCounter={isApiLoading || isGoogleFitLoading}
          newSteps={newSteps}
          resetStepsAfterContribution={() => resetStepsAfterContribution()}
        />
        {!googleFitConnectionError && !internetConnectionError && (
          <View
            style={{
              marginLeft: 10,
              marginRight: 10,
              alignItems: "center",
              justifyContent: "flex-end",
              flexDirection: "row",
            }}
          >
            <Text style={{ color: "grey" }}>
              {refetchStepsTimer} sec. until resync{" "}
            </Text>
            <TouchableOpacity onPress={() => setIsGoogleInfoPopUpVisible(true)}>
              <Feather name="info" size={24} color="grey" />
            </TouchableOpacity>
          </View>
        )}
        {(googleFitConnectionError || internetConnectionError) && (
          <View style={{ margin: 10, marginTop: 0 }}>
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                marginTop: 2,
                justifyContent: "center",
              }}
            >
              <MaterialIcons name="error-outline" size={24} color="red" />
              <Text>
                {googleFitConnectionError
                  ? " Google Fit Connection Error"
                  : " Internet Connection Error"}
              </Text>
            </View>
            {googleAuthInfo.refresh_token && (
              <Button
                style={{ marginTop: 10 }}
                mode="contained"
                onPress={() => {
                  setTryToGetNewToken(true);
                  syncStepsFromGoogleFit(true);
                }}
              >
                Retry
              </Button>
            )}
            {googleFitConnectionError && (
              <Button
                style={{ marginTop: 10 }}
                mode="outlined"
                onPress={() => {
                  setIsGoogleFitLoading(true);
                  dataManager
                    .disconnectFromGoogleFit(googleAuthInfo.access_token)
                    .then((worked) => {
                      if (worked) setIsConnectedToGoogleFit(false);
                      else setIsGoogleFitLoading(false);
                    });
                }}
              >
                Reconnect to Google Fit
              </Button>
            )}
          </View>
        )}
        {isGoogleInfoPopUpVisible && (
          <GoogleFitInfoDialog
            isGoogleInfoPopUpVisible={isGoogleInfoPopUpVisible}
            setIsGoogleInfoPopUpVisible={setIsGoogleInfoPopUpVisible}
          />
        )}
      </>
    );
  } else if (mode === "RELATIVE") {
    return (
      <>
        <StepsBarChart
          goalSteps={goalSteps}
          contributedSteps={contributedSteps}
          newSteps={newSteps}
        />

        <ContributeButton
          isErrorStepCounter={true}
          isLoadingStepCounter={isApiLoading || isGoogleFitLoading}
          newSteps={newSteps}
          resetStepsAfterContribution={() => resetStepsAfterContribution()}
        />
      </>
    );
  }
  return null;
}
