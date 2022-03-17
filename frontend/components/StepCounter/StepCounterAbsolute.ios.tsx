// https://snack.expo.dev/@yoobit0616/pedometer-functional

import React, { useState, useEffect, useContext } from "react";
import { Button, Surface } from "react-native-paper";
import { Pedometer } from "expo-sensors";
import dataManager from "../DataManager";
import { UserDataContext } from "../UserDataProvider";
import { Text, View } from "react-native";
import { style as stepCounterStyles } from "./StepCounterStyles";
import { style } from "../../constants/Styles";

export default function StepCounter() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [stepCountToday, setStepCountToday] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [currentStepCountAdded, setCurrentStepCountAdded] = useState(0);
  const [contributedSteps, setContributedSteps] = useState(0);
  const [newSteps, setNewSteps] = useState(0);
  const [goalSteps, setGoalSteps] = useState(0);
  const { userData, updated, setUpdated } = useContext(UserDataContext);
  const [error, setError] = useState(false);

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
        setIsPedometerAvailable(result);

        if (result === true) {
          const end = new Date();
          const start = new Date();
          start.setHours(0, 0, 0, 0);

          Pedometer.getStepCountAsync(start, end).then(
            (result) => {
              if (mounted) setStepCountToday(result.steps);
            },
            (error) => {
              console.log(error);
            }
          );
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const _unsubscribe = () => {
    _subscription && _subscription.remove();
    _subscription = null;
  };

  const resetStepsAfterContribution = () => {
    setContributedSteps(
      stepCountToday + currentStepCount - currentStepCountAdded
    );
    setNewSteps(0);
    setCurrentStepCountAdded(currentStepCount);
    setUpdated(!updated);
  };

  if (!isPedometerAvailable) {
    return <Text>Sorry, step counter is not available.</Text>;
  }

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
        <Button
          disabled={
            newSteps === 0 && currentStepCount - currentStepCountAdded === 0
          }
          style={{ alignSelf: "stretch" }}
          mode="contained"
          onPress={() => {
            dataManager
              .pushSteps(
                userData.id,
                newSteps + (currentStepCount - currentStepCountAdded)
              )
              .then((worked) => {
                if (worked) resetStepsAfterContribution();
                else setError(true);
              });
          }}
        >
          Contribute new steps
        </Button>
      </Surface>
    </>
  );
}
