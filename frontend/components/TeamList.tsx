import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { UserDataContext } from "./UserDataProvider";
import dataManager from "./DataManager";
import SendMotivationMessageDialog from "./SendMotivationMessageDialog";
import TeamChartRelative from "./TeamChartRelative";
import TeamChartAbsolute from "./TeamChartAbsolute";
import { Surface } from "react-native-paper";

export default function TeamStatistics() {
  const { userData, updated, mode } = useContext(UserDataContext);
  const [teamMembersAndStepCountsOfToday, setTeamMembersAndStepCountsOfToday] =
    useState([]);
  const [absoluteMostSteps, setAbsoluteMostSteps] = useState(0);

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const [selectedUser, setSelectedUser] = useState({
    expoToken: null,
    sumSteps: null,
    targetGoal: null,
    teamGoalPerMember: null,
    user: null,
    username: null,
  });

  useEffect(() => {
    let mounted = true;
    dataManager
      .getTeamMembersAndStepCountOfToday(userData.team)
      .then((teamMembersStepCountOfToday) => {
        if (mounted && teamMembersStepCountOfToday !== null)
          teamMembersStepCountOfToday.sort((a, b) =>
            a.userProgress < b.userProgress
              ? 1
              : b.userProgress < a.userProgress
              ? -1
              : 0
          );
        console.log(teamMembersStepCountOfToday);
        setTeamMembersAndStepCountsOfToday(teamMembersStepCountOfToday);
      });
    return () => {
      mounted = false;
    };
  }, [updated]);

  useEffect(() => {
    if (mode === "ABSOLUTE") {
      let mostSteps = 0;
      teamMembersAndStepCountsOfToday.forEach((member) => {
        if (member.sumSteps > mostSteps) mostSteps = member.sumSteps;
      });
      setAbsoluteMostSteps(mostSteps);
    }
  }, [mode, teamMembersAndStepCountsOfToday]);

  return (
    <View
      style={{
        marginBottom: 30,
      }}
    >
      {teamMembersAndStepCountsOfToday.map((member) => {
        if (mode === "RELATIVE") {
          return (
            // <Surface style={{ marginTop: 10}}>
            <TeamChartRelative
              member={member}
              showDialog={showDialog}
              setSelectedUser={setSelectedUser}
              key={member.username}
              currentUserName={userData.username}
            />
            // </Surface>
          );
        } else {
          return (
            <TeamChartAbsolute
              member={member}
              showDialog={showDialog}
              setSelectedUser={setSelectedUser}
              absoluteMostSteps={absoluteMostSteps}
              key={member.username}
              currentUserName={userData.username}
            />
          );
        }
      })}
      <SendMotivationMessageDialog
        visible={visible}
        hideDialog={hideDialog}
        nameTo={selectedUser.username}
        expoToken={selectedUser.expoToken}
        nameFrom={userData.username}
      />
    </View>
  );
}
