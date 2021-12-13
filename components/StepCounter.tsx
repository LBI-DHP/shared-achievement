// https://snack.expo.dev/@yoobit0616/pedometer-functional

import React, { useState, useEffect, useContext } from "react";
import { Text } from "../components/Themed";
import { Button } from "react-native-paper";
import { Pedometer } from "expo-sensors";
import dataManager from "./DataManager";
import { AppStateContext } from "./AppStateProvider";
import { style } from "../constants/Styles";

export default function StepCounter() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [stepCountToday, setStepCountToday] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [currentStepCountAdded, setCurrentStepCountAdded] = useState(0);
  const [newSteps, setNewSteps] = useState(0);
  const { userData, setUserData } = useContext(AppStateContext);
  const [error, setError] = useState(false);

  let _subscription: any;

  useEffect(() => {
    _subscribe();
    dataManager.getUserStepCountOfToday(userData.id).then((userStepCount) => {
      setNewSteps(stepCountToday - userStepCount);
    });
    return () => _unsubscribe();
  }, []);

  const _subscribe = () => {
    _subscription = Pedometer.watchStepCount((result) => {
      setCurrentStepCount(result.steps);
    });

    Pedometer.isAvailableAsync().then(
      (result: any) => {
        setIsPedometerAvailable(result);

        if (result === true) {
          const end = new Date();
          const start = new Date();
          start.setHours(0, 0, 0, 0);

          Pedometer.getStepCountAsync(start, end).then(
            (result) => {
              setStepCountToday(result.steps);
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
      <Text style={{ paddingBottom: 20 }}>
        New steps since the last contribution:{" "}
        <Text style={style.subheading}>
          {console.log(newSteps, currentStepCount, currentStepCountAdded)}
          {newSteps + currentStepCount - currentStepCountAdded}
        </Text>
      </Text>
      <Button
        disabled={newSteps === 0 && currentStepCount === 0}
        mode="contained"
        onPress={() => {
          if (newSteps === stepCountToday) {
            dataManager
              .pushStepCountofToday({
                personId: userData.id,
                steps:
                  stepCountToday + currentStepCount - currentStepCountAdded,
              })
              .then((responseStatus) => {
                if (responseStatus === 201 || responseStatus === 200) {
                  setNewSteps(0);
                  setCurrentStepCountAdded(currentStepCount);
                } else {
                  setError(true);
                }
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
                if (responseStatus === 201 || responseStatus === 200) {
                  setNewSteps(0);
                  setCurrentStepCountAdded(currentStepCount);
                } else {
                  setError(true);
                }
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
