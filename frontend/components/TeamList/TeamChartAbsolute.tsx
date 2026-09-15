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
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import { style as TeamListStyle } from "./TeamListStyles";

export default function TeamChartAbsolute({
  member,
  showDialog,
  setSelectedUser,
  currentUserName,
}) {
  return (
    <View style={TeamListStyle.surfaceAbs} key={member.username}>
      <View
        style={{
          flexDirection: "column",
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
          {member.username + " "}
          {member.username === currentUserName && (
            <Text style={{ fontWeight: "normal" }}>(me) </Text>
          )}
        </Text>
        <Text style={{ color: "#ffae00", fontSize: 15, fontWeight: "bold" }}>
          {member.sumSteps} steps
        </Text>
      </View>
      {member.username !== currentUserName && (
        <Button
          onPress={() => {
            setSelectedUser({
              username: member.username,
              expoToken: member.expoToken,
            });
            showDialog();
          }}
          mode="outlined"
        >
          motivate
        </Button>
      )}
    </View>
  );
}
