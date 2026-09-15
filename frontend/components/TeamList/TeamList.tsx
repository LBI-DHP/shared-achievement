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
import { View } from "react-native";
import { Button } from "react-native-paper";
import { UserDataContext } from "../../providers/UserDataProvider";
import { TeamDataContext } from "../../providers/TeamDataProvider";
import SendMotivationMessageDialog from "./SendMotivationMessageDialog";
import TeamChartRelative from "./TeamChartRelative";
import TeamChartAbsolute from "./TeamChartAbsolute";
import CenteredActivityIndicator from "../CenteredActivityIndicator";

export default function TeamList() {
  const { userData, isUserDataLoading } = useContext(UserDataContext);
  const {
    mode,
    teamMembersAndStepCountOfToday,
    isTeamMembersAndStepCountOfTodayLoading,
  } = useContext(TeamDataContext);
  const [expoTokenListTeamMembers, setExpoTokenListTeamMembers] = useState([]);
  const [isMessageDialogVisible, setIsMessageDialogVisible] = useState(false);

  const showDialog = () => setIsMessageDialogVisible(true);
  const hideDialog = () => {
    setIsMessageDialogVisible(false);
    setSelectedUser({
      expoToken: null,
      username: null,
    });
  };

  const [selectedUser, setSelectedUser] = useState({
    expoToken: null,
    username: null,
  });

  useEffect(() => {
    let expoTokens = [];
    teamMembersAndStepCountOfToday.forEach((member) => {
      if (member.expoToken !== userData.expoToken)
        expoTokens.push(member.expoToken);
    });
    setExpoTokenListTeamMembers(expoTokens);
  }, [teamMembersAndStepCountOfToday]);

  if (isTeamMembersAndStepCountOfTodayLoading || isUserDataLoading)
    return <CenteredActivityIndicator height={100} />;

  return (
    <View style={{ paddingTop: 10 }}>
      {teamMembersAndStepCountOfToday.map((member) => {
        if (mode === "RELATIVE") {
          return (
            <TeamChartRelative
              member={member}
              showDialog={showDialog}
              setSelectedUser={setSelectedUser}
              key={member.username}
              currentUserName={userData.username}
            />
          );
        } else if (mode === "ABSOLUTE") {
          return (
            <TeamChartAbsolute
              member={member}
              showDialog={showDialog}
              setSelectedUser={setSelectedUser}
              key={member.username}
              currentUserName={userData.username}
            />
          );
        }
      })}
      <Button
        style={{ margin: 10, marginBottom: 0 }}
        onPress={() => {
          showDialog();
        }}
        mode="outlined"
      >
        motivate all team members
      </Button>
      {isMessageDialogVisible && selectedUser.expoToken ? (
        <SendMotivationMessageDialog
          isVisible={isMessageDialogVisible}
          hideDialog={hideDialog}
          nameTo={selectedUser.username}
          expoTokenList={[selectedUser.expoToken]}
          nameFrom={userData.username}
        />
      ) : (
        <SendMotivationMessageDialog
          isVisible={isMessageDialogVisible}
          hideDialog={hideDialog}
          nameTo={"all team members"}
          expoTokenList={expoTokenListTeamMembers}
          nameFrom={userData.username}
        />
      )}
    </View>
  );
}
