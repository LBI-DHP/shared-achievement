// https://snack.expo.dev/@yoobit0616/pedometer-functional

import React, { useState, useEffect, useContext, useRef } from "react";
import { Surface } from "react-native-paper";
import { Pedometer } from "expo-sensors";
import dataManager from "../DataManager";
import { UserDataContext } from "../UserDataProvider";
import { Text, View, AppState } from "react-native";
import StepsBarChart from "./StepsBarChartRelative";
import { style } from "../../constants/Styles";
import { style as stepCounterStyles } from "./StepCounterStyles";
import ContributeButton from "./ContributeButton";
import CenteredActivityIndicator from "../CenteredActivityIndicator";

export default function StepCounter() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [stepCountToday, setStepCountToday] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [currentStepCountAdded, setCurrentStepCountAdded] = useState(0);
  const [contributedSteps, setContributedSteps] = useState(0);
  const [newSteps, setNewSteps] = useState(null);
  const [goalSteps, setGoalSteps] = useState(0);
  const { userData, updated, setUpdated, mode } = useContext(UserDataContext);
  const [isApiLoading, setIsApiLoading] = useState(true);
  const [isPedometerLoading, setIsPedometerLoading] = useState(true);
  const [midnightReload, setMidnightReload] = useState(false);
  const [appHasComeToForeground, setAppHasComeToForeground] = useState(true);

  useEffect(() => {
    setInterval(() => {
      const currentDateTime = new Date();
      const dateTimeString =
        currentDateTime.getHours() +
        ":" +
        currentDateTime.getMinutes() +
        ":" +
        currentDateTime.getSeconds();
      if (dateTimeString === "0:0:0") setMidnightReload(true);
    }, 1000);
  }, []);

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      setAppHasComeToForeground(true);
      console.log("App has come to the foreground!");
    } else {
      setAppHasComeToForeground(false);
    }
    appState.current = nextAppState;
  };

  let _subscription;

  useEffect(() => {
    let mounted = true;
    if (appHasComeToForeground) {
      _unsubscribe();
      _subscribe(mounted);
    }
    return () => {
      mounted = false;
      _unsubscribe();
    };
  }, [appHasComeToForeground, midnightReload]);

  useEffect(() => {
    let mounted = true;
    if (appHasComeToForeground) {
      setMidnightReload(false);
      setIsApiLoading(true);
      dataManager.getUserChallengeData(userData.id).then((data) => {
        if (mounted) {
          let userStepCount = data.total_steps;
          if (userStepCount === undefined) userStepCount = 0;
          const stepsNew = stepCountToday - userStepCount;
          if (stepsNew > 0) setNewSteps(stepCountToday - userStepCount);
          else setNewSteps(0);
          setContributedSteps(userStepCount);
          if (data.goal) setGoalSteps(data.goal);
          setIsApiLoading(false);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [stepCountToday, appHasComeToForeground, midnightReload]);

  const _subscribe = (mounted) => {
    setIsPedometerLoading(true);

    // reset Sate for watchStepCount variables
    setCurrentStepCount(0);
    setCurrentStepCountAdded(0);
    // callback  is invoked when new step count data is available
    _subscription = Pedometer.watchStepCount((result) => {
      if (mounted) {
        setCurrentStepCount(result.steps);
      }
    });

    // Returns whether the pedometer is enabled on the device
    Pedometer.isAvailableAsync().then(
      (result) => {
        if (result === true) {
          const end = new Date();
          const start = new Date();
          start.setHours(0, 0, 0, 0);

          Pedometer.getStepCountAsync(start, end).then(
            (result) => {
              if (mounted) {
                setStepCountToday(result.steps);
                setIsPedometerAvailable(true);
                setIsPedometerLoading(false);
              }
            },
            (error) => {
              setIsPedometerAvailable(false);
              console.log(error);
            }
          );
        }
      },
      (error) => {
        setIsPedometerAvailable(false);
        console.log(error);
      }
    );
  };

  const _unsubscribe = () => {
    _subscription && _subscription.remove();
    _subscription = null;
  };

  const resetStepsAfterContribution = () => {
    setContributedSteps(stepCountToday + currentStepCount);
    setNewSteps(0);
    setCurrentStepCountAdded(currentStepCount);
    setUpdated(!updated);
  };

  if (!isPedometerAvailable && !isPedometerLoading) {
    return (
      <Surface style={stepCounterStyles.surface}>
        <Text style={style.cardHeader}>Personal Contribution</Text>
        <Text style={{ padding: 10 }}>
          🚨 Error: Step counter is not available. Please go to phone settings
          and give this app permission to record motion and fitness data.
        </Text>
      </Surface>
    );
  }

  if (!mode || isApiLoading || isPedometerLoading) {
    return (
      <Surface style={stepCounterStyles.surface}>
        <Text style={style.cardHeader}>Personal Contribution</Text>
        <CenteredActivityIndicator height={100} />
        <ContributeButton
          isLoadingStepCounter={isApiLoading || isPedometerLoading}
          newSteps={newSteps + (currentStepCount - currentStepCountAdded)}
          resetStepsAfterContribution={() => resetStepsAfterContribution()}
        />
      </Surface>
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
            newSteps={newSteps + (currentStepCount - currentStepCountAdded)}
          />
        </Surface>
        <ContributeButton
          isLoadingStepCounter={isApiLoading || isPedometerLoading}
          newSteps={newSteps + (currentStepCount - currentStepCountAdded)}
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
              <Text style={stepCounterStyles.stepsNew}>
                {newSteps + (currentStepCount - currentStepCountAdded)}
              </Text>{" "}
              new steps since last contribution
            </Text>
          </View>
        </Surface>
        <ContributeButton
          isLoadingStepCounter={isApiLoading || isPedometerLoading}
          newSteps={newSteps + (currentStepCount - currentStepCountAdded)}
          resetStepsAfterContribution={() => resetStepsAfterContribution()}
        />
      </>
    );
  }
  return null;
}
