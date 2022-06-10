import React, { useEffect, useState, useContext } from "react";
import { Feather } from "@expo/vector-icons";
import { View, TouchableOpacity } from "react-native";
import configJSON from "../../config.json";
import { Text } from "../Themed";
import dataManager from "../DataManager";
import { UserDataContext } from "../UserDataProvider";
import { UpdateContext } from "../UpdateProvider";
import StepsBarChart from "./StepsBarChartRelative";
import { style } from "../../constants/Styles";
import { style as stepCounterStyles } from "./StepCounterStyles";
import ContributeButton from "./ContributeButton";
import CenteredActivityIndicator from "../CenteredActivityIndicator";
import { Button, Surface, Paragraph, Dialog, Portal } from "react-native-paper";

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
  const { userData, mode, setIsConnectedToGoogleFit } =
    useContext(UserDataContext);
  const { stepsPushedIndicator, setStepsPushedIndicator } =
    useContext(UpdateContext);

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
      if (authInfo != null) {
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
  }, [isTimerRunning]);

  useEffect(() => {
    let mounted = true;
    if (googleAuthInfo.access_token !== null) syncStepsFromGoogleFit(mounted);
    return () => {
      mounted = false;
    };
  }, [googleAuthInfo]);

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
              client_id: configJSON.googleConfig.clientID,
              client_secret: configJSON.googleConfig.clientSecret,
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
          <View style={{ padding: 10 }}>
            <Text style={{ padding: 5, textAlign: "center" }}>
              Sorry, we could not fetch new steps from Google Fit: Internet
              Connection Error
            </Text>
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
          </View>
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
          <View style={{ padding: 10 }}>
            <Text style={{ padding: 5, textAlign: "center" }}>
              Sorry, we could not fetch new steps from Google Fit: Connection
              Error
            </Text>
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
            <Button
              style={{ marginTop: 10 }}
              mode="contained"
              onPress={() => {
                setIsGoogleFitLoading(true);
                fetch(
                  "https://oauth2.googleapis.com/revoke?token=" +
                    googleAuthInfo.access_token,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                  }
                )
                  .then((response) => {
                    if (response.status) {
                      dataManager.deleteGoogleAuthInfo();
                      setIsConnectedToGoogleFit(false);
                    }
                  })
                  .catch(() => {
                    setIsGoogleFitLoading(false);
                  });
              }}
            >
              Reconnect to Google Fit
            </Button>
          </View>
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
            <View
              style={{
                alignItems: "center",
                justifyContent: "flex-end",
                flexDirection: "row",
                paddingTop: 3,
              }}
            >
              <Text style={{ color: "grey" }}>
                {refetchStepsTimer} sec. until resync{" "}
              </Text>
              <TouchableOpacity
                onPress={() => setIsGoogleInfoPopUpVisible(true)}
              >
                <Feather name="info" size={24} color="grey" />
              </TouchableOpacity>
            </View>
          </View>
        </Surface>
        <ContributeButton
          isLoadingStepCounter={isApiLoading || isGoogleFitLoading}
          newSteps={newSteps}
          resetStepsAfterContribution={() => resetStepsAfterContribution()}
        />
        {isGoogleInfoPopUpVisible && (
          <Portal>
            <Dialog visible={isGoogleInfoPopUpVisible}>
              <Dialog.Content>
                <Paragraph style={{ paddingBottom: 10 }}>
                  Google Fit uploads your steps in irregular intervals to the
                  cloud (approx. every 15min). 🕐
                </Paragraph>
                <Paragraph style={{ paddingBottom: 10 }}>
                  Therefore, it may happen that steps that are already visible
                  in your Google Fit app are not yet displayed here. As soon as
                  Google has uploaded your steps to the cloud, they will also be
                  visible here. 👣
                </Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setIsGoogleInfoPopUpVisible(false)}>
                  Okay
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        )}
      </>
    );
  }
  return null;
}
