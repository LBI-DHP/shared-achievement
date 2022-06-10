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

export const UserDataProvider = (props) => {
  const [stepsPushedIndicator, setStepsPushedIndicator] = useState(false);
  const [apiReloadIndicator, setApiReloadIndicator] = useState(false);
  const [midnightIndicator, setMidnightIndicator] = useState(false);

  useEffect(() => {}, []);

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
