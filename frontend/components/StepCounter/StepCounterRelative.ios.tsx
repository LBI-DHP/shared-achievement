// https://snack.expo.dev/@yoobit0616/pedometer-functional

import React, { useState, useEffect, useContext } from "react";
import { Button, Surface } from "react-native-paper";
import { Pedometer } from "expo-sensors";
import dataManager from "../DataManager";
import { UserDataContext } from "../UserDataProvider";
import { Text, StyleSheet, View } from "react-native";
import StepsBarChart from "../StepsBarChartRelative";

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
      <Surface style={styles.surface}>
        <Text style={styles.subheading}>Personal Progress</Text>
        <StepsBarChart
          goalSteps={goalSteps}
          contributedSteps={contributedSteps}
          newSteps={newSteps + (currentStepCount - currentStepCountAdded)}
        />
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
  subheading: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
    marginBottom: 0,
  },
});
