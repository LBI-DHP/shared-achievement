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
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";


export default function Trophy() {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#99bfcf",
        borderRadius: 15,
        backgroundColor: "white",
        width: 32,
        padding: 5,
        marginLeft: 18,
        marginTop: 17,
        marginBottom: -50,
        zIndex: 100,
      }}
    >
      <MaterialCommunityIcons name="trophy" size={20} color="#ffae00" />
    </View>
  );
}
