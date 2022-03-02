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
    useState({ challenge: {}, name: "", persons: [] });

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  useEffect(() => {
    let mounted = true;
    getTeamMembersStepCountOfToday(mounted);
    return () => {
      mounted = false;
    };
  }, [updated]);

  const getTeamMembersStepCountOfToday = (mounted) => {
    dataManager
      .getTeamMembersStepCountOfToday(userData.teamName)
      .then((teamMembersStepCountOfToday) => {
        if (mounted)
          setTeamMembersAndStepCountsOfToday(teamMembersStepCountOfToday);
      });
  };

  return (
    <View
      style={{
        marginBottom: 30,
      }}
    >
      {teamMembersAndStepCountsOfToday.persons.map((person) => {
        return (
          <View style={{ paddingBottom: 20 }} key={person.name}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
                paddingBottom: 10,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                {person.name}
                {console.log(person)}
                <Text style={{ color: "#ffae00" }}>{(500 / 1000) * 100}%</Text>
              </Text>
              <Button onPress={showDialog} mode="contained">
                motivate
              </Button>
              {/* <Text>{person.expoToken}</Text> */}
            </View>
            <TeamMemberBarChart goalSteps={1000} contributedSteps={500} />
          </View>
        );
      })}
      <SendMotivationMessageDialog visible={visible} hideDialog={hideDialog} />
    </View>
  );
}
