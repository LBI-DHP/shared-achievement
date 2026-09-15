/*
 * Copyright (c) 2021-2024 Ludwig Boltzmann Institute for Digital Health and Prevention
 *
 * Licensed under the Apache License, Version 2.0 with the Commons Clause License
 * Condition v1.0 (the "License"); you may not use this file except in compliance
 * with the License. A copy of the License is distributed in the LICENSE file at
 * the root of this repository; the Apache License is also available at
 * http://www.apache.org/licenses/LICENSE-2.0 and the Commons Clause condition at
 * https://commonsclause.com/
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * SPDX-License-Identifier: LicenseRef-Apache-2.0-WITH-Commons-Clause
 */

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
