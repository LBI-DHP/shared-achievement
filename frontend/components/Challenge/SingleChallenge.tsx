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

import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Untersberg from "./Untersberg";
import Clouds from "./Clouds";
import FlagTop from "./FlagTop";
import { UserDataContext } from "../../providers/UserDataProvider";

export default function Challenge() {
  const {
    userData,
    isUserDataLoading,
    isUserChallengeDataLoading,
    userChallengeData,
  } = useContext(UserDataContext);
  const [userRelativeStepCountToday, setUserRelativeStepCountToday] =
    useState(0);
  const [userAbsoluteStepCountToday, setUserAbsoluteStepCountToday] =
    useState(0);
  const [userAbsoluteStepGoal, setUserAbsoluteStepGoal] = useState(0);

  useEffect(() => {
    console.log("userChallengeData");
    console.log(userChallengeData);
    if (!isUserChallengeDataLoading) {
      setUserRelativeStepCountToday(userChallengeData.progress / 100);
      setUserAbsoluteStepCountToday(userChallengeData.totalSteps);
      setUserAbsoluteStepGoal(userChallengeData.goal);
    }
  }, [
    isUserChallengeDataLoading,
    userChallengeData.totalSteps,
    userChallengeData.progress,
    userChallengeData.goal,
  ]);

  const { height, width } = useWindowDimensions();
  const windowHeight = height;
  const windowWidth = width;

  let untersbergSvgWidth;
  let untersbergSvgHeight;
  let flagSvgHeight;

  const untersbergSvgViewBoxWidth = 547;
  const untersbergSvgViewBoxHeight = 247;
  const flagSvgViewBoxHeight = 33;

  const untersbergRelation =
    untersbergSvgViewBoxWidth / untersbergSvgViewBoxHeight;
  const flagRelation = untersbergSvgViewBoxWidth / flagSvgViewBoxHeight;

  if (windowWidth > windowHeight) {
    untersbergSvgWidth = windowHeight / 1.5;
    untersbergSvgHeight = untersbergSvgWidth / untersbergRelation;
    flagSvgHeight = untersbergSvgWidth / flagRelation;
  } else {
    untersbergSvgWidth = windowWidth;
    untersbergSvgHeight = untersbergSvgWidth / untersbergRelation;
    flagSvgHeight = untersbergSvgWidth / flagRelation;
  }
  let progressPosition = 0;

  if (userRelativeStepCountToday >= 1) {
    progressPosition =
      untersbergSvgViewBoxHeight - 10 - (untersbergSvgViewBoxHeight - 10 - 7.5);
  } else {
    progressPosition =
      untersbergSvgViewBoxHeight -
      10 -
      (untersbergSvgViewBoxHeight - 10 - 7.5) * userRelativeStepCountToday;
  }

  return (
    <View style={style.container}>
      <Clouds
        svgWidth={untersbergSvgWidth}
        svgHeight={untersbergSvgHeight / 3.5}
        svgViewBoxWidth={untersbergSvgViewBoxWidth}
        svgViewBoxHeight={untersbergSvgViewBoxHeight / 3.5}
      />
      <FlagTop
        svgWidth={untersbergSvgWidth}
        svgHeight={flagSvgHeight}
        svgViewBoxWidth={untersbergSvgViewBoxWidth}
        svgViewBoxHeight={flagSvgViewBoxHeight}
        progressPercent={userRelativeStepCountToday}
        teamAbsoluteStepGoal={userAbsoluteStepGoal}
        mode={"ABSOLUTE"}
      />
      <Untersberg
        svgWidth={untersbergSvgWidth}
        svgHeight={untersbergSvgHeight}
        svgViewBoxWidth={untersbergSvgViewBoxWidth}
        svgViewBoxHeight={untersbergSvgViewBoxHeight}
        progressPosition={progressPosition}
        progressPercent={userRelativeStepCountToday}
        mode={"ABSOLUTE"}
        teamAbsoluteStepCountToday={userAbsoluteStepCountToday}
      />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    paddingTop: 10,
    alignItems: "center",
    backgroundColor: "#99bfcf",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  containerAbsolute: {
    width: "100%",
    paddingBottom: 10,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  bigText: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold",
  },
  smallText: {
    color: "white",
    fontWeight: "bold",
  },
});
