// https://snack.expo.dev/@yoobit0616/pedometer-functional

import React, { useState, useEffect, useContext, useRef } from "react";
import { Surface } from "react-native-paper";
import { Pedometer } from "expo-sensors";
import dataManager from "../DataManager";
import { UserDataContext } from "../../providers/UserDataProvider";
import { UpdateContext } from "../../providers/UpdateProvider";
import { Text, View } from "react-native";
import StepsBarChart from "./StepsBarChartRelative";
import ContributeButton from "./ContributeButton";
import { MaterialIcons } from "@expo/vector-icons";

export default function StepCounter() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [stepCountToday, setStepCountToday] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [currentStepCountAdded, setCurrentStepCountAdded] = useState(0);
  const [contributedSteps, setContributedSteps] = useState(0);
  const [newSteps, setNewSteps] = useState(null);
  const [goalSteps, setGoalSteps] = useState(0);
  const { userData, mode } = useContext(UserDataContext);
  const {
    stepsPushedIndicator,
    setStepsPushedIndicator,
    midnightIndicator,
    appHasComeToForeground,
  } = useContext(UpdateContext);
  const [isApiLoading, setIsApiLoading] = useState(true);
  const [isPedometerLoading, setIsPedometerLoading] = useState(true);

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
  }, [appHasComeToForeground, midnightIndicator]);

  useEffect(() => {
    let mounted = true;
    if (appHasComeToForeground) {
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
  }, [stepCountToday, appHasComeToForeground, midnightIndicator]);

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
    setStepsPushedIndicator(!stepsPushedIndicator);
  };

  if (mode === "ABSOLUTE") {
    return (
      <>
        {!isPedometerAvailable && !isPedometerLoading && (
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              marginTop: 2,
              justifyContent: "center",
              padding: 10,
            }}
          >
            <MaterialIcons name="error-outline" size={24} color="red" />
            <Text style={{ paddingLeft: 10 }}>
              Error: Step counter is not available. Please go to phone settings
              and give this app permission to record motion and fitness data.
            </Text>
          </View>
        )}
        <ContributeButton
          isErrorStepCounter={!isPedometerAvailable && !isPedometerLoading}
          isLoadingStepCounter={isApiLoading || isPedometerLoading}
          newSteps={newSteps + (currentStepCount - currentStepCountAdded)}
          resetStepsAfterContribution={() => resetStepsAfterContribution()}
        />
      </>
    );
  } else if (mode === "RELATIVE") {
    return (
      <>
        <StepsBarChart
          goalSteps={goalSteps}
          contributedSteps={contributedSteps}
          newSteps={newSteps + (currentStepCount - currentStepCountAdded)}
        />
        <ContributeButton
          isErrorStepCounter={!isPedometerAvailable && !isPedometerLoading}
          isLoadingStepCounter={isApiLoading || isPedometerLoading}
          newSteps={newSteps + (currentStepCount - currentStepCountAdded)}
          resetStepsAfterContribution={() => resetStepsAfterContribution()}
        />
      </>
    );
  }
  return null;
}
