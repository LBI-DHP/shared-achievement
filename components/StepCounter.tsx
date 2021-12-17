// https://snack.expo.dev/@yoobit0616/pedometer-functional

import React, { useState, useEffect, useContext } from "react";
import { Text } from "../components/Themed";
import { Button } from "react-native-paper";
import { Pedometer } from "expo-sensors";
import dataManager from "./DataManager";
import { UserDataContext } from "./UserDataProvider";
import { style } from "../constants/Styles";

export default function StepCounter() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [stepCountToday, setStepCountToday] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [currentStepCountAdded, setCurrentStepCountAdded] = useState(0);
  const [contributedSteps, setContributedSteps] = useState(0);
  const [newSteps, setNewSteps] = useState(0);
  const { userData, updatedSteps, setUpdatedSteps } =
    useContext(UserDataContext);
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
  };

  if (!isPedometerAvailable) {
    return <Text>Sorry, step counter is not available.</Text>;
  }

  return (
    <>
      <Text style={{ paddingBottom: 10 }}>
        Total steps taken today:{" "}
        <Text style={style.subheading}>
          {stepCountToday + currentStepCount}
        </Text>
      </Text>
      <Text style={{ paddingBottom: 10 }}>
        Already contributed steps:{" "}
        <Text style={style.subheading}>{contributedSteps}</Text>
      </Text>
      <Text style={{ paddingBottom: 20 }}>
        New steps since the last contribution:{" "}
        <Text style={style.subheading}>
          {newSteps + currentStepCount - currentStepCountAdded}
        </Text>
      </Text>
      <Button
        disabled={
          newSteps === 0 && currentStepCount - currentStepCountAdded === 0
        }
        mode="contained"
        onPress={() => {
          setUpdatedSteps(!updatedSteps);
          if (newSteps === stepCountToday) {
            dataManager
              .pushStepCountofToday({
                personId: userData.id,
                steps:
                  stepCountToday + currentStepCount - currentStepCountAdded,
              })
              .then((responseStatus) => {
                if (responseStatus === 201 || responseStatus === 200)
                  resetStepsAfterContribution();
                else setError(true);
              });
          } else {
            const newDate = new Date();
            const dateString =
              newDate.getFullYear() +
              "-" +
              (newDate.getMonth() + 1) +
              "-" +
              newDate.getDate();

            console.log("dateString", dateString);

            dataManager
              .updateStepCount({
                day: dateString,
                personId: userData.id,
                steps:
                  stepCountToday + currentStepCount - currentStepCountAdded,
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
      {error && <Text>Error!</Text>}
    </>
  );
}
