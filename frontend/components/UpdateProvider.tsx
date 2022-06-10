import React, { useEffect, useState } from "react";

// Alternating booleans to trigger useEffect hooks based on an update
export const UpdateContext = React.createContext({
  stepsPushedIndicator: false,
  setStepsPushedIndicator: ({}) => {},
  apiReloadIndicator: false,
  setApiReloadIndicator: ({}) => {},
  midnightIndicator: false,
  setMidnightIndicator: ({}) => {},
});

export const UpdateProvider = (props) => {
  const [stepsPushedIndicator, setStepsPushedIndicator] = useState(false);
  const [apiReloadIndicator, setApiReloadIndicator] = useState(false);
  const [midnightIndicator, setMidnightIndicator] = useState(false);

  const [refetchApiTimer, setRefetchApiTimer] = useState(30);

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
      }}
    >
      {props.children}
    </UpdateContext.Provider>
  );
};
