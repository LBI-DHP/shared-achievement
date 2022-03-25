// https://snack.expo.dev/@yoobit0616/pedometer-functional

import React, { useState, useEffect, useContext } from "react";
import { Surface } from "react-native-paper";
import { Pedometer } from "expo-sensors";
import dataManager from "../DataManager";
import { UserDataContext } from "../UserDataProvider";
import { Text, View } from "react-native";
import StepsBarChart from "./StepsBarChartRelative";
import { style } from "../../constants/Styles";
import { style as stepCounterStyles } from "./StepCounterStyles";
import ContributeButton from "./ContributeButton";

export default function StepCounter() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [stepCountToday, setStepCountToday] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [currentStepCountAdded, setCurrentStepCountAdded] = useState(0);
  const [contributedSteps, setContributedSteps] = useState(0);
  const [newSteps, setNewSteps] = useState(0);
  const [goalSteps, setGoalSteps] = useState(0);
  const { userData, updated, setUpdated, mode } = useContext(UserDataContext);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  let _subscription;

  useEffect(() => {
    let mounted = true;
    _subscribe(mounted);
    return () => {
      mounted = false;
      _unsubscribe();
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    dataManager.getUserChallengeData(userData.id).then((data) => {
      if (mounted) {
        let userStepCount = data.total_steps;
        if (userStepCount === undefined) userStepCount = 0;
        setNewSteps(stepCountToday - userStepCount);
        setContributedSteps(userStepCount);
        if (data.goal) setGoalSteps(data.goal);
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [stepCountToday]);

  const _subscribe = (mounted) => {
    _subscription = Pedometer.watchStepCount((result) => {
      if (mounted) setCurrentStepCount(result.steps);
    });

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

  if (!isPedometerAvailable) {
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
          isLoadingStepCounter={isLoading}
          newSteps={newSteps + (currentStepCount - currentStepCountAdded)}
          resetStepsAfterContribution={() => resetStepsAfterContribution()}
        />
      </>
    );
  } else {
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
          isLoadingStepCounter={isLoading}
          newSteps={newSteps + (currentStepCount - currentStepCountAdded)}
          resetStepsAfterContribution={() => resetStepsAfterContribution()}
        />
      </>
    );
  }
}
