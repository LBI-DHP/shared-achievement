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

import * as React from "react";
import Svg, { Polygon, Circle, Rect, Text } from "react-native-svg";

export default function FlagTop(props) {
  const {
    svgWidth,
    svgHeight,
    svgViewBoxWidth,
    svgViewBoxHeight,
    progressPercent,
    teamAbsoluteStepGoal,
    mode,
  } = props;

  return (
    <Svg
      height={svgHeight}
      width={svgWidth}
      viewBox={"0 0 " + svgViewBoxWidth + " " + svgViewBoxHeight}
    >
      {mode === "ABSOLUTE" && (
        <Text x="235" y="18" fontSize={20} fontWeight="bold" fill={"white"}>
          {teamAbsoluteStepGoal} steps
        </Text>
      )}
      <Rect fill="black" x="207.63" y="1.27" width="1.27" height="31.73" />
      <Polygon
        fill={progressPercent >= 1 ? "#1300bd" : "#a12b2b"}
        points="219.13 11.12 224.33 6.9 229.53 2.68 209.22 2.68 209.22 19.55 229.53 19.55 224.33 15.33 219.13 11.12"
      />
      <Circle fill="black" cx="208.27" cy="1.27" r="1.27" />
    </Svg>
  );
}
