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

import React, { useContext, useEffect, useState } from "react";
import { ScrollView, View, Text, useWindowDimensions } from "react-native";
import { UserDataContext } from "../../providers/UserDataProvider";
import { TeamDataContext } from "../../providers/TeamDataProvider";
import { Foundation } from "@expo/vector-icons";

export default function TeamContributions() {
  const { userData } = useContext(UserDataContext);
  const { mode, teamMembersAndStepCountOfToday } = useContext(TeamDataContext);
  const [elementWidth, setElementWidth] = useState(0);

  const { width } = useWindowDimensions();
  const windowWidth = width;
  const parentPadding = 1;
  const elementPadding = 5;
  const elementBoarder = 1;
  const elementMargin = 5;
  let elementSpaces = (elementBoarder + elementMargin) * 2;

  useEffect(() => {
    if (teamMembersAndStepCountOfToday.length !== 0) {
      let elementMinInnerWidth = 75;
      let numOfElements = teamMembersAndStepCountOfToday.length;
      let availableSpaceInParent = windowWidth - parentPadding * 2;
      let elementsPerRow = Math.floor(
        availableSpaceInParent / (elementMinInnerWidth + elementSpaces)
      );
      let numOfRows = numOfElements / elementsPerRow;
      if (!Number.isInteger(numOfRows)) numOfRows = Math.floor(numOfRows) + 1;
      if (numOfRows > 1 && numOfElements % elementsPerRow !== 0) {
        let numOfElementsLastRow = numOfElements % elementsPerRow;
        let emptyElementsInLastRow = elementsPerRow - numOfElementsLastRow;
        let emptyElementsPerRow = Math.floor(
          emptyElementsInLastRow / numOfRows
        );
        elementsPerRow = elementsPerRow - emptyElementsPerRow;
      } else if (numOfRows === 1) elementsPerRow = numOfElements;

      let availableSpacePerElement = availableSpaceInParent / elementsPerRow;
      if (!availableSpacePerElement)
        availableSpacePerElement = elementMinInnerWidth;

      setElementWidth(availableSpacePerElement - elementSpaces);
    }
  }, [teamMembersAndStepCountOfToday]);

  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
        padding: parentPadding,
        flexWrap: "wrap",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      {teamMembersAndStepCountOfToday.map((member) => {
        return (
          <View
            style={
              member.username !== userData.username
                ? {
                    margin: elementMargin,
                    flexDirection: "column",
                    padding: elementPadding,
                    paddingBottom: 0,
                    borderWidth: elementBoarder,
                    borderColor: "#7ebdd8",
                    borderRadius: 5,
                    width: elementWidth,
                  }
                : {
                    margin: elementMargin,
                    flexDirection: "column",
                    padding: elementPadding - 1,
                    paddingBottom: 0,
                    borderWidth: elementBoarder + 1,
                    borderColor: "#7ebdd8",
                    backgroundColor: "#e6f7ff",
                    borderRadius: 5,
                    width: elementWidth,
                  }
            }
            key={member.username}
          >
            <View>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>
                  {mode === "ABSOLUTE"
                    ? member.sumSteps
                    : Math.round(member.userProgress * 100)}
                </Text>
                <Text>
                  {" "}
                  {mode === "ABSOLUTE" ? (
                    <Foundation name="foot" size={15} color="black" />
                  ) : (
                    "%"
                  )}
                </Text>
              </View>
              <ScrollView
                horizontal={true}
                style={{ paddingBottom: elementPadding }}
              >
                <Text
                  style={{
                    marginTop: -2,
                    color: "black",
                  }}
                >
                  {member.username === userData.username
                    ? member.username + " (me)"
                    : member.username}
                </Text>
              </ScrollView>
            </View>
          </View>
        );
      })}
    </View>
  );
}
