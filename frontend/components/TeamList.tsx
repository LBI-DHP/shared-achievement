import React, { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import { UserDataContext } from "./UserDataProvider";
import dataManager from "./DataManager";
import TeamMemberBarChart from "./TeamMemberBarChart";
import SendMotivationMessageDialog from "./SendMotivationMessageDialog";

export default function TeamStatistics() {
  const { userData, updated } = useContext(UserDataContext);
  const [teamMembersAndStepCountsOfToday, setTeamMembersAndStepCountsOfToday] =
    useState([]);

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  useEffect(() => {
    let mounted = true;
    dataManager
      .getTeamMembersAndStepCountOfToday(userData.team)
      .then((teamMembersStepCountOfToday) => {
        if (mounted && teamMembersStepCountOfToday !== null)
          setTeamMembersAndStepCountsOfToday(teamMembersStepCountOfToday);
      });
    return () => {
      mounted = false;
    };
  }, [updated]);

  return (
    <View
      style={{
        marginBottom: 30,
      }}
    >
      {console.log(teamMembersAndStepCountsOfToday)}
      {teamMembersAndStepCountsOfToday.map((member) => {
        return (
          <View style={{ paddingBottom: 20 }} key={member.user}>
            {console.log("member", member)}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
                paddingBottom: 10,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                {member.username + " "}
                <Text style={{ color: "#ffae00" }}>{(500 / 1000) * 100}%</Text>
              </Text>
              <Button onPress={showDialog} mode="contained">
                motivate
              </Button>
              <SendMotivationMessageDialog
                visible={visible}
                hideDialog={hideDialog}
                nameTo={member.username}
                expoToken={member.expoToken}
              />
            </View>
            <TeamMemberBarChart goalSteps={1000} contributedSteps={500} />
          </View>
        );
      })}
    </View>
  );
}
