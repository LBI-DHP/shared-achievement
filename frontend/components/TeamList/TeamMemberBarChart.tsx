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

import React from "react";
import { useWindowDimensions } from "react-native";
import Svg, { Rect, Mask } from "react-native-svg";

export default function TeamMemberBarChartRelative({
  goalSteps,
  contributedSteps,
}) {
  const { width } = useWindowDimensions();
  const windowWidth = width - 20;

  const colorStepsGoal = "#bebdbd";
  const colorStepsContributed = "#ffbb00";

  let progress = 0;

  if (contributedSteps > 0) {
    progress = contributedSteps / goalSteps;
  }

  return (
    <Svg
      height={10}
      width={windowWidth}
      viewBox={"0 0 " + windowWidth + " " + 10}
    >
      <Mask id="Mask" x="0" y="0" width={windowWidth} height="10">
        <Rect
          rx="5"
          ry="5"
          x="0"
          y="0"
          width={windowWidth}
          height="10"
          fill={"white"}
        />
      </Mask>
      <Rect
        mask="url(#Mask)"
        x="0"
        y="0"
        width={windowWidth}
        height="10"
        fill={colorStepsGoal}
      />
      <Rect
        mask="url(#Mask)"
        x="0"
        y="0"
        width={windowWidth * progress}
        height="10"
        fill={colorStepsContributed}
      />
    </Svg>
  );
}
