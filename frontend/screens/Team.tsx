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

import React, { useState, useContext, useEffect } from "react";
import { ScrollView, Text } from "react-native";
import { Button, Paragraph, Dialog, Portal } from "react-native-paper";
import JoinOrCreateTeam from "../components/JoinTeam";
import { UserDataContext } from "../providers/UserDataProvider";
import { TeamDataContext } from "../providers/TeamDataProvider";
import { UpdateContext } from "../providers/UpdateProvider";
import TeamList from "../components/TeamList/TeamList";
import { style } from "../constants/Styles";
import dataManager from "../components/DataManager";

export default function Team() {
  const { userData, setUserData } = useContext(UserDataContext);
  const { teamName } = useContext(TeamDataContext);

  const { setApiReloadIndicator, apiReloadIndicator } =
    useContext(UpdateContext);
  const [error, setError] = useState("");
  const [isLeaveTeamDialogVisible, setIsLeaveTeamDialogVisible] =
    useState(false);

  return (
    <>
      {userData.team ? (
        <>
          <Text style={style.header}>Go, team {teamName}!</Text>
          <ScrollView style={{ marginBottom: 0 }}>
            <TeamList />
            <Button
              style={{ margin: 10 }}
              disabled={!userData.team}
              mode="outlined"
              onPress={() => {
                setIsLeaveTeamDialogVisible(true);
              }}
            >
              Leave Team
            </Button>
          </ScrollView>
          {isLeaveTeamDialogVisible && (
            <Portal>
              <Dialog
                visible={isLeaveTeamDialogVisible}
                onDismiss={() => setIsLeaveTeamDialogVisible(false)}
              >
                <Dialog.Content>
                  <Paragraph style={{ paddingBottom: 10 }}>
                    Are you sure you want to leave team {teamName}?
                  </Paragraph>
                  {error.length > 0 && (
                    <Paragraph style={{ paddingBottom: 10 }}>{error}</Paragraph>
                  )}
                </Dialog.Content>
                <Dialog.Actions>
                  <Button
                    onPress={() => {
                      setIsLeaveTeamDialogVisible(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onPress={() => {
                      const newUserData = {
                        ...userData,
                        team: null,
                      };
                      dataManager.updateUserData(newUserData).then((data) => {
                        if (data === -1)
                          setError(
                            "🚨 Error: Please check your internet connection."
                          );
                        else if (data === null)
                          setError(
                            "🚨 Internal Server Error: Please try again or contact the administrator."
                          );
                        else {
                          setIsLeaveTeamDialogVisible(false);
                          setUserData(newUserData);
                          setApiReloadIndicator(apiReloadIndicator);
                        }
                      });
                    }}
                  >
                    Yes
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          )}
        </>
      ) : (
        <JoinOrCreateTeam />
      )}
    </>
  );
}
