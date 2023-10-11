import React, { useEffect, useState, useRef } from "react";
import { AppState } from "react-native";

export const UpdateContext = React.createContext({
  stepsPushedIndicator: false,
  setStepsPushedIndicator: ({ }) => { },
  apiReloadIndicator: false,
  setApiReloadIndicator: ({ }) => { },
  midnightIndicator: false,
  setMidnightIndicator: ({ }) => { },
  appHasComeToForeground: false,
});

export const UpdateProvider = (props) => {
  // Indicator are alternating booleans to trigger useEffect hooks based on an update
  const [stepsPushedIndicator, setStepsPushedIndicator] = useState(false);
  const [apiReloadIndicator, setApiReloadIndicator] = useState(false);
  const [midnightIndicator, setMidnightIndicator] = useState(false);

  const [refetchApiTimer, setRefetchApiTimer] = useState(30);
  const [appHasComeToForeground, setAppHasComeToForeground] = useState(true);

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        setAppHasComeToForeground(true);
        setApiReloadIndicator(!apiReloadIndicator);
        console.log("App has come to the foreground!");
      } else {
        setAppHasComeToForeground(false);
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);


  useEffect(() => {
    let mounted = true;
    let interval = setInterval(() => {
      setRefetchApiTimer((lastTimerCount) => {
        if (lastTimerCount <= 1) {
          clearInterval(interval);
          setApiReloadIndicator(!apiReloadIndicator);
          return 30;
        } else {
          return lastTimerCount - 1;
        }
      });
    }, 1000);
    return () => {
      clearInterval(interval);
      mounted = false;
    };
  });

  useEffect(() => {
    setInterval(() => {
      const currentDateTime = new Date();
      const dateTimeString =
        currentDateTime.getHours() +
        ":" +
        currentDateTime.getMinutes() +
        ":" +
        currentDateTime.getSeconds();
      if (dateTimeString === "0:0:0") {
        setMidnightIndicator(!midnightIndicator);
      }
    }, 1000);
  });

  return (
    <UpdateContext.Provider
      value={{
        stepsPushedIndicator,
        setStepsPushedIndicator,
        apiReloadIndicator,
        setApiReloadIndicator,
        midnightIndicator,
        setMidnightIndicator,
        appHasComeToForeground,
      }}
    >
      {props.children}
    </UpdateContext.Provider>
  );
};
