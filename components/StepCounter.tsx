// https://snack.expo.dev/@yoobit0616/pedometer-functional

import React, { useState, useEffect } from "react";
import { Text } from "../components/Themed";
import { Pedometer } from "expo-sensors";

export default function StepCounter() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);

  let _subscription: any;

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
          start.setDate(end.getDate() - 1);
          Pedometer.getStepCountAsync(start, end).then(
            (result) => {
              setPastStepCount(result.steps);
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

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  if (!isPedometerAvailable) {
    return <Text>Sorry, step counter is not available.</Text>;
  }

  return (
    <>
      <Text>Steps taken in the last 24 hours: {pastStepCount}</Text>
      <Text>Walk! And watch this go up: {currentStepCount}</Text>
    </>
  );
}
