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
import Svg, { Polygon } from "react-native-svg";

export default function UntersbergHidden(props) {
  const { svgWidth, svgHeight, svgViewBoxWidth, svgViewBoxHeight } = props;

  return (
    <Svg
      height={svgHeight}
      width={svgWidth}
      viewBox={"0 0 " + svgViewBoxWidth + " " + svgViewBoxHeight}
    >
      <Polygon
        fill="black"
        points="547 247 439.26 91 412.64 86 404.32 71 314.06 53 299.08 61 277.24 53 271.63 41 250.41 26 244.59 31 207.99 0 198 31 173.04 65 155.57 54 150.69 65.24 145.59 77 133.11 88 91.82 144.5 87.35 154 76.95 150 0 247 547 247"
      />
    </Svg>
  );
}
